import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-models-e-migrations",
  title: "Models e migrations",
  summary: "Migration muda o schema do banco de forma versionada; model é onde validação e associação moram.",
  estimatedMinutes: 18,
  level: "fundamentos",
};

export default function Licao04ModelsEMigrations() {
  return (
    <LessonBody>
      <h2>Migration — histórico versionado do schema</h2>
      <p>
        Uma migration é um arquivo Ruby que descreve <strong>uma mudança</strong> no schema do banco — criar tabela,
        adicionar coluna, criar índice. Cada uma tem um timestamp no nome e roda em ordem, uma vez só, registrada
        numa tabela de controle (<code>schema_migrations</code>) — é assim que o banco de cada desenvolvedor, e de
        produção, chega no mesmo schema sem ninguém rodar SQL manual.
      </p>
      <CodeExample
        label="db/migrate/..._add_estoque_to_produtos.rb"
        language="ruby"
        code={`class AddEstoqueToProdutos < ActiveRecord::Migration[7.1]
  def change
    add_column :produtos, :estoque, :integer, default: 0, null: false
    add_index :produtos, :nome
  end
end`}
      />
      <CodeExample
        label="terminal"
        language="bash"
        result={`== 20260102000000 AddEstoqueToProdutos: migrating ==========================
-- add_column(:produtos, :estoque, :integer, {:default=>0, :null=>false})
   -> 0.0023s
-- add_index(:produtos, :nome)
   -> 0.0015s
== 20260102000000 AddEstoqueToProdutos: migrated (0.0041s) ===================`}
        code={`rails db:migrate`}
      />

      <h2>Validação — a primeira barreira contra dado ruim</h2>
      <p>
        Sem validação, <code>Produto.create(nome: nil)</code> simplesmente cria um produto sem nome no banco. Uma
        validação recusa isso <strong>antes</strong> de chegar no banco.
      </p>
      <CodeExample
        label="app/models/produto.rb"
        language="ruby"
        code={`class Produto < ApplicationRecord
  validates :nome, presence: true, length: { minimum: 3 }
  validates :preco, numericality: { greater_than: 0 }
end`}
      />
      <CodeExample
        language="ruby"
        result={`false
["Nome não pode ficar em branco", "Nome é muito curto (mínimo 3 caracteres)"]`}
        code={`produto = Produto.new(nome: "")
produto.valid?
produto.errors.full_messages`}
      />

      <h2>Associação — a relação entre tabelas, em uma linha</h2>
      <CodeExample
        label="app/models/categoria.rb + produto.rb"
        language="ruby"
        code={`class Categoria < ApplicationRecord
  has_many :produtos
end

class Produto < ApplicationRecord
  belongs_to :categoria
end`}
      />
      <p>
        Isso exige uma coluna <code>categoria_id</code> na tabela <code>produtos</code> (adicionada via migration,
        igual ao exemplo de <code>estoque</code> acima) — a partir daí, <code>categoria.produtos</code> e{" "}
        <code>produto.categoria</code> já funcionam, sem escrever o JOIN na mão.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a migration que adiciona <code>categoria_id</code> (referência) à tabela <code>produtos</code>, e
            a validação em <code>Produto</code> que exige <code>categoria</code> presente.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`# migration
class AddCategoriaToProdutos < ActiveRecord::Migration[7.1]
  def change
    add_reference :produtos, :categoria, foreign_key: true
  end
end

# model
class Produto < ApplicationRecord
  belongs_to :categoria
  validates :categoria, presence: true
end`}
      />

      <Callout href="/padrao-banco-de-dados/conceitos-tecnicos/migrations">
        Convenções completas de migration do padrão — reversibilidade, dados default, colunas nunca removidas em
        produção sem etapa intermediária — estão documentadas no Padrão Banco de Dados.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Pra que serve a tabela de controle que o Rails mantém das migrations já rodadas?",
            options: [
              "Guarda uma cópia completa dos dados de todas as tabelas antes de cada migration rodar",
              "Serve para o Rails escolher automaticamente qual ambiente (desenvolvimento, teste ou produção) usar",
              "Armazena o histórico de queries SQL executadas manualmente fora do fluxo de migrations",
              "Garante que cada migration rode uma única vez, e sempre na ordem certa, em qualquer ambiente do projeto",
            ],
            correctIndex: 3,
          },
          {
            question: "O que has_many/belongs_to fazem entre dois models?",
            options: [
              "Criam automaticamente a coluna de chave estrangeira no banco de dados, sem precisar rodar uma migration",
              "Declaram a relação entre as tabelas, habilitando acesso direto tipo categoria.produtos sem escrever JOIN manual",
              "Validam que o registro relacionado existe antes de qualquer operação de salvar, sem precisar de configuração extra",
              "Impedem por padrão que o registro relacionado seja destruído enquanto ainda existirem referências a ele",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
