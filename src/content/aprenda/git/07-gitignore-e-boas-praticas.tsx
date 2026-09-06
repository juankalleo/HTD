import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-gitignore-e-boas-praticas",
  title: ".gitignore e boas práticas de commit",
  summary: "O que NUNCA deve entrar no repositório, e como escrever uma mensagem de commit que ajuda no futuro.",
  estimatedMinutes: 14,
};

export default function Licao07GitignoreEBoasPraticas() {
  return (
    <LessonBody>
      <h2>.gitignore — o que o git deve ignorar completamente</h2>
      <CodeExample
        label=".gitignore"
        language="plaintext"
        code={`node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store`}
      />
      <p>
        Arquivos listados aqui nunca aparecem em <code>git status</code>, nunca são commitados por acidente — mesmo
        rodando <code>git add .</code>. Três categorias sempre entram: dependências reinstaláveis (
        <code>node_modules</code>), saída de build (<code>dist</code>), e segredo (<code>.env</code>).
      </p>

      <h2>.env já commitado por engano — o problema mais sério</h2>
      <p>
        Se um <code>.env</code> com credencial de produção já foi commitado antes de entrar no{" "}
        <code>.gitignore</code>, adicionar ao <code>.gitignore</code> agora <strong>não</strong> remove do
        histórico — o segredo continua lá, em qualquer commit antigo, acessível por qualquer clone do repositório.
        Nesse caso a credencial precisa ser trocada/revogada, não só "escondida" — o git não apaga história
        retroativamente sem reescrever ela inteira (uma operação arriscada, fora do escopo desta lição).
      </p>

      <h2>Mensagem de commit — pra quem vai ler daqui a 6 meses</h2>
      <CodeExample
        label="ruim"
        language="plaintext"
        code={`fix
ajustes
wip
asdf`}
      />
      <CodeExample
        label="melhor"
        language="plaintext"
        code={`Corrige validação de e-mail aceitando espaço em branco

O regex não cobria o caso de "  ana@ex.com" (espaço antes) —
usuários colando do clipboard geravam cadastro com e-mail inválido.`}
      />
      <p>
        Primeira linha curta e no imperativo ("Corrige", não "Corrigido" ou "Corrigindo"); linha em branco; depois o{" "}
        <em>porquê</em>, se não for óbvio. <code>git log</code> daqui a 6 meses deveria explicar a decisão sem
        precisar perguntar pra ninguém.
      </p>

      <h2>Commits pequenos e frequentes vs. um commit gigante</h2>
      <p>
        Um commit por funcionalidade pequena e completa (não por "final do dia") facilita reverter só a parte que
        deu problema, sem levar junto outras 10 mudanças não relacionadas.
      </p>

      <Exercise
        prompt={
          <p>
            Um projeto Next.js novo tem uma chave de API num arquivo <code>.env.local</code>. O que deve estar no{" "}
            <code>.gitignore</code> desde o primeiro commit, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`.env.local

Motivo: se entrar no primeiro commit já no .gitignore, a chave nunca
chega a ser versionada — evita o problema mais sério (segredo já no
histórico, exigindo revogação depois). Adicionar ANTES do primeiro
commit que contém o segredo é o que realmente protege.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Adicionar .env ao .gitignore DEPOIS dele já ter sido commitado uma vez resolve o problema?",
            options: [
              "Sim, completamente",
              "Não — o segredo continua no histórico antigo; a credencial precisa ser trocada/revogada, não só escondida daqui pra frente",
              "Só resolve se for o commit mais recente",
              "gitignore sempre limpa o histórico automaticamente",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que preferir vários commits pequenos a um commit gigante no final do dia?",
            options: [
              "Não faz diferença nenhuma",
              "Facilita reverter só a parte problemática, sem levar junto outras mudanças não relacionadas",
              "Commits pequenos são obrigatórios pelo GitHub",
              "Reduz o tamanho do repositório",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
