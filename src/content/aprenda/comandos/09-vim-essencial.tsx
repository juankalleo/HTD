import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-vim-essencial",
  title: "Vim essencial: o suficiente pra sobreviver",
  summary: "Você não precisa virar um mestre do vim — precisa apenas conseguir entrar, editar e sair sem travar.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao09VimEssencial() {
  return (
    <LessonBody>
      <p>
        Existe uma piada muito repetida no mundo dev sobre gente que abriu o <code>vim</code> sem saber como sair
        e ficou presa ali. A piada existe porque é real: o vim se comporta de um jeito completamente diferente de
        qualquer editor que você já usou, e sem saber as regras básicas, é fácil travar de verdade. Esta lição
        cobre exatamente o mínimo pra você nunca mais ficar preso.
      </p>

      <h2>Por que aprender vim mesmo preferindo nano</h2>
      <p>
        Se o <code>nano</code> é mais amigável, por que se importar com o <code>vim</code>? Porque{" "}
        <strong>nem todo sistema tem o nano instalado, mas praticamente todo sistema Linux tem o vim</strong> (ou
        pelo menos o <code>vi</code>, seu antecessor mais simples) por padrão. Em algum momento você vai entrar
        num servidor remoto, tentar editar um arquivo, descobrir que <code>nano: command not found</code> aparece,
        e o vim vai ser a única opção disponível ali. Não precisa dominar o vim — só precisa não ficar preso nele.
      </p>

      <h2>Os dois modos principais</h2>
      <p>
        A diferença mais importante entre vim e qualquer editor comum: o vim tem <strong>modos</strong>. No modo
        que ele abre por padrão — o <strong>modo normal</strong> — as teclas não digitam letras, elas executam{" "}
        <em>comandos</em>. Apertar <code>a</code> no modo normal não escreve "a" na tela; faz outra coisa
        completamente diferente (nesse caso, entra em modo de inserção logo depois do cursor).
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`vim arquivo.txt`}
      />
      <p>
        Isso abre o arquivo já no <strong>modo normal</strong>. Se você começar a digitar imediatamente, nada do
        que você espera vai acontecer — letras vão disparar comandos, cursor pode pular de lugar, linhas podem
        sumir. É exatamente esse comportamento que assusta quem nunca usou.
      </p>

      <h2>Entrando em modo de inserção</h2>
      <p>
        Pra realmente digitar texto, você precisa entrar no <strong>modo de inserção</strong>. A tecla mais comum
        pra isso é <code>i</code> (de <em>insert</em>), que começa a inserir texto exatamente onde o cursor está.
      </p>
      <CodeExample
        label="dentro do vim, no modo normal"
        language="plaintext"
        code={`i`}
        result={`-- INSERT --   (aparece no rodapé da tela, confirmando a mudança de modo)`}
      />
      <p>
        Com essa indicação <code>-- INSERT --</code> visível, agora sim digitar funciona como em qualquer editor
        normal — cada tecla vira texto na tela.
      </p>

      <h2>Voltando ao modo normal</h2>
      <p>
        Pra sair do modo de inserção e voltar ao modo normal (onde ficam os comandos, incluindo salvar e sair), a
        tecla é <code>Esc</code>. Sem apertar <code>Esc</code> antes, nenhum comando de salvar ou sair funciona —
        porque tudo que você digitar ainda está sendo tratado como texto a inserir, não como comando.
      </p>

      <h2>Salvando e saindo</h2>
      <p>
        Com o cursor de volta no modo normal (depois do <code>Esc</code>), os comandos de salvar e sair começam
        com <code>:</code> (dois pontos), que abre uma linha de comando na parte de baixo da tela.
      </p>
      <CodeExample
        label="dentro do vim, no modo normal"
        language="plaintext"
        code={`:wq`}
        result={`# salva o arquivo (w, de "write") e sai (q, de "quit") — os dois numa tacada só`}
      />
      <p>Se você quer sair <strong>sem salvar</strong> nenhuma mudança que fez — por exemplo, se bagunçou tudo tentando entender os modos —, o comando é:</p>
      <CodeExample
        label="dentro do vim, no modo normal"
        language="plaintext"
        code={`:q!`}
        result={`# sai sem salvar. O "!" força a saída mesmo com mudanças não salvas.`}
      />
      <p>
        Esses dois comandos — <code>:wq</code> e <code>:q!</code> — já resolvem 90% das vezes que alguém fica
        "preso" no vim. O fluxo mínimo de sobrevivência é: <code>Esc</code> (garantir que está no modo normal),
        depois <code>:wq</code> pra salvar e sair, ou <code>:q!</code> pra abandonar sem salvar.
      </p>

      <CodeExample
        label="resumo de sobrevivência"
        language="plaintext"
        code={`i        → entra em modo de inserção (digitar texto normalmente)
Esc      → volta pro modo normal (onde ficam os comandos)
:wq      → salva e sai
:q!      → sai sem salvar (ignora mudanças)`}
      />

      <Exercise
        prompt={
          <p>
            Você abriu <code>vim notas.txt</code>, digitou algumas linhas de texto, e decidiu que não quer salvar
            nada disso — quer sair exatamente como o arquivo estava antes de você abrir. Descreva a sequência
            exata de teclas.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Esc     (garante que saiu do modo de inserção e voltou pro modo normal)
:q!     (sai sem salvar as mudanças, descartando tudo que foi digitado)

# Se você tentasse só ":q" sem o "!", o vim recusaria sair, avisando
# que existem mudanças não salvas — o "!" é o que força a saída mesmo assim.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que digitar texto direto ao abrir o vim, sem apertar nada antes, não funciona como esperado?",
            options: [
              "Porque o vim abre no modo normal, onde as teclas executam comandos em vez de inserir texto — é preciso entrar em modo de inserção primeiro",
              "Porque o vim precisa ser configurado manualmente antes do primeiro uso em cada máquina nova",
              "Porque o vim só aceita texto colado do clipboard, nunca digitado diretamente pelo teclado",
              "Porque o arquivo aberto precisa ter a permissão de execução ativada antes de aceitar edição",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual a diferença entre ':wq' e ':q!' no modo normal do vim?",
            options: [
              "Os dois sempre salvam o arquivo, a diferença é só a velocidade com que fecham o vim",
              "':q!' salva e fecha; ':wq' descarta as mudanças e fecha sem salvar nada",
              "':wq' salva o arquivo e sai; ':q!' sai sem salvar, descartando qualquer mudança feita",
              "':wq' funciona só no modo de inserção, e ':q!' funciona só no modo normal",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
