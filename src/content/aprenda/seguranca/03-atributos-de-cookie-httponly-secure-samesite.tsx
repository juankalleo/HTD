import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-atributos-de-cookie-httponly-secure-samesite",
  title: "Os atributos de cookie que decidem sua segurança",
  summary:
    "HttpOnly, Secure e SameSite parecem detalhe de configuração — são, na prática, a diferença entre uma sessão protegida e uma sequestrável.",
  estimatedMinutes: 17,
  level: "fundamentos",
};

export default function Licao03AtributosDeCookieHttpOnlySecureSameSite() {
  return (
    <LessonBody>
      <p>
        A lição anterior mostrou <code>Set-Cookie: sessao=abc123; HttpOnly</code> sem parar pra explicar cada parte
        depois do valor. Esses atributos não são cosmético — cada um fecha uma porta de ataque específica, e um
        cookie de sessão emitido sem eles está, na prática, exposto a pelo menos um dos três problemas que esta
        lição cobre.
      </p>

      <Compare
        badLabel="Cookie de sessão vulnerável"
        goodLabel="Cookie de sessão protegido"
        bad={<CodeExample language="plaintext" code={`Set-Cookie: sessao=abc123`} />}
        good={<CodeExample language="plaintext" code={`Set-Cookie: sessao=abc123; HttpOnly; Secure; SameSite=Lax`} />}
      />

      <h2>HttpOnly — tirando o cookie do alcance do JavaScript</h2>
      <p>
        Por padrão, qualquer script rodando na página consegue ler cookies através de{" "}
        <code>document.cookie</code>. Isso inclui scripts legítimos seus — mas também inclui um script injetado por
        um ataque de XSS (lição 7). Se o cookie de sessão está ali, legível, um XSS bem-sucedido consegue roubá-lo e
        mandar pra um servidor do atacante, que passa a se autenticar como a vítima sem precisar de senha nenhuma.
      </p>
      <CodeExample
        label="dentro do console do navegador"
        language="javascript"
        result={`// sem HttpOnly:
"sessao=abc123; tema=escuro"

// com HttpOnly no cookie "sessao":
"tema=escuro"   // "sessao" simplesmente não aparece aqui`}
        code={`document.cookie`}
      />
      <p>
        <code>HttpOnly</code> instrui o navegador a nunca expor aquele cookie específico pra JavaScript — ele
        continua sendo enviado normalmente nas requisições HTTP (é isso que faz a sessão funcionar), só não pode ser{" "}
        <em>lido</em> por código rodando na página. Repare que isso não impede o XSS de acontecer; reduz o estrago{" "}
        <strong>se</strong> ele acontecer, tirando o cookie de sessão da lista de coisas que um script malicioso
        consegue roubar diretamente.
      </p>

      <h2>Secure — nunca em texto puro na rede</h2>
      <p>
        <code>Secure</code> diz ao navegador pra só enviar aquele cookie em conexões HTTPS — nunca em HTTP puro. Sem
        esse atributo, se por qualquer motivo (um link antigo, um redirecionamento mal configurado) uma requisição
        sair em HTTP, o cookie de sessão viaja sem criptografia nenhuma pela rede, legível por qualquer um no mesmo
        Wi-Fi ou no mesmo provedor — exatamente o cenário de interceptação (MITM) aprofundado na lição 14.
      </p>

      <h2>SameSite — controlando pedidos vindos de outro site</h2>
      <p>
        O atributo mais sutil dos três. Ele controla se o cookie é enviado quando a requisição parte de um{" "}
        <strong>site diferente</strong> daquele que emitiu o cookie — por exemplo, um formulário hospedado em{" "}
        <code>site-malicioso.com</code> enviando uma requisição pra <code>banco.com</code>. Sem restrição nenhuma, o
        navegador manda o cookie de sessão do <code>banco.com</code> mesmo numa requisição disparada por outro site,
        porque "reenviar cookie do domínio automaticamente" não sabe distinguir uma navegação legítima de um ataque.
        Isso é a base do CSRF, coberto de verdade na lição 8 — aqui fica só o mecanismo de defesa:
      </p>
      <CodeExample
        label="os três valores possíveis"
        language="plaintext"
        code={`SameSite=Strict  → o cookie NUNCA é enviado em requisição originada de outro site,
                    nem clicando num link vindo de fora (mais seguro, mas quebra alguns
                    fluxos legítimos, tipo abrir um link de e-mail e já chegar logado)

SameSite=Lax     → o cookie é enviado ao NAVEGAR pra o site (clicar num link), mas não
                    em requisições em segundo plano (POST de formulário, fetch) disparadas
                    por outro site — o equilíbrio padrão hoje na maioria dos frameworks

SameSite=None    → o cookie é enviado sempre, mesmo cross-site — precisa vir acompanhado
                    de Secure obrigatoriamente, e só faz sentido pra casos específicos
                    (ex.: um widget embutido em outros sites)`}
      />
      <p>
        Repare a ordem de risco: <code>None</code> sem outra defesa deixa a porta do CSRF praticamente aberta;{" "}
        <code>Lax</code> (o padrão da maioria dos navegadores modernos quando nada é especificado) já bloqueia o
        cenário mais comum de ataque, o POST disparado silenciosamente por outro site.
      </p>

      <Exercise
        prompt={
          <p>
            Um cookie de sessão está configurado como <code>Set-Cookie: sessao=xyz; Secure</code> (sem{" "}
            <code>HttpOnly</code> e sem <code>SameSite</code>). Um campo de comentário do site tem uma falha de XSS
            armazenado. Explique por que esse cookie específico ainda está em risco, mesmo com <code>Secure</code>{" "}
            presente, e o que faltou pra reduzir esse risco.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Secure só garante que o cookie trafega criptografado (via HTTPS) —
não impede que JavaScript rodando na própria página LEIA o cookie.
Como falta HttpOnly, um script injetado pelo XSS armazenado (por
exemplo, escondido num comentário salvo por um atacante) consegue
executar "document.cookie" normalmente, capturar o valor "xyz" e
mandar pra um servidor externo com uma requisição comum.

Faltou adicionar HttpOnly, que teria removido "sessao" da lista de
cookies visíveis via document.cookie, mesmo com o script malicioso
já rodando na página.`}
      />

      <Callout href="/padrao-frontend/seguranca/cookies-httponly-secure">
        A configuração completa de cookies do padrão — incluindo quais atributos cada tipo de cookie (sessão,
        preferência, analytics) deve ter — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o atributo HttpOnly de um cookie impede especificamente?",
            options: [
              "Impede que o cookie seja enviado em requisições que não usam o método POST",
              "Impede que o cookie expire antes do tempo configurado em Max-Age",
              "Impede que JavaScript rodando na página leia o valor do cookie via document.cookie — ele continua sendo enviado normalmente nas requisições HTTP",
              "Impede que o cookie seja lido por qualquer servidor que não seja o que o emitiu originalmente",
            ],
            correctIndex: 2,
          },
          {
            question:
              "Por que SameSite=Lax já bloqueia o cenário mais comum de CSRF (um POST de formulário disparado por outro site), mesmo sem ser tão restritivo quanto Strict?",
            options: [
              "Porque Lax bloqueia especificamente requisições em segundo plano disparadas por outro site (como um POST de formulário ou fetch), permitindo só a navegação normal ao clicar num link",
              "Porque Lax criptografa o valor do cookie antes de enviar, tornando-o inútil pra um atacante mesmo se interceptado",
              "Porque Lax e Strict são exatamente equivalentes na prática, só com nomes diferentes",
              "Porque Lax impede que o cookie seja usado em qualquer requisição que não venha do mesmo IP do login original",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
