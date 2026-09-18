import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-logs-e-debug-em-producao",
  title: "Logs e debugging de containers em produção",
  summary: "Container 'rodando' não é o mesmo que container funcionando — saber diferenciar crash de travamento economiza horas de investigação às cegas.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao13LogsEDebugEmProducao() {
  return (
    <LessonBody>
      <p>
        Quando algo dá errado em produção, você não tem um debugger anexado nem um terminal aberto olhando o
        processo — o que você tem são logs, um punhado de comandos do próprio Docker e, na pior das hipóteses, um
        container que nem chegou a subir. Saber usar essas ferramentas rápido é a diferença entre resolver em 2
        minutos e ficar 1 hora tateando no escuro.
      </p>

      <h2>docker logs -f — acompanhando saída em tempo real</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`docker logs -f api
docker logs --tail 100 api    # só as últimas 100 linhas, sem o histórico inteiro`}
      />
      <p>
        <code>-f</code> ("follow") mantém o terminal acompanhando a saída conforme ela é gerada — o equivalente a um{" "}
        <code>tail -f</code> de um arquivo de log, mas puxando direto do container. Funciona mesmo depois que o
        container já crashou (sem o <code>-f</code>), porque o Docker guarda a saída já produzida.
      </p>

      <h2>docker exec -it — entrando num container que já está rodando</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`docker exec -it api sh`}
      />
      <p>
        Isso abre uma sessão interativa <strong>dentro</strong> do container já em execução — útil pra inspecionar um
        arquivo, checar uma variável de ambiente ou testar um comando pontual sem reconstruir nada.{" "}
        <strong>Não</strong> é lugar pra editar código: qualquer mudança feita ali dentro desaparece na próxima vez
        que o container for recriado, porque o sistema de arquivos do container não é a fonte de verdade — a imagem
        é.
      </p>

      <h2>docker stats — uso de recursos em tempo real</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`CONTAINER   CPU %   MEM USAGE / LIMIT   NET I/O
api         12.4%   340MiB / 512MiB     1.2MB / 850kB
db          3.1%    180MiB / 1GiB       410kB / 2MB`}
        code={`docker stats`}
      />
      <p>
        Primeiro lugar pra olhar quando um serviço está lento ou reiniciando sozinho: se <code>MEM USAGE</code> está
        colado no limite, é candidato a estar sendo morto pelo OOM killer (lição de limites de recursos); se{" "}
        <code>CPU %</code> está constantemente em 100%+, o serviço está gargalado em processamento, não em memória.
      </p>

      <h2>Container que crashou vs container que nunca subiu</h2>
      <p>
        São dois problemas diferentes e pedem investigação diferente:
      </p>
      <CodeExample
        label="diferenciando os dois"
        language="plaintext"
        code={`Crashou depois de rodar   O processo iniciou, rodou por um tempo, e morreu. "docker logs" tem
                          conteúdo útil: erro de aplicação, exceção não tratada, OOM.

Nunca chegou a subir      O container sai quase instantaneamente. Geralmente é o comando do
                          CMD/ENTRYPOINT com erro de sintaxe, um arquivo esperado que não existe
                          na imagem, ou uma variável de ambiente obrigatória faltando. "docker logs"
                          pode estar vazio ou ter só um erro de shell — o app nunca chegou a rodar
                          de verdade.`}
      />
      <CodeExample
        label="terminal — primeiro diagnóstico"
        language="bash"
        result={`CONTAINER ID   IMAGE       STATUS
9f2a1c8b3d4e   minha-api   Exited (1) 4 seconds ago`}
        code={`docker ps -a`}
      />
      <p>
        <code>docker ps -a</code> (com o <code>-a</code>, mostra containers parados também) já entrega o código de
        saída — o próximo passo é sempre <code>docker logs</code> daquele container específico pra ver a mensagem de
        erro real.
      </p>

      <h2>Exit codes comuns</h2>
      <CodeExample
        label="códigos de saída"
        language="plaintext"
        code={`0     Sucesso — o processo terminou normalmente, sem erro
1     Erro genérico da aplicação — depende do que o processo reportou
137   SIGKILL (128 + 9) — geralmente o OOM killer matando o processo por estourar memória
139   Segmentation fault — o processo acessou memória inválida e travou
143   SIGTERM (128 + 15) — o processo recebeu um pedido de parada graciosa (ex.: "docker stop")`}
      />

      <Exercise
        prompt={
          <p>
            <code>docker ps -a</code> mostra um serviço com <code>Exited (137)</code>, reiniciando repetidamente a
            cada poucos minutos. <code>docker logs</code> não mostra nenhum erro de aplicação — a saída simplesmente
            para no meio. Qual a hipótese mais provável, e o que checar em seguida?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Código 137 = SIGKILL, tipicamente o OOM killer. A ausência de erro de
aplicação nos logs bate com essa hipótese: o processo não teve chance
de logar nada, foi simplesmente morto pelo kernel. Próximo passo:
"docker inspect <container> --format '{{json .State}}'" pra confirmar
"OOMKilled": true, e depois "docker stats" pra ver se o uso de memória
sobe até o limite configurado (ou se não HÁ limite configurado, o que
seria o próprio problema).`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/hardware-kernel-e-processos">
        Como o kernel lida com processos, sinais (SIGKILL, SIGTERM) e códigos de saída está documentado em detalhe no
        Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual comando permite entrar num shell dentro de um container que já está rodando, pra inspecionar arquivos ou testar um comando pontual?",
            options: [
              "docker exec -it nome_do_container sh — abre uma sessão interativa dentro do container já em execução",
              "docker run -it nome_do_container sh — cria um novo container a partir da mesma imagem para inspeção",
              "docker logs -it nome_do_container — abre um shell interativo dentro dos logs do container",
              "docker build -it nome_do_container sh — reconstrói a imagem em modo interativo para depuração",
            ],
            correctIndex: 0,
          },
          {
            question: "O que o exit code 137 geralmente indica quando um container para?",
            options: [
              "O container terminou normalmente, sem nenhum tipo de erro ou intervenção externa",
              "O processo dentro do container recebeu SIGKILL, frequentemente porque o OOM killer o matou por estourar o limite de memória",
              "O Dockerfile usado para construir a imagem contém um erro de sintaxe",
              "A imagem base usada pelo container não está mais disponível no registry",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
