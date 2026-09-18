import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-this-call-apply-bind",
  title: "this, call, apply e bind",
  summary: "this não é fixo — depende de como a função é chamada, e call/apply/bind existem pra você controlar isso na mão.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao10ThisCallApplyBind() {
  return (
    <LessonBody>
      <p>
        Na lição de funções você viu que arrow function não tem <code>this</code> próprio. Mas isso só faz sentido de
        verdade quando você entende o que <strong>determina</strong> o <code>this</code> de uma função normal em
        primeiro lugar — e é isso que costuma gerar o bug mais clássico de JavaScript orientado a objeto.
      </p>

      <h2>this depende de como a função é chamada, não de onde foi escrita</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = {
  nome: "Ana",
  saudar() {
    console.log(\`Olá, \${this.nome}\`);
  },
};

usuario.saudar(); // "Olá, Ana" — this é usuario, porque a chamada foi usuario.saudar()

const saudarSolto = usuario.saudar;
saudarSolto(); // "Olá, undefined" — a função é a mesma, mas a ligação com usuario se perdeu`}
      />
      <p>
        <code>saudarSolto</code> é literalmente a mesma função que <code>usuario.saudar</code>. O que muda é{" "}
        <strong>como</strong> ela é chamada: quando você chama <code>objeto.metodo()</code>, <code>this</code> vira{" "}
        <code>objeto</code>. Quando chama a função "solta", sem nenhum objeto antes do ponto, essa ligação some.
      </p>

      <h2>O bug clássico: perder o this num callback</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = {
  nome: "Ana",
  saudar() {
    console.log(\`Olá, \${this.nome}\`);
  },
};

// parece inofensivo, mas quebra:
setTimeout(usuario.saudar, 100); // "Olá, undefined"
// setTimeout chama a função sozinha, sem o "usuario." na frente —
// é exatamente o mesmo problema de saudarSolto() acima`}
      />
      <p>
        Passar <code>usuario.saudar</code> como argumento entrega só a <em>função</em>, sem o objeto que a
        acompanhava. Quando <code>setTimeout</code> chama essa função depois, não existe mais nenhum{" "}
        <code>usuario.</code> na frente pra definir o <code>this</code>.
      </p>

      <h2>call e apply — chamar a função definindo o this na mão</h2>
      <CodeExample
        language="javascript"
        code={`function saudar(saudacao) {
  console.log(\`\${saudacao}, \${this.nome}\`);
}

const ana = { nome: "Ana" };
const bia = { nome: "Bia" };

saudar.call(ana, "Olá");    // "Olá, Ana"  — chama agora, this = ana, argumentos um a um
saudar.apply(bia, ["Oi"]);  // "Oi, Bia"   — igual a call, mas argumentos dentro de um array`}
      />
      <p>
        <code>call</code> e <code>apply</code> fazem exatamente a mesma coisa — a única diferença é como você passa
        os argumentos extras (separados em <code>call</code>, dentro de um array em <code>apply</code>). Os dois
        chamam a função <strong>imediatamente</strong>.
      </p>

      <h2>bind — não chama agora, devolve uma função nova com this travado</h2>
      <CodeExample
        language="javascript"
        code={`const saudarAna = saudar.bind(ana);
saudarAna("E aí"); // "E aí, Ana" — this já vem travado em ana, não importa como saudarAna for chamada depois

setTimeout(usuario.saudar.bind(usuario), 100); // "Olá, Ana" — corrige o bug do exemplo anterior`}
      />

      <h2>O outro jeito de corrigir: arrow function dentro do método</h2>
      <p>
        Você já viu esse padrão na lição de funções — vale reforçar por quê ele funciona. Uma arrow function criada{" "}
        <strong>dentro</strong> de um método herda o <code>this</code> desse método, então não perde a ligação com o
        objeto:
      </p>
      <CodeExample
        language="javascript"
        code={`const usuario2 = {
  nome: "Ana",
  saudarComAtraso() {
    setTimeout(() => {
      console.log(\`Olá, \${this.nome}\`); // this aqui é herdado de saudarComAtraso — que é usuario2
    }, 100);
  },
};

usuario2.saudarComAtraso(); // "Olá, Ana"`}
      />

      <Exercise
        prompt={
          <p>
            Dado <code>{'const carrinho = { itens: ["mouse", "teclado"], contarItens() { return this.itens.length; } }'}</code>
            , o código <code>{"setTimeout(carrinho.contarItens, 100)"}</code> quebra (this perdido). Corrija usando{" "}
            <code>bind</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const carrinho = {
  itens: ["mouse", "teclado"],
  contarItens() {
    return this.itens.length;
  },
};

setTimeout(carrinho.contarItens.bind(carrinho), 100);
// bind trava o this em carrinho antes de entregar a função pro setTimeout`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que determina o valor de this dentro de uma função normal?",
            options: [
              "O lugar do arquivo onde a função foi escrita, nunca muda depois disso",
              "Como a função é chamada — objeto.metodo() define this como esse objeto; chamada solta perde essa ligação",
              "O tipo de dado que a função retorna no final da execução",
              "this é sempre igual ao escopo global, não importa como a função seja chamada",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual a diferença entre call/apply e bind?",
            options: [
              "call e apply travam o this pra sempre; bind executa a função imediatamente",
              "Não existe diferença real, os três fazem exatamente a mesma coisa",
              "bind só funciona com arrow function; call e apply só com função normal",
              "call e apply chamam a função na hora, definindo this manualmente; bind devolve uma nova função com this já travado, pra chamar depois",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
