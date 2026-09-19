import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-autenticacao-por-bearer-token",
  title: "Autenticação por bearer token",
  summary:
    "Nenhum navegador reenvia um bearer token sozinho — e é exatamente essa diferença que muda o cálculo de segurança inteiro.",
  estimatedMinutes: 17,
  level: "fundamentos",
};

export default function Licao04AutenticacaoPorBearerToken() {
  return (
    <LessonBody>
      <p>
        Sessão com cookie funciona muito bem pra um site tradicional, onde navegador e servidor são as únicas duas
        pontas envolvidas. Ela funciona mal (ou nem funciona) pra um app mobile nativo, um SPA consumindo uma API
        separada do domínio do front, ou um serviço backend chamando outro backend — nenhum desses tem "o navegador"
        cuidando de cookie pra eles. Pra esses casos, o mecanismo mais comum é o <strong>bearer token</strong>: um
        valor que o próprio cliente carrega e anexa manualmente em cada requisição.
      </p>

      <h2>O fluxo, passo a passo</h2>
      <NetworkDiagram
        height={250}
        nodes={[
          { id: "cliente", label: "App / SPA", kind: "client", x: 15, y: 50 },
          { id: "servidor", label: "API", kind: "server", x: 85, y: 50 },
        ]}
        hops={[
          { from: "cliente", to: "servidor", caption: "1. POST /login com email e senha." },
          { from: "servidor", to: "cliente", caption: "2. Servidor responde com um token no CORPO da resposta (não como Set-Cookie)." },
          { from: "cliente", to: "servidor", caption: "3. Cliente guarda esse token e anexa manualmente em cada chamada seguinte." },
          { from: "cliente", to: "servidor", caption: "4. GET /pedidos com header Authorization: Bearer eyJhbGc... — sem esse header, o servidor nem sabe quem está perguntando." },
        ]}
      />
      <CodeExample
        label="requisição autenticada"
        language="http"
        code={`GET /pedidos HTTP/1.1
Host: api.exemplo.com
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIx...`}
      />
      <p>
        A palavra <code>Bearer</code> literalmente significa "portador" — o protocolo assume que quem apresenta esse
        token é quem tem direito a ele, sem prova adicional. Repare no contraste com a lição 2: ali, o navegador
        reenviava o cookie sozinho, sem nenhuma linha de código pedindo isso. Aqui, se o seu código esquecer de
        anexar o header <code>Authorization</code>, a requisição simplesmente chega sem identificação nenhuma — o
        servidor responde <code>401 Unauthorized</code>, e não há "reenvio automático" nenhum salvando essa situação.
      </p>

      <h2>Onde o cliente guarda esse token — e por que isso importa</h2>
      <p>
        Diferente do cookie (que o navegador guarda e protege sozinho, respeitando <code>HttpOnly</code>), o bearer
        token precisa ser guardado em algum lugar que o <strong>código do cliente</strong> controla e consegue ler de
        volta pra montar o header a cada chamada. As opções mais comuns são <code>localStorage</code> (persiste entre
        recarregamentos de página, mas fica acessível a qualquer script) ou só em memória/estado da aplicação
        (some ao recarregar a página, mas não fica exposto entre abas nem sobrevive um refresh).
      </p>
      <CodeExample
        label="anexando o token manualmente"
        language="javascript"
        code={`const token = localStorage.getItem("token");

fetch("/pedidos", {
  headers: { Authorization: \`Bearer \${token}\` },
});`}
      />
      <p>
        Esse mesmo <code>localStorage.getItem("token")</code> é o ponto fraco: se existir uma falha de XSS em
        qualquer lugar da aplicação (lição 7), o script injetado consegue rodar exatamente essa mesma linha e roubar
        o token — sem precisar de nenhum truque adicional, porque não existe equivalente de <code>HttpOnly</code>{" "}
        pra <code>localStorage</code>. É o trade-off central do bearer token guardado no client: ele resolve o
        problema de CSRF quase de graça (a lição 8 explica o porquê), mas herda uma exposição a XSS que o cookie{" "}
        <code>HttpOnly</code> não tem.
      </p>

      <h2>Por que isso é o padrão em mobile e integrações de terceiro</h2>
      <p>
        Um app mobile nativo não tem "o navegador" gerenciando cookie de domínio nenhum — ele guarda o token no
        armazenamento seguro do próprio sistema operacional (Keychain no iOS, Keystore no Android) e o anexa
        manualmente, exatamente como no exemplo acima. O mesmo vale pra uma API pública consumida por um serviço
        terceiro: não existe "sessão de navegador" entre dois servidores conversando entre si, então bearer token (ou
        uma variação com chave de API) é praticamente a única opção que faz sentido.
      </p>

      <Exercise
        prompt={
          <p>
            Um front-end guarda o bearer token em <code>localStorage</code> e faz login normalmente. Depois de um
            deploy, um usuário reporta que, ao abrir duas abas do mesmo site e fazer login em uma delas, a outra
            também passa a aparecer autenticada sem recarregar. Isso é esperado? E se o token estivesse só em memória
            (numa variável de estado, não em <code>localStorage</code>), esse comportamento mudaria?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Sim, é esperado com localStorage: ele é compartilhado entre todas
as abas da mesma origem, então assim que uma aba grava o token, ele
já existe ali pra qualquer outra aba que o leia (na próxima ação que
disparar uma leitura, como uma navegação ou um fetch).

Se o token estivesse só em memória (variável de estado dentro do
JavaScript da página, não em localStorage), cada aba teria sua
própria cópia isolada — login em uma aba não apareceria na outra
sem um recarregamento completo, porque memória de JavaScript não é
compartilhada entre abas.`}
      />

      <Callout href="/padrao-api/seguranca/autenticacao">
        A estratégia de autenticação por token usada em produção pelo padrão — incluindo expiração e renovação —
        está documentada no Padrão API.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Qual a diferença essencial entre como o cookie de sessão (lição 2) e o bearer token chegam em cada requisição seguinte?",
            options: [
              "Não existe diferença real — os dois são reenviados automaticamente pelo navegador do mesmo jeito",
              "O bearer token é sempre mais rápido de processar no servidor do que um cookie de sessão",
              "O cookie exige que o servidor tenha um banco de dados; o bearer token nunca precisa de nenhum tipo de armazenamento no servidor",
              "O navegador reenvia o cookie automaticamente sem código nenhum; o bearer token precisa ser lido de algum armazenamento e anexado manualmente pelo código do cliente a cada chamada",
            ],
            correctIndex: 3,
          },
          {
            question:
              "Por que guardar um bearer token em localStorage é considerado um risco específico de XSS, diferente de um cookie HttpOnly?",
            options: [
              "Porque qualquer script rodando na página (incluindo um injetado por XSS) consegue ler localStorage normalmente — não existe um equivalente de HttpOnly pra ele",
              "Porque localStorage é enviado automaticamente pra qualquer site que o usuário visitar depois",
              "Porque localStorage expira sozinho depois de alguns segundos, forçando reautenticação constante",
              "Porque localStorage só funciona em navegadores desktop, tornando apps mobile automaticamente inseguros",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
