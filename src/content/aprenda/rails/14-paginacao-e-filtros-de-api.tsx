import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-paginacao-e-filtros-de-api",
  title: "Paginação e filtros de API",
  summary:
    "Devolver a tabela inteira numa resposta funciona até ela ter volume real — paginação e filtro seguro resolvem isso antes que vire incidente.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao14PaginacaoEFiltrosDeApi() {
  return (
    <LessonBody>
      <p>
        <code>Produto.all</code> funciona perfeitamente com 20 registros de teste. Com 200 mil em produção, essa
        mesma linha devolve um JSON enorme, deixa a resposta lenta e pode até pressionar a memória do processo à
        toa — o cliente quase nunca precisa da tabela inteira de uma vez. Toda listagem pensada pra produção precisa
        de paginação desde o início, não como otimização de depois.
      </p>

      <h2>Pagy — paginação sem acoplar a view nenhuma</h2>
      <p>
        <code>Pagy</code> é a gem de paginação usada no padrão: calcula offset e limite a partir da página pedida e
        devolve metadados (página atual, total de páginas, total de registros), sem assumir nada sobre HTML — o que
        importa numa API que só devolve JSON.
      </p>
      <CodeExample
        label="app/controllers/produtos_controller.rb"
        language="ruby"
        code={`class ProdutosController < ApplicationController
  include Pagy::Backend

  def index
    pagy, produtos = pagy(Produto.all)
    render json: {
      data: ProdutoSerializer.new(produtos).serializable_hash[:data],
      meta: { pagina: pagy.page, total_paginas: pagy.pages, total_registros: pagy.count }
    }
  end
end`}
      />
      <CodeExample
        label="GET /produtos?page=2 — Resultado"
        language="json"
        result={`{
  "data": [ /* só os produtos da página 2 */ ],
  "meta": { "pagina": 2, "total_paginas": 48, "total_registros": 954 }
}`}
        code={`pagy(Produto.all)`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/paginacao">
        A configuração de paginação do padrão — tamanho de página default, limite máximo aceito por query param —
        está documentada no Padrão API.
      </Callout>
      <Callout href="/padrao-api/tecnologias/pagy">
        Por que o Pagy foi escolhido em vez de outras gems de paginação do ecossistema Rails está documentado nas
        Tecnologias do Padrão API.
      </Callout>

      <h2>Filtro por query param — sem confiar cegamente no que chega</h2>
      <CodeExample
        label="filtro combinado com paginação"
        language="ruby"
        code={`def index
  produtos = Produto.all
  produtos = produtos.where(categoria_id: params[:categoria_id]) if params[:categoria_id].present?
  pagy, produtos_paginados = pagy(produtos)
  render json: {
    data: ProdutoSerializer.new(produtos_paginados).serializable_hash[:data],
    meta: { pagina: pagy.page, total_paginas: pagy.pages }
  }
end`}
      />
      <p>
        <code>where(categoria_id: params[:categoria_id])</code> é seguro porque ActiveRecord monta a query com
        parâmetro escapado — o valor de <code>params[:categoria_id]</code> nunca vira parte literal do SQL, não
        importa o que venha nele.
      </p>

      <h2>O erro que abre brecha de SQL injection</h2>
      <CodeExample
        label="NUNCA faça isso"
        language="ruby"
        code={`Produto.where("nome LIKE '%#{params[:busca]}%'")   # interpola direto na string SQL`}
      />
      <p>
        Se <code>params[:busca]</code> chegar como <code>{"' OR '1'='1"}</code>, o texto interpolado muda o{" "}
        <strong>significado</strong> da query inteira, não só o valor buscado — isso é injeção de SQL. A correção é
        usar placeholder, deixando o ActiveRecord escapar o valor:
      </p>
      <CodeExample
        label="correto — placeholder escapa o valor"
        language="ruby"
        code={`Produto.where("nome LIKE ?", "%#{params[:busca]}%")`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/filtros-e-busca">
        Os padrões de filtro seguro por query param — incluindo busca por texto e intervalo de data — estão
        documentados no Padrão API.
      </Callout>

      <Exercise
        prompt={
          <p>
            Adicione ao <code>index</code> de <code>PedidosController</code> um filtro opcional por{" "}
            <code>status</code> (via <code>?status=finalizado</code>), combinado com a paginação já existente, sem
            interpolar nada direto numa string SQL.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`def index
  pedidos = current_usuario.pedidos
  pedidos = pedidos.where(status: params[:status]) if params[:status].present?
  pagy, pedidos_paginados = pagy(pedidos)
  render json: {
    data: PedidoSerializer.new(pedidos_paginados).serializable_hash[:data],
    meta: { pagina: pagy.page, total_paginas: pagy.pages }
  }
end`}
      />

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que uma listagem de API em produção não deveria simplesmente devolver Model.all sem paginação?",
            options: [
              "Porque o Rails limita para no máximo 50 registros por padrão, então all já vem cortado sozinho",
              "Porque com uma tabela grande a resposta fica enorme, mais lenta e mais pesada em memória — o cliente raramente precisa de tudo de uma vez",
              "Porque all não funciona em ambiente de produção, só em desenvolvimento",
              "Porque JSON não suporta arrays com mais de mil elementos",
            ],
            correctIndex: 1,
          },
          {
            question:
              "Qual o problema de escrever Produto.where(\"nome LIKE '%#{params[:busca]}%'\") com interpolação direta de string?",
            options: [
              "É apenas uma questão de estilo de código, sem nenhum risco real",
              "Fica mais lento do que usar o placeholder ?, mas o comportamento é idêntico",
              "Só funciona com bancos PostgreSQL, quebra em outros bancos suportados pelo Rails",
              "Um valor malicioso no parâmetro pode alterar o significado da query (SQL injection), já que o texto é inserido sem ser escapado",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
