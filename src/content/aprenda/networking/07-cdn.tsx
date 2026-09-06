import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-cdn",
  title: "CDN — conteúdo mais perto do usuário",
  summary: "Por que um site global não serve tudo de um único servidor — e o que muda entre cache hit e cache miss.",
  estimatedMinutes: 16,
};

export default function Licao07Cdn() {
  return (
    <LessonBody>
      <p>
        Se o servidor de um site mora nos EUA, um visitante no Brasil espera a viagem completa até lá e volta — a
        velocidade da luz numa fibra óptica já impõe um limite físico real. Uma <strong>CDN</strong> (Content
        Delivery Network) resolve isso espalhando cópias do conteúdo em servidores ("edges") por várias regiões do
        mundo — o visitante fala com o edge mais próximo, não com a origem.
      </p>

      <p>
        Os dois cenários abaixo usam a mesma topologia — visitante, edge mais próximo, origem lá longe — só muda
        até onde a requisição precisa viajar.
      </p>

      <h2>Cenário 1 — Cache HIT (o edge já tem o arquivo)</h2>
      <NetworkDiagram
        height={220}
        nodes={[
          { id: "client", label: "Visitante (BR)", kind: "client", x: 10, y: 50 },
          { id: "edge", label: "Edge CDN (São Paulo)", kind: "cdn", x: 50, y: 50 },
          { id: "origin", label: "Origem (EUA)", kind: "server", x: 90, y: 50 },
        ]}
        edges={[
          { from: "client", to: "edge" },
          { from: "edge", to: "origin" },
        ]}
        hops={[
          { from: "client", to: "edge", caption: "1. Requisição vai pro edge mais próximo — não pra origem." },
          { from: "edge", to: "client", caption: "2. Cache HIT: o edge já tinha o arquivo guardado e responde na hora, sem acionar a origem." },
        ]}
      />

      <h2>Cenário 2 — Cache MISS (o edge precisa buscar na origem)</h2>
      <NetworkDiagram
        height={220}
        nodes={[
          { id: "client", label: "Visitante (BR)", kind: "client", x: 10, y: 50 },
          { id: "edge", label: "Edge CDN (São Paulo)", kind: "cdn", x: 50, y: 50 },
          { id: "origin", label: "Origem (EUA)", kind: "server", x: 90, y: 50 },
        ]}
        edges={[
          { from: "client", to: "edge" },
          { from: "edge", to: "origin" },
        ]}
        hops={[
          { from: "client", to: "edge", caption: "1. Requisição chega no edge." },
          { from: "edge", to: "origin", caption: "2. Cache MISS: o edge não tem esse arquivo ainda, busca na origem." },
          { from: "origin", to: "edge", caption: "3. Origem responde; o edge GUARDA uma cópia antes de repassar." },
          { from: "edge", to: "client", caption: "4. Edge entrega ao visitante — e da próxima vez, será HIT." },
        ]}
      />

      <p>
        Depois de um MISS, o mesmo arquivo já fica em cache naquele edge — o próximo visitante da mesma região
        recebe um HIT, sem a viagem até a origem de novo.
      </p>

      <h2>O que uma CDN normalmente NÃO cacheia</h2>
      <CodeExample
        language="plaintext"
        code={`Bom pra CDN: imagem, CSS, JS, vídeo, fonte — arquivo que não muda por usuário
Ruim pra CDN: resposta de API personalizada por usuário, dado de sessão,
              conteúdo que muda a cada requisição sem um cache-control explícito`}
      />
      <CodeExample
        label="header que controla isso"
        language="plaintext"
        code={`Cache-Control: public, max-age=31536000, immutable
// "pode cachear, guarda por 1 ano, esse conteúdo nunca muda"
// — típico de um arquivo com hash no nome (logo.a3f9e2.png)`}
      />

      <Exercise
        prompt={
          <p>
            Um arquivo <code>app.a3f9e2.js</code> (com hash no nome, gerado pelo build) pode usar{" "}
            <code>Cache-Control: immutable</code> com segurança. Por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Porque o hash no nome muda toda vez que o CONTEÚDO do arquivo muda —
uma nova versão do JS gera um nome de arquivo diferente
(app.f8b3c1.js). Isso significa que "app.a3f9e2.js" especificamente
NUNCA vai mudar de conteúdo — pode ficar em cache pra sempre com
segurança, sem risco de servir uma versão desatualizada.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual o principal ganho de uma CDN pra um visitante longe do servidor de origem?",
            options: [
              "Nenhum, a distância não importa pra rede",
              "O visitante fala com um edge geograficamente mais próximo em vez da origem, reduzindo a distância (e o tempo) da viagem",
              "CDN só serve pra economizar dinheiro do dono do site",
              "CDN substitui completamente a necessidade de um servidor de origem",
            ],
            correctIndex: 1,
          },
          {
            question: "O que acontece num cache MISS num edge de CDN?",
            options: [
              "O visitante recebe um erro",
              "O edge busca o conteúdo na origem, guarda uma cópia em cache, e entrega — o próximo visitante daquela região recebe um HIT",
              "A requisição é descartada silenciosamente",
              "MISS significa que o site está fora do ar",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
