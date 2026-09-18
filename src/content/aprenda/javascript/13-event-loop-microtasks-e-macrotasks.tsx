import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-event-loop-microtasks-e-macrotasks",
  title: "Event loop, microtasks e macrotasks",
  summary: "await parece pausar tudo, mas por baixo é a call stack, a fila de callbacks e a fila de microtasks decidindo quem roda primeiro.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao13EventLoopMicrotasksEMacrotasks() {
  return (
    <LessonBody>
      <p>
        Você já sabe usar Promise e <code>async/await</code>. A pergunta que fica em aberto: JavaScript roda numa
        única thread — então como uma Promise "espera" alguma coisa sem travar o programa inteiro? A resposta é o{" "}
        <strong>event loop</strong>.
      </p>

      <h2>Call stack — onde o código síncrono roda</h2>
      <p>
        A <strong>call stack</strong> é onde funções são executadas, uma de cada vez, cada uma empilhada sobre a
        anterior até retornar. Enquanto tem algo na call stack, nada mais roda — é por isso que uma função síncrona
        muito longa trava a página inteira.
      </p>

      <h2>Web APIs — quem cuida do que é lento</h2>
      <p>
        <code>setTimeout</code>, <code>fetch</code> e eventos de clique não são executados pelo motor de
        JavaScript diretamente — são entregues ao navegador (ou ao Node), que cuida da espera por fora da call
        stack. Quando terminam, o resultado não entra direto na call stack: ele vai pra uma fila, esperando sua vez.
      </p>

      <h2>Duas filas: macrotasks e microtasks</h2>
      <p>
        Existem duas filas de espera, e elas não têm a mesma prioridade:
      </p>
      <CodeExample
        language="javascript"
        code={`// vai pra fila de MACROTASKS (callback queue)
setTimeout(() => console.log("do setTimeout"), 0);

// vai pra fila de MICROTASKS
Promise.resolve().then(() => console.log("do then"));`}
      />
      <p>
        O <strong>event loop</strong> é o mecanismo que fica checando: "a call stack está vazia?". Quando está, ele
        primeiro esvazia <strong>toda</strong> a fila de microtasks — uma por uma, incluindo novas microtasks que
        apareçam no meio do processo — e só depois pega <strong>um único</strong> item da fila de macrotasks.
      </p>

      <h2>O exemplo que mostra tudo</h2>
      <CodeExample
        language="javascript"
        code={`console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// ordem real de impressão: 1, 4, 3, 2`}
        result={`1
4
3
2`}
      />
      <p>
        <code>"1"</code> e <code>"4"</code> rodam na hora, de forma síncrona, porque estão direto no código
        principal. Quando a call stack fica vazia, o event loop esvazia a fila de microtasks primeiro —{" "}
        <code>"3"</code> — e só então pega o <code>setTimeout</code> da fila de macrotasks — <code>"2"</code>. Isso
        acontece mesmo com <code>0</code> milissegundos de atraso no <code>setTimeout</code>: a fila de microtasks
        sempre tem prioridade.
      </p>
      <p>
        <code>await</code> funciona sobre essa mesma base: o código depois de um <code>await</code> vira, por baixo,
        um <code>.then()</code> — ou seja, entra na fila de microtasks, não na de macrotasks.
      </p>

      <Exercise
        prompt={
          <p>
            Qual é a ordem de impressão deste código, e por quê?
            <br />
            <code>{'console.log("A"); setTimeout(() => console.log("B"), 0); Promise.resolve().then(() => console.log("C")); Promise.resolve().then(() => console.log("D")); console.log("E");'}</code>
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`// Ordem: A, E, C, D, B
//
// A e E rodam direto, de forma síncrona, antes de qualquer fila ser checada.
// Depois, o event loop esvazia TODA a fila de microtasks antes de tocar
// na fila de macrotasks — por isso C e D (dois .then) rodam antes de B
// (o setTimeout), mesmo os dois .then tendo sido registrados antes do
// setTimeout no código.`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que uma Promise resolvida roda antes de um setTimeout(fn, 0)?",
            options: [
              "Porque o callback da Promise vai pra fila de microtasks, que o event loop sempre esvazia inteira antes de pegar o próximo item da fila de macrotasks (onde o setTimeout entra)",
              "Porque setTimeout(fn, 0) na verdade demora 1 segundo inteiro pra disparar, por limitação do navegador",
              "Porque Promise roda dentro da call stack, sem passar por nenhuma fila",
              "Porque o motor de JavaScript executa Promises com prioridade mais alta de CPU do que qualquer outro código",
            ],
            correctIndex: 0,
          },
          {
            question: "O que é a call stack no contexto do event loop?",
            options: [
              "A fila onde callbacks de setTimeout esperam pra serem executados",
              "Um recurso exclusivo do Node.js, que não existe rodando no navegador",
              "A estrutura onde o código síncrono é executado, uma chamada de função de cada vez — só quando ela esvazia é que o event loop libera a próxima tarefa da fila",
              "O local onde as Promises pendentes ficam guardadas até serem resolvidas",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
