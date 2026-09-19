import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-oauth-e-login-social",
  title: "OAuth: como funciona o 'Entrar com Google'",
  summary: "Seu aplicativo nunca vê a senha do Google do usuário — e é justamente esse design que torna login social mais seguro do que parece à primeira vista.",
  estimatedMinutes: 19,
  level: "intermediario",
};

export default function Licao15OauthELoginSocial() {
  return (
    <LessonBody>
      <p>
        Todo botão "Entrar com Google" (ou GitHub, ou qualquer outro provedor) esconde um protocolo chamado{" "}
        <strong>OAuth</strong>. A confusão mais comum é achar que a sua aplicação recebe a senha do Google do usuário
        de alguma forma — ela nunca recebe. O design inteiro do protocolo existe justamente pra impedir isso.
      </p>

      <h2>O fluxo, em alto nível: authorization code</h2>
      <NetworkDiagram
        height={280}
        nodes={[
          { id: "cliente", label: "Navegador do usuário", kind: "client", x: 12, y: 50 },
          { id: "app", label: "Seu servidor", kind: "server", x: 50, y: 20 },
          { id: "google", label: "Google", kind: "server", x: 88, y: 50 },
        ]}
        edges={[
          { from: "cliente", to: "app" },
          { from: "cliente", to: "google" },
          { from: "app", to: "google" },
        ]}
        hops={[
          { from: "cliente", to: "app", caption: "1. Usuário clica 'Entrar com Google' no seu site." },
          { from: "app", to: "cliente", caption: "2. Seu servidor redireciona o navegador para uma URL do Google, informando quem é sua aplicação." },
          { from: "cliente", to: "google", caption: "3. O usuário autentica DIRETAMENTE com o Google — na página do Google, com a senha do Google. Sua aplicação nunca vê essa tela nem essa senha." },
          { from: "google", to: "cliente", caption: "4. Google redireciona de volta pro seu site, com um código de autorização de uso único anexado na URL." },
          { from: "app", to: "google", caption: "5. Seu SERVIDOR (não o navegador) troca esse código pelo token de acesso, numa chamada direta servidor-a-servidor com sua chave secreta." },
        ]}
      />
      <p>
        O passo 3 é o coração do design: a autenticação de verdade acontece inteiramente dentro do domínio do Google,
        numa página que o Google controla. Sua aplicação só recebe, no passo 4, um <strong>código</strong> — não uma
        senha, não um token ainda utilizável diretamente pelo navegador.
      </p>

      <h2>Por que o código não é o token final</h2>
      <p>
        Se o Google devolvesse o token de acesso direto pro navegador logo no redirecionamento, ele ficaria exposto
        na URL — visível no histórico do navegador, em logs de proxy, em qualquer lugar que registre a URL acessada.
        Em vez disso, o Google devolve um <strong>código de uso único</strong>, de vida curta, que só serve pra uma
        coisa: ser trocado por um token de verdade — e essa troca acontece numa chamada direta{" "}
        <strong>servidor a servidor</strong>, autenticada com uma chave secreta que só o seu backend conhece (nunca
        exposta no navegador).
      </p>
      <CodeExample
        label="a troca do código pelo token, do lado do seu servidor"
        language="http"
        code={`POST /oauth/token HTTP/1.1
Host: accounts.google.com

grant_type=authorization_code
&code=4/0AY0e-g7...
&client_id=SEU_CLIENT_ID
&client_secret=SEU_CLIENT_SECRET   ← nunca sai do backend
&redirect_uri=https://seusite.com/callback`}
      />
      <p>
        Mesmo que alguém capture o código de autorização de alguma forma (ele aparece brevemente na URL de retorno),
        sem o <code>client_secret</code> — que fica só no servidor, nunca no navegador nem em código client-side —
        não é possível completar a troca por um token utilizável.
      </p>

      <h2>O que o seu backend faz com o token do Google</h2>
      <p>
        Depois da troca, o Google devolve informações básicas do usuário (nome, email, um identificador único) junto
        com o token. A partir daí, é o seu sistema quem decide como autenticar essa pessoa dentro da sua própria
        aplicação — tipicamente criando (ou reconhecendo) um usuário local vinculado a esse email/id do Google, e
        então emitindo sua <strong>própria</strong> sessão (cookie, lição 2) ou JWT (lição 5) pra ela, exatamente como
        faria num login tradicional. O token do Google raramente é usado direto pra autorizar chamadas dentro da sua
        própria API — ele serve só pra confirmar identidade nesse momento inicial.
      </p>

      <Exercise
        prompt={
          <p>
            Um desenvolvedor implementa "Entrar com Google" de um jeito diferente: o token de acesso do Google é
            devolvido diretamente pro JavaScript do navegador (sem passar pelo backend), e o próprio frontend faz a
            troca do código pelo token, guardando o <code>client_secret</code> num arquivo JavaScript do bundle da
            aplicação. O que está errado nessa implementação?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`O client_secret nunca deveria existir em código que roda no
navegador — qualquer JavaScript enviado ao cliente pode ser lido
por qualquer pessoa (basta abrir as ferramentas de desenvolvedor ou
visualizar o código-fonte da página). Um client_secret exposto desse
jeito deixa de ser secreto: qualquer atacante consegue extraí-lo do
bundle e usá-lo para se passar pela sua aplicação junto ao Google,
completando a troca de código por token em nome dela.

A troca de código por token PRECISA acontecer no backend
especificamente por esse motivo — é o único lugar onde um segredo
consegue, de fato, permanecer secreto.`}
      />

      <Callout href="/padrao-api/seguranca/autenticacao">
        Como login social se integra com a estratégia de autenticação (sessão própria ou JWT emitido depois da troca
        OAuth) usada em produção pelo padrão está documentado no Padrão API.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No fluxo de OAuth do 'Entrar com Google', em que momento sua aplicação vê a senha do Google do usuário?",
            options: [
              "No passo em que o navegador redireciona de volta pro seu site com o código de autorização",
              "No momento em que seu servidor troca o código pelo token de acesso",
              "Em nenhum momento — a autenticação acontece inteiramente numa página do próprio Google, e sua aplicação recebe só um código de autorização, nunca a senha",
              "Apenas se o usuário optar explicitamente por compartilhar a senha durante o cadastro",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que a troca do código de autorização pelo token de acesso precisa acontecer no backend, e não no navegador?",
            options: [
              "Porque o navegador não tem capacidade técnica de fazer requisições POST",
              "Porque essa troca exige o client_secret, que precisa permanecer só no servidor — qualquer código enviado ao navegador pode ser lido por qualquer pessoa, o que exporia o segredo se a troca acontecesse ali",
              "Porque o Google bloqueia qualquer requisição vinda de um domínio diferente do seu, independente de onde ela se origina",
              "Porque tokens de acesso só podem ser processados por servidores com certificado TLS válido",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
