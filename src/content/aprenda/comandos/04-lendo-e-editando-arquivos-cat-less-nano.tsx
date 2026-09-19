import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-lendo-e-editando-arquivos-cat-less-nano",
  title: "Lendo e editando arquivos: cat, less e nano",
  summary: "Ver um arquivo inteiro, navegar um arquivo enorme e editar de verdade — três ferramentas, três situações diferentes.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao04LendoEEditandoArquivosCatLessNano() {
  return (
    <LessonBody>
      <p>
        Criar e mover arquivo é uma coisa; ler o que tem dentro e mudar o conteúdo é outra. Esta lição cobre três
        ferramentas com papéis bem diferentes: <code>cat</code> pra despejar um arquivo inteiro na tela,{" "}
        <code>less</code> pra navegar um arquivo grande sem travar o terminal, e <code>nano</code> — o editor que
        praticamente todo iniciante usa primeiro dentro do terminal.
      </p>

      <h2>cat — jogar o arquivo inteiro na tela</h2>
      <p>
        <code>cat</code> (de <em>concatenate</em>) imprime todo o conteúdo de um arquivo de uma vez, sem paginação.
        Serve bem pra arquivos curtos.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`cat config.txt`}
        result={`porta=3000
ambiente=desenvolvimento
debug=true`}
      />
      <p>
        O problema aparece com arquivos grandes: se <code>config.txt</code> tivesse 5 mil linhas, <code>cat</code>{" "}
        despejaria as 5 mil de uma vez, e você só veria a última tela cheia — o resto rolou pra fora da tela sem
        dar tempo de ler nada.
      </p>

      <h2>less — navegar sem se perder</h2>
      <p>
        <code>less</code> abre o arquivo em modo de <strong>navegação</strong>, uma tela por vez, sem imprimir tudo
        de uma vez.
      </p>
      <CodeExample label="terminal" language="bash" code={`less arquivo-de-log.txt`} />
      <p>Dentro do <code>less</code>, os atalhos essenciais são:</p>
      <CodeExample
        label="atalhos do less"
        language="plaintext"
        code={`↓ / j    → desce uma linha
↑ / k    → sobe uma linha
espaço   → desce uma tela inteira
/palavra → busca "palavra" no arquivo (Enter confirma, "n" pula pra próxima ocorrência)
q        → sai do less, volta pro terminal`}
      />
      <p>
        Repare que <code>q</code> ("quit") é o jeito de sair — muita gente trava na primeira vez que abre um
        arquivo com <code>less</code> porque não sabe como fechar. Não tem botão de fechar; é <code>q</code> no
        teclado.
      </p>

      <h2>nano — editando de verdade, passo a passo</h2>
      <p>
        <code>cat</code> e <code>less</code> só <strong>leem</strong>. Pra editar o conteúdo de um arquivo direto no
        terminal, o editor mais amigável pra quem está começando é o <code>nano</code>. Vamos passo a passo, porque
        esse vai ser seu editor de cabeceira nas próximas lições.
      </p>
      <CodeExample label="terminal" language="bash" code={`nano config.txt`} />
      <p>
        Isso abre o arquivo ocupando a tela inteira do terminal, com o texto no meio e uma barra de atalhos fixada
        embaixo. Diferente do <code>less</code>, aqui você pode digitar e o texto realmente muda.
      </p>
      <CodeExample
        label="atalhos essenciais do nano"
        language="plaintext"
        code={`Ctrl+O   → salva o arquivo ("O" de "Write Out" — sim, o atalho é O mesmo pra salvar)
Enter    → confirma o nome do arquivo depois do Ctrl+O (ele pergunta, só confirme)
Ctrl+X   → sai do nano (se tiver mudança não salva, ele pergunta antes)
Ctrl+K   → corta a linha inteira onde está o cursor
Ctrl+U   → cola de volta a última linha cortada`}
      />
      <p>
        O fluxo típico é: abrir com <code>nano arquivo.txt</code>, mover o cursor com as setas até onde quer
        editar, digitar normalmente (não tem "modo especial" pra digitar, ao contrário do vim), <code>Ctrl+O</code>{" "}
        pra salvar, <code>Enter</code> pra confirmar o nome, e <code>Ctrl+X</code> pra sair. Se você apertar{" "}
        <code>Ctrl+X</code> com alterações não salvas, o nano pergunta "Save modified buffer?" — <code>Y</code> salva
        e sai, <code>N</code> descarta e sai, <code>Ctrl+C</code> cancela e volta pra edição.
      </p>
      <CodeExample
        label="a barra de atalhos que aparece no rodapé do nano"
        language="plaintext"
        code={`^G Ajuda   ^O Salvar   ^W Buscar   ^K Cortar linha   ^X Sair
^R Ler arq ^\\ Substit. ^U Colar    ^J Justificar`}
      />
      <p>
        O <code>^</code> ali significa <code>Ctrl</code> — é assim que o nano documenta os próprios atalhos direto
        na tela, então mesmo esquecendo tudo o resto, essa barra sempre está visível como cola.
      </p>

      <Exercise
        prompt={
          <p>
            Abra o <code>nano</code> num arquivo novo chamado <code>notas.txt</code>, escreva duas linhas de texto
            qualquer, salve e saia. Depois use <code>cat</code> pra confirmar que o conteúdo foi salvo. Escreva a
            sequência completa de comandos e atalhos.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`nano notas.txt
# digita as duas linhas de texto
# Ctrl+O  → salva
# Enter   → confirma o nome do arquivo
# Ctrl+X  → sai do nano

cat notas.txt
# mostra as duas linhas digitadas, confirmando que salvou`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que 'less' é preferível a 'cat' pra abrir um arquivo de log com milhares de linhas?",
            options: [
              "'less' edita o conteúdo automaticamente, enquanto 'cat' só permite leitura",
              "'cat' não consegue abrir arquivos maiores que alguns kilobytes de tamanho",
              "'less' comprime o arquivo antes de exibir, economizando memória do terminal",
              "'less' mostra uma tela por vez e permite navegar/buscar, enquanto 'cat' despeja tudo de uma vez sem controle",
            ],
            correctIndex: 3,
          },
          {
            question: "No nano, o que exatamente o atalho Ctrl+O faz?",
            options: [
              "Abre um novo arquivo em branco, descartando o que estava sendo editado antes",
              "Sai do nano imediatamente, sem perguntar se quer salvar as mudanças",
              "Salva o arquivo atual (pedindo confirmação do nome antes de gravar)",
              "Desfaz a última linha digitada, voltando o texto ao estado anterior",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
