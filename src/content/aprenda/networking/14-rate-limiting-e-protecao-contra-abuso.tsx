import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-rate-limiting-e-protecao-contra-abuso",
  title: "Rate limiting e proteção contra abuso",
  summary: "Sem limite de requisição, um único cliente mal-intencionado (ou um bug num script) consegue derrubar a API pra todo mundo.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao14RateLimitingEProtecaoContraAbuso() {
  return (
    <LessonBody>
      <p>
        Praticamente toda API pública limita quantas requisições um mesmo cliente pode fazer num intervalo de tempo.
        Não é paranoia: sem limite, um script com bug rodando em loop, um scraper agressivo, ou uma tentativa de
        força bruta contra login conseguem consumir toda a capacidade do servidor — prejudicando todos os outros
        usuários legítimos ao mesmo tempo.
      </p>

      <h2>Token bucket — a ideia mais comum por trás do rate limit</h2>
      <p>
        Um jeito simples (e muito usado) de implementar limite de requisição é o <strong>token bucket</strong>: existe
        um "balde" com capacidade fixa de tokens; cada requisição consome um token; o balde recarrega a uma taxa
        constante. Sem token disponível, a requisição é recusada — mas o balde permite uma rajada momentânea de
        requisições (até a capacidade do balde), não só uma taxa média rígida.
      </p>
      <CodeExample
        label="token bucket, em pseudocódigo"
        language="plaintext"
        code={`capacidade = 10           // até 10 requisições em rajada
tokens = 10
taxa_recarga = 1/segundo  // 1 token novo a cada segundo

a cada requisição recebida:
  se tokens > 0:
    tokens = tokens - 1
    processa a requisição normalmente
  senão:
    responde 429 Too Many Requests`}
      />

      <h2>429 Too Many Requests — o status pensado pra isso</h2>
      <CodeExample
        label="resposta de rate limit"
        language="plaintext"
        code={`HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{"error": "Limite de requisições excedido. Tente novamente em 30 segundos."}`}
      />
      <p>
        O header <code>Retry-After</code> diz explicitamente ao cliente quanto tempo esperar antes de tentar de novo
        — evitando que ele fique tentando imediatamente em loop, o que só pioraria a situação.
      </p>

      <h2>Onde aplicar o limite</h2>
      <CodeExample
        label="nginx aplicando limite por IP"
        language="plaintext"
        code={`limit_req_zone $binary_remote_addr zone=api:10m rate=5r/s;

server {
  location /api/ {
    limit_req zone=api burst=10 nodelay;
    proxy_pass http://backend;
  }
}`}
      />
      <p>
        O limite normalmente é aplicado <strong>por cliente</strong> (IP, chave de API, ou usuário autenticado), não
        de forma global — senão um único cliente abusivo derrubaria a cota de todo mundo. Pode viver no proxy
        reverso (como no exemplo acima), na própria aplicação, ou num serviço dedicado com contador compartilhado
        (Redis costuma ser a escolha, já que vários servidores atrás de um load balancer precisam enxergar a mesma
        contagem).
      </p>

      <Exercise
        prompt={
          <p>
            Por que um endpoint de login geralmente precisa de um limite de requisição bem mais rígido do que um
            endpoint público de leitura, tipo listar produtos de uma loja?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`O endpoint de login é alvo direto de ataques de força bruta —
alguém tentando adivinhar senha de uma conta específica testando
várias combinações rapidamente. Um limite rígido (poucas tentativas
por IP/conta em um período curto) torna esse tipo de ataque
impraticável. Já o endpoint de listar produtos não expõe uma
credencial pra "adivinhar" — o limite ali existe mais pra evitar
scraping agressivo ou sobrecarga acidental, então pode tolerar um
volume de requisição bem maior sem risco equivalente.`}
      />

      <Callout href="/padrao-api/seguranca/forca-bruta-e-bloqueio">
        A estratégia real de rate limiting e bloqueio contra força bruta usada em produção pelo padrão está
        documentada no Padrão API.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a ideia central do algoritmo de token bucket para rate limiting?",
            options: [
              "Um balde com um número limitado de tokens é consumido a cada requisição e recarregado a uma taxa fixa — sem token disponível, a requisição é rejeitada",
              "Cada IP recebe uma cota fixa por mês, sem nenhuma recarga até o próximo ciclo de cobrança",
              "O servidor bloqueia permanentemente qualquer IP que exceda o limite uma única vez",
              "As requisições são enfileiradas e processadas em ordem, sem nenhuma rejeitada",
            ],
            correctIndex: 0,
          },
          {
            question: "O que o status 429 Too Many Requests comunica ao cliente?",
            options: [
              "Que o servidor está fora do ar temporariamente por manutenção programada",
              "Que a requisição foi bloqueada por um firewall, sem relação com limite de uso",
              "Que ele excedeu o limite de requisições permitido, e deve tentar de novo depois (frequentemente indicado pelo header Retry-After)",
              "Que o cliente precisa se autenticar novamente antes de repetir a requisição",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
