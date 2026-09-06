import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-ruby-essencial",
  title: "Ruby essencial",
  summary: "Só o suficiente de sintaxe Ruby pra ler Rails com confiança — não é um curso de Ruby inteiro.",
  estimatedMinutes: 18,
};

export default function Licao01RubyEssencial() {
  return (
    <LessonBody>
      <p>
        Esta lição não ensina Ruby do zero absoluto — ensina o vocabulário mínimo pra você <strong>ler</strong>{" "}
        código Rails sem travar em cada linha. O resto você aprende vendo Rails de verdade, nas próximas lições.
      </p>

      <h2>Tudo é objeto, até número</h2>
      <CodeExample
        language="ruby"
        code={`3.times { puts "oi" }   # números têm métodos
"oi".upcase             # "OI" — string tem método, sem função solta upcase("oi")
5.even?                 # false — "?" no final é convenção pra método que retorna booleano`}
      />

      <h2>Blocos — a coisa mais "Ruby" da linguagem</h2>
      <p>
        Um bloco é uma função anônima passada pra outro método, com duas sintaxes equivalentes:{" "}
        <code>{"{ }"}</code> pra uma linha, <code>do...end</code> pra várias.
      </p>
      <CodeExample
        language="ruby"
        code={`[1, 2, 3].map { |n| n * 2 }   # => [2, 4, 6]

[1, 2, 3].map do |n|
  n * 2
end                            # => [2, 4, 6] — mesmo resultado, sintaxe diferente`}
      />

      <h2>Hash e símbolo</h2>
      <p>
        Um <code>Hash</code> é um objeto chave-valor (como um dicionário). Um símbolo (<code>:nome</code>) é um texto
        imutável usado como identificador — Rails usa símbolo pra chave de hash o tempo todo.
      </p>
      <CodeExample
        language="ruby"
        code={`usuario = { nome: "Ana", ativo: true }
usuario[:nome]        # "Ana"
usuario[:ativo]        # true`}
      />

      <h2>Classe — o parecido com o que você já sabe</h2>
      <CodeExample
        language="ruby"
        result={`"Ana"`}
        code={`class Usuario
  attr_reader :nome        # gera um "getter" automático — sem escrever o método na mão

  def initialize(nome)     # o "construtor"
    @nome = nome            # @ = atributo de instância (equivalente a this.nome)
  end
end

Usuario.new("Ana").nome`}
      />

      <h2>? e ! — convenções, não sintaxe especial</h2>
      <p>
        Um método terminado em <code>?</code> retorna booleano por convenção (<code>ativo?</code>). Um método
        terminado em <code>!</code> é a versão "perigosa" — muda o objeto no lugar em vez de retornar uma cópia
        (<code>sort</code> retorna nova lista; <code>sort!</code> reordena a lista original).
      </p>

      <Exercise
        prompt={
          <p>
            Escreva uma classe <code>Produto</code> com <code>attr_reader :nome, :preco</code> e um método{" "}
            <code>caro?</code> que retorna <code>true</code> se <code>preco</code> for maior que 100.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class Produto
  attr_reader :nome, :preco

  def initialize(nome, preco)
    @nome = nome
    @preco = preco
  end

  def caro?
    preco > 100
  end
end`}
      />

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o @ antes de um nome de variável significa em Ruby?",
            options: [
              "Variável global",
              "Atributo de instância (equivalente a this.algo em outras linguagens)",
              "Constante",
              "Não significa nada, é decorativo",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual a diferença entre sort e sort! numa lista?",
            options: [
              "Não tem diferença nenhuma",
              "sort retorna uma nova lista ordenada; sort! reordena a lista original no lugar",
              "sort! é só mais rápido",
              "sort só funciona com número, sort! com qualquer tipo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
