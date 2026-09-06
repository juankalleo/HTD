import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-como-a-internet-funciona",
  title: "Como a internet funciona",
  summary: "O modelo cliente-servidor — a ideia mais básica por trás de literalmente todo site que você já visitou.",
  estimatedMinutes: 12,
};

export default function Licao01ComoAInternetFunciona() {
  return (
    <LessonBody>
      <p>
        Todo acesso a um site segue o mesmo modelo básico: um <strong>cliente</strong> (seu navegador, seu celular)
        manda uma <strong>requisição</strong> perguntando por alguma coisa; um <strong>servidor</strong> (um
        computador ligado 24 horas, em algum data center) processa e devolve uma <strong>resposta</strong>. Todo o
        resto que essa trilha ensina — DNS, HTTP, proxy, CDN — existe pra fazer essa troca simples acontecer de forma
        rápida, segura e confiável, em escala.
      </p>

      <NetworkDiagram
        height={220}
        nodes={[
          { id: "client", label: "Seu navegador", kind: "client", x: 15, y: 50 },
          { id: "server", label: "Servidor", kind: "server", x: 85, y: 50 },
        ]}
        hops={[
          { from: "client", to: "server", caption: "1. O navegador manda uma requisição: \"me dá a página /produtos\"." },
          { from: "server", to: "client", caption: "2. O servidor processa e devolve uma resposta: o HTML da página." },
        ]}
      />

      <h2>O que acontece entre o clique e a tela aparecer</h2>
      <CodeExample
        label="visão simplificada"
        language="plaintext"
        code={`1. Você digita howtodev.site e aperta Enter
2. O navegador precisa achar o ENDEREÇO desse nome (lição 3 — DNS)
3. O navegador abre uma conexão com o servidor nesse endereço
4. Manda uma requisição HTTP: "GET / " (lição 4)
5. O servidor processa e devolve uma resposta (o HTML da página)
6. O navegador desenha a página na tela`}
      />

      <h2>Não existe "a internet" como uma coisa só</h2>
      <p>
        A internet é uma rede de redes — milhões de computadores conectados por cabos, fibra óptica e rádio,
        conversando através de um conjunto de protocolos (regras combinadas) que todos concordam em seguir. Nenhuma
        empresa "é dona" da internet; ela funciona porque todo mundo implementa os mesmos protocolos.
      </p>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No modelo cliente-servidor, quem inicia a comunicação?",
            options: [
              "O servidor, mandando dado sem ser solicitado",
              "O cliente, mandando uma requisição — o servidor responde a ela",
              "Os dois ao mesmo tempo, sempre",
              "Depende do site, não tem um padrão",
            ],
            correctIndex: 1,
          },
          {
            question: "O que faz a internet funcionar de forma unificada, sem uma empresa dona dela?",
            options: [
              "Um único servidor central que controla tudo",
              "Todos os computadores conectados seguem os mesmos protocolos (regras combinadas) de comunicação",
              "Não existe unificação real, cada site é isolado",
              "A internet é controlada por um consórcio de governos",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
