import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-arquitetura-de-controllers",
  title: "Arquitetura de controllers de produção",
  summary:
    "before_action e strong params fazem mais do que economizar linha — usados com disciplina, são o que separa um controller magro de um fat controller disfarçado.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao12ArquiteturaDeControllers() {
  return (
    <LessonBody>
      <p>
        A lição de controllers e rotas mostrou <code>before_action :set_produto, only: [...]</code> economizando uma
        linha repetida. Isso é só a superfície: <code>before_action</code> em cadeia, <code>skip_before_action</code>{" "}
        e strong params com estrutura aninhada resolvem problemas reais de organização — e entender exatamente como
        funcionam evita um controller que parece magro mas esconde regra de negócio dentro de si.
      </p>

      <h2>before_action em cadeia — a ordem importa, e interromper é normal</h2>
      <CodeExample
        label="app/controllers/pedidos_controller.rb"
        language="ruby"
        code={`class PedidosController < ApplicationController
  before_action :authenticate_usuario!
  before_action :set_pedido, only: [:show, :update, :destroy]
  before_action :verificar_editavel, only: [:update]

  def update
    if @pedido.update(pedido_params)
      render json: @pedido
    else
      render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_pedido
    @pedido = Pedido.find(params[:id])
  end

  def verificar_editavel
    return if @pedido.pendente?
    render json: { error: "Pedido já finalizado não pode ser alterado" }, status: :unprocessable_entity
  end
end`}
      />
      <p>
        Os três <code>before_action</code> rodam <strong>na ordem declarada</strong>: primeiro autentica, depois
        busca o pedido, depois checa se ele ainda pode ser editado. Se qualquer um deles chamar <code>render</code>{" "}
        (ou <code>head</code>), a cadeia para ali — os <code>before_action</code> seguintes e a action nunca rodam.
        É assim que <code>verificar_editavel</code> impede <code>update</code> de executar sem precisar de um{" "}
        <code>if</code> dentro dela.
      </p>

      <h2>skip_before_action — a exceção declarada, não um if a mais</h2>
      <CodeExample
        label="app/controllers/sessoes_controller.rb"
        language="ruby"
        code={`class SessoesController < ApplicationController
  skip_before_action :authenticate_usuario!, only: [:create]   # logar não exige já estar logado
end`}
      />

      <h2>Strong params além do básico</h2>
      <CodeExample
        label="permitindo array e atributo aninhado"
        language="ruby"
        code={`def pedido_params
  params.require(:pedido).permit(:total, itens_attributes: [:produto_id, :quantidade])
end

def produto_params
  params.require(:produto).permit(:nome, :preco, tags: [])   # tags: [] permite um array de valores simples
end`}
      />
      <p>
        <code>itens_attributes: [...]</code> permite uma lista de hashes aninhados (o formato que{" "}
        <code>accepts_nested_attributes_for</code> espera); <code>tags: []</code> permite um array de valores
        simples. Em ambos os casos, qualquer chave fora do que foi listado continua sendo descartada silenciosamente
        — a regra da lição de scaffold não muda, só fica mais expressiva.
      </p>

      <h2>O que "controller magro" significa de fato</h2>
      <p>
        Controller magro não é sinônimo de "controller pequeno" contado em linhas — é um controller que faz só três
        coisas: extrai parâmetro, delega a regra de negócio a outra camada (model ou service), devolve a resposta.
        Se tem <code>if</code> de regra de negócio, cálculo de valor ou filtro manual em Ruby dentro de uma action, é
        sinal de lógica vazando pro lugar errado.
      </p>
      <CodeExample
        label="fat controller disfarçado"
        language="ruby"
        code={`def index
  pedidos = Pedido.all
  if params[:desde]
    pedidos = pedidos.select { |p| p.created_at >= Date.parse(params[:desde]) }   # filtra em Ruby, depois de carregar tudo
  end
  total_geral = pedidos.sum { |p| p.total }                                        # soma em Ruby, não no banco
  render json: { pedidos: pedidos, total: total_geral }                            # formato de resposta na mão
end`}
      />
      <CodeExample
        label="a mesma action, magra"
        language="ruby"
        code={`def index
  pedidos = Pedido.all
  pedidos = pedidos.where("created_at >= ?", params[:desde]) if params[:desde].present?
  render json: PedidoSerializer.new(pedidos).serializable_hash
end`}
      />
      <p>
        A versão magra filtra <strong>no banco</strong> (uma query, não um <code>select</code> depois de carregar
        tudo), delega o formato de resposta ao serializer, e não calcula nada em Ruby que o SQL já resolve melhor. O
        controller continua sabendo só de HTTP — quem sabe a regra é o model e o serializer.
      </p>

      <Exercise
        prompt={
          <p>
            Uma action <code>finalizar</code> hoje calcula o total do pedido, decrementa o estoque de cada item e
            envia o e-mail de confirmação, tudo dentro do controller. Reescreva a action delegando isso a um service
            (reaproveite a ideia de <code>FinalizarPedido</code> da lição de service objects).
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`def finalizar
  if FinalizarPedido.new(@pedido).call
    render json: PedidoSerializer.new(@pedido).serializable_hash
  else
    render json: { error: "Pedido sem itens" }, status: :unprocessable_entity
  end
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/arquitetura-de-controllers">
        A arquitetura completa de controllers do padrão — ordem de before_action, rescue_from centralizado,
        convenção de resposta — está documentada no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Num controller com before_action :autenticar depois before_action :set_pedido, o que acontece se autenticar renderizar uma resposta de erro (ex.: 401)?",
            options: [
              "Os dois before_actions rodam sempre, independente do que um renderize",
              "Apenas set_pedido é interrompido, mas a action principal roda normalmente",
              "O Rails ignora a resposta de erro e continua a cadeia até a action",
              "A cadeia para ali — set_pedido e a action não rodam, porque uma resposta já foi renderizada",
            ],
            correctIndex: 3,
          },
          {
            question: "O que realmente significa um 'controller magro' na prática?",
            options: [
              "Um controller com menos de 10 linhas de código no total",
              "Um controller que só extrai parâmetro, delega a regra de negócio a outra camada (model ou service) e devolve a resposta",
              "Um controller que nunca usa before_action, pra manter cada action independente",
              "Um controller que não tem nenhum método privado dentro dele",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
