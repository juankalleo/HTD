import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-preparando-producao",
  title: "Projeto guiado: preparando o compose pra produção",
  summary: "O compose do projeto de fundamentos sobe local igualzinho a produção — mas produção de verdade pede rede isolada, healthcheck, limites e um override próprio.",
  estimatedMinutes: 24,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoPreparandoProducao() {
  return (
    <LessonBody>
      <p>
        No projeto guiado de fundamentos, a API de <code>Pedidos</code> (Rails), a tela de <code>Tarefas</code>{" "}
        (Next.js) e o Postgres subiram juntos com um <code>docker-compose.yml</code> funcional. Funcional não é o
        mesmo que pronto pra produção. Aqui, esse mesmo compose evolui incorporando tudo que o intermediário cobriu:
        rede customizada isolando o ambiente, healthcheck em cada serviço, limites de recursos e um arquivo de
        override específico pra produção.
      </p>

      <h2>1. Rede customizada isolando o ambiente</h2>
      <p>
        Em vez de depender só da rede padrão que o Compose cria automaticamente pro projeto, declaramos uma rede
        nomeada — deixa explícito que esses três serviços formam um ambiente isolado, e facilita conectar outro
        projeto a ela no futuro, se for preciso (lição de redes customizadas).
      </p>
      <CodeExample
        label="docker-compose.yml (rede)"
        language="yaml"
        code={`networks:
  pedidos_net:
    driver: bridge`}
      />

      <h2>2. Healthcheck em cada serviço, e depends_on esperando de verdade</h2>
      <p>
        O compose original usava <code>depends_on</code> só pra ordem de inicialização. Agora, <code>api</code> só
        sobe depois que <code>db</code> está de fato aceitando conexões, e <code>web</code> só sobe depois que{" "}
        <code>api</code> está respondendo — não só "iniciado".
      </p>
      <CodeExample
        label="docker-compose.yml (healthcheck + depends_on)"
        language="yaml"
        code={`services:
  db:
    image: postgres:16-alpine
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5

  api:
    build: ./api
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      retries: 3

  web:
    build: ./web
    depends_on:
      api:
        condition: service_healthy`}
      />

      <h2>3. Limites de recursos</h2>
      <p>
        Cada serviço ganha um teto de memória e CPU — se algum deles vazar memória, só ele é derrubado pelo OOM
        killer, o resto do ambiente continua de pé.
      </p>
      <CodeExample
        label="docker-compose.yml (limites)"
        language="yaml"
        code={`services:
  api:
    mem_limit: 512m
    cpus: "0.5"

  web:
    mem_limit: 512m
    cpus: "0.5"

  db:
    mem_limit: 1g
    cpus: "1.0"`}
      />

      <h2>4. docker-compose.prod.yml — o override de produção</h2>
      <p>
        Ajustes que só fazem sentido em produção (restart policy, variáveis de produção, sem bind mount de código)
        ficam num arquivo separado, combinado na hora do deploy — sem misturar com o que é usado localmente.
      </p>
      <CodeExample
        label="docker-compose.prod.yml"
        language="yaml"
        code={`services:
  api:
    restart: unless-stopped
    env_file: .env.production

  web:
    restart: unless-stopped
    env_file: .env.production
    environment:
      NEXT_PUBLIC_API_URL: https://api.exemplo.com

  db:
    restart: unless-stopped
    env_file: .env.production`}
      />
      <CodeExample
        label="terminal — deploy"
        language="bash"
        result={`[+] Running 3/3
 ✔ Container pedidos-db-1    Healthy
 ✔ Container pedidos-api-1   Healthy
 ✔ Container pedidos-web-1   Started`}
        code={`docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build`}
      />

      <h2>O compose base, completo, juntando tudo</h2>
      <CodeExample
        label="docker-compose.yml (final)"
        language="yaml"
        code={`services:
  web:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    depends_on:
      api:
        condition: service_healthy
    networks:
      - pedidos_net
    mem_limit: 512m
    cpus: "0.5"

  api:
    build: ./api
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgres://postgres:postgres@db:5432/app_production
    depends_on:
      db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      retries: 3
    networks:
      - pedidos_net
    mem_limit: 512m
    cpus: "0.5"

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: postgres
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      retries: 5
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - pedidos_net
    mem_limit: 1g
    cpus: "1.0"

volumes:
  postgres_data:

networks:
  pedidos_net:
    driver: bridge`}
      />
      <p>
        Note o que <strong>não</strong> mudou em relação ao projeto de fundamentos: <code>db</code> continua sem{" "}
        <code>ports:</code> (só a rede interna precisa alcançá-lo), <code>NEXT_PUBLIC_API_URL</code> continua usando{" "}
        <code>localhost</code> porque quem chama é o navegador. O que evoluiu foi tudo que protege o ambiente de um
        problema real em produção: rede isolada, espera de verdade por dependência saudável, e um teto pra cada
        serviço.
      </p>

      <Exercise
        prompt={
          <p>
            O time quer adicionar um Redis pra cache, só usado pela <code>api</code>, seguindo os mesmos padrões
            deste compose: rede <code>pedidos_net</code>, healthcheck, limite de memória de 256MB e sem porta
            publicada (nada de fora precisa acessá-lo diretamente). Escreva o serviço.
          </p>
        }
        solutionLanguage="yaml"
        solutionCode={`services:
  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      retries: 3
    networks:
      - pedidos_net
    mem_limit: 256m
    cpus: "0.25"
    # sem "ports:" — só "api", na mesma rede, precisa falar com o redis

  api:
    depends_on:
      redis:
        condition: service_healthy
      # ... (mantém o depends_on de "db" já existente)`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/limites-de-recursos-e-oom">
        A referência completa de limites de recursos e comportamento do OOM killer usada neste compose está
        documentada no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que colocar api, web e db na mesma rede customizada (pedidos_net) no compose de produção?",
            options: [
              "Porque sem uma rede customizada nenhum dos serviços consegue expor porta nenhuma pro host",
              "Porque isso é obrigatório apenas quando existem mais de dois serviços no mesmo compose",
              "Porque uma rede customizada elimina a necessidade de configurar DATABASE_URL",
              "Pra manter a comunicação entre eles isolada da rede padrão do host e de outros projetos, além de continuar usando o DNS interno por nome de serviço",
            ],
            correctIndex: 3,
          },
          {
            question: "Nesse projeto, por que api depende de db com condition: service_healthy em vez de um depends_on simples?",
            options: [
              "Porque condition: service_healthy é a única sintaxe aceita pelo Compose desde a versão 3",
              "Porque sem isso o Postgres não consegue criar o volume de dados corretamente",
              "Porque depends_on simples só espera o container do banco iniciar, não que ele já esteja pronto pra aceitar conexões",
              "Porque isso reduz o tempo total de build da imagem da API",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
