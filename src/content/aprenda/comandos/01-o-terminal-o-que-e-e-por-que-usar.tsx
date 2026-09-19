import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-o-terminal-o-que-e-e-por-que-usar",
  title: "O terminal: o que é e por que usar",
  summary: "Uma tela preta com um cursor piscando não é enfeite de hacker de filme — é a forma mais direta de conversar com o computador.",
  estimatedMinutes: 12,
  level: "fundamentos",
};

export default function Licao01OTerminalOQueEEPorQueUsar() {
  return (
    <LessonBody>
      <p>
        A primeira vez que alguém abre um terminal, a reação comum é estranhamento: não tem botão, não tem ícone,
        não tem nada pra clicar — só um cursor piscando esperando você digitar alguma coisa. Parece que voltou pra
        um computador de 1985. Só que essa "tela preta" continua sendo, até hoje, a ferramenta mais usada por quem
        programa profissionalmente, e não por nostalgia: é a forma mais rápida e mais precisa de dizer ao
        computador exatamente o que fazer.
      </p>

      <h2>Interface gráfica vs. linha de comando</h2>
      <p>
        Quando você clica em "renomear arquivo" numa pasta do sistema, por trás disso o sistema operacional está
        rodando uma instrução equivalente a um comando de terminal — só que escondida atrás de menus, ícones e
        cliques. A <strong>interface gráfica (GUI)</strong> foi feita pra ser descoberta visualmente; o{" "}
        <strong>terminal</strong> foi feito pra ser digitado. A diferença aparece na prática quando a tarefa é
        repetitiva ou específica: renomear um arquivo é fácil nos dois jeitos, mas renomear 200 arquivos seguindo
        um padrão, ou automatizar isso pra rodar toda noite sozinho, só é razoável a partir de comandos.
      </p>
      <CodeExample
        label="a mesma ação, dois caminhos"
        language="plaintext"
        code={`Interface gráfica: abrir pasta → clicar no arquivo → clicar em "renomear" → digitar novo nome → Enter
Terminal:          mv arquivo-antigo.txt arquivo-novo.txt`}
      />
      <p>
        Nenhum dos dois é "errado". Mas o comando pode ser copiado, colado, guardado num script e repetido
        automaticamente mil vezes sem erro de dedo — o clique, não.
      </p>

      <h2>O que é um shell</h2>
      <p>
        O programa que você usa pra digitar comandos se chama <strong>shell</strong> (literalmente "casca" — uma
        camada em volta do sistema operacional). Existem vários: <code>bash</code> e <code>zsh</code> são os mais
        comuns em Linux e macOS hoje em dia (o macOS usa <code>zsh</code> como padrão desde 2019). O shell é quem lê
        o que você digita, interpreta como um comando, executa e devolve o resultado na tela. O programa que abre
        essa janela onde o shell roda (a "caixa" em si) se chama <strong>terminal</strong> ou{" "}
        <strong>emulador de terminal</strong> — no dia a dia, as pessoas usam "terminal" pra se referir aos dois
        juntos, e essa trilha faz o mesmo.
      </p>

      <h2>O prompt</h2>
      <p>
        Quando você abre um terminal, a primeira coisa que aparece é o <strong>prompt</strong> — um texto curto
        terminado em <code>$</code> (ou <code>%</code> no zsh, ou <code>#</code> quando você está autenticado como
        superusuário) esperando você digitar algo. Não é decoração: é o shell avisando "terminei o comando
        anterior, pronto pro próximo".
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`usuario@maquina ~ % echo "primeiro comando"`}
        result={`primeiro comando`}
      />
      <p>
        O comando <code>echo</code> simplesmente repete de volta o que você passou pra ele — é o "Olá, mundo" do
        terminal. Depois de rodar, o prompt volta a aparecer, esperando o próximo comando. Esse ciclo —{" "}
        <em>digitar, apertar Enter, ler o resultado, voltar ao prompt</em> — é o padrão de todo o resto desta
        trilha.
      </p>

      <h2>Por que todo dev usa terminal mesmo tendo GUI</h2>
      <p>
        Três motivos concretos, sem exagero: primeiro, <strong>velocidade</strong> — depois de acostumado, digitar
        um comando é mais rápido do que navegar por menus. Segundo, <strong>reprodutibilidade</strong> — um comando
        pode ser salvo num arquivo e rodado igual em qualquer máquina, uma ação de clique não. Terceiro,{" "}
        <strong>alcance</strong> — praticamente todo servidor remoto (onde o site ou app realmente roda em
        produção) só tem terminal disponível, sem tela, sem mouse, sem interface gráfica nenhuma. Saber terminal
        não é opcional pra quem quer trabalhar com desenvolvimento; é o idioma base.
      </p>

      <Exercise
        prompt={
          <p>
            Abra o terminal da sua máquina (Terminal, no macOS; qualquer emulador de terminal no Linux; ou
            "Terminal" dentro do WSL/Git Bash no Windows) e rode um comando <code>echo</code> com uma mensagem sua.
            O que aparece antes do cursor, no início da linha, antes de você digitar?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`echo "estou aprendendo terminal"

# O que aparece antes do cursor é o PROMPT — geralmente mostra seu usuário,
# o nome da máquina e a pasta atual, terminando em $ (bash) ou % (zsh).
# Ele reaparece sozinho depois que o comando termina de rodar.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre 'shell' e 'terminal', no sentido estrito dos termos?",
            options: [
              "O shell é o programa que interpreta e executa comandos; o terminal é a janela/emulador onde o shell roda",
              "São exatamente a mesma coisa, só muda o nome dependendo se é Linux, macOS ou Windows",
              "O terminal é o programa que interpreta comandos; o shell é só o texto do prompt exibido na tela",
              "Shell é o nome usado em servidores remotos; terminal é o nome usado só em computadores locais",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que rodar um comando repetidas vezes é mais confiável do que repetir um clique numa interface gráfica?",
            options: [
              "Porque interfaces gráficas não conseguem processar mais de uma ação por vez, ao contrário do terminal",
              "Um comando pode ser salvo e reexecutado de forma idêntica, sem depender de repetir os mesmos cliques manualmente",
              "Porque todo comando de terminal já roda automaticamente em todos os arquivos de uma pasta, sem precisar repetir nada",
              "Porque a interface gráfica exige conexão com a internet para repetir qualquer ação, e o terminal não",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
