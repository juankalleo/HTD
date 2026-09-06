import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-projeto-guiado-api-rest",
  title: "Projeto guiado: API REST completa",
  summary: "Um recurso Pedido do scaffold ao endpoint autenticado, autorizado e serializado — as 9 lições juntas.",
  estimatedMinutes: 26,
};

export default function Licao10ProjetoGuiadoApiRest() {
  return (
    <LessonBody>
      <p>
        Última peça: um recurso <code>Pedido</code> inteiro, do zero ao endpoint pronto pra produção, encadeando
        tudo que foi visto — scaffold, model com validação, controller REST, serializer, service object, Devise e
        CanCanCan.
      </p>

      <h2>1. Scaffold</h2>
      <CodeExample
        language="bash"
        code={`rails generate scaffold Pedido usuario:references status:string total:decimal --api
rails db:migrate`}
      />

      <h2>2. Model — validação e enum de status</h2>
      <CodeExample
        label="app/models/pedido.rb"
        language="ruby"
        code={`class Pedido < ApplicationRecord
  belongs_to :usuario
  has_many :itens

  enum status: { pendente: 0, finalizado: 1, cancelado: 2 }

  validates :total, numericality: { greater_than: 0 }

  def entregue?
    status == "finalizado"
  end
end`}
      />

      <h2>3. Ability — quem pode fazer o quê</h2>
      <CodeExample
        label="app/models/ability.rb"
        language="ruby"
        code={`class Ability
  include CanCan::Ability

  def initialize(usuario)
    return unless usuario

    if usuario.admin?
      can :manage, :all
    else
      can [:read, :create], Pedido
      can [:update], Pedido, usuario_id: usuario.id
      cannot :destroy, Pedido
    end
  end
end`}
      />

      <h2>4. Service — a ação que orquestra mais de uma tabela</h2>
      <CodeExample
        label="app/services/finalizar_pedido.rb"
        language="ruby"
        code={`class FinalizarPedido
  def initialize(pedido)
    @pedido = pedido
  end

  def call
    return false unless @pedido.itens.any?

    ActiveRecord::Base.transaction do
      @pedido.finalizado!
      @pedido.itens.each { |item| item.produto.decrement!(:estoque, item.quantidade) }
    end
    true
  end
end`}
      />

      <h2>5. Serializer — o formato de resposta</h2>
      <CodeExample
        label="app/serializers/pedido_serializer.rb"
        language="ruby"
        code={`class PedidoSerializer
  include JSONAPI::Serializer

  attributes :status, :total
  belongs_to :usuario
end`}
      />

      <h2>6. Controller — a única peça que conhece HTTP</h2>
      <CodeExample
        label="app/controllers/pedidos_controller.rb"
        language="ruby"
        code={`class PedidosController < ApplicationController
  before_action :authenticate_usuario!    # Devise: exige token válido
  load_and_authorize_resource              # CanCanCan: aplica a Ability

  def index
    render json: PedidoSerializer.new(current_usuario.pedidos).serializable_hash
  end

  def show
    render json: PedidoSerializer.new(@pedido).serializable_hash
  end

  def create
    pedido = current_usuario.pedidos.new(pedido_params)
    if pedido.save
      render json: PedidoSerializer.new(pedido).serializable_hash, status: :created
    else
      render json: { errors: pedido.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def finalizar
    if FinalizarPedido.new(@pedido).call
      render json: PedidoSerializer.new(@pedido).serializable_hash
    else
      render json: { error: "Pedido sem itens" }, status: :unprocessable_entity
    end
  end

  private

  def pedido_params
    params.require(:pedido).permit(:total)
  end
end`}
      />
      <CodeExample
        label="config/routes.rb"
        language="ruby"
        code={`Rails.application.routes.draw do
  resources :pedidos, except: [:new, :edit, :destroy] do
    member { post :finalizar }   # POST /pedidos/:id/finalizar — rota extra, fora do REST padrão
  end
end`}
      />

      <p>
        Repare a ordem das camadas dentro de <code>PedidosController</code>: <code>authenticate_usuario!</code>{" "}
        (quem é você) roda antes de <code>load_and_authorize_resource</code> (o que você pode fazer), que roda antes
        de qualquer lógica de negócio. Autenticação, depois autorização, depois regra de negócio — nessa ordem,
        sempre.
      </p>

      <Exercise
        prompt={
          <p>
            Um usuário comum tenta <code>{"POST /pedidos/7/finalizar"}</code> num pedido que não é dele. Em que
            camada exatamente essa tentativa é barrada, e com qual status HTTP?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Barrada em load_and_authorize_resource, antes da action "finalizar" rodar —
a Ability só permite :update em Pedido quando usuario_id == usuario.id.
CanCan::AccessDenied é levantado e, tratado em ApplicationController, vira
403 Forbidden. O service FinalizarPedido nem chega a ser chamado.`}
      />

      <Callout href="/padrao-api">
        Este projeto guiado é a versão reduzida do Padrão API completo — vale ler a documentação inteira agora que
        cada peça já faz sentido isoladamente.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Na ordem do controller final, o que roda primeiro: autenticação, autorização ou a regra de negócio (service)?",
            options: [
              "Regra de negócio, depois autenticação, depois autorização",
              "Autenticação, depois autorização, depois regra de negócio",
              "A ordem não importa",
              "Autorização sempre antes de autenticação",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que a rota finalizar usa member { post :finalizar } em vez de resources sozinho?",
            options: [
              "resources nunca aceita rota extra",
              "'Finalizar um pedido específico' não é uma das 7 actions REST padrão, então precisa ser declarada à parte",
              "member é obrigatório em toda rota Rails",
              "Só funciona com GET, nunca POST",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
