import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-assincrono-promises-async-await",
  title: "Assíncrono: callbacks, promises, async/await",
  summary: "Por que buscar dado de uma API não trava a página — e como o código foi evoluindo pra lidar com isso.",
  estimatedMinutes: 18,
};

export default function Licao07AssincronoPromisesAsyncAwait() {
  return (
    <LessonBody>
      <p>
        JavaScript roda em <strong>uma única thread</strong> — mas buscar dado de uma API leva tempo (rede é lenta
        perto de CPU) e a página não pode simplesmente "travar" esperando. A solução: operações demoradas são{" "}
        <strong>assíncronas</strong> — o código continua rodando, e você é avisado quando o resultado chega.
      </p>

      <h2>1ª geração: callback</h2>
      <CodeExample
        language="javascript"
        code={`setTimeout(() => {
  console.log("Isso roda depois de 1 segundo");
}, 1000);

console.log("Isso roda ANTES do de cima, mesmo vindo depois no código");`}
      />
      <p>
        Callback funciona, mas encadear várias operações assíncronas em sequência (buscar usuário, depois os pedidos
        dele, depois os detalhes de cada pedido) vira um aninhamento profundo de funções dentro de funções — o
        "callback hell" que motivou a próxima geração.
      </p>

      <h2>2ª geração: Promise</h2>
      <CodeExample
        language="javascript"
        code={`function buscarUsuario(id) {
  return fetch(\`/api/usuarios/\${id}\`).then((res) => res.json());
}

buscarUsuario(1)
  .then((usuario) => console.log(usuario))
  .catch((erro) => console.error("Deu erro:", erro));`}
      />
      <p>
        Uma <code>Promise</code> representa "um valor que ainda não existe, mas vai existir (ou vai falhar)".{" "}
        <code>.then()</code> encadeia o que fazer quando der certo; <code>.catch()</code>, quando der errado — mais
        legível que callback aninhado, mas ainda assim uma cadeia de <code>.then()</code>.
      </p>

      <h2>3ª geração: async/await — o padrão hoje</h2>
      <CodeExample
        language="javascript"
        code={`async function buscarUsuario(id) {
  try {
    const res = await fetch(\`/api/usuarios/\${id}\`);
    const usuario = await res.json();
    return usuario;
  } catch (erro) {
    console.error("Deu erro:", erro);
  }
}`}
      />
      <p>
        <code>async/await</code> não é uma tecnologia diferente de Promise — é <strong>a mesma coisa</strong>, com uma
        sintaxe que lê como código síncrono normal. <code>await</code> "pausa" a função (só ela, não a página
        inteira) até a Promise resolver. <code>try/catch</code> substitui o <code>.catch()</code> encadeado. É por
        isso que todo componente async do Next.js usa exatamente essa sintaxe.
      </p>

      <h2>Rodando promises em paralelo</h2>
      <CodeExample
        language="javascript"
        code={`// sequencial — espera uma terminar pra começar a próxima (mais lento)
const usuario = await buscarUsuario(1);
const produtos = await buscarProdutos();

// paralelo — as duas requisições saem ao mesmo tempo (mais rápido)
const [usuario2, produtos2] = await Promise.all([
  buscarUsuario(1),
  buscarProdutos(),
]);`}
      />

      <Exercise
        prompt={
          <p>
            Duas funções <code>buscarPerfil()</code> e <code>buscarNotificacoes()</code> não dependem uma da outra.
            Escreva o código que busca as duas em paralelo, usando async/await.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`async function carregarTela() {
  const [perfil, notificacoes] = await Promise.all([
    buscarPerfil(),
    buscarNotificacoes(),
  ]);
  return { perfil, notificacoes };
}`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "async/await é uma tecnologia diferente de Promise?",
            options: [
              "Sim, são mecanismos completamente separados",
              "Não — é a mesma Promise, só com uma sintaxe que lê como código síncrono",
              "async/await substituiu Promise, que não existe mais",
              "Promise só funciona no navegador, async/await só no servidor",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que usar Promise.all em vez de dois await sequenciais, quando as buscas são independentes?",
            options: [
              "Não tem diferença nenhuma",
              "Promise.all dispara as duas requisições ao mesmo tempo, sendo mais rápido do que esperar uma terminar pra começar a outra",
              "Promise.all é a única forma de tratar erro",
              "await sequencial não funciona com fetch",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
