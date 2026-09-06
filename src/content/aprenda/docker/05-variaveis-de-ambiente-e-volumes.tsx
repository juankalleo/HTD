import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-variaveis-de-ambiente-e-volumes",
  title: "Variáveis de ambiente e volumes",
  summary: "Segredo nunca vai dentro da imagem; dado nunca vive só dentro do container.",
  estimatedMinutes: 14,
};

export default function Licao05VariaveisDeAmbienteEVolumes() {
  return (
    <LessonBody>
      <h2>Variáveis de ambiente — configuração fora da imagem</h2>
      <p>
        Uma imagem Docker é construída uma vez e roda em vários lugares (local, staging, produção) — cada lugar com
        um <code>DATABASE_URL</code>, uma chave de API diferente. Isso não pode estar escrito dentro da imagem (senão
        você precisaria de uma imagem por ambiente); tem que ser injetado na hora de rodar o container.
      </p>
      <CodeExample
        label="terminal — injetando direto"
        language="bash"
        code={`docker run -e DATABASE_URL=postgres://... -e SECRET_KEY=abc123 minha-api`}
      />
      <CodeExample
        label="ou via arquivo .env (mais comum com compose)"
        language="yaml"
        code={`services:
  api:
    build: .
    env_file: .env    # lê as variáveis desse arquivo, que NUNCA vai pro git`}
      />
      <p>
        O <code>.env</code> entra no <code>.gitignore</code> sempre — é exatamente o tipo de arquivo que, se
        commitado sem querer, vaza credencial de produção pro histórico do repositório pra sempre.
      </p>

      <h2>Volumes — dado que sobrevive ao container</h2>
      <p>
        Por padrão, tudo que um container escreve no próprio sistema de arquivos <strong>some</strong> quando ele é
        removido. Isso é ótimo pra código (você quer sempre a versão da imagem, não o que sobrou de execuções
        antigas) e péssimo pra dado de banco. Um <strong>volume</strong> é uma pasta que existe fora do ciclo de vida
        do container, montada dentro dele.
      </p>
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  db:
    image: postgres:16-alpine
    volumes:
      - postgres_data:/var/lib/postgresql/data   # nomeado — Docker gerencia onde fica

volumes:
  postgres_data:`}
      />
      <p>
        Existe também o <strong>bind mount</strong>: em vez de um volume nomeado, você monta uma pasta real da sua
        máquina — útil em desenvolvimento, pra editar código local e ver o container refletir na hora, sem rebuild.
      </p>
      <CodeExample
        label="bind mount pra desenvolvimento"
        language="yaml"
        code={`services:
  api:
    build: .
    volumes:
      - .:/app          # bind mount: pasta do projeto local dentro do container
      - /app/node_modules # exceção: node_modules do container, não da máquina local`}
      />

      <Exercise
        prompt={
          <p>
            Por que a segunda linha (<code>/app/node_modules</code>) é necessária junto com{" "}
            <code>.:/app</code> no exemplo acima?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Sem essa linha, o bind mount ".:/app" sobrescreveria node_modules do
container com o da máquina local (que pode nem existir, ou ter binários
compilados pra outro sistema operacional). A segunda entrada diz "não
sobrescreva node_modules, deixe o que já existe dentro do container".`}
      />

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que segredo (chave de API, senha de banco) nunca vai dentro da imagem Docker?",
            options: [
              "É só uma convenção estética",
              "A mesma imagem roda em vários ambientes diferentes, e segredo commitado na imagem vaza pra qualquer lugar que a imagem chegue",
              "Docker não permite tecnicamente",
              "Só importa em produção, não em desenvolvimento",
            ],
            correctIndex: 1,
          },
          {
            question: "O que acontece com dado escrito no sistema de arquivos de um container, sem volume, quando ele é removido?",
            options: [
              "Fica salvo automaticamente",
              "É perdido — some junto com o container",
              "Vira uma nova imagem",
              "É enviado pro Docker Hub",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
