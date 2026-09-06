import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-deploy",
  title: "Deploy: do compose local a um ambiente real",
  summary: "A mesma imagem que roda no seu notebook é a que sobe em produção — esse é o ponto todo.",
  estimatedMinutes: 16,
};

export default function Licao07Deploy() {
  return (
    <LessonBody>
      <p>
        O maior ganho de containerizar não é só "organizar serviço" — é que a <strong>mesma imagem</strong> testada
        localmente é a que vai pra produção, sem reconstruir nada nem torcer pra "bater" com o ambiente do servidor.
      </p>

      <h2>1. Build e publicação da imagem</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`[+] Building 24.3s (12/12) FINISHED
The push refers to repository [registry.exemplo.com/minha-api]
latest: digest: sha256:a3f9e2... size: 2419`}
        code={`docker build -t registry.exemplo.com/minha-api:latest .
docker push registry.exemplo.com/minha-api:latest`}
      />
      <p>
        <code>build</code> gera a imagem local; <code>push</code> envia pra um <strong>registry</strong> (Docker Hub,
        GitHub Container Registry, ou um privado) — de onde o servidor de produção vai baixá-la, sem precisar do
        código-fonte nem do processo de build rodando lá.
      </p>

      <h2>2. No servidor: puxar e subir</h2>
      <CodeExample
        label="servidor de produção"
        language="bash"
        code={`docker pull registry.exemplo.com/minha-api:latest
docker compose up -d`}
      />
      <p>
        Isso é a diferença entre deploy "clássico" (copiar código pro servidor, instalar dependência lá, torcer pra
        versão do Ruby/Node bater) e deploy com container: o servidor só executa uma imagem já pronta e testada —
        ele nunca precisa ter o ambiente de build instalado.
      </p>

      <h2>Variável de ambiente muda por ambiente, a imagem não</h2>
      <CodeExample
        label="mesma imagem, .env diferente por ambiente"
        language="bash"
        code={`# staging
docker run --env-file .env.staging registry.exemplo.com/minha-api:latest

# produção
docker run --env-file .env.production registry.exemplo.com/minha-api:latest`}
      />
      <p>
        A imagem <code>minha-api:latest</code> é idêntica nos dois casos — só o que muda é a configuração externa
        (lição 5), exatamente como deveria ser.
      </p>

      <h2>Health check — o orquestrador precisa saber se o container está bem</h2>
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  api:
    image: registry.exemplo.com/minha-api:latest
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 10s
      retries: 3`}
      />
      <p>
        Sem health check, um container "rodando" pode estar travado, sem responder — o orquestrador não tem como
        saber e continuar mandando tráfego pra ele. Com health check, ele é reiniciado automaticamente se parar de
        responder.
      </p>

      <Callout href="/padrao-infraestrutura">
        O fluxo de CI/CD completo do padrão — de commit a deploy em produção, incluindo os checks antes do build —
        está documentado no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual o principal ganho de a mesma imagem rodar local e em produção?",
            options: [
              "A imagem fica menor",
              "Elimina a divergência de ambiente entre 'minha máquina' e produção — o que foi testado é literalmente o que sobe",
              "Não precisa mais de variável de ambiente",
              "É só uma questão de convenção, sem ganho real",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve um healthcheck no compose/produção?",
            options: [
              "Acelera o build",
              "Permite que o orquestrador detecte um container travado (rodando mas não respondendo) e reinicie automaticamente",
              "Substitui a necessidade de logs",
              "É só usado em desenvolvimento",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
