import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-rede-entre-containers",
  title: "Rede entre containers",
  summary: "localhost dentro de um container não é a mesma coisa que localhost na sua máquina.",
  estimatedMinutes: 14,
};

export default function Licao06RedeEntreContainers() {
  return (
    <LessonBody>
      <p>
        A confusão mais comum de quem começa com Docker: um container tentando se conectar em{" "}
        <code>localhost:5432</code> achando que vai alcançar o Postgres que está rodando noutro container. Não vai —{" "}
        <code>localhost</code> dentro de um container aponta pro <strong>próprio container</strong>, não pra sua
        máquina nem pros outros containers.
      </p>

      <h2>Por que docker-compose resolve isso sozinho</h2>
      <p>
        Quando você sobe serviços via <code>docker-compose.yml</code>, o Compose cria automaticamente uma rede
        privada e registra cada serviço nela com um <strong>DNS interno</strong> — o nome do serviço vira um hostname
        que os outros containers da mesma rede conseguem resolver.
      </p>
      <CodeExample
        label="docker-compose.yml"
        language="yaml"
        code={`services:
  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app  # "db", não "localhost"
  db:
    image: postgres:16-alpine`}
      />
      <CodeExample
        label="dentro do container 'api'"
        language="bash"
        result={`PING db (172.19.0.2): 56 data bytes
64 bytes from 172.19.0.2: seq=0 ttl=64 time=0.089 ms`}
        code={`ping db`}
      />
      <p>
        <code>db</code> resolve pro IP interno do container do Postgres — sem você configurar IP nenhum manualmente,
        porque os dois estão na mesma rede que o Compose criou.
      </p>

      <h2>Publicando porta pro mundo externo</h2>
      <p>
        Isso é diferente de "publicar" uma porta. <code>ports: ["3000:3000"]</code> expõe a porta do container pra{" "}
        <strong>fora</strong> do Docker, acessível via <code>localhost:3000</code> da sua máquina de verdade. Serviços
        internos (como o banco) normalmente <strong>não</strong> precisam disso — só a API, que o navegador acessa.
      </p>
      <CodeExample
        label="por que o banco geralmente não expõe porta"
        language="yaml"
        code={`services:
  api:
    ports:
      - "3000:3000"    # acessível de fora — o navegador bate aqui
  db:
    image: postgres:16-alpine
    # sem "ports:" — só "api" precisa falar com "db", e eles já se enxergam pela rede interna`}
      />

      <Exercise
        prompt={
          <p>
            Um container "worker" (processamento em background) precisa falar com o Redis do compose, mas ninguém de
            fora precisa acessar o worker nem o Redis diretamente. O que muda no <code>ports:</code> de cada um?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Nenhum dos dois precisa de "ports:". Eles se enxergam pela rede interna
do compose (worker fala com "redis" pelo nome do serviço) — "ports:" só é
necessário pra quem precisa ser acessado de FORA do ambiente Docker, e
nem worker nem redis se enquadram nisso.`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que 'localhost' não funciona pra um container falar com outro container?",
            options: [
              "localhost é bloqueado pelo Docker por segurança",
              "localhost dentro de um container aponta pro próprio container, não pros outros",
              "Só funciona se os dois estiverem na mesma máquina física",
              "É um bug conhecido do Docker",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que o serviço de banco de dados geralmente NÃO tem 'ports:' no compose?",
            options: [
              "Porque banco de dados nunca precisa de porta",
              "Porque só quem precisa ser acessado de fora do ambiente Docker precisa publicar porta — o banco só fala com a API, pela rede interna",
              "É proibido pelo Docker",
              "Porque banco de dados não usa TCP",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
