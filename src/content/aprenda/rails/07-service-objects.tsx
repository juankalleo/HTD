import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-service-objects",
  title: "Service objects",
  summary: "Quando uma ação envolve mais de um model, ela não pertence nem ao controller nem a um model só.",
  estimatedMinutes: 16,
};

export default function Licao07ServiceObjects() {
  return (
    <LessonBody>
      <p>
        "Finalizar um pedido" não é só <code>Pedido.update</code>: baixa estoque, cria um registro de pagamento,
        manda e-mail de confirmação. Colocar tudo isso direto no controller (um "fat controller") mistura HTTP com
        regra de negócio; colocar no model <code>Pedido</code> mistura persistência com orquestração de várias
        tabelas. Um <strong>service object</strong> é uma classe cuja única responsabilidade é essa ação.
      </p>

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
      @pedido.update!(status: :finalizado)
      @pedido.itens.each { |item| item.produto.decrement!(:estoque, item.quantidade) }
      Pagamento.create!(pedido: @pedido, valor: @pedido.total)
    end

    PedidoMailer.confirmacao(@pedido).deliver_later
    true
  end
end`}
      />

      <CodeExample
        label="uso no controller — controller volta a ser fino"
        language="ruby"
        code={`def finalizar
  pedido = Pedido.find(params[:id])
  if FinalizarPedido.new(pedido).call
    render json: pedido
  else
    render json: { error: "Pedido sem itens" }, status: :unprocessable_entity
  end
end`}
      />

      <p>
        Note o <code>ActiveRecord::Base.transaction</code>: se <code>Pagamento.create!</code> falhar depois do
        estoque já ter sido baixado, a transação desfaz <strong>tudo</strong> — sem isso, um erro no meio do processo
        deixaria o banco num estado inconsistente (estoque baixado, mas sem pagamento registrado).
      </p>

      <h2>Quando NÃO criar um service</h2>
      <p>
        Uma action que só salva um registro (<code>Produto.create(params)</code>) não precisa de service — isso é
        exatamente pra que o model e o controller já servem. Service object resolve orquestração entre múltiplas
        entidades, não é uma camada obrigatória em toda action.
      </p>

      <Exercise
        prompt={
          <p>
            Um <code>CancelarPedido</code> precisa: reverter o status pra "cancelado", devolver o estoque de cada
            item, e só funcionar se o pedido ainda não tiver sido entregue. Esboce a classe.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class CancelarPedido
  def initialize(pedido)
    @pedido = pedido
  end

  def call
    return false if @pedido.entregue?

    ActiveRecord::Base.transaction do
      @pedido.update!(status: :cancelado)
      @pedido.itens.each { |item| item.produto.increment!(:estoque, item.quantidade) }
    end
    true
  end
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/service-result">
        O padrão de retorno de service (sucesso/erro tipado, não só true/false) está documentado no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Quando faz sentido extrair um service object?",
            options: [
              "Em toda action, sem exceção",
              "Quando a ação orquestra mais de uma entidade/tabela e não pertence claramente a um model só",
              "Nunca — tudo deveria ficar no controller",
              "Só quando o controller tem menos de 5 linhas",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que envolver as operações em ActiveRecord::Base.transaction?",
            options: [
              "Deixa o código mais rápido",
              "Se uma etapa falhar no meio, desfaz todas as anteriores, evitando estado inconsistente no banco",
              "É só uma boa prática estética, sem efeito real",
              "Transaction é obrigatório em qualquer método Ruby",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
