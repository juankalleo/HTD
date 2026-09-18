import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "19-testes-em-rails",
  title: "Testes em Rails: RSpec essencial",
  summary:
    "Um controller spec testa o controller isolado, sem passar pela rota de verdade; um request spec testa o que o cliente da API realmente recebe.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao19TestesEmRails() {
  return (
    <LessonBody>
      <p>
        <code>RSpec</code> é o framework de teste mais usado no ecossistema Rails — substitui o Minitest que vem por
        padrão no gerador do Rails. Pra uma API, duas camadas de teste cobrem a maior parte do que importa: model
        spec (a regra de negócio isolada) e request spec (o comportamento HTTP real, de ponta a ponta).
      </p>

      <h2>Model spec — validação e associação, sem HTTP nenhum envolvido</h2>
      <CodeExample
        label="spec/models/produto_spec.rb"
        language="ruby"
        code={`RSpec.describe Produto, type: :model do
  it "é inválido sem nome" do
    produto = Produto.new(nome: nil, preco: 10)
    expect(produto).not_to be_valid
  end

  it "é inválido com preço menor ou igual a zero" do
    produto = Produto.new(nome: "Teclado", preco: 0)
    expect(produto).not_to be_valid
  end

  it "pertence a uma categoria" do
    expect(Produto.reflect_on_association(:categoria).macro).to eq(:belongs_to)
  end
end`}
      />
      <p>
        Um model spec testa a classe isolada — sem rota, sem controller, sem servidor rodando. É rápido de rodar e
        pega exatamente o tipo de regra que já foi coberta na lição de models e migrations: validação e associação.
      </p>

      <h2>Request spec — o que o cliente da API realmente vê</h2>
      <CodeExample
        label="spec/requests/pedidos_spec.rb"
        language="ruby"
        code={`RSpec.describe "Pedidos", type: :request do
  describe "POST /pedidos" do
    it "cria um pedido e devolve 201 com o total correto" do
      usuario = Usuario.create!(email: "ana@exemplo.com", password: "12345678")

      post "/pedidos",
           params: { pedido: { total: 150 } },
           headers: { "Authorization" => "Bearer #{token_para(usuario)}" }

      expect(response).to have_http_status(:created)
      corpo = JSON.parse(response.body)
      expect(corpo["data"]["attributes"]["total"]).to eq("150.0")
    end

    it "devolve 422 quando o total é inválido" do
      usuario = Usuario.create!(email: "ana@exemplo.com", password: "12345678")

      post "/pedidos",
           params: { pedido: { total: -10 } },
           headers: { "Authorization" => "Bearer #{token_para(usuario)}" }

      expect(response).to have_http_status(:unprocessable_entity)
    end
  end
end`}
      />
      <p>
        Um request spec faz uma chamada HTTP de verdade contra a aplicação de teste: passa pela rota declarada em{" "}
        <code>routes.rb</code>, pelo middleware, pela autenticação via header, pelo controller e pelo serializer —
        na mesma ordem que um cliente real veria em produção.
      </p>

      <h2>Por que request spec ganhou a preferência sobre controller spec</h2>
      <p>
        Um controller spec chama a action do controller <strong>diretamente</strong>, pulando roteamento e boa parte
        do middleware — um teste verde nele não garante que a rota realmente existe em <code>routes.rb</code>, nem
        que o header de autenticação funciona do jeito que um cliente de verdade vai mandar. Um request spec testa o
        contrato real que qualquer cliente da API enxerga, e é por isso que ele é a opção preferida hoje pra testar
        uma API Rails.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva um model spec pra <code>Pedido</code>, cobrindo a validação{" "}
            <code>validates :total, numericality: {"{ greater_than: 0 }"}</code> vista na lição de models e
            migrations, sem usar nenhuma gem de matcher além do RSpec puro.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`RSpec.describe Pedido, type: :model do
  it "é inválido com total igual a zero" do
    pedido = Pedido.new(total: 0)
    expect(pedido).not_to be_valid
  end

  it "é inválido com total negativo" do
    pedido = Pedido.new(total: -50)
    expect(pedido).not_to be_valid
  end

  it "é válido com total maior que zero" do
    pedido = Pedido.new(total: 100, usuario: Usuario.new)
    pedido.valid?
    expect(pedido.errors[:total]).to be_empty
  end
end`}
      />

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que um model spec tipicamente verifica, como no exemplo de Produto?",
            options: [
              "Se a rota /produtos responde com o status HTTP correto",
              "Se o token JWT enviado no header é aceito pelo Devise",
              "Se as validações e associações declaradas na classe do model se comportam como esperado, isoladamente do HTTP",
              "Se o serializer formata o JSON de resposta corretamente",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que request spec é preferido a controller spec para testar uma API atualmente?",
            options: [
              "Porque passa pela pilha real — roteamento, middleware e parsing de parâmetros — em vez de chamar a action do controller diretamente, pulando essas camadas",
              "Porque request spec roda mais rápido que qualquer outro tipo de teste no RSpec",
              "Porque controller spec não consegue testar nenhum tipo de erro, só respostas de sucesso",
              "Porque request spec não precisa de banco de dados configurado no ambiente de teste",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
