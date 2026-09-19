import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-navegando-pastas-pwd-ls-cd",
  title: "Navegando no sistema de arquivos: pwd, ls e cd",
  summary: "Três comandos resolvem 90% da navegação: saber onde você está, ver o que tem ali e se mover — sem clicar em nada.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao02NavegandoPastasPwdLsCd() {
  return (
    <LessonBody>
      <p>
        No Finder ou no Explorer, você sempre sabe "onde está" porque enxerga a janela, o caminho de pastas
        abertas, os ícones. No terminal isso não é visual — você precisa perguntar. É exatamente pra isso que
        existem <code>pwd</code>, <code>ls</code> e <code>cd</code>: os três comandos que substituem clicar duas
        vezes numa pasta.
      </p>

      <h2>pwd — onde você está agora</h2>
      <p>
        <code>pwd</code> significa <em>print working directory</em> ("imprimir o diretório de trabalho") e mostra o
        caminho completo da pasta em que o terminal está posicionado no momento.
      </p>
      <CodeExample label="terminal" language="bash" code={`pwd`} result={`/Users/joana/projetos/site`} />
      <p>
        Todo comando que você roda depois disso age <strong>a partir dessa pasta</strong>, a não ser que você diga o
        contrário. É por isso que "onde estou" é sempre a primeira pergunta a fazer quando algo não se comporta
        como esperado.
      </p>

      <h2>ls — o que tem aqui</h2>
      <p>
        <code>ls</code> (<em>list</em>) lista o conteúdo da pasta atual. Sozinho, ele mostra só os nomes:
      </p>
      <CodeExample label="terminal" language="bash" code={`ls`} result={`index.html  package.json  src  styles.css`} />
      <p>
        Na prática, quase ninguém usa <code>ls</code> puro — o combo mais comum é <code>ls -la</code>, que junta
        duas flags:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ls -la`}
        result={`drwxr-xr-x  6 joana  staff   192 12 mar 10:00 .
drwxr-xr-x  9 joana  staff   288 10 mar 09:12 ..
-rw-r--r--  1 joana  staff   412 12 mar 10:00 .env
drwxr-xr-x  4 joana  staff   128 11 mar 22:40 .git
-rw-r--r--  1 joana  staff   180 09 mar 15:03 index.html
-rw-r--r--  1 joana  staff   520 09 mar 15:03 package.json
drwxr-xr-x  5 joana  staff   160 11 mar 22:41 src
-rw-r--r--  1 joana  staff    98 09 mar 15:03 styles.css`}
      />
      <p>
        O <code>-l</code> muda pro formato "longo" — uma linha por item, com permissões, dono, tamanho e data (a
        próxima lição explica cada coluna dessas em detalhe). O <code>-a</code> ("all") mostra também os arquivos{" "}
        <strong>ocultos</strong>, que no Linux/macOS são simplesmente qualquer arquivo cujo nome começa com{" "}
        <code>.</code> — como <code>.env</code> e <code>.git</code> no exemplo acima. Sem <code>-a</code>, esses
        dois nunca apareceriam, e é justamente onde ficam configurações importantes.
      </p>

      <h2>cd — mudando de pasta</h2>
      <p>
        <code>cd</code> (<em>change directory</em>) move o terminal pra outra pasta.
      </p>
      <CodeExample label="terminal" language="bash" code={`cd src`} />
      <p>
        Repare que <code>cd</code> normalmente não imprime nada quando dá certo — silêncio é sucesso, no terminal.
        Se você errar o nome da pasta, aí sim aparece um erro do tipo <code>no such file or directory</code>.
      </p>

      <h2>Caminho absoluto vs. relativo</h2>
      <p>
        Existem duas formas de dizer "onde" uma pasta ou arquivo está. Um{" "}
        <strong>caminho absoluto</strong> começa da raiz do sistema (<code>/</code>) e funciona de qualquer lugar
        que você esteja: <code>/Users/joana/projetos/site/src</code>. Um{" "}
        <strong>caminho relativo</strong> parte de onde você já está agora: se você já estiver dentro de{" "}
        <code>projetos/site</code>, basta <code>cd src</code>.
      </p>
      <CodeExample
        label="três atalhos de caminho relativo"
        language="plaintext"
        code={`.   → a pasta atual (usado com comandos que pedem uma pasta explícita, ex: "cp arquivo .")
..  → a pasta um nível acima (a "pasta mãe")
~   → a pasta pessoal do usuário logado (ex: /Users/joana ou /home/joana)`}
      />
      <CodeExample
        label="terminal"
        language="bash"
        code={`cd ..
pwd
cd ~
pwd`}
        result={`/Users/joana/projetos
/Users/joana`}
      />
      <p>
        <code>cd ..</code> sobe um nível; <code>cd ~</code> te leva direto pra sua pasta pessoal de qualquer lugar
        do sistema, sem precisar digitar o caminho completo. E <code>cd</code> sozinho, sem argumento nenhum, faz a
        mesma coisa que <code>cd ~</code> — vai direto pra casa.
      </p>

      <Exercise
        prompt={
          <p>
            Você está em <code>/Users/joana/projetos/site/src</code> e quer ir direto pra{" "}
            <code>/Users/joana/projetos</code> — duas pastas acima de onde está. Sem digitar o caminho absoluto
            completo, como fazer isso num único comando?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`cd ../..

# Cada ".." sobe um nível. Como "src" está duas pastas abaixo de
# "projetos", dois ".." separados por barra resolvem em um único cd.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que muda entre 'ls' sozinho e 'ls -la'?",
            options: [
              "'ls -la' lista arquivos ocultos e organiza por ordem alfabética, enquanto 'ls' sozinho ordena por data",
              "'-l' mostra formato detalhado (permissão, dono, tamanho, data) e '-a' inclui arquivos ocultos (que começam com ponto)",
              "'-la' é apenas um atalho visual, sem diferença real na lista de arquivos retornada",
              "'ls -la' mostra só pastas, escondendo os arquivos que 'ls' sozinho mostraria",
            ],
            correctIndex: 1,
          },
          {
            question: "Estando em '/Users/joana/projetos/site', o que 'cd ~' faz, diferente de 'cd ..'?",
            options: [
              "Vai direto pra pasta pessoal do usuário (ex: /Users/joana), enquanto 'cd ..' sobe só um nível (pra 'projetos')",
              "Os dois fazem exatamente a mesma coisa: subir um nível na árvore de pastas",
              "'cd ~' fecha o terminal atual e abre um novo já na pasta pessoal do usuário",
              "'cd ~' sobe dois níveis de uma vez, enquanto 'cd ..' sobe só um nível por vez",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
