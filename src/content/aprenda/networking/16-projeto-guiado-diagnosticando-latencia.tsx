import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-diagnosticando-latencia",
  title: "Projeto guiado: por que essa requisição está lenta?",
  summary: "Um runbook passo a passo pra descobrir, camada por camada, onde uma requisição está perdendo tempo.",
  estimatedMinutes: 24,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoDiagnosticandoLatencia() {
  return (
    <LessonBody>
      <p>
        "Tá lento" pode significar coisas completamente diferentes — DNS demorando, handshake TLS, um proxy
        congestionado, um cache MISS na CDN, um load balancer mandando tráfego pra um servidor sobrecarregado, ou uma
        query lenta no banco de dados. Esse projeto junta praticamente toda a trilha de networking num único runbook
        de diagnóstico, na ordem em que o tráfego realmente percorre esses pontos.
      </p>

      <NetworkDiagram
        height={280}
        nodes={[
          { id: "client", label: "Cliente", kind: "client", x: 6, y: 55 },
          { id: "dns", label: "DNS", kind: "dns", x: 24, y: 15 },
          { id: "cdn", label: "Edge CDN", kind: "cdn", x: 42, y: 55 },
          { id: "lb", label: "Load Balancer", kind: "loadbalancer", x: 62, y: 55 },
          { id: "server", label: "Servidor de app", kind: "server", x: 80, y: 55 },
          { id: "database", label: "Banco de dados", kind: "database", x: 96, y: 55 },
        ]}
        edges={[
          { from: "client", to: "dns" },
          { from: "client", to: "cdn" },
          { from: "cdn", to: "lb" },
          { from: "lb", to: "server" },
          { from: "server", to: "database" },
        ]}
        hops={[
          { from: "client", to: "dns", caption: "1. Cliente pergunta ao DNS o IP do domínio — se essa etapa já demora, o problema começa antes de qualquer dado trafegar." },
          { from: "dns", to: "client", caption: "2. DNS responde com o IP do edge de CDN mais próximo." },
          { from: "client", to: "cdn", caption: "3. Cliente conecta no edge (é aqui que entra o handshake TLS, se for HTTPS)." },
          { from: "cdn", to: "lb", caption: "4. Cache MISS no edge — precisa buscar na origem, que fica atrás de um load balancer." },
          { from: "lb", to: "server", caption: "5. Load balancer escolhe um servidor de aplicação disponível." },
          { from: "server", to: "database", caption: "6. Servidor consulta o banco antes de montar a resposta — se a query for lenta, é aqui que o tempo some." },
        ]}
      />

      <h2>Passo 1 — onde exatamente o tempo está sendo gasto?</h2>
      <p>
        Antes de suspeitar de qualquer camada específica, abra a aba Network do navegador (lição anterior) e olhe a
        divisão de tempo da requisição: <code>DNS Lookup</code>, <code>Initial connection/SSL</code>,{" "}
        <code>Waiting (TTFB)</code>, <code>Content Download</code>. O restante deste runbook segue essa ordem, porque
        é a ordem em que o tráfego passa por cada camada.
      </p>

      <h2>Passo 2 — DNS lento</h2>
      <p>
        Se <code>DNS Lookup</code> aparece alto, confirme com <code>dig</code> consultando um resolvedor público
        direto. TTL muito baixo (forçando consulta a cada poucos segundos) ou um provedor de DNS distante/sobrecarregado
        são as causas mais comuns.
      </p>
      <CodeExample label="terminal" language="bash" code={`dig @8.8.8.8 howtodev.site`} />

      <h2>Passo 3 — handshake TLS lento</h2>
      <p>
        Se <code>SSL</code> aparece alto mesmo com a conexão TCP já rápida, use <code>curl -v</code> pra ver o
        handshake isoladamente. Na maioria dos casos essa etapa é rápida (poucos round-trips) — quando não é,
        geralmente aponta pra um proxy/terminador TLS sobrecarregado, não pro certificado em si.
      </p>
      <CodeExample label="terminal" language="bash" code={`curl -v https://howtodev.site`} />

      <h2>Passo 4 — proxy e cache MISS na CDN</h2>
      <p>
        Muitas CDNs expõem um header dizendo se aquela resposta veio do cache do edge ou precisou buscar na origem
        (algo como <code>X-Cache: HIT</code> ou <code>MISS</code>, o nome exato varia por provedor). Um MISS
        constante no mesmo recurso pode indicar <code>Cache-Control</code> configurado errado na origem, fazendo a
        CDN nunca guardar aquele conteúdo.
      </p>
      <CodeExample
        label="checando o header de cache da CDN"
        language="bash"
        code={`curl -sI https://howtodev.site/logo.png | grep -i cache`}
        result={`x-cache: MISS
cache-control: public, max-age=31536000, immutable`}
      />

      <h2>Passo 5 — load balancer mandando tráfego pro servidor errado</h2>
      <p>
        Se só uma fração das requisições está lenta (não todas), suspeite de um servidor específico atrás do load
        balancer estar sobrecarregado ou com health check falhando de forma intermitente — o sintoma típico é
        latência inconsistente entre requisições idênticas, já que o round-robin (ou outra estratégia) às vezes
        acerta o servidor saudável e às vezes o problemático.
      </p>

      <h2>Passo 6 — o gargalo mais comum de todos: o banco de dados</h2>
      <p>
        Depois de descartar DNS, TLS, CDN e load balancer, o que sobra costuma ser o próprio processamento da
        aplicação — na prática, na maioria das vezes uma <strong>query lenta no banco</strong> (índice faltando,
        tabela grande demais pra aquela consulta). É exatamente esse tempo que aparece como{" "}
        <code>Waiting (TTFB)</code> alto na aba Network, mesmo com toda a infraestrutura de rede funcionando bem.
      </p>

      <Exercise
        prompt={
          <p>
            Rodando <code>curl -v</code> numa rota de API, você percebe: conexão e handshake TLS somam 90ms, mas
            passam 4.2s entre o fim do handshake e a primeira linha da resposta chegar. Seguindo o runbook desta
            lição, em qual camada você concentraria a investigação, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`A investigação deveria focar no servidor de aplicação e no banco de
dados, não na rede. DNS, conexão e TLS já ficaram pra trás e foram
rápidos (90ms). O intervalo de 4.2s até o primeiro byte da resposta
é justamente o tempo de PROCESSAMENTO no lado do servidor — depois
que o load balancer já escolheu um servidor e ele já recebeu a
requisição, mas antes de responder. Os próximos passos seriam
checar logs/APM da aplicação e o tempo das queries que essa rota
dispara no banco, não repetir testes de rede que já mostraram que
essa camada está saudável.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Num diagnóstico de latência, se DNS e handshake TLS forem rápidos mas o TTFB (tempo até o primeiro byte) for alto, onde é mais provável que o gargalo esteja?",
            options: [
              "No roteador da casa do usuário, que está limitando a velocidade de upload",
              "No certificado TLS, que provavelmente está prestes a expirar",
              "No processamento do lado do servidor (aplicação ou banco de dados) depois que a conexão já foi estabelecida",
              "No navegador do usuário, que está processando o HTML mais devagar que o normal",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que checar se uma CDN retornou cache HIT ou MISS ajuda a diagnosticar uma requisição lenta?",
            options: [
              "Porque um MISS significa que o edge precisou buscar o conteúdo na origem antes de responder, adicionando a viagem completa até lá no tempo total",
              "Porque HIT e MISS indicam se o certificado TLS da CDN está válido ou expirado",
              "Porque esse header controla se o load balancer vai escolher outro servidor de origem",
              "Porque MISS significa que o DNS ainda não terminou de resolver o domínio",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
