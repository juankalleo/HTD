import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-compose-avancado-profiles-e-overrides",
  title: "Compose avançado: profiles e overrides",
  summary: "Nem todo serviço precisa subir sempre, e dev/produção não deviam compartilhar o mesmo arquivo sem ajuste nenhum.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao14ComposeAvancadoProfilesEOverrides() {
  return (
    <LessonBody>
      <p>
        Até aqui, um único <code>docker-compose.yml</code> serviu tanto pra rodar localmente quanto (com variável de
        ambiente trocada) pra produção. Isso funciona pra projetos simples, mas dois problemas aparecem rápido: você
        quer coisas em dev que não fazem sentido em produção (bind mount de código, porta de debug), e às vezes só
        quer subir <strong>parte</strong> dos serviços, não todos. O Compose tem mecanismos prontos pra isso.
      </p>

      <h2>docker-compose.override.yml — o Compose já espera por ele</h2>
      <p>
        Se existir um arquivo chamado exatamente <code>docker-compose.override.yml</code> na mesma pasta do{" "}
        <code>docker-compose.yml</code>, o Compose <strong>mescla os dois automaticamente</strong> ao rodar{" "}
        <code>docker compose up</code> — sem precisar passar <code>-f</code> nenhum. É o lugar natural pra ajustes só
        de desenvolvimento local, mantendo o arquivo principal mais "neutro".
      </p>
      <CodeExample
        label="docker-compose.yml (base, comum a todo ambiente)"
        language="yaml"
        code={`services:
  api:
    build: .
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app
  db:
    image: postgres:16-alpine`}
      />
      <CodeExample
        label="docker-compose.override.yml (só dev, mesclado automaticamente)"
        language="yaml"
        code={`services:
  api:
    volumes:
      - .:/app             # bind mount pra hot-reload em dev
    ports:
      - "9229:9229"        # porta de debug do Node, só faz sentido localmente`}
      />

      <h2>Múltiplos -f — combinando arquivos explicitamente</h2>
      <p>
        Pra produção, você não quer o override de dev, mas quer um arquivo próprio com ajustes de produção. Nesse
        caso, ignore o mecanismo automático e escolha os arquivos na mão, na ordem que fizer sentido — o Compose
        aplica um por cima do outro, na ordem em que aparecem:
      </p>
      <CodeExample
        label="terminal — produção"
        language="bash"
        code={`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`}
      />
      <p>
        Como o override automático só é aplicado quando você <strong>não</strong> passa <code>-f</code>, usar{" "}
        <code>-f</code> explicitamente (como acima) já ignora o <code>docker-compose.override.yml</code> por padrão —
        é assim que dev e produção deixam de compartilhar ajustes que só fazem sentido num dos dois lados.
      </p>

      <h2>profiles — subir só parte dos serviços</h2>
      <p>
        Serviços auxiliares (uma interface de administração de banco, uma ferramenta de debug) nem sempre precisam
        subir junto com o resto. Marcando um serviço com <code>profiles</code>, ele só sobe quando esse profile é
        ativado explicitamente — por padrão, fica de fora.
      </p>
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  api:
    build: .
    # sem "profiles" — sobe sempre

  adminer:
    image: adminer
    ports:
      - "8081:8080"
    profiles: ["debug"]   # só sobe se o profile "debug" for ativado`}
      />
      <CodeExample
        label="terminal"
        language="bash"
        code={`docker compose up -d              # sobe só "api" (e "db", se não tiver profile)
docker compose --profile debug up -d   # sobe "api", "db" E "adminer"`}
      />

      <h2>Variáveis por ambiente: dev vs prod no mesmo projeto</h2>
      <CodeExample
        label="docker-compose.prod.yml"
        language="yaml"
        code={`services:
  api:
    restart: unless-stopped
    env_file: .env.production
    # sem bind mount, sem porta de debug — só o necessário pra rodar a imagem já buildada`}
      />
      <p>
        A combinação <code>docker-compose.yml</code> (base) + <code>docker-compose.override.yml</code> (dev,
        automático) ou + <code>docker-compose.prod.yml</code> (produção, explícito via <code>-f</code>) evita
        duplicar o arquivo inteiro pra cada ambiente — só o que muda de fato fica declarado separadamente.
      </p>

      <Exercise
        prompt={
          <p>
            Um projeto tem <code>docker-compose.yml</code> com os serviços <code>api</code> e <code>db</code>, e
            precisa de um serviço <code>mailhog</code> (captura de e-mail pra teste) que só deveria subir em
            desenvolvimento, nunca em produção. Onde declarar <code>mailhog</code>, e como isso evita que ele suba
            sem querer em produção?
          </p>
        }
        solutionLanguage="yaml"
        solutionCode={`# docker-compose.override.yml (mesclado automaticamente só quando
# "docker compose up" roda SEM -f explícito — ou seja, localmente)
services:
  mailhog:
    image: mailhog/mailhog
    ports:
      - "8025:8025"

# Em produção, o deploy roda com:
#   docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
# Como isso usa -f explicitamente, o override.yml é ignorado por padrão,
# e "mailhog" nunca aparece no ambiente de produção.`}
      />

      <Callout href="/padrao-infraestrutura/tecnologias/docker-compose">
        O compose de produção completo do padrão, incluindo como ele lida com múltiplos ambientes, está documentado
        no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o Compose faz automaticamente quando existe um arquivo docker-compose.override.yml na mesma pasta?",
            options: [
              "Ele ignora o override e usa exclusivamente o docker-compose.yml principal",
              "Ele exige que o override seja renomeado para docker-compose.yml antes do próximo build",
              "Ele mescla esse arquivo com o docker-compose.yml automaticamente, sem precisar passar -f, ideal pra ajustes locais de desenvolvimento",
              "Ele substitui completamente o docker-compose.yml, ignorando os serviços que não aparecem no override",
            ],
            correctIndex: 2,
          },
          {
            question: "Pra que serve a chave profiles num serviço do compose?",
            options: [
              "Definir em qual sistema operacional aquele serviço tem permissão de rodar",
              "Limitar quantos containers daquele serviço podem existir simultaneamente",
              "Escolher qual usuário do sistema o processo dentro do container vai usar",
              "Fazer esse serviço só subir quando o profile correspondente for explicitamente ativado, em vez de sempre junto com os outros",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
