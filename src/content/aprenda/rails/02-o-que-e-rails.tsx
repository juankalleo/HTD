import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-o-que-e-rails",
  title: "O que é Rails: gems, Gemfile e convenção sobre configuração",
  summary: "Como um projeto Rails nasce (gem install, rails new, Gemfile) — e por que Rails decide tanta coisa por você.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao02OQueERails() {
  return (
    <LessonBody>
      <p>
        Rails é um framework web em Ruby construído em torno de um princípio: <strong>convenção sobre
        configuração</strong>. Em vez de você decidir e configurar onde cada arquivo mora, como uma tabela se chama,
        qual método um controller deveria ter pra criar um recurso — Rails já decidiu, e segue essa decisão em todo
        projeto Rails do mundo. Isso tem um preço (menos flexibilidade) e um ganho enorme (qualquer pessoa que já viu
        um projeto Rails sabe onde procurar coisa em outro projeto Rails, sem ler configuração nenhuma).
      </p>

      <h2>Antes de tudo: o que é uma "gem" e como um projeto Rails nasce</h2>
      <p>
        Ruby chama uma biblioteca instalável de <strong>gem</strong> — o mesmo conceito de um pacote npm no mundo
        JavaScript. O próprio Rails é distribuído como gem: instalar Rails na máquina é, literalmente, instalar mais
        uma biblioteca Ruby.
      </p>
      <CodeExample
        label="terminal — instalando Rails e criando um projeto"
        language="bash"
        result={`Successfully installed rails-7.1.3
      create  config/application.rb
      create  Gemfile
      create  app/models
      create  app/controllers
      create  db/
      ...`}
        code={`gem install rails
rails new minha_api --api`}
      />
      <p>
        <code>rails new minha_api --api</code> não cria uma pasta vazia — ele gera a estrutura inteira de pastas da
        seção seguinte, já com um <strong>Gemfile</strong> populado. <code>--api</code> pede a variante enxuta pra
        API (sem as partes de gerar HTML no servidor, que uma API não usa).
      </p>

      <h2>Gemfile e bundler: como as dependências do projeto são geridas</h2>
      <p>
        Todo projeto Rails tem um arquivo <code>Gemfile</code> na raiz — é a lista de todas as gems (bibliotecas) que
        o projeto depende, mais ou menos como um <code>package.json</code> lista as dependências de um projeto
        Node/Next.js.
      </p>
      <CodeExample
        label="Gemfile (trecho)"
        language="ruby"
        code={`gem "rails", "~> 7.1.3"
gem "pg", "~> 1.5"          # driver do Postgres
gem "puma"                  # servidor de aplicação

group :development, :test do
  gem "rspec-rails"          # só instalado em dev/test, nunca em produção
end`}
      />
      <p>
        Depois de editar o <code>Gemfile</code> — seja criando o projeto do zero, seja adicionando uma gem nova mais
        pra frente (nas próximas lições você vai adicionar <code>devise</code> e <code>cancancan</code> assim) —
        você roda <code>bundle install</code>. O <strong>Bundler</strong> lê o <code>Gemfile</code>, resolve qual
        versão exata de cada gem (e de cada dependência delas) instalar sem conflitar entre si, baixa tudo, e escreve
        o resultado em <code>Gemfile.lock</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Fetching gem metadata from https://rubygems.org/...
Installing pg 1.5.4
Installing puma 6.4.0
Bundle complete! 15 Gemfile dependencies, 62 gems now installed.`}
        code={`bundle install`}
      />
      <p>
        O <code>Gemfile.lock</code> é o que faz o projeto instalar exatamente as <strong>mesmas versões</strong> na
        sua máquina, na do seu colega e no servidor de produção — sem ele, cada instalação poderia puxar uma versão
        diferente de cada gem e um bug "só acontecer" num lugar. Por isso ele é versionado no git, e o
        <code>Gemfile</code> sozinho nunca é o suficiente pra reproduzir o ambiente.
      </p>

      <h2>A convenção que mais aparece: nome no plural/singular</h2>
      <CodeExample
        label="convenção de nomenclatura"
        language="plaintext"
        code={`Model:      Produto        (classe, singular, PascalCase)
Tabela:     produtos       (banco, plural, snake_case)
Controller: ProdutosController (plural)
Rota:       /produtos      (plural)`}
      />
      <p>
        Você não escreve essa relação em lugar nenhum — Rails deduz a tabela a partir do nome do model
        automaticamente. Isso só quebra se você tentar nomear algo fora do padrão, e nesse caso você teria que
        configurar manualmente o que, no caminho convencional, é automático.
      </p>

      <h2>A estrutura de pastas também é convenção</h2>
      <CodeExample
        label="estrutura de um projeto Rails"
        language="plaintext"
        code={`app/
  models/          → regra de negócio + acesso a dado (ActiveRecord)
  controllers/      → recebe requisição HTTP, decide o que fazer
  serializers/       → formata o model em JSON pra resposta da API
  services/          → lógica que não cabe num model nem controller sozinho
config/
  routes.rb          → mapeia URL + verbo HTTP → controller#action
db/
  migrate/           → histórico versionado de mudanças no schema do banco`}
      />
      <p>
        Compare com o Next.js: lá, pasta define rota; aqui, pasta define <strong>papel</strong> (model, controller,
        service...) e um arquivo separado (<code>routes.rb</code>) mapeia URL pra controller. São filosofias
        diferentes de organização, e as próximas lições mostram cada uma dessas pastas na prática.
      </p>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que significa 'convenção sobre configuração'?",
            options: [
              "Framework que exige configurar manualmente cada nome de tabela e caminho de arquivo antes de usar",
              "Rails já assume padrões prontos (nome de tabela, estrutura de pasta) para você não precisar configurar isso manualmente",
              "Princípio que prioriza arquivos de configuração YAML no lugar de código Ruby sempre que possível",
              "Regra que impede qualquer configuração customizada depois que o projeto é criado",
            ],
            correctIndex: 1,
          },
          {
            question: "Dado um model Pedido, qual o nome convencional da tabela no banco?",
            options: ["pedido (singular, snake_case)", "Pedido (singular, PascalCase, igual à classe)", "pedidos_tabela (plural com sufixo redundante)", "pedidos (plural, snake_case)"],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
