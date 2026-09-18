import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "20-projeto-guiado-api-avancada",
  title: "Projeto guiado: evoluindo a API de Pedidos",
  summary:
    "A mesma API de Pedidos da lição de fundamentos ganha paginação, envelope de resposta, job assíncrono e teste de request — fechando fundamentos e intermediário juntos.",
  estimatedMinutes: 26,
  level: "intermediario",
};

export default function Licao20ProjetoGuiadoApiAvancada() {
  return (
    <LessonBody>
      <p>
        O projeto guiado de fundamentos deixou o recurso <code>Pedido</code> com scaffold, validação, Ability,
        service, serializer e controller autenticado/autorizado. Agora cada peça evolui com o que as lições
        intermediárias acrescentaram: <code>index</code> com paginação, resposta em envelope com erro tratado
        centralmente, o service devolvendo um <code>Resultado</code> em vez de <code>true</code>/<code>false</code>{" "}
        e disparando um job assíncrono, e um teste de request cobrindo o fluxo inteiro.
      </p>

      <h2>1. Paginação no index</h2>
      <CodeExample
        label="app/controllers/pedidos_controller.rb (index)"
        language="ruby"
        code={`class PedidosController < ApplicationController
  include Pagy::Backend

  before_action :authenticate_usuario!
  load_and_authorize_resource

  def index
    pagy, pedidos = pagy(current_usuario.pedidos.order(created_at: :desc))
    render json: {
      data: PedidoSerializer.new(pedidos).serializable_hash[:data],
      meta: { pagina: pagy.page, total_paginas: pagy.pages, total_registros: pagy.count }
    }
  end
end`}
      />

      <h2>2. Envelope de resposta e rescue_from central</h2>
      <CodeExample
        label="app/controllers/application_controller.rb"
        language="ruby"
        code={`class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :registro_nao_encontrado
  rescue_from CanCan::AccessDenied, with: :acesso_negado

  private

  def registro_nao_encontrado(excecao)
    render json: { error: { codigo: "nao_encontrado", mensagem: excecao.message } }, status: :not_found
  end

  def acesso_negado(_excecao)
    render json: { error: { codigo: "acesso_negado", mensagem: "Você não tem permissão para essa ação" } },
           status: :forbidden
  end
end`}
      />

      <h2>3. Service com Resultado, disparando job assíncrono</h2>
      <CodeExample
        label="app/services/resultado.rb"
        language="ruby"
        code={`class Resultado
  attr_reader :erros, :pedido

  def initialize(sucesso:, pedido: nil, erros: [])
    @sucesso = sucesso
    @pedido = pedido
    @erros = erros
  end

  def sucesso?
    @sucesso
  end
end`}
      />
      <CodeExample
        label="app/services/finalizar_pedido.rb"
        language="ruby"
        code={`class FinalizarPedido
  def initialize(pedido)
    @pedido = pedido
  end

  def call
    return Resultado.new(sucesso: false, erros: ["Pedido sem itens"]) unless @pedido.itens.any?

    ActiveRecord::Base.transaction do
      @pedido.update!(status: :finalizado)
      @pedido.itens.each { |item| item.produto.decrement!(:estoque, item.quantidade) }
    end

    PedidoMailer.confirmacao(@pedido).deliver_later   # roda fora do request, via Solid Queue

    Resultado.new(sucesso: true, pedido: @pedido)
  end
end`}
      />
      <p>
        "Pedido sem itens" continua sendo um resultado esperado, não uma exception — e o envio do e-mail de
        confirmação não bloqueia mais a resposta, porque roda em background depois que a transação já foi
        confirmada.
      </p>

      <h2>4. Controller final — todas as peças juntas</h2>
      <CodeExample
        label="app/controllers/pedidos_controller.rb (completo)"
        language="ruby"
        code={`class PedidosController < ApplicationController
  include Pagy::Backend

  before_action :authenticate_usuario!
  load_and_authorize_resource

  def index
    pedidos = current_usuario.pedidos.order(created_at: :desc)
    pedidos = pedidos.where(status: params[:status]) if params[:status].present?
    pagy, pedidos_paginados = pagy(pedidos)
    render json: {
      data: PedidoSerializer.new(pedidos_paginados).serializable_hash[:data],
      meta: { pagina: pagy.page, total_paginas: pagy.pages, total_registros: pagy.count }
    }
  end

  def create
    pedido = current_usuario.pedidos.new(pedido_params)
    if pedido.save
      render json: { data: PedidoSerializer.new(pedido).serializable_hash[:data] }, status: :created
    else
      render json: { error: { codigo: "invalido", mensagens: pedido.errors.full_messages } },
             status: :unprocessable_entity
    end
  end

  def finalizar
    resultado = FinalizarPedido.new(@pedido).call
    if resultado.sucesso?
      render json: { data: PedidoSerializer.new(resultado.pedido).serializable_hash[:data] }
    else
      render json: { error: { codigo: "invalido", mensagens: resultado.erros } }, status: :unprocessable_entity
    end
  end

  private

  def pedido_params
    params.require(:pedido).permit(:total)
  end
end`}
      />

      <h2>5. Teste de request cobrindo o fluxo de finalizar</h2>
      <CodeExample
        label="spec/requests/pedidos_spec.rb"
        language="ruby"
        code={`RSpec.describe "Pedidos", type: :request do
  describe "POST /pedidos/:id/finalizar" do
    it "finaliza o pedido e enfileira o e-mail de confirmação" do
      usuario = Usuario.create!(email: "ana@exemplo.com", password: "12345678")
      pedido = usuario.pedidos.create!(total: 150)
      pedido.itens.create!(produto: Produto.create!(nome: "Teclado", preco: 100, estoque: 5), quantidade: 1)

      expect {
        post "/pedidos/#{pedido.id}/finalizar", headers: { "Authorization" => "Bearer #{token_para(usuario)}" }
      }.to have_enqueued_mail(PedidoMailer, :confirmacao)

      expect(response).to have_http_status(:ok)
      expect(pedido.reload.status).to eq("finalizado")
    end

    it "devolve erro quando o pedido não tem itens" do
      usuario = Usuario.create!(email: "bia@exemplo.com", password: "12345678")
      pedido = usuario.pedidos.create!(total: 0)

      post "/pedidos/#{pedido.id}/finalizar", headers: { "Authorization" => "Bearer #{token_para(usuario)}" }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end`}
      />
      <p>
        <code>have_enqueued_mail</code> confirma que o job de e-mail foi enfileirado — não que ele foi entregue. A
        entrega de fato roda depois, fora do ciclo do teste, processada pelo worker do Solid Queue; o request spec
        só precisa garantir que a chamada certa foi enfileirada.
      </p>

      <Exercise
        prompt={
          <p>
            O <code>index</code> acima já filtra por <code>status</code>. Adicione também um filtro opcional por
            data mínima (<code>?desde=2026-01-01</code>), combinado com o filtro de status e a paginação já
            existentes, sem interpolar nada direto numa string SQL.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`def index
  pedidos = current_usuario.pedidos.order(created_at: :desc)
  pedidos = pedidos.where(status: params[:status]) if params[:status].present?
  pedidos = pedidos.where("created_at >= ?", params[:desde]) if params[:desde].present?
  pagy, pedidos_paginados = pagy(pedidos)
  render json: {
    data: PedidoSerializer.new(pedidos_paginados).serializable_hash[:data],
    meta: { pagina: pagy.page, total_paginas: pagy.pages }
  }
end`}
      />

      <Callout href="/padrao-api">
        Este projeto guiado fecha fundamentos e intermediário do Padrão API reduzidos a um único recurso — vale ler
        a documentação completa agora que cada peça, das básicas às avançadas, já faz sentido isoladamente.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Depois de adicionar paginação e envelope ao index, o que a resposta passa a incluir além dos dados dos pedidos?",
            options: [
              "Nada além dos dados — paginação e envelope não mudam o formato de resposta",
              "Apenas o total de pedidos, sem nenhuma outra informação de página",
              "Um novo token de autenticação a cada requisição de listagem",
              "Um bloco meta com informação de paginação (página atual, total de páginas, total de registros), ao lado de data",
            ],
            correctIndex: 3,
          },
          {
            question: "No teste de request de finalizar, por que verificar que o e-mail foi enfileirado (have_enqueued_mail) em vez de checar se ele foi realmente entregue?",
            options: [
              "Porque have_enqueued_mail é a única forma de testar mailers em RSpec, não existe alternativa",
              "Porque com deliver_later o teste só precisa garantir que o job foi enfileirado corretamente — a entrega de fato roda depois, fora do ciclo do request, e é responsabilidade do worker",
              "Porque testar entrega real de e-mail é mais rápido do que testar se o job foi enfileirado",
              "Porque o Solid Queue impede que testes automatizados verifiquem o conteúdo de um e-mail",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
