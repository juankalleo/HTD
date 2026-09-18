import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-websockets-e-tempo-real",
  title: "WebSockets: comunicação em tempo real",
  summary: "HTTP normal é 'pergunta e resposta' — um chat ao vivo precisa que o servidor consiga falar primeiro.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao10WebsocketsETempoReal() {
  return (
    <LessonBody>
      <p>
        Todo o modelo HTTP visto até aqui segue a mesma regra: o cliente pergunta, o servidor responde. Isso funciona
        perfeitamente pra carregar uma página, mas trava num chat ao vivo ou numa notificação instantânea — porque{" "}
        <strong>o servidor não pode iniciar o envio de nada</strong>. Se uma mensagem nova chega para você, o servidor
        não tem como simplesmente "empurrar" ela; ele só fala quando alguém pergunta.
      </p>

      <h2>A solução ruim: ficar perguntando (polling)</h2>
      <CodeExample
        label="polling — o jeito ingênuo"
        language="plaintext"
        code={`A cada 2 segundos:
  cliente → servidor: "tem mensagem nova?"
  servidor → cliente: "não" (ou "sim, aqui está")

// funciona, mas desperdiça requisição mesmo quando não tem nada novo,
// e o atraso máximo é o intervalo entre perguntas`}
      />

      <h2>WebSocket — a conexão HTTP vira outra coisa</h2>
      <p>
        Um WebSocket começa como uma requisição HTTP normal, mas pede pro servidor <strong>trocar de protocolo</strong>{" "}
        no meio do caminho, usando o header <code>Upgrade</code>. Se o servidor aceitar, a mesma conexão TCP que
        começou como HTTP passa a ser usada como um canal aberto dos dois lados — sem precisar abrir uma nova conexão
        a cada mensagem.
      </p>
      <CodeExample
        label="o handshake de upgrade"
        language="plaintext"
        code={`GET /chat HTTP/1.1
Host: howtodev.site
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade

// a partir daqui, não é mais request/response — é um canal aberto:
// qualquer um dos dois lados manda mensagem a qualquer momento`}
      />
      <p>
        Depois do <code>101 Switching Protocols</code>, a conexão deixa de seguir o ciclo pergunta-resposta do HTTP.
        O servidor consegue mandar uma mensagem pro cliente no instante em que ela existe — sem esperar o cliente
        perguntar antes. É por isso que <code>ws://</code> (ou <code>wss://</code>, a versão sobre TLS) é a base de
        chat, notificação ao vivo, colaboração em tempo real e jogos multiplayer baseados em navegador.
      </p>

      <h2>Server-Sent Events (SSE) — quando só uma via já resolve</h2>
      <p>
        Nem todo caso precisa de comunicação nos dois sentidos. Um feed de notícias ao vivo ou um placar de jogo em
        tempo real só precisa que o <strong>servidor</strong> mande atualização pro cliente — o cliente nunca precisa
        responder nada pelo mesmo canal. Pra esse caso, <strong>Server-Sent Events</strong> é mais simples que
        WebSocket: continua sendo HTTP normal (sem upgrade de protocolo), só que a resposta nunca termina — o
        servidor vai escrevendo eventos novos nela conforme acontecem, e o navegador expõe isso via <code>EventSource</code>,
        já com reconexão automática embutida se a conexão cair.
      </p>
      <CodeExample
        label="resposta de um endpoint SSE"
        language="plaintext"
        code={`HTTP/1.1 200 OK
Content-Type: text/event-stream

data: {"placar": "1-0"}

data: {"placar": "1-1"}

// a conexão HTTP fica aberta; cada "data:" novo é um evento entregue
// ao cliente sem que ele precise pedir de novo`}
      />

      <Exercise
        prompt={
          <p>
            Um app de chat precisa mostrar "fulano está digitando..." em tempo real pros dois lados da conversa, e
            também um placar de jogo ao vivo que só é exibido, nunca interagido. Qual tecnologia faz mais sentido pra
            cada um, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Chat com indicador de "digitando": WebSocket — os dois lados
precisam ENVIAR eventos a qualquer momento (mensagem, indicador de
digitação), então precisa ser bidirecional de verdade.

Placar de jogo ao vivo: Server-Sent Events — só o servidor emite
atualização, o cliente nunca manda nada pelo mesmo canal. SSE
resolve com menos complexidade (é só HTTP comum) e ainda ganha
reconexão automática de graça via EventSource.`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/websocket">
        A implementação real de WebSocket usada em produção pelo padrão está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que HTTP puro (request/response) não é ideal para um chat em tempo real?",
            options: [
              "Porque o servidor não pode iniciar o envio de uma mensagem — o cliente precisaria ficar perguntando repetidamente se chegou algo novo",
              "Porque HTTP não suporta enviar texto, apenas arquivos binários",
              "Porque toda requisição HTTP obrigatoriamente fecha a conexão TCP depois da resposta, mesmo com keep-alive",
              "Porque o protocolo HTTP não permite que o servidor identifique de qual usuário veio a requisição",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual a principal diferença entre WebSocket e Server-Sent Events (SSE)?",
            options: [
              "SSE é mais rápido porque usa UDP em vez de TCP",
              "WebSocket só funciona em conexões HTTPS; SSE funciona em HTTP e HTTPS",
              "WebSocket é bidirecional (cliente e servidor enviam a qualquer momento); SSE é só do servidor para o cliente, sobre HTTP comum",
              "SSE substitui completamente a necessidade de um servidor, entregando dados direto de uma CDN",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
