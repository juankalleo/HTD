import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-serializers",
  title: "Serializers",
  summary: "render json: @model devolve TODAS as colunas — serializer decide exatamente o que sai.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao06Serializers() {
  return (
    <LessonBody>
      <p>
        <code>render json: @produto</code> funciona, mas devolve <strong>todas as colunas da tabela</strong> — inclusive
        as que você nunca quis expor, tipo um <code>custo_interno</code> ou o <code>created_at</code> bruto sem
        formatação. Um serializer é a camada que decide, explicitamente, o formato do JSON de resposta.
      </p>

      <CodeExample
        label="app/serializers/produto_serializer.rb"
        language="ruby"
        code={`class ProdutoSerializer
  include JSONAPI::Serializer

  attributes :nome, :preco   # só esses dois saem — custo_interno nunca aparece

  attribute :em_estoque do |produto|
    produto.estoque > 0       # atributo calculado, não existe como coluna
  end

  belongs_to :categoria        # inclui a relação, se pedido
end`}
      />

      <CodeExample
        label="controller usando o serializer"
        language="ruby"
        code={`def show
  render json: ProdutoSerializer.new(@produto).serializable_hash
end`}
      />

      <CodeExample
        label="Resultado — GET /produtos/1"
        language="json"
        result={`{
  "data": {
    "id": "1",
    "type": "produto",
    "attributes": {
      "nome": "Teclado mecânico",
      "preco": "349.9",
      "em_estoque": true
    }
  }
}`}
        code={`ProdutoSerializer.new(@produto).serializable_hash`}
      />

      <p>
        Repare: <code>custo_interno</code> nunca aparece (nem foi listado em <code>attributes</code>);{" "}
        <code>em_estoque</code> não é uma coluna real, é calculado na hora; e o formato de resposta (
        <code>data</code>/<code>attributes</code>/<code>type</code>) é consistente pra qualquer model serializado
        assim — o cliente da API sempre sabe onde procurar o dado, independente do recurso.
      </p>

      <Exercise
        prompt={
          <p>
            Um <code>Usuario</code> tem colunas <code>nome</code>, <code>email</code> e{" "}
            <code>senha_digest</code>. Escreva o serializer garantindo que <code>senha_digest</code> jamais vaze na
            resposta.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class UsuarioSerializer
  include JSONAPI::Serializer

  attributes :nome, :email
  # senha_digest simplesmente não é listado — nunca sai no JSON
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/arquitetura-de-serializers">
        A convenção completa de serializers do padrão — atributos calculados, relações aninhadas, versionamento de
        resposta — está documentada no Padrão API.
      </Callout>

      <Callout
        title="Isso é aprofundado no intermediário"
        href="/aprenda/rails/13-serializers-avancados"
        linkLabel="Ver aula completa →"
      >
        Serializer condicional por contexto (um campo que só admin vê) e como evitar N+1 escondido dentro de uma
        associação aninhada — a lição 13 cobre os dois.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual o principal risco de usar render json: @model direto, sem serializer?",
            options: [
              "Deixa a resposta mais lenta, porque o Rails precisa converter o objeto duas vezes",
              "Expõe todas as colunas da tabela, incluindo dados que nunca deveriam sair pela API",
              "Impede que a resposta seja armazenada em cache pelo navegador do cliente",
              "Faz o Rails ignorar silenciosamente as associações declaradas no model",
            ],
            correctIndex: 1,
          },
          {
            question: "O atributo em_estoque do exemplo, calculado a partir de estoque > 0, precisa existir como coluna na tabela?",
            options: [
              "Sim, porque todo atributo listado num serializer precisa corresponder a uma coluna real",
              "Só se o tipo do atributo calculado for numérico, não booleano",
              "Só quando o model também define um método com esse mesmo nome",
              "Não — o serializer pode calcular um atributo na hora, sem que ele exista como coluna na tabela",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
