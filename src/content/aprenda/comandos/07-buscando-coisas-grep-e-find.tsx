import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-buscando-coisas-grep-e-find",
  title: "Buscando coisas: grep e find",
  summary: "Duas perguntas diferentes — 'onde está esse texto' e 'onde está esse arquivo' — duas ferramentas diferentes.",
  estimatedMinutes: 15,
  level: "fundamentos",
};

export default function Licao07BuscandoCoisasGrepEFind() {
  return (
    <LessonBody>
      <p>
        Quando o projeto cresce, procurar coisas manualmente abrindo pasta por pasta deixa de ser viável. O
        terminal resolve isso com duas ferramentas que respondem perguntas diferentes:{" "}
        <code>grep</code> busca <strong>dentro do conteúdo</strong> dos arquivos (que texto tem ali), e{" "}
        <code>find</code> busca <strong>pelos próprios arquivos</strong> (nome, tipo, localização) — sem olhar o
        que tem escrito dentro.
      </p>

      <h2>grep — buscando texto dentro de arquivos</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`grep "TODO" tarefas.txt`}
        result={`# TODO: revisar essa função
# TODO: adicionar teste`}
      />
      <p>
        <code>grep</code> imprime só as <strong>linhas</strong> do arquivo que contêm o texto buscado — não o
        arquivo inteiro, só o que bateu com a busca. Três flags resolvem praticamente todo uso do dia a dia:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`grep -r "TODO" src/`}
        result={`src/utils/parser.js:12: // TODO: tratar erro de parsing
src/components/Form.jsx:45: // TODO: validar campo vazio`}
      />
      <p>
        <code>-r</code> (<em>recursive</em>) faz o <code>grep</code> entrar em todas as subpastas de{" "}
        <code>src/</code> em vez de olhar só o nível atual — essencial quando você não lembra em qual arquivo
        exato deixou aquele comentário.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`grep -i "todo" tarefas.txt`}
        result={`# TODO: revisar essa função
# Todo item da lista precisa de dono definido`}
      />
      <p>
        <code>-i</code> (<em>case-insensitive</em>) ignora maiúscula/minúscula — sem ela, <code>grep "todo"</code>{" "}
        não encontraria uma linha escrita como <code>TODO</code> ou <code>Todo</code>, porque por padrão o{" "}
        <code>grep</code> diferencia maiúsculas de minúsculas.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`grep -n "TODO" tarefas.txt`}
        result={`3:# TODO: revisar essa função
9:# TODO: adicionar teste`}
      />
      <p>
        <code>-n</code> mostra o <strong>número da linha</strong> onde o texto foi encontrado — útil quando você
        vai abrir o arquivo num editor logo em seguida e quer ir direto na linha certa, sem precisar procurar de
        novo visualmente.
      </p>

      <h2>find — buscando os próprios arquivos</h2>
      <p>
        <code>find</code> não olha conteúdo — ele varre a árvore de pastas procurando arquivos ou pastas que batem
        com algum critério: nome, tipo, tamanho, data, entre outros. A forma básica é{" "}
        <code>find pasta-onde-procurar critério</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`find . -name "*.test.js"`}
        result={`./src/utils/parser.test.js
./src/components/Form.test.js`}
      />
      <p>
        <code>-name</code> busca pelo nome do arquivo (aceitando <code>*</code> como coringa) a partir da pasta
        indicada — aqui, <code>.</code> significa "a partir da pasta atual, entrando em todas as subpastas".
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`find . -type d -name "node_modules"`}
        result={`./node_modules
./packages/api/node_modules`}
      />
      <p>
        <code>-type</code> filtra pelo tipo do item: <code>f</code> pra arquivo (<em>file</em>), <code>d</code> pra
        pasta (<em>directory</em>). O exemplo acima acha todas as pastas chamadas exatamente{" "}
        <code>node_modules</code>, ignorando qualquer arquivo comum que por acaso tenha esse nome.
      </p>

      <h2>Combinando os dois</h2>
      <p>
        Como grep e find respondem perguntas diferentes, é comum combiná-los com pipe: usar <code>find</code> pra
        limitar quais arquivos olhar, e <code>grep</code> pra olhar o conteúdo deles.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`find . -name "*.js" -type f | xargs grep -l "console.log"`}
        result={`./src/utils/parser.js
./src/debug.js`}
      />
      <p>
        (O <code>xargs</code> aqui só repassa cada nome de arquivo encontrado como argumento pro <code>grep</code>{" "}
        — um detalhe que vai fazer mais sentido conforme você pratica, não precisa decorar agora.)
      </p>

      <Exercise
        prompt={
          <p>
            Você lembra que escreveu a palavra <code>"FIXME"</code> em algum arquivo <code>.py</code> dentro da
            pasta <code>backend/</code>, mas não lembra em qual arquivo nem em qual linha. Escreva um comando{" "}
            <code>grep</code> que ache isso mostrando o arquivo e o número da linha.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`grep -rn "FIXME" backend/

# -r entra em todas as subpastas de backend/, -n mostra o número da
# linha de cada ocorrência encontrada. Poderia adicionar --include="*.py"
# pra restringir só a arquivos Python, mas -rn já resolve o pedido.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença fundamental entre o que 'grep' e 'find' procuram?",
            options: [
              "'grep' busca texto dentro do conteúdo dos arquivos; 'find' busca os próprios arquivos por nome, tipo ou local",
              "Os dois fazem a mesma busca, só muda a velocidade de execução entre eles",
              "'find' só funciona em arquivos de texto puro, e 'grep' funciona em qualquer tipo de arquivo",
              "'grep' busca arquivos por nome; 'find' busca texto dentro do conteúdo dos arquivos",
            ],
            correctIndex: 0,
          },
          {
            question: "Rodando 'grep \"erro\"' num arquivo que só tem a palavra 'Erro' (com E maiúsculo), o que acontece?",
            options: [
              "O grep encontra normalmente, porque por padrão ele ignora maiúsculas e minúsculas",
              "Nada é encontrado, porque por padrão o grep diferencia maiúsculas de minúsculas — seria preciso usar -i",
              "O grep retorna um erro de sintaxe, porque a busca precisa ter a mesma capitalização do nome do arquivo",
              "O grep encontra, mas mostra a palavra em minúsculo na saída, convertendo automaticamente",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
