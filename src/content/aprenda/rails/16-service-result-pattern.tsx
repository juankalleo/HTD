import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-service-result-pattern",
  title: "Service Result: aprofundando service objects",
  summary:
    "Levantar exception pra 'e-mail já cadastrado' trata um resultado esperado do negócio como se fosse um bug — um objeto de resultado resolve isso.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao16ServiceResultPattern() {
  return (
    <LessonBody>
      <p>
        O <code>FinalizarPedido</code> da lição de service objects devolvia só <code>true</code>/<code>false</code>{" "}
        — o controller sabia que falhou, mas não sabia <strong>por quê</strong>. É tentador resolver isso levantando
        uma exception customizada pra carregar a mensagem de erro. Isso é pior do que o problema original.
      </p>

      <h2>O anti-padrão: exception pra um fluxo esperado</h2>
      <CodeExample
        label="NÃO faça isso"
        language="ruby"
        code={`class EmailJaCadastrado < StandardError; end

class CadastrarUsuario
  def initialize(params)
    @params = params
  end

  def call
    raise EmailJaCadastrado if Usuario.exists?(email: @params[:email])
    Usuario.create!(@params)
  end
end`}
      />
      <CodeExample
        label="controller precisando saber disso de antemão"
        language="ruby"
        code={`def create
  usuario = CadastrarUsuario.new(usuario_params).call
  render json: usuario, status: :created
rescue EmailJaCadastrado
  render json: { error: "E-mail já cadastrado" }, status: :unprocessable_entity
end`}
      />
      <p>
        "E-mail já cadastrado" acontece o tempo todo no uso normal do sistema — não é uma falha inesperada do
        programa, é um <strong>resultado</strong> esperado da regra de negócio. Tratar isso como exception mistura,
        no mesmo <code>rescue</code>, coisas de gravidade completamente diferente: um usuário digitando um e-mail já
        usado e o banco de dados caindo no meio da chamada viram, pro código, o mesmo tipo de evento. E o método{" "}
        <code>call</code> não deixa claro, só pela assinatura, que quem chama precisa envolver isso num{" "}
        <code>rescue</code>.
      </p>

      <h2>O padrão correto: um objeto de resultado</h2>
      <CodeExample
        label="app/services/resultado.rb"
        language="ruby"
        code={`class Resultado
  attr_reader :erros, :dado

  def initialize(sucesso:, dado: nil, erros: [])
    @sucesso = sucesso
    @dado = dado
    @erros = erros
  end

  def sucesso?
    @sucesso
  end
end`}
      />
      <CodeExample
        label="app/services/cadastrar_usuario.rb"
        language="ruby"
        code={`class CadastrarUsuario
  def initialize(params)
    @params = params
  end

  def call
    return Resultado.new(sucesso: false, erros: ["E-mail já cadastrado"]) if Usuario.exists?(email: @params[:email])

    usuario = Usuario.new(@params)
    if usuario.save
      Resultado.new(sucesso: true, dado: usuario)
    else
      Resultado.new(sucesso: false, erros: usuario.errors.full_messages)
    end
  end
end`}
      />
      <CodeExample
        label="controller reagindo ao resultado, sem rescue nenhum"
        language="ruby"
        code={`def create
  resultado = CadastrarUsuario.new(usuario_params).call
  if resultado.sucesso?
    render json: resultado.dado, status: :created
  else
    render json: { errors: resultado.erros }, status: :unprocessable_entity
  end
end`}
      />
      <p>
        Repare: "e-mail já cadastrado" e "senha muito curta" (vindo de <code>usuario.errors</code>) agora passam
        pelo <strong>mesmo caminho</strong> — <code>sucesso?</code> falso, com a mensagem certa dentro de{" "}
        <code>erros</code>. Uma falha de verdade (o banco caindo no meio da chamada) continua subindo como exception
        normal e é tratada pelo <code>rescue_from</code> central — a diferença é que ela não é mais usada pra
        representar um resultado que o negócio já esperava.
      </p>

      <Exercise
        prompt={
          <p>
            Reescreva o <code>CancelarPedido</code> (que reverte o status pra "cancelado" e devolve o estoque, mas
            só funciona se o pedido não tiver sido entregue) pra devolver um <code>Resultado</code> em vez de{" "}
            <code>true</code>/<code>false</code>, com a mensagem "Pedido já entregue não pode ser cancelado" no caso
            de falha.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class CancelarPedido
  def initialize(pedido)
    @pedido = pedido
  end

  def call
    return Resultado.new(sucesso: false, erros: ["Pedido já entregue não pode ser cancelado"]) if @pedido.entregue?

    ActiveRecord::Base.transaction do
      @pedido.update!(status: :cancelado)
      @pedido.itens.each { |item| item.produto.increment!(:estoque, item.quantidade) }
    end

    Resultado.new(sucesso: true, dado: @pedido)
  end
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/service-result">
        O objeto de resultado padrão usado em todos os services do padrão — incluindo como compor múltiplos
        resultados numa transação — está documentado no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que 'e-mail já cadastrado' não deveria ser implementado como uma exception levantada pelo service?",
            options: [
              "Porque Ruby não permite lançar exceptions dentro de uma classe de service",
              "Porque exceptions só podem ser usadas dentro de models, nunca em services",
              "Porque uma exception sempre derruba o servidor Rails inteiro quando levantada",
              "Porque é um resultado esperado do uso normal do sistema, não uma falha inesperada — misturar isso com bugs reais no mesmo rescue confunde gravidades diferentes",
            ],
            correctIndex: 3,
          },
          {
            question: "No objeto Resultado do exemplo, o que resultado.sucesso? falso, com erros preenchido, permite que o controller faça?",
            options: [
              "Chamar automaticamente outro service para tentar corrigir o erro sozinho",
              "Decidir a resposta HTTP (ex.: 422 com a lista de erros) sem precisar de rescue, só verificando sucesso?",
              "Reverter automaticamente qualquer alteração já salva no banco, sem precisar de transaction",
              "Pular a validação do model na próxima tentativa de salvar",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
