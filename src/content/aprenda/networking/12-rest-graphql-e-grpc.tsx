import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-rest-graphql-e-grpc",
  title: "REST, GraphQL e gRPC: modelos de comunicação",
  summary: "Não existe 'o melhor' entre os três — cada um assume uma prioridade diferente sobre como uma API deve se comportar.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao12RestGraphqlEGrpc() {
  return (
    <LessonBody>
      <p>
        Os três resolvem o mesmo problema — cliente e servidor trocando dado estruturado pela rede — mas cada um
        parte de uma filosofia diferente sobre o que deve ser fácil e o que pode ser mais trabalhoso.
      </p>

      <h2>REST — o recurso é a unidade central</h2>
      <p>
        Numa API REST, cada URL identifica um <strong>recurso</strong> (<code>/usuarios/42</code>,{" "}
        <code>/usuarios/42/pedidos</code>), e o método HTTP diz a operação (GET busca, POST cria). O formato da
        resposta é fixo, decidido pelo servidor — o que é simples de cachear (URLs batem naturalmente com cache de
        CDN e navegador), mas pode obrigar o cliente a fazer várias requisições pra montar uma tela, ou receber campos
        que nem vai usar.
      </p>
      <CodeExample
        label="REST — buscar usuário e seus últimos pedidos"
        language="plaintext"
        code={`GET /usuarios/42
GET /usuarios/42/pedidos?limit=3

// duas idas ao servidor pra montar uma única tela`}
      />

      <h2>GraphQL — o cliente descreve a forma dos dados que quer</h2>
      <p>
        Com GraphQL existe um único endpoint, e é o <strong>cliente</strong> quem descreve exatamente quais campos
        precisa, numa única consulta — mesmo que os dados venham de relações diferentes no backend. Isso resolve o
        over-fetching e o under-fetching do exemplo acima, mas troca simplicidade de cache (tudo passa por POST no
        mesmo endpoint, então cache de CDN baseado em URL não funciona de graça) por uma camada de schema e
        resolvers que alguém precisa manter.
      </p>
      <CodeExample
        label="GraphQL — a mesma necessidade, numa consulta só"
        language="graphql"
        code={`query {
  usuario(id: 42) {
    nome
    pedidos(limit: 3) {
      id
      total
    }
  }
}`}
      />

      <h2>gRPC — contrato rígido, binário, pensado pra serviço-a-serviço</h2>
      <p>
        gRPC define um <strong>contrato</strong> explícito num arquivo <code>.proto</code>, serializa as mensagens em
        formato binário (Protocol Buffers, não texto) e roda sobre HTTP/2. O ganho é performance e tipagem forte
        entre serviços internos — mas o payload binário não dá pra inspecionar direto no navegador ou num{" "}
        <code>curl</code> simples, e chamar gRPC a partir de um navegador exige uma camada extra (grpc-web), o que o
        torna mais raro entre cliente e servidor voltado ao público.
      </p>
      <CodeExample
        label="contrato .proto"
        language="plaintext"
        code={`service PedidosService {
  rpc BuscarPedido (PedidoRequest) returns (PedidoResponse);
}

message PedidoRequest {
  int32 id = 1;
}`}
      />

      <h2>Quando cada um faz mais sentido</h2>
      <CodeExample
        language="plaintext"
        code={`REST     → API pública, consumida por muitos clientes diferentes,
            se beneficia de cache HTTP tradicional (CDN, navegador)
GraphQL  → clientes com necessidades de dados bem diferentes entre si
            (app mobile vs. painel web), evitando múltiplas idas ao servidor
gRPC     → comunicação interna entre microsserviços, onde performance e
            contrato tipado importam mais que legibilidade humana do payload`}
      />
      <p>
        Nenhum dos três é "sempre melhor" — GraphQL não elimina a necessidade de pensar em cache, e gRPC não é uma
        boa escolha só porque é rápido, se o consumidor da API é um navegador comum.
      </p>

      <Exercise
        prompt={
          <p>
            Uma API pública, consumida por parceiros externos que sua empresa não controla, precisa aproveitar cache
            de CDN o máximo possível pra reduzir custo de infraestrutura. Entre REST e GraphQL, qual tende a se
            encaixar melhor nesse requisito específico, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`REST tende a se encaixar melhor aqui. Como cada recurso tem sua
própria URL e normalmente usa GET, uma CDN consegue cachear a
resposta pela URL sem nenhum trabalho extra. GraphQL, por padrão,
manda toda consulta via POST para o mesmo endpoint único — o que
quebra o cache baseado em URL que CDNs tradicionais usam, exigindo
uma camada adicional de cache (por exemplo, no nível do resolver ou
usando "persisted queries") pra recuperar esse benefício.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual é o principal ganho do GraphQL em relação ao REST tradicional?",
            options: [
              "GraphQL sempre responde mais rápido porque usa um protocolo binário em vez de texto",
              "GraphQL elimina completamente a necessidade de autenticação nas requisições",
              "O cliente descreve exatamente os campos que precisa numa única consulta, evitando over-fetching e múltiplas idas ao servidor",
              "GraphQL substitui a necessidade de um banco de dados no lado do servidor",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que gRPC é mais comum em comunicação entre serviços internos do que entre navegador e servidor?",
            options: [
              "Porque usa serialização binária (Protocol Buffers) sobre HTTP/2, difícil de consumir direto no navegador sem uma camada adicional (grpc-web)",
              "Porque gRPC não suporta nenhum tipo de autenticação entre serviços",
              "Porque gRPC só funciona dentro da mesma máquina, nunca entre servidores diferentes",
              "Porque gRPC exige que o cliente e o servidor estejam na mesma versão do sistema operacional",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
