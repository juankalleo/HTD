import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-processos-ps-kill-top-e-jobs",
  title: "Processos: ps, kill, top e jobs",
  summary: "Todo programa rodando é um 'processo' com um número — e saber enxergar, pausar e encerrar processos evita muito Ctrl+C desesperado.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao08ProcessosPsKillTopEJobs() {
  return (
    <LessonBody>
      <p>
        Todo programa que roda no seu computador — um servidor local, um script, até o próprio terminal — é um{" "}
        <strong>processo</strong>: uma execução com um número de identificação único, o <strong>PID</strong> (
        <em>process ID</em>). Saber ver quais processos estão rodando, pausá-los e encerrá-los é o que separa
        "fechar o terminal e torcer" de resolver o problema de verdade.
      </p>

      <h2>ps aux — a lista de processos</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ps aux`}
        result={`USER   PID  %CPU %MEM  COMMAND
joana  1421  0.2  1.1  node server.js
joana  1502  12.4 3.8  chrome --renderer
joana  1600  0.0  0.4  bash`}
      />
      <p>
        <code>ps</code> (<em>process status</em>) lista processos; <code>aux</code> é um combo de flags clássico
        que mostra <strong>todos</strong> os processos de <strong>todos</strong> os usuários (<code>a</code>), com
        informações de dono e uso de recursos (<code>u</code>), incluindo processos sem terminal associado (
        <code>x</code>). A coluna <code>PID</code> é o número que você vai usar pra apontar exatamente qual
        processo mexer a seguir.
      </p>

      <h2>kill vs. kill -9</h2>
      <p>
        <code>kill</code> envia um <strong>sinal</strong> pra um processo, pedindo pra ele se encerrar. O nome é um
        pouco enganoso: o <code>kill</code> padrão (sinal <code>SIGTERM</code>) é um <em>pedido educado</em> —
        avisa o processo, que pode se preparar (salvar estado, fechar conexões) antes de sair.
      </p>
      <CodeExample label="terminal" language="bash" code={`kill 1421`} />
      <p>
        Quando isso não funciona — o processo trava e ignora o pedido —, existe a versão sem meio-termo:{" "}
        <code>kill -9</code>, que envia <code>SIGKILL</code>, um sinal que o sistema operacional executa à força,
        sem dar chance nenhuma ao processo de reagir.
      </p>
      <CodeExample label="terminal" language="bash" code={`kill -9 1421`} />
      <p>
        A diferença importa: <code>kill -9</code> pode deixar arquivos temporários abertos, conexões de rede
        penduradas ou dados não salvos, porque o processo não teve chance de "se despedir" de nada. Por isso o
        padrão é sempre tentar <code>kill</code> primeiro, e só usar <code>-9</code> quando o processo realmente
        não responde.
      </p>

      <h2>top — consumo em tempo real</h2>
      <p>
        <code>ps aux</code> é uma foto do momento. <code>top</code> (ou <code>htop</code>, uma versão mais colorida
        e interativa, se estiver instalado) mostra os processos <strong>atualizando ao vivo</strong>, ordenados por
        quem está consumindo mais CPU ou memória — ótimo pra descobrir o que está travando a máquina agora.
      </p>
      <CodeExample label="terminal" language="bash" code={`top`} />
      <p>
        Dentro do <code>top</code>, a tecla <code>q</code> sai (mesma lógica do <code>less</code>), e{" "}
        <code>k</code> deixa você digitar um PID pra matar sem sair da tela.
      </p>

      <h2>Background com &, jobs, fg e bg</h2>
      <p>
        Quando você roda um comando normalmente, o terminal fica ocupado até ele terminar — você não consegue
        digitar outro comando enquanto isso. Colocar <code>&</code> no final manda o comando rodar em{" "}
        <strong>segundo plano</strong>, devolvendo o terminal pra você imediatamente.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`npm run dev &`}
        result={`[1] 2231`}
      />
      <p>
        O número entre colchetes é o <strong>job ID</strong>; o segundo é o PID. <code>jobs</code> lista tudo que
        está rodando em background na sessão atual do terminal:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`jobs`}
        result={`[1]+  Running    npm run dev &`}
      />
      <p>
        <code>fg</code> (<em>foreground</em>) traz um job de volta pro primeiro plano; <code>bg</code>{" "}
        (<em>background</em>) manda continuar rodando em segundo plano depois de pausado.
      </p>

      <h2>Ctrl+C vs. Ctrl+Z</h2>
      <p>
        Esses dois atalhos confundem muita gente no início porque parecem fazer a mesma coisa — "parar o que está
        rodando" — mas são bem diferentes. <code>Ctrl+C</code> envia <code>SIGINT</code>, pedindo pro processo{" "}
        <strong>encerrar de vez</strong>. <code>Ctrl+Z</code> envia <code>SIGTSTP</code>, que apenas{" "}
        <strong>pausa</strong> o processo, deixando ele "congelado" — ele continua existindo, só não está mais
        executando, e pode voltar a rodar depois com <code>fg</code> ou <code>bg</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`# processo rodando em primeiro plano...
# Ctrl+Z
[1]+  Stopped    npm run dev
bg`}
        result={`[1]+ npm run dev &`}
      />

      <Exercise
        prompt={
          <p>
            Você iniciou um servidor com <code>npm run dev</code> e ele travou, sem responder a nenhum comando. Você
            já sabe o PID (pelo <code>ps aux</code>) e já tentou <code>kill</code> normal, sem sucesso. Qual o
            próximo comando, e o que ele faz de diferente do <code>kill</code> normal?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`kill -9 1421

# kill normal (SIGTERM) pede educadamente pro processo se encerrar,
# dando chance dele reagir. Como o processo travou e ignorou esse
# pedido, kill -9 (SIGKILL) força o encerramento imediato, sem dar
# nenhuma chance ao processo de reagir ou salvar estado.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença real entre 'kill 1421' e 'kill -9 1421'?",
            options: [
              "'kill -9' só funciona em processos que já estão pausados por Ctrl+Z, e 'kill' funciona em qualquer processo",
              "Os dois enviam o mesmo sinal, o '-9' só adiciona uma confirmação extra antes de executar",
              "'kill' pede educadamente pro processo se encerrar (dando chance de reagir); 'kill -9' força o encerramento imediato",
              "'kill' encerra o processo imediatamente; 'kill -9' é a versão mais lenta, que espera o processo terminar sozinho",
            ],
            correctIndex: 2,
          },
          {
            question: "O que diferencia Ctrl+C de Ctrl+Z num processo rodando no terminal?",
            options: [
              "Ctrl+C encerra o processo de vez; Ctrl+Z apenas pausa, deixando o processo pronto pra retomar com 'fg' ou 'bg'",
              "Ctrl+Z encerra o processo de vez; Ctrl+C apenas minimiza a janela do terminal sem afetar o processo",
              "Os dois pausam o processo da mesma forma, só muda a tecla usada para isso",
              "Ctrl+C só funciona em processos em segundo plano; Ctrl+Z só funciona em processos em primeiro plano",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
