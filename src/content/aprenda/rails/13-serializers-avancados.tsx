import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-serializers-avancados",
  title: "Serializers avançados",
  summary:
    "Associação aninhada, atributo condicional por contexto e N+1 escondido dentro de um serializer — o que a lição básica deixou de fora.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao13SerializersAvancados() {
  return (
    <LessonBody>
      <p>
        A lição de serializers cobriu atributos explícitos e um atributo calculado. Faltam três coisas que aparecem
        o tempo todo num serializer de produção: aninhar uma associação inteira dentro da resposta, mudar o que sai
        dependendo de quem pediu, e evitar que essa mesma associação aninhada dispare uma query por registro.
      </p>

      <h2>Associação aninhada — serializando o relacionamento inteiro</h2>
      <CodeExample
        label="app/serializers/pedido_serializer.rb + item_serializer.rb"
        language="ruby"
        code={`class ItemSerializer
  include JSONAPI::Serializer

  attributes :quantidade
  belongs_to :produto, serializer: ProdutoSerializer
end

class PedidoSerializer
  include JSONAPI::Serializer

  attributes :status, :total
  belongs_to :usuario
  has_many :itens, serializer: ItemSerializer
end`}
      />
      <p>
        <code>serializer: ItemSerializer</code> diz explicitamente qual serializer usar pra cada item da lista — sem
        isso, o gem não saberia formatar <code>itens</code> como objetos estruturados. O resultado é uma árvore
        completa: pedido, com seus itens, com o produto de cada item, tudo no mesmo JSON.
      </p>

      <h2>Serializer condicional por contexto</h2>
      <p>
        Às vezes o mesmo recurso precisa aparecer diferente dependendo de <strong>quem</strong> está pedindo — um
        campo que só administrador vê, por exemplo. Duplicar o serializer inteiro (<code>ProdutoSerializer</code> e{" "}
        <code>AdminProdutoSerializer</code>) só pra um campo a mais é desperdício; a opção <code>if:</code> resolve
        isso no mesmo serializer.
      </p>
      <CodeExample
        label="app/serializers/produto_serializer.rb"
        language="ruby"
        code={`class ProdutoSerializer
  include JSONAPI::Serializer

  attributes :nome, :preco

  attribute :custo_interno, if: Proc.new { |_produto, params| params[:usuario_atual]&.admin? }
end`}
      />
      <CodeExample
        label="controller passando o contexto pro serializer"
        language="ruby"
        code={`def show
  render json: ProdutoSerializer.new(
    @produto,
    params: { usuario_atual: current_usuario }
  ).serializable_hash
end`}
      />
      <p>
        O <code>Proc</code> recebe o registro e os <code>params</code> passados na hora de instanciar o serializer —
        se <code>usuario_atual</code> não for admin, <code>custo_interno</code> simplesmente não entra na resposta.
        Mesma classe, mesmo model, JSON diferente dependendo de quem chamou.
      </p>

      <h2>N+1 escondido dentro de um serializer</h2>
      <p>
        O perigo de <code>has_many :itens, serializer: ItemSerializer</code>, que por sua vez tem{" "}
        <code>belongs_to :produto</code>, é que serializar uma <strong>lista</strong> de pedidos assim dispara uma
        query de itens por pedido, e uma query de produto por item — sem ninguém perceber, porque o N+1 não está no
        controller, está dentro da árvore de associações do serializer.
      </p>
      <CodeExample
        label="dispara N+1 ao listar"
        language="ruby"
        code={`def index
  render json: PedidoSerializer.new(Pedido.all).serializable_hash
  # pra cada pedido: 1 query de itens + 1 query de produto por item
end`}
      />
      <CodeExample
        label="corrigido — carregado antecipadamente na consulta"
        language="ruby"
        code={`def index
  pedidos = Pedido.includes(itens: :produto)
  render json: PedidoSerializer.new(pedidos).serializable_hash
end`}
      />
      <p>
        <code>includes(itens: :produto)</code> carrega pedidos, itens e produtos em poucas consultas otimizadas, em
        vez de uma nova consulta pra cada registro percorrido. O serializer em si não muda nada — ele não sabe (nem
        precisa saber) se os dados vieram eager loaded; o ajuste sempre acontece na query, no controller.
      </p>

      <Exercise
        prompt={
          <p>
            Um <code>UsuarioSerializer</code> tem <code>attributes :nome</code>. Adicione um atributo condicional{" "}
            <code>email</code>, visível só quando <code>usuario_atual</code> (passado via params) for o próprio
            usuário sendo serializado ou for admin.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class UsuarioSerializer
  include JSONAPI::Serializer

  attributes :nome

  attribute :email, if: Proc.new { |usuario, params|
    atual = params[:usuario_atual]
    atual && (atual.admin? || atual.id == usuario.id)
  }
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/arquitetura-de-serializers">
        Associação aninhada, contexto por parâmetro e estratégias de eager loading pra serializer estão documentadas
        em detalhe no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "No serializer com attribute :custo_interno, if: Proc.new { |_produto, params| params[:usuario_atual]&.admin? }, quando esse atributo aparece na resposta?",
            options: [
              "Só quando o usuário passado via params no serializer for um admin — o mesmo serializer produz JSON diferente dependendo de quem pediu",
              "Sempre, independente de quem fez a requisição, porque if só controla validação no model",
              "Nunca, porque atributos condicionais não são suportados por serializers em Rails",
              "Apenas na primeira requisição depois que o servidor é reiniciado",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Por que Pedido.includes(itens: :produto) evita N+1 ao serializar uma lista de pedidos com itens aninhados?",
            options: [
              "Porque remove a necessidade de declarar has_many :itens no serializer",
              "Porque converte a consulta em uma única string SQL sem nenhum JOIN",
              "Porque carrega os itens e os produtos relacionados antecipadamente, em poucas consultas, em vez de uma consulta nova para cada pedido",
              "Porque desativa a validação de presença nos models Item e Produto durante a serialização",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
