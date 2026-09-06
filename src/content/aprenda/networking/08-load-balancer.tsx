import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-load-balancer",
  title: "Load balancer — distribuindo tráfego entre servidores",
  summary: "Quando um servidor não aguenta mais sozinho, a resposta raramente é 'um servidor maior'.",
  estimatedMinutes: 16,
};

export default function Licao08LoadBalancer() {
  return (
    <LessonBody>
      <p>
        Um servidor tem um teto de requisições que aguenta processar por segundo. Duas formas de crescer:{" "}
        <strong>escalar verticalmente</strong> (um servidor mais potente — tem limite físico e fica caro rápido) ou{" "}
        <strong>escalar horizontalmente</strong> (vários servidores idênticos, dividindo o trabalho). Um{" "}
        <strong>load balancer</strong> é a peça que torna a segunda opção possível — ele decide, a cada requisição,
        qual servidor vai atender.
      </p>

      <p>
        Repare que o load balancer fica conectado aos 3 servidores o tempo todo — a diferença entre uma requisição e
        outra é só qual dessas 3 conexões recebe o tráfego daquela vez.
      </p>

      <h2>Requisição 1 → Servidor A</h2>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "client", label: "Cliente", kind: "client", x: 12, y: 50 },
          { id: "lb", label: "Load Balancer", kind: "loadbalancer", x: 48, y: 50 },
          { id: "a", label: "Servidor A", kind: "server", x: 88, y: 18 },
          { id: "b", label: "Servidor B", kind: "server", x: 88, y: 50 },
          { id: "c", label: "Servidor C", kind: "server", x: 88, y: 82 },
        ]}
        edges={[
          { from: "client", to: "lb" },
          { from: "lb", to: "a" },
          { from: "lb", to: "b" },
          { from: "lb", to: "c" },
        ]}
        hops={[
          { from: "client", to: "lb", caption: "1. Requisição chega no load balancer, não direto num servidor." },
          { from: "lb", to: "a", caption: "2. LB escolhe o Servidor A (round-robin: a vez dele agora)." },
        ]}
      />

      <h2>Requisição 2 (logo em seguida) → Servidor B</h2>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "client", label: "Cliente", kind: "client", x: 12, y: 50 },
          { id: "lb", label: "Load Balancer", kind: "loadbalancer", x: 48, y: 50 },
          { id: "a", label: "Servidor A", kind: "server", x: 88, y: 18 },
          { id: "b", label: "Servidor B", kind: "server", x: 88, y: 50 },
          { id: "c", label: "Servidor C", kind: "server", x: 88, y: 82 },
        ]}
        edges={[
          { from: "client", to: "lb" },
          { from: "lb", to: "a" },
          { from: "lb", to: "b" },
          { from: "lb", to: "c" },
        ]}
        hops={[
          { from: "client", to: "lb", caption: "1. Uma NOVA requisição chega — o cliente nem percebe a troca." },
          { from: "lb", to: "b", caption: "2. Round-robin: agora é a vez do Servidor B — distribui a carga entre os 3." },
        ]}
      />

      <h2>Estratégias de distribuição</h2>
      <CodeExample
        language="plaintext"
        code={`Round-robin        → alterna entre os servidores em sequência (A, B, C, A, B, C...)
Least connections   → manda pro servidor com menos conexões ativas no momento
IP hash              → o mesmo cliente sempre cai no mesmo servidor (útil sem sessão compartilhada)`}
      />

      <h2>Health check — o LB precisa saber quem está de pé</h2>
      <CodeExample
        label="nginx como load balancer"
        language="plaintext"
        code={`upstream backend {
  server 10.0.0.1:3000;
  server 10.0.0.2:3000;
  server 10.0.0.3:3000 max_fails=3 fail_timeout=30s;
}

server {
  location / {
    proxy_pass http://backend;
  }
}`}
      />
      <p>
        Se o Servidor C parar de responder, o load balancer precisa <strong>parar de mandar tráfego pra ele</strong>{" "}
        automaticamente (via health check periódico) — senão parte das requisições dos usuários cairia num servidor
        morto.
      </p>

      <Exercise
        prompt={
          <p>
            Com 3 servidores atrás de um load balancer, cada um guardando sessão de login só na própria memória
            (sem banco compartilhado), o que pode dar errado com a estratégia round-robin?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Um usuário pode logar no Servidor A (sessão salva só lá), e na
próxima requisição o round-robin manda ele pro Servidor B — que
nunca viu aquela sessão, e trata o usuário como deslogado. Soluções:
usar "IP hash" (mesmo cliente sempre no mesmo servidor) ou, melhor,
guardar sessão num lugar compartilhado (Redis) que qualquer servidor
consiga ler.`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/load-balancer">
        A configuração real de load balancer usada em produção pelo padrão, incluindo health check, está documentada
        no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre escalar verticalmente e horizontalmente?",
            options: [
              "São sinônimos",
              "Vertical = um servidor mais potente; horizontal = vários servidores idênticos dividindo o trabalho, coordenados por um load balancer",
              "Vertical é sempre mais barato",
              "Horizontal só funciona com banco de dados",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que um load balancer precisa de health check?",
            options: [
              "Só para gerar relatório",
              "Pra parar de mandar tráfego automaticamente pra um servidor que parou de responder, evitando que usuários caiam num servidor morto",
              "Health check é opcional e raramente usado",
              "Serve só pra medir velocidade da rede",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
