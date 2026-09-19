import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-diagnosticando-servidor",
  title: "Projeto guiado: diagnosticando um servidor remoto",
  summary: "Um cenário real, do início ao fim: o site caiu, você só tem acesso via SSH, e cada comando desta trilha entra em ação.",
  estimatedMinutes: 23,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoDiagnosticandoServidor() {
  return (
    <LessonBody>
      <p>
        Esta última lição não ensina comando novo nenhum — ela junta praticamente tudo que você viu nas 15 lições
        anteriores num cenário só, do jeito que aconteceria de verdade: alguém te avisa que "o site caiu", e a
        única ferramenta que você tem em mãos é o terminal.
      </p>

      <h2>O cenário</h2>
      <p>
        Você recebe uma mensagem: "o site parou de responder". Não tem mais informação que isso. O servidor onde
        a aplicação roda é uma VPS Linux, e seu único acesso é remoto. Vamos investigar passo a passo, exatamente
        na ordem que faz sentido investigar — de fora pra dentro.
      </p>

      <h2>Passo 1 — conectando no servidor</h2>
      <p>
        O primeiro passo é sempre entrar no servidor. Isso é a lição 12 em ação:
      </p>
      <CodeExample
        label="terminal (na sua máquina)"
        language="bash"
        code={`ssh deploy@203.0.113.42`}
        result={`Welcome to Ubuntu 22.04.3 LTS
deploy@servidor:~$`}
      />
      <p>
        Prompt mudou pra <code>deploy@servidor</code> — você está dentro do servidor agora. Todo comando daqui pra
        frente roda lá, não na sua máquina.
      </p>

      <h2>Passo 2 — navegando até a pasta do projeto</h2>
      <p>Isso é a lição 2: <code>pwd</code> pra saber onde você está, <code>cd</code> pra chegar até a aplicação.</p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`pwd`}
        result={`/home/deploy`}
      />
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`cd /var/www/meu-site
ls -la`}
        result={`drwxr-xr-x  7 deploy deploy  224 12 mar 08:00 .
drwxr-xr-x  4 deploy deploy  128 01 fev 09:00 ..
-rw-r--r--  1 deploy deploy  512 12 mar 08:00 .env
drwxr-xr-x  3 deploy deploy   96 12 mar 08:00 logs
-rw-r--r--  1 deploy deploy  340 10 mar 14:22 config.yml
drwxr-xr-x  5 deploy deploy  160 12 mar 08:00 src`}
      />
      <p>Existe uma pasta <code>logs</code> — é o próximo lugar óbvio pra olhar.</p>

      <h2>Passo 3 — lendo o log de erro</h2>
      <p>
        Isso combina a lição 4 (<code>less</code>) com a lição 7 (<code>grep</code>). Um log de produção pode ter
        milhares de linhas — não dá pra ler tudo com <code>cat</code>.
      </p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`grep -n "ERROR" logs/app.log | tail -5`}
        result={`8821: [ERROR] 2026-09-18 03:14:02 - Connection refused: database unreachable
8822: [ERROR] 2026-09-18 03:14:02 - Falling back to cached response
9001: [ERROR] 2026-09-18 03:41:10 - Worker process exited unexpectedly
9002: [ERROR] 2026-09-18 03:41:10 - Restart attempt failed: port 3000 already in use
9003: [ERROR] 2026-09-18 03:41:11 - Restart attempt failed: port 3000 already in use`}
      />
      <p>
        <code>grep -n "ERROR"</code> filtra só as linhas de erro, mostrando o número da linha; <code>tail -5</code>{" "}
        (que ainda não vimos, mas segue a mesma lógica de pipe da lição 6) pega só as 5 últimas — as mais recentes.
        A pista mais forte aqui: <strong>porta 3000 já em uso</strong>, impedindo o serviço de reiniciar. Isso
        sugere que existe um processo travado, ainda ocupando a porta que o serviço precisa.
      </p>

      <h2>Passo 4 — checando se o processo está rodando</h2>
      <p>Hora da lição 8. Vamos confirmar a suspeita: existe algum processo preso, segurando a porta 3000.</p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`ps aux | grep node`}
        result={`deploy  4102  0.0  2.1  node server.js
deploy  4390  95.2 8.7  node server.js`}
      />
      <p>
        Dois processos <code>node server.js</code> rodando ao mesmo tempo — isso não deveria acontecer. O segundo (
        <code>PID 4390</code>) está consumindo 95% de CPU, um sinal claro de que travou num loop e nunca terminou
        de sair, sem liberar a porta 3000 pro processo novo conseguir subir.
      </p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`kill 4390`}
      />
      <p>
        Um <code>kill</code> normal primeiro, do jeito educado — dando a chance do processo se encerrar
        corretamente antes de forçar. Se depois de alguns segundos o <code>ps aux</code> mostrar que ele ainda está
        lá, aí sim o próximo passo seria <code>kill -9 4390</code>.
      </p>

      <h2>Passo 5 — editando a configuração</h2>
      <p>
        Enquanto investigava, você percebeu no <code>config.yml</code> que a URL do banco estava apontando pro
        endereço errado — provavelmente a causa raiz do <code>Connection refused</code> visto no log. Hora do{" "}
        <code>nano</code>, lição 4:
      </p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`nano config.yml`}
      />
      <CodeExample
        label="conteúdo corrigido de config.yml"
        language="yaml"
        code={`database_url: postgres://app:senha@db.interno:5432/producao
porta: 3000`}
      />
      <p>
        Depois de corrigir a linha do <code>database_url</code>: <code>Ctrl+O</code> salva, <code>Enter</code>{" "}
        confirma o nome, <code>Ctrl+X</code> sai.
      </p>

      <h2>Passo 6 — reiniciando o serviço</h2>
      <p>
        Com o processo travado encerrado e a configuração corrigida, é hora de subir o serviço de novo. Como isso
        pode demorar e você quer continuar usando o terminal pra acompanhar, rodar em background (lição 8) faz
        sentido:
      </p>
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`node server.js &`}
        result={`[1] 4521`}
      />
      <CodeExample
        label="terminal (no servidor)"
        language="bash"
        code={`grep -n "ERROR" logs/app.log | tail -3`}
        result={`9001: [ERROR] 2026-09-18 03:41:10 - Worker process exited unexpectedly
9002: [ERROR] 2026-09-18 03:41:10 - Restart attempt failed: port 3000 already in use
9003: [ERROR] 2026-09-18 03:41:11 - Restart attempt failed: port 3000 already in use`}
      />
      <p>
        Nenhum erro novo depois do restart — sinal de que a correção funcionou. Uma última conferência com{" "}
        <code>ps aux | grep node</code> confirma que agora existe só <strong>um</strong> processo rodando, saudável,
        sem consumo anormal de CPU.
      </p>

      <h2>O que esse cenário mostrou</h2>
      <CodeExample
        label="a investigação inteira, resumida"
        language="plaintext"
        code={`ssh                → entrar no servidor remoto
cd / ls -la         → chegar até a pasta certa e ver o que existe ali
grep -n / tail       → filtrar o log gigante até achar as linhas relevantes
ps aux               → confirmar o que está rodando de fato, e identificar o processo travado
kill                 → encerrar o processo problemático, do jeito educado primeiro
nano                 → corrigir a configuração com o erro raiz identificado
comando & / jobs      → reiniciar o serviço em background e acompanhar`}
      />
      <p>
        Nenhum passo dessa investigação usou uma ferramenta gráfica, um dashboard ou um clique sequer — cada
        decisão veio de ler a saída de um comando e decidir o próximo com base nela. É exatamente essa leitura de
        saída, comando após comando, que esta trilha inteira tentou construir.
      </p>

      <Exercise
        prompt={
          <p>
            Depois de reiniciar o serviço, você quer ter certeza de que, se ele cair de novo à noite, vai aparecer
            algo no log. Usando comandos desta lição e da lição 6, escreva como você verificaria continuamente as
            novas linhas de erro que aparecerem no arquivo <code>logs/app.log</code> a partir de agora, sem reabrir
            o arquivo inteiro toda vez.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`tail -f logs/app.log | grep --line-buffered "ERROR"

# "tail -f" ("follow") mantém o terminal aberto mostrando novas linhas
# assim que são escritas no arquivo, em vez de mostrar só um trecho
# fixo. O pipe pro grep filtra, em tempo real, só as linhas de erro
# entre tudo que está sendo adicionado ao log.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No cenário desta lição, por que o segundo processo 'node server.js' (PID 4390) era o principal suspeito do problema?",
            options: [
              "Porque ele tinha o número de PID mais alto entre os dois processos encontrados no ps aux",
              "Porque ele aparecia listado antes do outro processo na saída do comando ps aux",
              "Porque estava consumindo 95% de CPU, sinal de estar travado, e segurando a porta que o serviço novo precisava usar",
              "Porque era o único processo rodando com o usuário 'deploy' em vez de root",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que faz sentido tentar 'kill 4390' antes de já ir direto pra 'kill -9 4390'?",
            options: [
              "'kill -9' dá a chance do processo se encerrar sozinho antes de forçar, e o 'kill' normal já força de imediato",
              "'kill' normal pede o encerramento de forma educada, dando ao processo a chance de reagir antes de forçar com -9",
              "Não faz diferença nenhuma, os dois comandos sempre produzem exatamente o mesmo resultado",
              "'kill -9' exige senha de administrador, e por isso deve ser sempre a última tentativa",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
