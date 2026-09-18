import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-limites-de-recursos-e-oom",
  title: "Limites de recursos e OOM em containers",
  summary: "Sem limite de memória, um container com vazamento não derruba só ele mesmo — pode derrubar a VM inteira.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao12LimitesDeRecursosEOom() {
  return (
    <LessonBody>
      <p>
        Por padrão, um container pode consumir <strong>toda</strong> a memória e CPU disponíveis na máquina onde ele
        roda — não existe limite nenhum a menos que você configure um. Isso é inofensivo enquanto tudo funciona bem;
        é um desastre no dia em que um serviço tem um vazamento de memória (memory leak) e ninguém colocou um teto
        nele.
      </p>

      <h2>O que é o OOM killer</h2>
      <p>
        Quando o Linux fica sem memória disponível, o kernel não trava — ele aciona o <strong>OOM killer</strong>{" "}
        ("out of memory killer"), um mecanismo que escolhe um processo (com base em heurísticas de quanto memória ele
        usa e sua importância estimada) e o mata à força, liberando memória pra manter o resto do sistema de pé. Isso
        vale tanto no nível do host quanto, com cgroups, no nível de <strong>cada container individualmente</strong>.
      </p>

      <h2>mem_limit e cpus no compose</h2>
      <CodeExample
        label="docker-compose.yml (trecho)"
        language="yaml"
        code={`services:
  api:
    build: .
    mem_limit: 512m     # o container não pode passar de 512MB de RAM
    cpus: "0.5"          # o container não pode usar mais que meio núcleo de CPU`}
      />
      <p>
        Isso não é uma sugestão — é um limite rígido imposto via <strong>cgroups</strong> do Linux (o mesmo mecanismo
        do kernel que dá isolamento de recursos a um container). Se o processo dentro do container tentar alocar mais
        memória do que <code>mem_limit</code> permite, o kernel aciona o OOM killer <strong>só dentro do cgroup
        daquele container</strong> — não do host inteiro.
      </p>

      <h2>O que acontece quando o container estoura o limite</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`CONTAINER ID   STATUS
a3f9e2b1c8d4   Exited (137) 2 seconds ago`}
        code={`docker ps -a`}
      />
      <p>
        Código de saída <code>137</code> (128 + 9, o número do sinal <code>SIGKILL</code>) é a marca registrada de um
        processo morto à força — geralmente pelo OOM killer. <code>docker inspect</code> confirma a causa
        especificamente:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`"OOMKilled": true,
"ExitCode": 137`}
        code={`docker inspect api --format '{{json .State}}'`}
      />

      <h2>Por que isolar isso importa: sem limite, um container derruba a VM inteira</h2>
      <p>
        Sem <code>mem_limit</code>, um container com vazamento de memória não tem teto — ele consome RAM até o{" "}
        <strong>host inteiro</strong> ficar sem memória disponível. Nesse ponto, é o OOM killer do <em>host</em> que
        entra em ação, e ele pode escolher matar <strong>qualquer</strong> processo do sistema, incluindo outros
        containers saudáveis, ou até serviços essenciais como o próprio daemon do Docker ou o SSH — derrubando a VPS
        inteira por causa de um único serviço mal comportado. Com <code>mem_limit</code> configurado, o dano fica
        contido: só aquele container é morto, o resto do sistema continua de pé.
      </p>

      <Exercise
        prompt={
          <p>
            Um worker de processamento de imagens tem histórico de picos de uso de memória durante conversões
            grandes, mas nunca deveria ultrapassar 1GB em uso normal. Configure <code>mem_limit</code> pra esse
            serviço no compose de um jeito que dê alguma margem pros picos sem deixar o serviço sem limite nenhum.
          </p>
        }
        solutionLanguage="yaml"
        solutionCode={`services:
  image-worker:
    build: .
    mem_limit: 1536m   # margem sobre o 1GB normal, mas ainda um teto —
                        # se vazar de verdade, só esse container é derrubado,
                        # não a VPS inteira`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/limites-de-recursos-e-oom">
        O detalhamento completo de limites de recursos e comportamento do OOM killer em produção está documentado no
        Padrão Infraestrutura.
      </Callout>
      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/hardware-kernel-e-processos">
        Como o kernel gerencia processos e memória por trás disso (a base de como cgroups funcionam) está documentado
        no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o OOM killer do Linux faz quando o sistema fica sem memória?",
            options: [
              "Ele aumenta automaticamente a memória RAM disponível redistribuindo do disco",
              "Ele pausa todos os containers até o administrador liberar memória manualmente",
              "Ele apenas registra um aviso no log, sem tomar nenhuma ação sobre os processos",
              "O kernel escolhe um processo, com base em heurísticas, e o mata pra liberar memória e manter o sistema de pé",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que definir mem_limit num serviço do compose é importante mesmo se ele nunca deveria vazar memória?",
            options: [
              "Porque sem limite, um vazamento de memória nesse container pode consumir toda a RAM do host e derrubar outros containers e serviços junto",
              "Porque o Docker cobra por quantidade de memória reservada, mesmo sem uso real",
              "Porque containers sem mem_limit não conseguem se conectar à rede interna do compose",
              "Porque isso é exigido pelo Dockerfile para qualquer imagem baseada em Alpine",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
