import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-healthcheck-e-restart-policy",
  title: "Healthcheck e restart policy",
  summary: "Um container 'rodando' e um container funcionando não são a mesma coisa — e o que o Docker faz quando ele cai depende de uma configuração que não vem ligada por padrão.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao11HealthcheckERestartPolicy() {
  return (
    <LessonBody>
      <p>
        <code>docker ps</code> mostra "Up 3 hours" pra um container travado, sem responder nenhuma requisição, do
        mesmo jeito que mostra pra um saudável — o processo continua vivo, só não faz mais nada útil. Docker, por
        padrão, não sabe diferenciar essas duas situações. <code>HEALTHCHECK</code> e <strong>restart policy</strong>{" "}
        juntos resolvem isso: um define como detectar que algo está errado, o outro define o que fazer a respeito.
      </p>

      <h2>HEALTHCHECK no Dockerfile</h2>
      <CodeExample
        label="Dockerfile (trecho)"
        language="dockerfile"
        code={`HEALTHCHECK --interval=10s --timeout=3s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1`}
      />
      <CodeExample
        label="anotado"
        language="plaintext"
        code={`--interval   de quanto em quanto tempo rodar a checagem (aqui: a cada 10s)
--timeout    quanto tempo esperar a checagem responder antes de considerar falha
--retries    quantas falhas seguidas até marcar o container como "unhealthy"
CMD          o comando que decide sucesso/falha pelo código de saída (0 = saudável, qualquer outro = falha)`}
      />
      <p>
        Com isso, <code>docker ps</code> passa a mostrar <code>(healthy)</code>, <code>(unhealthy)</code> ou{" "}
        <code>(health: starting)</code> ao lado do container — informação que antes simplesmente não existia.
      </p>

      <h2>Healthcheck no compose (não precisa estar só no Dockerfile)</h2>
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  api:
    build: .
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      timeout: 3s
      retries: 3`}
      />
      <p>
        Declarar no compose é útil quando a mesma imagem é reusada em contextos diferentes e você quer um healthcheck
        específico pra um deploy — o valor do compose sobrescreve o que estiver no Dockerfile.
      </p>

      <h2>restart policy: o que fazer quando o container cai</h2>
      <CodeExample
        label="opções de restart"
        language="plaintext"
        code={`no              nunca reinicia sozinho (padrão quando "restart" não é declarado)
always          sempre reinicia, mesmo depois de "docker stop" seguido de reinício do daemon Docker
on-failure      só reinicia se o processo sair com código de erro (diferente de 0) — saída limpa não reinicia
unless-stopped  como "always", mas respeita um "docker stop" manual: se você parou de propósito, não volta sozinho`}
      />
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  api:
    build: .
    restart: unless-stopped`}
      />
      <p>
        Em produção, <code>unless-stopped</code> é o mais comum: se o container crashar, reinicia sozinho; se alguém
        (ou um script de deploy) parar o container de propósito, ele não fica ressuscitando no meio de uma
        manutenção. <code>on-failure</code> faz sentido pra jobs que devem rodar uma vez e terminar — reiniciar só
        importa se deram erro.
      </p>

      <h2>depends_on com condition: service_healthy</h2>
      <p>
        Um <code>depends_on</code> simples (o que a trilha de fundamentos usou) só espera o <strong>container</strong>{" "}
        do outro serviço iniciar — não que ele esteja pronto pra aceitar conexão. Um Postgres recém-iniciado ainda
        gasta um tempo inicializando antes de aceitar conexões; uma API que sobe rápido demais pode tentar conectar
        antes disso e cair. Combinando <code>depends_on</code> com o healthcheck do banco, dá pra esperar de verdade.
      </p>
      <CodeExample
        label="docker-compose.yml"
        language="yaml"
        code={`services:
  api:
    build: .
    depends_on:
      db:
        condition: service_healthy   # espera "db" ficar healthy, não só "started"

  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5`}
      />

      <Exercise
        prompt={
          <p>
            Um worker de fila (processa jobs em background) tem <code>restart: on-failure</code> e termina
            normalmente (código 0) depois de processar todos os jobs pendentes uma única vez, por design. Depois de um
            deploy, o time percebe que o worker não está mais rodando — <code>docker ps -a</code> mostra ele como
            "Exited (0)". Isso é um bug do restart policy?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Não é bug — é o comportamento esperado de "on-failure". Essa policy só
reinicia o container quando ele sai com código de ERRO (diferente de 0).
Como o worker terminou "com sucesso" (código 0, por design), o Docker
não tem motivo pra reiniciar. Se o worker deveria ficar rodando
continuamente (não é um job de execução única), o problema está no
design do worker, não na restart policy — ou o restart policy certo
seria "always"/"unless-stopped" se o objetivo é ele nunca parar.`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre restart: on-failure e restart: unless-stopped?",
            options: [
              "on-failure reinicia sempre; unless-stopped só reinicia em caso de erro de rede",
              "Não existe diferença prática, os dois têm o mesmo comportamento no Compose",
              "on-failure só reinicia se o container sair com código de erro; unless-stopped reinicia sempre, mesmo em saída limpa, a menos que você pare o container manualmente",
              "unless-stopped funciona apenas em containers sem healthcheck configurado",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que depends_on com condition: service_healthy é diferente do depends_on simples?",
            options: [
              "Não tem diferença, os dois esperam a mesma coisa, é só sintaxe alternativa",
              "O simples só espera o container do outro serviço iniciar; o com condition espera o healthcheck reportar 'healthy' antes de subir o dependente",
              "condition: service_healthy substitui a necessidade de definir HEALTHCHECK no Dockerfile",
              "depends_on simples já espera o healthcheck, e condition serve só para documentação",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
