import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-escopo-hoisting-e-closures",
  title: "Escopo, hoisting e closures",
  summary: "var 'vaza' pro escopo da função inteira, hoisting não é mágica e uma função pode continuar lembrando de uma variável muito depois de ter terminado de rodar.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao09EscopoHoistingEClosures() {
  return (
    <LessonBody>
      <p>
        Você já usa <code>let</code> e <code>const</code> desde a primeira lição. Agora vale entender{" "}
        <strong>por que</strong> <code>var</code> foi abandonado — e o mecanismo por trás de um dos comportamentos
        mais úteis (e mais mal compreendidos) de JavaScript: a closure.
      </p>

      <h2>Escopo de função vs. escopo de bloco</h2>
      <p>
        <code>var</code> tem escopo de <strong>função</strong> — ela ignora blocos como <code>if</code> e{" "}
        <code>for</code>. <code>let</code> e <code>const</code> têm escopo de <strong>bloco</strong> — existem só
        dentro do <code>{"{ }"}</code> onde foram declaradas.
      </p>
      <CodeExample
        language="javascript"
        code={`function exemploVar() {
  if (true) {
    var mensagem = "declarada dentro do if";
  }
  console.log(mensagem); // "declarada dentro do if" — var vazou pro escopo da função inteira
}

function exemploLet() {
  if (true) {
    let mensagem = "declarada dentro do if";
  }
  console.log(mensagem); // ReferenceError: mensagem is not defined — não existe fora do bloco
}`}
      />
      <p>
        Esse "vazamento" do <code>var</code> é a fonte clássica de bug em loop: uma variável que você achava que
        estava isolada dentro de cada iteração, na verdade é uma única variável compartilhada por todo mundo.
      </p>

      <h2>Hoisting — o que é realmente içado</h2>
      <p>
        Antes de rodar qualquer linha, o motor de JavaScript varre o escopo e "sobe" as <strong>declarações</strong>{" "}
        pro topo. Isso é o hoisting. A parte que costuma confundir: ele içar a declaração não significa içar o valor.
      </p>
      <CodeExample
        language="javascript"
        code={`console.log(nome); // undefined — a declaração "var nome" foi içada, mas a atribuição não
var nome = "Ana";

console.log(idade); // ReferenceError: Cannot access 'idade' before initialization
let idade = 28;`}
      />
      <p>
        Com <code>var</code>, a variável já existe (com valor <code>undefined</code>) antes da linha onde você a
        declarou. Com <code>let</code>/<code>const</code>, a variável também é içada, mas fica presa numa{" "}
        <strong>zona temporal morta</strong> até a linha da declaração rodar de verdade — por isso o erro, em vez de
        simplesmente devolver <code>undefined</code>.
      </p>
      <CodeExample
        language="javascript"
        code={`jaFuncionava(); // "isso roda mesmo chamada antes de aparecer no arquivo"

function jaFuncionava() {
  return "isso roda mesmo chamada antes de aparecer no arquivo";
}

expressaoFuncao(); // TypeError: expressaoFuncao is not a function

const expressaoFuncao = function () {
  return "só existe a partir desta linha";
};`}
      />
      <p>
        Declaração de função (<code>function nome() {}</code>) é içada <strong>inteira</strong>, corpo incluído —
        por isso funciona chamar antes. Uma função guardada numa variável só ganha valor quando aquela linha roda,
        então chamar antes dá erro, do mesmo jeito que aconteceria com qualquer outra variável.
      </p>

      <h2>Closure — uma função que lembra de onde nasceu</h2>
      <p>
        Uma <strong>closure</strong> acontece quando uma função guarda acesso às variáveis do escopo onde foi criada,
        mesmo depois desse escopo já ter terminado de executar. Não é uma cópia do valor — é uma referência viva.
      </p>
      <CodeExample
        language="javascript"
        code={`function criarContador() {
  let contagem = 0; // essa variável fica "presa" na closure

  return function incrementar() {
    contagem++;
    return contagem;
  };
}

const contador1 = criarContador();
contador1(); // 1
contador1(); // 2

const contador2 = criarContador();
contador2(); // 1 — tem a própria "contagem", independente de contador1`}
      />
      <p>
        <code>criarContador()</code> já terminou de rodar há muito tempo quando você chama{" "}
        <code>contador1()</code> pela segunda vez — mas <code>incrementar</code> continua enxergando{" "}
        <code>contagem</code>, porque carrega consigo o escopo onde nasceu. Cada chamada de{" "}
        <code>criarContador()</code> cria uma closure nova, com sua própria cópia de <code>contagem</code>.
      </p>

      <h2>Por que isso é a base de debounce e memoization</h2>
      <p>
        Qualquer padrão que precisa "lembrar" de algo entre chamadas — sem usar uma variável global — depende de
        closure.
      </p>
      <CodeExample
        language="javascript"
        code={`function debounce(fn, atraso) {
  let temporizador; // fica preso na closure, compartilhado entre todas as chamadas

  return function (...args) {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => fn(...args), atraso);
  };
}

const salvarComDebounce = debounce(salvarNoServidor, 500);
// cada chamada de salvarComDebounce cancela a anterior — só a última, depois de 500ms parado, executa de verdade`}
      />
      <p>
        Sem closure, <code>temporizador</code> teria que ser uma variável global (compartilhada por todo o
        programa, arriscando conflito com outro código) ou a função esqueceria dele a cada chamada.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva uma função <code>criarContadorRegressivo(inicio)</code> que devolve uma função. Cada chamada
            dessa função decrementa 1 e retorna o valor atual, começando de <code>inicio</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`function criarContadorRegressivo(inicio) {
  let atual = inicio;

  return function () {
    atual--;
    return atual;
  };
}

const contagemRegressiva = criarContadorRegressivo(3);
contagemRegressiva(); // 2
contagemRegressiva(); // 1
contagemRegressiva(); // 0`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença de escopo entre var e let dentro de um bloco if?",
            options: [
              "var tem escopo de função e 'vaza' pra fora do bloco if; let tem escopo de bloco e só existe dentro dele",
              "let tem escopo de função e vaza pra fora do bloco; var fica preso dentro do bloco if",
              "Os dois têm exatamente o mesmo escopo, a diferença é só que var aceita reatribuição",
              "var só funciona dentro de funções assíncronas, nunca dentro de um if comum",
            ],
            correctIndex: 0,
          },
          {
            question: "O que realmente acontece no hoisting de let idade = 28?",
            options: [
              "O valor 28 é içado pro topo do escopo junto com a declaração, ficando disponível na hora",
              "Nada é içado — let não sofre hoisting de forma alguma, diferente de var",
              "A declaração de idade é içada pro topo do escopo, mas fica numa zona temporal morta até a linha rodar — por isso acessar antes gera erro",
              "O hoisting só se aplica a funções declaradas com function, nunca a variáveis",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
