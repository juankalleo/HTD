import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-compactando-e-arquivando",
  title: "Compactando e arquivando: tar e zip",
  summary: "'Arquivar' e 'compactar' parecem sinônimos no dia a dia, mas são duas operações diferentes que o tar costuma fazer juntas.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao14CompactandoEArquivando() {
  return (
    <LessonBody>
      <p>
        No uso comum, "compactar um arquivo" vira uma expressão só — mas por baixo dela existem duas operações
        separadas. <strong>Arquivar</strong> significa juntar vários arquivos (e pastas) num único arquivo, sem
        necessariamente reduzir o tamanho de nada. <strong>Compactar</strong> significa reduzir o tamanho dos
        dados, aplicando um algoritmo de compressão. O <code>tar</code>, a ferramenta mais tradicional do mundo
        Unix pra isso, historicamente faz as duas coisas em sequência.
      </p>

      <h2>tar -czvf — criando um arquivo compactado</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`tar -czvf projeto.tar.gz projeto/`}
        result={`projeto/
projeto/index.html
projeto/src/
projeto/src/app.js
projeto/package.json`}
      />
      <p>Cada letra da flag <code>-czvf</code> tem um papel específico:</p>
      <CodeExample
        label="as 4 flags de tar -czvf"
        language="plaintext"
        code={`c → create (criar um novo arquivo tar)
z → compactar usando gzip (é essa letra que dá a extensão .gz)
v → verbose (mostrar cada arquivo processado na tela, como no exemplo acima)
f → o próximo argumento é o NOME do arquivo de saída (aqui, projeto.tar.gz)`}
      />
      <p>
        O resultado, <code>projeto.tar.gz</code>, junta todo o conteúdo da pasta <code>projeto/</code> num único
        arquivo <em>e</em> reduz o tamanho total via compressão gzip — as duas operações (arquivar + compactar)
        aconteceram numa única chamada de comando.
      </p>

      <h2>tar -xzvf — extraindo</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`tar -xzvf projeto.tar.gz`}
        result={`projeto/
projeto/index.html
projeto/src/
projeto/src/app.js
projeto/package.json`}
      />
      <p>
        Só o <code>c</code> vira <code>x</code> (<em>extract</em>) — o resto das flags é igual, porque o{" "}
        <code>z</code> continua dizendo "isso está compactado com gzip" e o <code>f</code> continua apontando pro
        nome do arquivo, agora de entrada em vez de saída.
      </p>

      <h2>zip e unzip — a alternativa mais comum fora do Unix</h2>
      <p>
        O formato <code>.zip</code> é mais popular fora do mundo Unix — é o padrão nativo do Windows, por exemplo
        — e no terminal os comandos correspondentes são bem mais diretos que o <code>tar</code>, sem combinação de
        flags cifradas:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`zip -r projeto.zip projeto/`}
        result={`  adding: projeto/ (stored 0%)
  adding: projeto/index.html (deflated 45%)
  adding: projeto/src/app.js (deflated 60%)`}
      />
      <p>
        Assim como <code>cp</code> e <code>rm</code>, o <code>zip</code> também precisa de <code>-r</code> pra
        entrar recursivamente numa pasta — sem essa flag, ele reclamaria que <code>projeto/</code> é uma pasta e
        não um arquivo.
      </p>
      <CodeExample label="terminal" language="bash" code={`unzip projeto.zip`} />
      <p>
        <code>unzip</code> não precisa de flag nenhuma pro caso comum — ele já sabe extrair pastas e arquivos
        preservando a estrutura original.
      </p>

      <h2>Quando usar qual</h2>
      <p>
        Em servidores Linux e em scripts de automação, <code>tar.gz</code> é o padrão histórico e mais esperado.{" "}
        <code>.zip</code> aparece mais quando o arquivo vai circular também entre pessoas usando Windows, ou
        quando alguém precisa abrir o conteúdo clicando duas vezes numa interface gráfica sem instalar nada
        extra.
      </p>

      <Exercise
        prompt={
          <p>
            Você precisa enviar a pasta <code>relatorios/</code> pra um colega que vai abrir no Windows, sem
            instalar nenhum programa extra. Depois, ele te devolve um arquivo <code>respostas.tar.gz</code> gerado
            num servidor Linux. Quais os dois comandos, um pra cada situação?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`# Pra enviar pro colega no Windows (zip abre nativamente lá, sem instalar nada):
zip -r relatorios.zip relatorios/

# Pra extrair o que o colega te devolveu (formato do mundo Linux):
tar -xzvf respostas.tar.gz`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Na prática, qual a diferença entre 'arquivar' e 'compactar', que o comando tar costuma fazer junto?",
            options: [
              "Arquivar e compactar são exatamente a mesma operação, só muda o nome usado em cada sistema operacional",
              "Compactar junta vários arquivos num só; arquivar reduz o tamanho desses dados",
              "Arquivar só funciona em pastas; compactar só funciona em arquivos individuais soltos",
              "Arquivar junta vários arquivos num único arquivo; compactar reduz o tamanho dos dados usando compressão",
            ],
            correctIndex: 3,
          },
          {
            question: "Em 'tar -czvf projeto.tar.gz projeto/', o que a flag 'f' especifica exatamente?",
            options: [
              "Que o próximo argumento é o nome do arquivo de saída (ou entrada, ao extrair)",
              "Que o comando deve rodar de forma forçada, ignorando qualquer arquivo já existente com esse nome",
              "Que o conteúdo deve ser compactado usando o algoritmo gzip",
              "Que cada arquivo processado deve ser exibido na tela durante a execução",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
