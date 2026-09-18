import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-tratamento-de-erros-assincrono",
  title: "Tratando erro em código assíncrono",
  summary: "Promise.all derruba tudo se UMA requisição falhar — às vezes é exatamente isso que você não quer.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao15TratamentoDeErrosAssincrono() {
  return (
    <LessonBody>
      <p>
        Você já sabe usar <code>try/catch</code> com <code>async/await</code>. Só que existe um detalhe sobre{" "}
        <code>fetch</code> que costuma pegar quem está começando de surpresa, e uma escolha entre dois métodos de
        Promise que muda completamente o comportamento quando algo falha no meio de várias buscas.
      </p>

      <h2>fetch não rejeita em erro HTTP — só em falha de rede</h2>
      <CodeExample
        language="javascript"
        code={`async function buscarDados() {
  try {
    const resposta = await fetch("/api/dados");

    if (!resposta.ok) {
      throw new Error(\`Erro HTTP: \${resposta.status}\`);
    }

    return await resposta.json();
  } catch (erro) {
    console.error("Falha ao buscar dados:", erro);
    throw erro; // repassa pro chamador decidir o que fazer
  }
}`}
      />
      <p>
        Uma resposta <code>404</code> ou <code>500</code> ainda é, do ponto de vista do <code>fetch</code>, uma
        requisição que "deu certo" — o servidor respondeu alguma coisa. <code>fetch</code> só rejeita a Promise em
        problema de rede de verdade (sem conexão, DNS que não resolve). Por isso o <code>if (!resposta.ok)</code>{" "}
        manual é necessário — sem ele, um erro 500 passaria batido pelo <code>catch</code>.
      </p>

      <h2>Promise.all — uma rejeição derruba todas</h2>
      <CodeExample
        language="javascript"
        code={`try {
  const [usuario, pedidos, endereco] = await Promise.all([
    buscarUsuario(1),
    buscarPedidos(1),
    buscarEndereco(1),
  ]);
} catch (erro) {
  // se QUALQUER uma das três falhar, cai aqui — mesmo que as outras duas tenham funcionado
  console.error("Alguma busca falhou:", erro);
}`}
      />
      <p>
        Isso é o comportamento certo quando as três informações só fazem sentido <strong>juntas</strong> — de nada
        adianta ter o usuário sem os pedidos dele, por exemplo.
      </p>

      <h2>Promise.allSettled — cada resultado isolado</h2>
      <CodeExample
        language="javascript"
        code={`const resultados = await Promise.allSettled([
  buscarUsuario(1),
  buscarPedidos(1),
  buscarEndereco(1),
]);

resultados.forEach((r) => {
  if (r.status === "fulfilled") {
    console.log("Deu certo:", r.value);
  } else {
    console.error("Essa falhou:", r.reason);
  }
});
// nenhuma falha impede as outras de aparecer no resultado`}
      />
      <p>
        Use <code>Promise.allSettled</code> quando cada busca é independente e você quer mostrar o que deu certo,
        mesmo que uma delas tenha falhado — por exemplo, um painel com vários cartões, cada um vindo de uma API
        diferente.
      </p>

      <h2>AbortController — cancelando um fetch em andamento</h2>
      <CodeExample
        language="javascript"
        code={`const controlador = new AbortController();

fetch("/api/dados-grandes", { signal: controlador.signal })
  .then((res) => res.json())
  .catch((erro) => {
    if (erro.name === "AbortError") {
      console.log("Requisição cancelada");
    }
  });

// em algum outro momento (ex.: usuário saiu da tela, ou disparou uma busca nova)
controlador.abort();`}
      />
      <p>
        Sem cancelar, uma requisição antiga que demora mais que uma nova pode chegar depois dela e sobrescrever um
        dado mais atualizado com um mais velho — <code>AbortController</code> evita esse tipo de condição de
        corrida.
      </p>

      <Exercise
        prompt={
          <p>
            Você tem <code>{"await Promise.all([buscarPerfil(), buscarPreferencias()])"}</code>, mas quer que, se{" "}
            <code>buscarPreferencias()</code> falhar, a tela ainda mostre o perfil (com preferências padrão).
            Reescreva usando <code>Promise.allSettled</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const [resultadoPerfil, resultadoPreferencias] = await Promise.allSettled([
  buscarPerfil(),
  buscarPreferencias(),
]);

const perfil = resultadoPerfil.status === "fulfilled" ? resultadoPerfil.value : null;
const preferencias =
  resultadoPreferencias.status === "fulfilled" ? resultadoPreferencias.value : { tema: "claro" };`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre Promise.all e Promise.allSettled?",
            options: [
              "Promise.allSettled só aceita uma Promise por vez; Promise.all aceita várias",
              "Não existe diferença de comportamento, só o nome do método muda",
              "Promise.all rejeita tudo se qualquer uma das promises falhar; Promise.allSettled devolve o resultado de cada uma isoladamente, mesmo com falhas",
              "Promise.all funciona só no navegador; Promise.allSettled só no Node.js",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que fetch não rejeita a Promise quando a API responde com status 404?",
            options: [
              "Porque fetch só rejeita em falha de rede (sem conexão, DNS, etc.) — uma resposta HTTP, mesmo de erro, ainda é considerada 'sucesso' do ponto de vista da requisição",
              "Porque 404 é convertido automaticamente em 200 pelo navegador antes de chegar no código",
              "Porque fetch não suporta verificar o status da resposta de jeito nenhum",
              "Porque erros HTTP só existem em requisições feitas com XMLHttpRequest, não com fetch",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
