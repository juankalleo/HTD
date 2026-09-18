import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-debugando-rede-na-pratica",
  title: "Debugando rede na prática: curl, dig e DevTools",
  summary: "'Tá lento' não é um diagnóstico — é preciso descobrir EM QUAL etapa da rede o tempo está sendo gasto.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao15DebugandoRedeNaPratica() {
  return (
    <LessonBody>
      <p>
        Toda essa trilha explicou as etapas que uma requisição percorre — DNS, TCP, TLS, proxy, cache. Debugar um
        problema de rede de verdade é usar ferramentas que mostram exatamente <strong>onde</strong>, dentro dessas
        etapas, o tempo está sendo gasto, em vez de adivinhar.
      </p>

      <h2>A aba Network do navegador — a primeira parada</h2>
      <p>
        Ao inspecionar uma requisição na aba <strong>Network</strong> do DevTools, o navegador já separa o tempo
        total em fases: <code>DNS Lookup</code>, <code>Initial connection</code>, <code>SSL</code>, <code>Waiting (TTFB)</code>{" "}
        e <code>Content Download</code>. Isso já diz muito antes de qualquer outra ferramenta: uma fase de{" "}
        <code>Waiting</code> longa aponta pro <strong>servidor</strong> (ele recebeu a requisição e demorou pra
        responder); uma fase de <code>DNS Lookup</code> longa aponta pra resolução de nome; uma fase de{" "}
        <code>Content Download</code> longa aponta pro tamanho da resposta, não pra "rede lenta" de forma genérica.
      </p>

      <h2>dig — checando a resolução DNS diretamente</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`dig howtodev.site +short`}
        result={`76.76.21.21`}
      />
      <p>
        Quando você suspeita que o problema é DNS especificamente, dá pra consultar um servidor público direto — sem
        passar pelo cache do seu sistema operacional ou roteador — pra isolar se o problema é a sua rede local ou o
        registro DNS de verdade:
      </p>
      <CodeExample
        label="terminal — consultando o Google DNS diretamente"
        language="bash"
        code={`dig @8.8.8.8 howtodev.site`}
        result={`;; ANSWER SECTION:
howtodev.site.        300     IN      A       76.76.21.21

;; Query time: 24 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)`}
      />
      <p>
        Se a resposta do <code>8.8.8.8</code> já vem correta e rápida, o problema não está no registro DNS em si —
        pode estar num cache antigo no seu resolvedor local, ou em outra etapa depois da resolução de nome.
      </p>

      <h2>curl -v — vendo a requisição sem a abstração do navegador</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`curl -v https://howtodev.site`}
        result={`* Trying 76.76.21.21:443...
* Connected to howtodev.site (76.76.21.21) port 443
* TLS handshake, Server hello (2):
* SSL connection using TLSv1.3
> GET / HTTP/1.1
> Host: howtodev.site
> Accept: */*
>
< HTTP/1.1 200 OK
< content-type: text/html; charset=utf-8
< cache-control: public, max-age=0, must-revalidate`}
      />
      <p>
        A flag <code>-v</code> (verbose) mostra a conexão sendo estabelecida, o handshake TLS, e depois os headers
        de requisição (linhas com <code>&gt;</code>) e resposta (linhas com <code>&lt;</code>) exatamente como
        trafegaram — útil pra depurar API sem depender de interface gráfica, ou pra confirmar que um header
        específico (como <code>Cache-Control</code> ou <code>Access-Control-Allow-Origin</code>) realmente veio do
        servidor do jeito esperado.
      </p>

      <Exercise
        prompt={
          <p>
            Você abre a aba Network e vê uma requisição de API que levou 2.1s no total: 0.05s de DNS, 0.08s de
            conexão + TLS, <strong>1.9s de Waiting (TTFB)</strong>, e o resto em download do corpo da resposta. Isso
            aponta pra um problema de rede ou de servidor? Por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Aponta pra um problema do lado do SERVIDOR, não de rede. DNS e
conexão/TLS já foram rápidos (menos de 0.15s somados) — a etapa que
consumiu quase todo o tempo foi "Waiting (TTFB)", que mede o
intervalo entre a requisição ser enviada e o primeiro byte da
resposta chegar. Esse tempo é gasto no servidor processando a
requisição (ex.: uma query lenta no banco de dados) antes mesmo de
começar a responder — a rede, nesse caso, não é o gargalo.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Na aba Network do navegador, o que a fase 'Waiting (TTFB)' representa?",
            options: [
              "O tempo que o navegador espera antes de decidir usar cache em vez de rede",
              "O tempo gasto exclusivamente na resolução DNS do domínio",
              "O tempo total de download do conteúdo da resposta, incluindo imagens",
              "O tempo entre a requisição ser enviada e o primeiro byte da resposta chegar — geralmente reflete o tempo de processamento no servidor",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que rodar 'dig @8.8.8.8 dominio.com' é útil pra debugar um problema de DNS?",
            options: [
              "Porque 8.8.8.8 é sempre mais rápido que qualquer outro servidor DNS do mundo",
              "Consulta um servidor DNS público diretamente, ajudando a isolar se o problema está no seu resolvedor local (cache) ou no registro de verdade",
              "Porque essa consulta força a atualização imediata do registro DNS em todos os servidores do mundo",
              "Porque o dig só funciona quando aponta para um servidor Google especificamente",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
