import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-tcp-vs-udp",
  title: "TCP vs UDP",
  summary: "Os dois jeitos de transportar dado pela rede — um garante entrega, o outro prioriza velocidade.",
  estimatedMinutes: 14,
};

export default function Licao05TcpVsUdp() {
  return (
    <LessonBody>
      <p>
        HTTP roda em cima de outro protocolo, que cuida do transporte real dos bytes pela rede. Existem dois
        principais, com filosofias opostas: <strong>TCP</strong> e <strong>UDP</strong>.
      </p>

      <h2>TCP — confiável, com handshake antes de qualquer dado</h2>
      <p>
        Antes de trocar qualquer dado de verdade, TCP faz um "aperto de mãos" de 3 passos pra garantir que os dois
        lados estão prontos:
      </p>

      <NetworkDiagram
        height={220}
        nodes={[
          { id: "client", label: "Cliente", kind: "client", x: 15, y: 50 },
          { id: "server", label: "Servidor", kind: "server", x: 85, y: 50 },
        ]}
        hops={[
          { from: "client", to: "server", caption: "1. SYN — \"quero abrir uma conexão\"" },
          { from: "server", to: "client", caption: "2. SYN-ACK — \"combinado, e eu também quero\"" },
          { from: "client", to: "server", caption: "3. ACK — \"confirmado\". A partir daqui, os dados fluem." },
        ]}
      />

      <p>
        Depois do handshake, TCP garante que todo pacote chega <strong>na ordem certa</strong>, e reenvia
        automaticamente qualquer pacote perdido no caminho. Esse cuidado extra tem um custo: mais round-trips, mais
        overhead — por isso TCP é ótimo pra "preciso que 100% do dado chegue certo" (carregar uma página, baixar um
        arquivo), mas não é o ideal quando um pacote atrasado é pior que um pacote perdido.
      </p>

      <h2>UDP — sem handshake, sem garantia, mas rápido</h2>
      <CodeExample
        label="UDP em uma frase"
        language="plaintext"
        code={`Manda o pacote e não espera confirmação nenhuma.
Se chegar, chegou. Se não chegar, ninguém reenvia automaticamente.`}
      />
      <p>
        Isso parece pior, mas é exatamente o que uma chamada de vídeo ou um jogo online querem: numa chamada, um
        frame de vídeo perdido de meio segundo atrás não vale a pena esperar — é melhor pular pro frame atual do que
        atrasar tudo esperando reenvio. É por isso que streaming ao vivo, chamada de voz/vídeo e jogos multiplayer
        usam UDP; carregamento de site, e-mail e transferência de arquivo usam TCP.
      </p>

      <CodeExample
        label="resumo"
        language="plaintext"
        code={`TCP                              UDP
Handshake antes de enviar        Sem handshake
Garante ordem e entrega          Sem garantia nenhuma
Mais lento (mais overhead)        Mais rápido
Site, e-mail, arquivo             Chamada de vídeo, jogo, streaming ao vivo`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que uma chamada de vídeo usa UDP em vez de TCP?",
            options: [
              "UDP é mais seguro",
              "Um pacote de vídeo perdido/atrasado é pior esperar reenvio do que simplesmente pular — velocidade importa mais que garantia total de entrega",
              "TCP não funciona com vídeo",
              "Não tem motivo técnico real",
            ],
            correctIndex: 1,
          },
          {
            question: "O que o handshake de 3 passos do TCP (SYN, SYN-ACK, ACK) garante antes de qualquer dado real trafegar?",
            options: [
              "Nada, é só formalidade",
              "Que os dois lados confirmaram que estão prontos pra trocar dado, antes de qualquer byte de conteúdo ser enviado",
              "Que a conexão será criptografada automaticamente",
              "Que o servidor tem espaço em disco suficiente",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
