import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-controllers-e-rotas-rest",
  title: "Controllers e rotas REST",
  summary: "resources gera 7 rotas de uma vez — entender as 7 evita reinventar rota fora do padrão REST.",
  estimatedMinutes: 16,
};

export default function Licao05ControllersERotasRest() {
  return (
    <LessonBody>
      <p>
        <code>resources :produtos</code> em <code>routes.rb</code> gera 7 rotas de uma vez, cada uma mapeada pra uma{" "}
        <em>action</em> do controller. Saber essas 7 de cor evita inventar rota fora do padrão REST — o que quase
        sempre é sinal de que falta uma action, não de que o REST não serve pro caso.
      </p>

      <CodeExample
        label="as 7 rotas REST"
        language="plaintext"
        code={`Verbo    URL                Action    Uso
GET      /produtos          index     listar todos
GET      /produtos/new      new       (só em app c/ view — API não usa)
POST     /produtos          create    criar um novo
GET      /produtos/:id      show      mostrar um específico
GET      /produtos/:id/edit edit      (só em app c/ view — API não usa)
PATCH    /produtos/:id      update    atualizar parcialmente
DELETE   /produtos/:id      destroy   remover`}
      />
      <p>
        Numa API, <code>new</code>/<code>edit</code> não fazem sentido (não existe formulário HTML pra "editar") —
        por isso o gerador com <code>--api</code> já não inclui essas duas.
      </p>

      <h2>O controller — uma action por rota</h2>
      <CodeExample
        label="app/controllers/produtos_controller.rb"
        language="ruby"
        code={`class ProdutosController < ApplicationController
  before_action :set_produto, only: [:show, :update, :destroy]

  def index
    render json: Produto.all
  end

  def show
    render json: @produto
  end

  def create
    produto = Produto.new(produto_params)
    if produto.save
      render json: produto, status: :created
    else
      render json: { errors: produto.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update
    if @produto.update(produto_params)
      render json: @produto
    else
      render json: { errors: @produto.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @produto.destroy
    head :no_content
  end

  private

  def set_produto
    @produto = Produto.find(params[:id])
  end

  def produto_params
    params.require(:produto).permit(:nome, :preco)
  end
end`}
      />
      <p>
        <code>before_action :set_produto, only: [...]</code> evita repetir <code>Produto.find(params[:id])</code> em
        3 actions — roda antes delas, deixando <code>@produto</code> pronto. E cada branch de erro devolve um status
        HTTP correto (<code>422</code> pra validação falhando, <code>204</code> pra delete sem corpo) — o código de
        status <strong>é</strong> parte do contrato da API, não detalhe.
      </p>

      <Exercise
        prompt={
          <p>
            Se <code>Produto.find(params[:id])</code> não achar o registro, o Rails levanta{" "}
            <code>ActiveRecord::RecordNotFound</code>. Sem tratamento nenhum, isso vira erro <code>500</code>. Que
            status HTTP deveria ser esse, e onde você trataria isso pra não repetir em cada controller?
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`# Deveria ser 404, não 500 — o registro simplesmente não existe.
# Tratado uma vez, em ApplicationController (todo controller herda dele):

class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound do
    render json: { error: "Registro não encontrado" }, status: :not_found
  end
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/arquitetura-de-controllers">
        A arquitetura completa de controllers do padrão — before_action, rescue_from centralizado, convenção de
        resposta — está documentada no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que new/edit não aparecem num controller gerado com --api?",
            options: [
              "É um bug do gerador",
              "Elas existem só pra renderizar formulário HTML, que uma API não tem",
              "API não suporta essas actions por limitação técnica",
              "new/edit sempre existem, independente de --api",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve before_action :set_produto, only: [:show, :update, :destroy]?",
            options: [
              "Valida os dados do formulário",
              "Roda Produto.find antes dessas 3 actions, evitando repetir a mesma linha em cada uma",
              "Só funciona em produção",
              "Cria automaticamente as rotas REST",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
