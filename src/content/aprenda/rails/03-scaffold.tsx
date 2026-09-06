import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-scaffold",
  title: "Scaffold: gerando um recurso e entendendo cada arquivo",
  summary: "Um comando gera model, migration, controller e rotas — entender o que cada arquivo faz é o objetivo.",
  estimatedMinutes: 16,
};

export default function Licao03Scaffold() {
  return (
    <LessonBody>
      <p>
        <code>scaffold</code> é o gerador mais completo do Rails: um comando cria model, migration, controller,
        rotas e (em app tradicional) views. Numa API, view não entra — mas todo o resto sim. O objetivo aqui não é
        decorar o comando, é entender pra que serve cada arquivo que ele cria.
      </p>

      <CodeExample
        label="terminal"
        language="bash"
        result={`      invoke  active_record
      create    db/migrate/20260101000000_create_produtos.rb
      create    app/models/produto.rb
      invoke  resource_route
       route    resources :produtos
      invoke  scaffold_controller
      create    app/controllers/produtos_controller.rb
      invoke    serializer
      create      app/serializers/produto_serializer.rb`}
        code={`rails generate scaffold Produto nome:string preco:decimal --api`}
      />

      <p>
        <code>--api</code> pede a variante pra API (sem view HTML). <code>nome:string preco:decimal</code> já define
        as colunas da tabela — Rails escreve a migration a partir disso.
      </p>

      <h2>O que cada arquivo gerado faz</h2>
      <CodeExample
        label="db/migrate/..._create_produtos.rb"
        language="ruby"
        code={`class CreateProdutos < ActiveRecord::Migration[7.1]
  def change
    create_table :produtos do |t|
      t.string :nome
      t.decimal :preco
      t.timestamps               # cria created_at e updated_at sozinho
    end
  end
end`}
      />
      <CodeExample
        label="app/models/produto.rb"
        language="ruby"
        code={`class Produto < ApplicationRecord
end`}
      />
      <p>
        Um model Rails começa <strong>vazio</strong> — herdar de <code>ApplicationRecord</code> já dá acesso a todo
        CRUD (<code>Produto.all</code>, <code>Produto.find(1)</code>, <code>Produto.create(...)</code>) sem escrever
        SQL nenhum. Validação e associação entram depois, na próxima lição.
      </p>
      <CodeExample
        label="config/routes.rb"
        language="ruby"
        code={`Rails.application.routes.draw do
  resources :produtos   # gera as 7 rotas REST padrão de uma vez (próxima lição)
end`}
      />
      <CodeExample
        label="app/controllers/produtos_controller.rb (resumido)"
        language="ruby"
        code={`class ProdutosController < ApplicationController
  def index
    render json: Produto.all
  end

  def show
    render json: Produto.find(params[:id])
  end

  def create
    produto = Produto.create(produto_params)
    render json: produto, status: :created
  end

  private

  def produto_params
    params.require(:produto).permit(:nome, :preco)
  end
end`}
      />
      <p>
        <code>produto_params</code> é o <strong>strong parameters</strong> do Rails: exige que o JSON venha
        aninhado sob <code>produto</code> e permite explicitamente só <code>nome</code>/<code>preco</code> — qualquer
        outro campo enviado (tipo um <code>admin: true</code> malicioso) é silenciosamente descartado. Isso não é
        detalhe cosmético: é a primeira linha de defesa contra mass assignment.
      </p>

      <Exercise
        prompt={
          <p>
            Rode <code>rails generate scaffold Categoria nome:string --api</code> mentalmente: quais 4 arquivos
            seriam criados, e o que cada um teria de diferente em relação ao exemplo de Produto acima?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`db/migrate/..._create_categorias.rb  → create_table :categorias com coluna nome:string
app/models/categoria.rb              → class Categoria < ApplicationRecord (vazio, igual)
config/routes.rb                     → adiciona resources :categorias
app/controllers/categorias_controller.rb → mesmas actions, trocando Produto por Categoria
                                           e categoria_params permitindo só :nome`}
      />

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que faz produto_params (strong parameters) no controller gerado?",
            options: [
              "Valida o formato do JSON",
              "Exige que os dados venham aninhados sob uma chave e permite explicitamente só os campos esperados",
              "Converte o JSON em texto",
              "Faz cache da requisição",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que app/models/produto.rb começa vazio, sem métodos?",
            options: [
              "É um bug do gerador",
              "Herdar de ApplicationRecord já dá acesso a todo CRUD básico automaticamente",
              "Rails não suporta lógica em model",
              "Porque a lógica sempre fica só no controller",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
