import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-forca-bruta-e-rate-limiting",
  title: "Força bruta: tentando senha até acertar — e como travar isso",
  summary: "Sem limite nenhum, adivinhar senha vira só uma questão de quantas tentativas por segundo o atacante consegue automatizar.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao11ForcaBrutaERateLimiting() {
  return (
    <LessonBody>
      <p>
        Ataque de força bruta contra login não tem nada de sofisticado: um script tenta login repetidamente, trocando
        a senha a cada tentativa, até uma bater. O que separa um login vulnerável de um protegido não é a força da
        senha da vítima — é se o servidor deixa esse script tentar milhares de vezes por minuto sem nenhuma
        consequência.
      </p>

      <h2>O ataque, sem limite nenhum</h2>
      <NetworkDiagram
        height={250}
        nodes={[
          { id: "atacante", label: "Script automatizado", kind: "client", x: 15, y: 50 },
          { id: "servidor", label: "POST /login", kind: "server", x: 85, y: 50 },
        ]}
        hops={[
          { from: "atacante", to: "servidor", caption: "1. Tentativa 1: email + senha '123456' → servidor responde 401, sem nenhuma penalidade." },
          { from: "atacante", to: "servidor", caption: "2. Tentativa 2: email + senha 'password' → 401 de novo, nenhum atraso, nenhum bloqueio." },
          { from: "atacante", to: "servidor", caption: "3. ...centenas de tentativas depois, numa lista de senhas comuns, uma delas bate → 200, login concedido ao atacante." },
        ]}
      />
      <p>
        Sem defesa nenhuma, o único obstáculo do atacante é o tempo de rede — e listas de senhas comuns (as milhares
        de senhas mais usadas do mundo, já compiladas publicamente) fazem esse ataque funcionar contra uma fração
        significativa de contas reais, não só contra senhas exóticas de propósito.
      </p>

      <h2>Bloqueio após N tentativas</h2>
      <p>
        A defesa mais direta: contar tentativas malsucedidas por conta (ou por IP, ou os dois combinados) e recusar
        novas tentativas depois de um limite, por um período.
      </p>
      <CodeExample
        label="pseudocódigo do bloqueio por conta"
        language="plaintext"
        code={`tentativas_falhas["ana@exemplo.com"] += 1  // a cada login incorreto

se tentativas_falhas["ana@exemplo.com"] >= 5:
    bloquear_login("ana@exemplo.com", por: 15.minutos)
    responder(429, "Muitas tentativas. Tente novamente mais tarde.")`}
      />
      <p>
        Bloquear por <strong>conta</strong> (o email tentado) impede um atacante mirando um alvo específico, mesmo
        que ele troque de IP a cada tentativa. Bloquear por <strong>IP</strong> impede um atacante testando muitas
        contas diferentes a partir da mesma origem. Um sistema robusto normalmente combina os dois, porque cada um
        cobre um padrão de ataque que o outro sozinho deixaria passar.
      </p>

      <h2>Delay progressivo — uma alternativa mais suave que bloqueio total</h2>
      <p>
        Bloqueio total tem um efeito colateral incômodo: um usuário legítimo que errou a senha 5 vezes seguidas fica
        impedido de tentar de novo, mesmo lembrando a senha certa na sexta tentativa. Uma alternativa (ou
        complemento) é o <strong>delay progressivo</strong>: cada tentativa falha subsequente espera um pouco mais
        antes de responder, sem bloquear completamente.
      </p>
      <CodeExample
        label="delay progressivo, em pseudocódigo"
        language="plaintext"
        code={`tentativa 1 falhou → responde imediatamente
tentativa 2 falhou → espera 1s antes de responder
tentativa 3 falhou → espera 2s
tentativa 4 falhou → espera 4s
tentativa 5 falhou → espera 8s
// dobrando a cada tentativa, o tempo pra testar 100 senhas passa de
// segundos pra horas, sem nunca bloquear alguém completamente`}
      />

      <h2>CAPTCHA — o último recurso, não o primeiro</h2>
      <p>
        CAPTCHA (aquele desafio "eu não sou um robô") funciona, mas piora a experiência de todo usuário legítimo pra
        se defender de um problema que afeta só uma fração de tentativas. Por isso, a prática comum é aplicar CAPTCHA
        só depois de algumas tentativas falhas seguidas (ou em conjunto com bloqueio/delay), não em todo login desde
        a primeira tentativa — reservando o atrito extra pra quando já existe sinal concreto de comportamento
        suspeito.
      </p>

      <Exercise
        prompt={
          <p>
            Um sistema bloqueia uma conta por 15 minutos após 5 tentativas falhas de login. Um atacante percebe isso
            e passa a tentar senhas contra <strong>centenas</strong> de contas diferentes, uma tentativa por conta
            (nunca chegando a 5 na mesma conta). O bloqueio por conta continua sendo suficiente sozinho? O que
            complementaria essa defesa?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Não, sozinho não é suficiente contra esse padrão específico —
"password spraying" (poucas senhas comuns testadas contra muitas
contas diferentes, em vez de muitas senhas contra uma única conta) é
desenhado justamente pra ficar abaixo do limite de bloqueio por
conta.

O complemento é um limite também por IP (ou por padrão de
comportamento, como muitas tentativas de login vindas da mesma
origem em pouco tempo, mesmo contra contas diferentes). Rate
limiting mais amplo, aplicado na camada de rede ou proxy — e não só
por conta individual — cobre esse ângulo que o bloqueio por conta
sozinho deixa passar.`}
      />

      <Callout
        title="Rate limiting em profundidade"
        href="/aprenda/networking/14-rate-limiting-e-protecao-contra-abuso"
        linkLabel="Ver aula completa de rate limiting →"
      >
        O algoritmo de token bucket, o status <code>429</code> e onde aplicar o limite (aplicação, proxy, serviço
        dedicado) já são cobertos em profundidade na trilha de Networking — vale revisitar aquela lição pensando
        especificamente no endpoint de login.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/forca-bruta-e-bloqueio">
        A estratégia de bloqueio contra força bruta usada no frontend do padrão está documentada no Padrão Frontend.
      </Callout>
      <Callout href="/padrao-api/seguranca/forca-bruta-e-bloqueio">
        A estratégia completa do lado da API — throttle por IP e por conta, resposta ao cliente bloqueado — está
        documentada no Padrão API.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que bloquear tentativas de login só por IP não é suficiente contra todo tipo de força bruta?",
            options: [
              "Porque bloqueio por IP nunca funciona, em nenhum cenário de ataque",
              "Porque bloqueio por IP é mais lento de processar do que bloqueio por conta",
              "Porque um atacante testando poucas senhas comuns contra muitas contas diferentes (password spraying), ou trocando de IP a cada tentativa contra uma única conta, passa despercebido só com limite por IP",
              "Porque bloqueio por IP exige que o usuário resolva um CAPTCHA antes de qualquer tentativa",
            ],
            correctIndex: 2,
          },
          {
            question: "Qual a vantagem do delay progressivo em relação a um bloqueio total após N tentativas?",
            options: [
              "Ele impede completamente que um atacante automatizado consiga testar mais de uma senha",
              "Ele elimina totalmente a necessidade de qualquer outro tipo de proteção contra força bruta",
              "Ele torna o custo de testar muitas senhas cada vez maior (o tempo dobra a cada tentativa), sem bloquear completamente um usuário legítimo que errou algumas vezes",
              "Ele funciona exclusivamente quando combinado com CAPTCHA, nunca sozinho",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
