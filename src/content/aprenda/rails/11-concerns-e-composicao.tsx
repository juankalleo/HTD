import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-concerns-e-composicao",
  title: "Concerns e composição",
  summary:
    "Herança força uma hierarquia rígida — concern deixa você compartilhar comportamento entre models sem isso, desde que não vire uma gaveta de bagunça.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao11ConcernsEComposicao() {
  return (
    <LessonBody>
      <p>
        <code>Produto</code> e <code>Pedido</code> não têm nenhuma relação de "é um" entre si — mas os dois
        precisam poder ser <strong>arquivados</strong> sem sair do banco (um campo <code>arquivado</code>, um{" "}
        <code>scope</code> pra listar só os ativos, um método pra marcar como arquivado). Copiar esse código nos
        dois models é duplicação; criar uma superclasse comum só pra compartilhar isso força uma hierarquia que não
        faz sentido semântico. Um <strong>concern</strong> resolve exatamente esse caso: comportamento compartilhado
        sem herança.
      </p>

      <h2>Um concern é um módulo com uma DSL pra rodar código na inclusão</h2>
      <CodeExample
        label="app/models/concerns/arquivavel.rb"
        language="ruby"
        code={`module Arquivavel
  extend ActiveSupport::Concern

  included do
    scope :ativos, -> { where(arquivado: false) }
    scope :arquivados, -> { where(arquivado: true) }
  end

  def arquivar!
    update!(arquivado: true)
  end
end`}
      />
      <p>
        <code>ActiveSupport::Concern</code> é o que dá acesso ao bloco <code>included do ... end</code>: tudo dentro
        dele roda <strong>no contexto da classe que inclui</strong> o módulo, e é por isso que <code>scope</code> —
        que só existe em classe ActiveRecord — funciona ali dentro, mesmo estando escrito num módulo solto.
      </p>

      <CodeExample
        label="incluindo o concern nos dois models"
        language="ruby"
        code={`class Produto < ApplicationRecord
  include Arquivavel
end

class Pedido < ApplicationRecord
  include Arquivavel
end

Produto.ativos          # só os não arquivados
produto.arquivar!        # marca como arquivado, sem duplicar lógica em nenhum dos dois models`}
      />

      <p>
        Controller também usa concern — não é uma ferramenta exclusiva de model. Um{" "}
        <code>app/controllers/concerns/paginavel.rb</code> compartilhando a mesma lógica de paginação entre{" "}
        <code>ProdutosController</code> e <code>PedidosController</code> segue a mesma ideia: comportamento comum,
        sem repetir código, sem forçar os dois controllers a herdarem de uma terceira classe intermediária.
      </p>

      <h2>Quando um concern vira gaveta de bagunça</h2>
      <p>
        O anti-padrão mais comum não é usar concern demais — é criar <strong>um</strong> concern genérico (
        <code>Helpers</code>, <code>Util</code>, <code>Shared</code>) e ir empilhando ali qualquer método que não
        tem lugar óbvio, sem relação lógica entre um método e outro. Isso é pior do que não ter concern nenhum:
        agora o comportamento de um model está espalhado num arquivo que ninguém sabe o que faz só de olhar o nome.
      </p>
      <p>
        O teste prático: um concern deveria ter um nome que descreve <strong>uma capacidade coesa</strong> —{" "}
        <code>Arquivavel</code>, <code>Pesquisavel</code>, <code>Notificavel</code>. Se você não consegue dar ao
        concern um nome assim, sem ser um substantivo genérico, é sinal de que ele deveria virar duas classes
        separadas, ou nem existir.
      </p>

      <Exercise
        prompt={
          <p>
            <code>Produto</code> e <code>Categoria</code> têm uma coluna <code>nome</code> em comum. Escreva um
            concern <code>Pesquisavel</code> que adiciona um método de classe{" "}
            <code>buscar_por_termo(termo)</code>, usando <code>where</code> com placeholder (nunca interpolando o
            termo direto na query).
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`module Pesquisavel
  extend ActiveSupport::Concern

  class_methods do
    def buscar_por_termo(termo)
      where("nome ILIKE ?", "%#{termo}%")
    end
  end
end

class Produto < ApplicationRecord
  include Pesquisavel
end

class Categoria < ApplicationRecord
  include Pesquisavel
end`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/concerns-e-composicao">
        A convenção completa de concerns do padrão — quando extrair, como nomear, o limite entre concern de model e
        de controller — está documentada no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Qual o principal motivo pra extrair um comportamento repetido em Produto e Pedido pra um concern, em vez de criar uma superclasse comum da qual os dois herdam?",
            options: [
              "Porque herança é proibida em Ruby quando duas classes não têm nenhuma relação entre si",
              "Porque um concern roda mais rápido em tempo de execução do que um método herdado de superclasse",
              "Porque Produto e Pedido não têm uma relação de 'é um' entre si — forçar uma superclasse comum criaria uma hierarquia artificial só pra compartilhar código",
              "Porque ActiveRecord não permite que dois models herdem da mesma classe além de ApplicationRecord",
            ],
            correctIndex: 2,
          },
          {
            question: "O que caracteriza um concern que virou 'gaveta de bagunça' (anti-padrão)?",
            options: [
              "Reúne métodos sem relação lógica entre si, só agrupados por conveniência, sob um nome genérico como Helpers ou Utils",
              "Ser incluído em mais de um model ao mesmo tempo, como Produto e Pedido",
              "Definir um scope dentro do bloco included do, em vez de direto no model",
              "Ter menos de dez linhas de código no arquivo do concern",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
