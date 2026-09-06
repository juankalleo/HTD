import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-o-que-e-rails",
  title: "O que é Rails, convenção sobre configuração",
  summary: "Por que Rails decide tanta coisa por você — e por que isso é o ponto, não um problema.",
  estimatedMinutes: 12,
};

export default function Licao02OQueERails() {
  return (
    <LessonBody>
      <p>
        Rails é um framework web em Ruby construído em torno de um princípio: <strong>convenção sobre
        configuração</strong>. Em vez de você decidir e configurar onde cada arquivo mora, como uma tabela se chama,
        qual método um controller deveria ter pra criar um recurso — Rails já decidiu, e segue essa decisão em todo
        projeto Rails do mundo. Isso tem um preço (menos flexibilidade) e um ganho enorme (qualquer pessoa que já viu
        um projeto Rails sabe onde procurar coisa em outro projeto Rails, sem ler configuração nenhuma).
      </p>

      <h2>A convenção que mais aparece: nome no plural/singular</h2>
      <CodeExample
        label="convenção de nomenclatura"
        language="plaintext"
        code={`Model:      Produto        (classe, singular, PascalCase)
Tabela:     produtos       (banco, plural, snake_case)
Controller: ProdutosController (plural)
Rota:       /produtos      (plural)`}
      />
      <p>
        Você não escreve essa relação em lugar nenhum — Rails deduz a tabela a partir do nome do model
        automaticamente. Isso só quebra se você tentar nomear algo fora do padrão, e nesse caso você teria que
        configurar manualmente o que, no caminho convencional, é automático.
      </p>

      <h2>A estrutura de pastas também é convenção</h2>
      <CodeExample
        label="estrutura de um projeto Rails"
        language="plaintext"
        code={`app/
  models/          → regra de negócio + acesso a dado (ActiveRecord)
  controllers/      → recebe requisição HTTP, decide o que fazer
  serializers/       → formata o model em JSON pra resposta da API
  services/          → lógica que não cabe num model nem controller sozinho
config/
  routes.rb          → mapeia URL + verbo HTTP → controller#action
db/
  migrate/           → histórico versionado de mudanças no schema do banco`}
      />
      <p>
        Compare com o Next.js: lá, pasta define rota; aqui, pasta define <strong>papel</strong> (model, controller,
        service...) e um arquivo separado (<code>routes.rb</code>) mapeia URL pra controller. São filosofias
        diferentes de organização, e as próximas lições mostram cada uma dessas pastas na prática.
      </p>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que significa 'convenção sobre configuração'?",
            options: [
              "Rails não tem nenhuma configuração",
              "Rails já decide padrões (nome de tabela, estrutura de pasta) pra você não ter que configurar isso manualmente",
              "Configuração é sempre mais importante que convenção",
              "É um princípio exclusivo do Rails, nenhum outro framework usa",
            ],
            correctIndex: 1,
          },
          {
            question: "Dado um model Pedido, qual o nome convencional da tabela no banco?",
            options: ["Pedido", "pedido", "pedidos", "PedidosTable"],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
