import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-csrf-cross-site-request-forgery",
  title: "CSRF: quando o navegador da vítima ataca por ela",
  summary: "O atacante nunca vê a senha, nem o cookie — ele só precisa fazer o navegador da vítima disparar uma requisição por ele.",
  estimatedMinutes: 18,
  level: "fundamentos",
};

export default function Licao08CsrfCrossSiteRequestForgery() {
  return (
    <LessonBody>
      <p>
        CSRF (Cross-Site Request Forgery) é um ataque estranho de entender na primeira vez, porque o atacante não
        rouba nada diretamente — ele engana o <strong>navegador da vítima</strong> pra disparar uma requisição
        autenticada em nome dela, aproveitando um comportamento que a lição 2 já mostrou: o navegador reenvia cookie
        automaticamente pra qualquer requisição pro domínio certo, não importa <strong>de onde</strong> essa
        requisição partiu.
      </p>

      <h2>O ataque, passo a passo</h2>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "vitima", label: "Navegador da vítima", kind: "client", x: 15, y: 50 },
          { id: "malicioso", label: "site-malicioso.com", kind: "server", x: 50, y: 20 },
          { id: "banco", label: "banco.com", kind: "server", x: 85, y: 50 },
        ]}
        edges={[
          { from: "vitima", to: "banco" },
          { from: "vitima", to: "malicioso" },
        ]}
        hops={[
          { from: "banco", to: "vitima", caption: "1. Antes de tudo: a vítima já fez login em banco.com — o cookie de sessão está salvo no navegador dela." },
          { from: "vitima", to: "malicioso", caption: "2. Ainda logada, a vítima abre site-malicioso.com numa aba diferente (ex.: clicou num link recebido por e-mail)." },
          { from: "malicioso", to: "vitima", caption: "3. A página maliciosa contém um formulário invisível que se auto-submete assim que a página carrega." },
          { from: "vitima", to: "banco", caption: "4. O navegador dispara POST /transferir para banco.com — e anexa o cookie de sessão sozinho, porque o cookie é do domínio banco.com, não de quem originou o clique." },
        ]}
      />
      <CodeExample
        label="o formulário escondido dentro de site-malicioso.com"
        language="html"
        code={`<form action="https://banco.com/transferir" method="POST" id="f">
  <input type="hidden" name="valor" value="5000">
  <input type="hidden" name="destino" value="conta-do-atacante">
</form>
<script>document.getElementById("f").submit();</script>`}
      />
      <p>
        Repare que <code>site-malicioso.com</code> nunca lê a resposta dessa requisição, nem precisa — ele só
        precisa que ela seja <strong>enviada</strong> com o cookie certo anexado. Isso já basta pra causar o efeito
        colateral (a transferência) do lado de <code>banco.com</code>, que processa a requisição achando que ela veio
        de um formulário legítimo do próprio site, porque o cookie de sessão confere perfeitamente.
      </p>

      <h2>Por que isso é um problema específico de autenticação por cookie</h2>
      <p>
        Esse ataque funciona porque o navegador reenvia cookie <strong>automaticamente</strong>, sem o atacante
        precisar fazer nada especial pra isso acontecer. Um bearer token (lição 4) não sofre desse problema do mesmo
        jeito: ele precisa ser anexado manualmente no header <code>Authorization</code> por código JavaScript — e{" "}
        <code>site-malicioso.com</code> não tem como ler o token guardado no <code>localStorage</code> de{" "}
        <code>banco.com</code> (isso violaria a mesma política de mesma origem que impede CORS não autorizado) nem
        forçar o navegador a inventar um header customizado numa submissão de formulário simples. Não é que bearer
        token seja "imune" a tudo — ele troca esse risco pela exposição a XSS/localStorage vista na lição 4 — mas
        especificamente contra CSRF, ele já nasce protegido pelo próprio mecanismo.
      </p>

      <h2>As defesas</h2>
      <p>
        A primeira linha de defesa já foi vista na lição 3: <code>SameSite=Lax</code> (ou <code>Strict</code>) no
        cookie de sessão já bloqueia a maior parte desse cenário, porque o navegador simplesmente não anexa o cookie
        numa requisição de POST disparada por outro site. A segunda camada, tradicionalmente usada antes de{" "}
        <code>SameSite</code> existir (e ainda recomendada como defesa adicional), é o{" "}
        <strong>token CSRF</strong>: um valor único, gerado pelo servidor e embutido no formulário legítimo, que
        precisa ser enviado de volta junto da requisição.
      </p>
      <CodeExample
        label="formulário legítimo, com token CSRF"
        language="html"
        code={`<form action="/transferir" method="POST">
  <input type="hidden" name="csrf_token" value="f3a9c1e8...">
  <!-- site-malicioso.com não tem como saber esse valor, então não consegue reproduzi-lo -->
</form>`}
      />
      <p>
        O servidor recusa qualquer requisição que não venha com o token CSRF correto e correspondente à sessão atual
        — e, como esse valor é gerado por requisição/sessão e não é previsível, o atacante em{" "}
        <code>site-malicioso.com</code> não tem como adivinhá-lo ou obtê-lo sem já ter acesso à página legítima.
      </p>

      <Exercise
        prompt={
          <p>
            Uma API usa exclusivamente autenticação por bearer token (header <code>Authorization</code>, sem cookie
            nenhum envolvido). Um colega insiste em adicionar proteção CSRF mesmo assim, "por garantia". Ela é
            necessária nesse cenário? Justifique.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Não é necessária nesse cenário específico. CSRF depende de o
navegador anexar credenciais automaticamente (o comportamento padrão
de cookie) numa requisição disparada por outro site. Um bearer token
não é anexado automaticamente por nada — ele precisa ser lido de
algum armazenamento (localStorage, memória) e colocado manualmente
no header Authorization por JavaScript escrito propositalmente para
isso.

site-malicioso.com não tem como ler o token guardado na origem de
outro domínio nem forçar o navegador da vítima a incluir um header
Authorization customizado numa requisição simples (como um POST de
formulário). Proteção CSRF nesse caso não erra por excesso, mas é
esforço em algo que o próprio mecanismo de autenticação já não
permite.`}
      />

      <Callout href="/padrao-frontend/seguranca/csrf">
        A estratégia de proteção contra CSRF usada em produção pelo padrão — token, SameSite, e quando cada um se
        aplica — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "No ataque de CSRF descrito, o que exatamente site-malicioso.com precisa conseguir fazer pra ter sucesso?",
            options: [
              "Ler a senha da vítima diretamente do formulário de login de banco.com",
              "Descobrir o valor do cookie de sessão da vítima e reenviá-lo manualmente",
              "Interceptar a resposta de banco.com antes que ela chegue ao navegador da vítima",
              "Fazer o navegador da vítima enviar uma requisição para banco.com — o cookie de sessão é anexado automaticamente pelo próprio navegador, sem o site malicioso precisar acessá-lo",
            ],
            correctIndex: 3,
          },
          {
            question:
              "Por que uma API autenticada só por bearer token (sem cookie) é naturalmente resistente a CSRF, mesmo sem nenhuma defesa adicional?",
            options: [
              "Porque bearer token nunca pode ser roubado por um atacante, em nenhuma circunstância",
              "Porque o token não é anexado automaticamente pelo navegador — precisa ser lido de um armazenamento e colocado manualmente no header pelo JavaScript da própria aplicação legítima, algo que um site externo não consegue forçar",
              "Porque bearer token sempre expira em poucos segundos, antes que um ataque possa ser completado",
              "Porque APIs que usam bearer token não aceitam requisições do tipo POST",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
