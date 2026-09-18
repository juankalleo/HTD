import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-consumindo-api",
  title: "Projeto guiado: consumindo uma API com cache simples",
  summary: "Junta closure, event loop e tratamento de erro pra construir um mini cliente de API que não refaz a mesma requisição duas vezes.",
  estimatedMinutes: 24,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoConsumindoApi() {
  return (
    <LessonBody>
      <p>
        Esse projeto junta três coisas que você viu em lições separadas: closure (pra guardar estado sem variável
        global), tratamento de erro assíncrono de verdade, e <code>AbortController</code> pra cancelar uma
        requisição que ficou obsoleta. O resultado é um cliente de API pequeno, mas com os mesmos cuidados que um
        de produção teria.
      </p>

      <h2>1. O problema — buscar o mesmo dado de novo, sem necessidade</h2>
      <p>
        Se duas partes da tela pedem o mesmo recurso, ou o usuário volta pra uma tela que já visitou, refazer a
        mesma requisição de rede é desperdício. A solução mais simples: guardar o resultado num cache em memória.
      </p>

      <h2>2. Cache em memória com Map, escondido numa closure</h2>
      <CodeExample
        language="javascript"
        code={`function criarClienteApi() {
  const cache = new Map(); // fica preso na closure — ninguém fora daqui acessa isso diretamente

  return {
    // implementado nos próximos passos
  };
}`}
      />
      <p>
        <code>cache</code> não é uma variável global — ela só existe dentro do escopo de{" "}
        <code>criarClienteApi</code>. As funções que essa fábrica devolver vão "lembrar" desse <code>cache</code>{" "}
        pra sempre, exatamente como o contador da lição de closures.
      </p>

      <h2>3. fetch com tratamento de erro real</h2>
      <CodeExample
        language="javascript"
        code={`async function buscarNaRede(url) {
  const resposta = await fetch(url);

  if (!resposta.ok) {
    throw new Error(\`Erro HTTP: \${resposta.status}\`);
  }

  return resposta.json();
}`}
      />

      <h2>4. Cancelamento — uma busca nova invalida a anterior</h2>
      <CodeExample
        language="javascript"
        code={`function criarClienteApi() {
  const cache = new Map();
  let controladorAtual = null;

  async function buscar(url) {
    if (cache.has(url)) {
      console.log("Veio do cache:", url);
      return cache.get(url);
    }

    if (controladorAtual) {
      controladorAtual.abort(); // cancela uma busca anterior que ainda estava pendente
    }
    controladorAtual = new AbortController();

    try {
      const resposta = await fetch(url, { signal: controladorAtual.signal });

      if (!resposta.ok) {
        throw new Error(\`Erro HTTP: \${resposta.status}\`);
      }

      const dado = await resposta.json();
      cache.set(url, dado);
      return dado;
    } catch (erro) {
      if (erro.name === "AbortError") {
        console.log("Busca cancelada:", url);
        return null;
      }
      console.error("Falha ao buscar", url, erro);
      throw erro;
    }
  }

  return { buscar };
}`}
      />
      <p>
        <code>controladorAtual</code> também é uma variável presa na closure — cada chamada de <code>buscar</code>{" "}
        pode ver e cancelar o <code>AbortController</code> da chamada anterior, porque as duas compartilham o mesmo
        escopo de <code>criarClienteApi</code>.
      </p>

      <h2>5. Usando o cliente</h2>
      <CodeExample
        language="javascript"
        code={`const cliente = criarClienteApi();

await cliente.buscar("/api/usuarios/1"); // vai pra rede de verdade
await cliente.buscar("/api/usuarios/1"); // vem do cache — nenhuma requisição nova é feita

// duas telas diferentes usando o MESMO cliente compartilham o cache
const perfil = await cliente.buscar("/api/usuarios/1");`}
      />
      <p>
        Repare que nada disso depende de uma variável global espalhada pelo código: todo o estado (cache,
        requisição em andamento) vive escondido dentro do <code>cliente</code> que <code>criarClienteApi()</code>{" "}
        devolveu.
      </p>

      <Exercise
        prompt={
          <p>
            Adicione um método <code>invalidar(url)</code> ao objeto devolvido por <code>criarClienteApi()</code>,
            que remove uma única entrada do cache (útil depois de um <code>POST</code> que muda aquele dado no
            servidor).
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`function criarClienteApi() {
  const cache = new Map();
  let controladorAtual = null;

  async function buscar(url) {
    // ...implementação igual à anterior
  }

  function invalidar(url) {
    cache.delete(url);
  }

  return { buscar, invalidar };
}

const cliente = criarClienteApi();
await cliente.buscar("/api/usuarios/1");
cliente.invalidar("/api/usuarios/1");
await cliente.buscar("/api/usuarios/1"); // vai pra rede de novo, porque o cache foi limpo pra essa url`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que o cache e o controladorAtual funcionam mesmo sem serem variáveis globais?",
            options: [
              "Porque toda variável declarada com let se torna global automaticamente depois da primeira chamada",
              "Porque o navegador promove automaticamente variáveis usadas dentro de fetch para o escopo global",
              "Porque Map e AbortController são sempre globais, não importa onde sejam criados",
              "Porque buscar é uma closure — ela guarda uma referência viva ao escopo de criarClienteApi, então continua acessando cache e controladorAtual mesmo depois da função externa já ter terminado de rodar",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que chamar controladorAtual.abort() antes de uma nova busca é importante aqui?",
            options: [
              "Porque, sem isso, o JavaScript recusa fazer duas requisições fetch na mesma página",
              "Porque cancela uma requisição anterior que ainda estava pendente, evitando que uma resposta antiga e mais lenta chegue e sobrescreva um dado mais novo",
              "Porque abort() é obrigatório em toda chamada de fetch, mesmo sem requisição anterior pendente",
              "Porque isso limpa o cache inteiro antes de guardar o novo resultado",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
