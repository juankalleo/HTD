import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-envelope-de-resposta-e-tratamento-de-erros",
  title: "Envelope de resposta e tratamento de erros",
  summary:
    "Cada endpoint devolvendo um formato de erro diferente obriga o front a tratar cada um na mão — um envelope padronizado e um rescue_from central resolvem isso de uma vez.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao15EnvelopeDeRespostaETratamentoDeErros() {
  return (
    <LessonBody>
      <p>
        Sem um padrão combinado, é fácil um endpoint devolver <code>{"{ error: \"...\" }"}</code>, outro devolver{" "}
        <code>{"{ errors: [...] }"}</code>, e um terceiro simplesmente estourar um <code>500</code> cru quando algo
        falha. O cliente da API — front-end, app mobile, outro serviço — precisa tratar cada formato na mão. Um{" "}
        <strong>envelope de resposta</strong> combinado com <code>rescue_from</code> centralizado resolve isso de
        vez, num lugar só.
      </p>

      <h2>O formato — sucesso e erro seguem sempre a mesma forma</h2>
      <CodeExample
        label="resposta de sucesso"
        language="json"
        code={`{
  "data": { "id": "1", "type": "pedido", "attributes": { "total": "150.0" } },
  "meta": { "pagina": 1 }
}`}
      />
      <CodeExample
        label="resposta de erro"
        language="json"
        code={`{
  "error": { "codigo": "nao_encontrado", "mensagem": "Pedido não encontrado" }
}`}
      />
      <p>
        Um cliente que já sabe ler esse formato consegue tratar <strong>qualquer</strong> endpoint da API do mesmo
        jeito — olha se veio <code>data</code> ou <code>error</code>, sem precisar de um tratamento específico por
        rota.
      </p>

      <h2>rescue_from centralizado — um lugar só pra cada tipo de exceção</h2>
      <CodeExample
        label="app/controllers/application_controller.rb"
        language="ruby"
        code={`class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :registro_nao_encontrado
  rescue_from ActiveRecord::RecordInvalid, with: :registro_invalido
  rescue_from CanCan::AccessDenied, with: :acesso_negado

  private

  def registro_nao_encontrado(excecao)
    render json: { error: { codigo: "nao_encontrado", mensagem: excecao.message } }, status: :not_found
  end

  def registro_invalido(excecao)
    render json: { error: { codigo: "invalido", mensagens: excecao.record.errors.full_messages } },
           status: :unprocessable_entity
  end

  def acesso_negado(_excecao)
    render json: { error: { codigo: "acesso_negado", mensagem: "Você não tem permissão para essa ação" } },
           status: :forbidden
  end
end`}
      />
      <p>
        Como toda classe controller herda de <code>ApplicationController</code>, essas três regras valem pra{" "}
        <strong>qualquer</strong> controller do projeto — nenhum deles precisa saber que <code>RecordNotFound</code>{" "}
        existe, só precisa deixar o Rails levantar a exceção naturalmente.
      </p>

      <h2>O que isso substitui: begin/rescue repetido em cada action</h2>
      <CodeExample
        label="sem rescue_from — repetido, e fácil de divergir"
        language="ruby"
        code={`def show
  begin
    pedido = Pedido.find(params[:id])
    render json: pedido
  rescue ActiveRecord::RecordNotFound
    render json: { error: "não encontrado" }, status: :not_found   # formato diferente do combinado acima!
  end
end`}
      />
      <p>
        Além de repetir o mesmo <code>begin/rescue</code> em toda action que pode levantar{" "}
        <code>RecordNotFound</code>, nada garante que dois desenvolvedores formatem o erro do mesmo jeito — é
        exatamente esse tipo de divergência que o envelope padronizado tenta eliminar, e ela volta a existir se cada
        action trata sua própria exceção.
      </p>

      <Exercise
        prompt={
          <p>
            <code>params.require(:pedido)</code> levanta <code>ActionController::ParameterMissing</code> quando a
            chave <code>pedido</code> não vem na requisição. Adicione um <code>rescue_from</code> em{" "}
            <code>ApplicationController</code> pra essa exceção, seguindo o mesmo formato de envelope de erro usado
            acima.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`rescue_from ActionController::ParameterMissing, with: :parametro_ausente

private

def parametro_ausente(excecao)
  render json: { error: { codigo: "parametro_ausente", mensagem: excecao.message } }, status: :bad_request
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/envelope-de-resposta">
        O formato completo de envelope do padrão — incluindo paginação e metadados adicionais — está documentado no
        Padrão API.
      </Callout>
      <Callout href="/padrao-api/conceitos-tecnicos/tratamento-de-erros">
        O mapeamento completo de exceção para status HTTP e código de erro do padrão está documentado no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a vantagem de rescue_from centralizado no ApplicationController em vez de begin/rescue espalhado em cada action?",
            options: [
              "rescue_from só funciona a partir do Rails 8, então é a única opção moderna disponível",
              "begin/rescue não é uma sintaxe válida dentro de uma action de controller",
              "Garante um único lugar de manutenção e um formato de erro consistente pra qualquer action que levantar aquela exceção",
              "rescue_from impede completamente que qualquer exceção aconteça na aplicação",
            ],
            correctIndex: 2,
          },
          {
            question: "O que um envelope de resposta padronizado (data/meta/error) resolve para quem consome a API?",
            options: [
              "Evita que o cliente precise tratar um formato de resposta diferente para cada endpoint, já que a estrutura básica é sempre a mesma",
              "Reduz o tamanho da resposta HTTP em qualquer situação, mesmo em listas grandes",
              "Substitui a necessidade de status HTTP correto, já que o erro fica só dentro do JSON",
              "Faz o Rails validar automaticamente os dados antes de salvar no banco",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
