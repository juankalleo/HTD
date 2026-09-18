import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-cabecalhos-http-essenciais",
  title: "Cabeçalhos HTTP essenciais: cache, CORS e cookies",
  summary: "A maior parte da 'política' de uma requisição não está no corpo — está em headers que você raramente lê.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao11CabecalhosHttpEssenciais() {
  return (
    <LessonBody>
      <p>
        Quando você chama <code>fetch()</code>, o navegador cuida de um monte de coisa por trás sem avisar — se pode
        reusar uma resposta em cache, se um site diferente tem permissão de ler essa resposta, se deve mandar o
        cookie de sessão junto. Tudo isso é decidido por <strong>headers</strong>, não pelo código que você escreveu.
      </p>

      <h2>Cache-Control e ETag — evitando repetir trabalho</h2>
      <CodeExample
        label="header de cache"
        language="plaintext"
        code={`Cache-Control: public, max-age=3600
// "pode guardar essa resposta em cache por 3600 segundos (1h);
// depois disso, precisa perguntar de novo ao servidor"

Cache-Control: no-store
// "nunca guarde isso em cache, nem localmente" — típico de dado sensível`}
      />
      <p>
        Quando o <code>max-age</code> expira, o navegador não precisa necessariamente baixar o arquivo inteiro de
        novo. Ele pode mandar o <code>ETag</code> (um identificador — geralmente um hash — que o servidor gerou da
        última vez) de volta, perguntando se ainda é válido:
      </p>
      <CodeExample
        label="revalidação com ETag"
        language="plaintext"
        code={`// primeira resposta do servidor
HTTP/1.1 200 OK
ETag: "a3f9e2"

// requisição seguinte, depois do cache expirar
GET /produtos HTTP/1.1
If-None-Match: "a3f9e2"

// se o conteúdo NÃO mudou:
HTTP/1.1 304 Not Modified
// (sem corpo — o navegador reusa a versão que já tinha)`}
      />

      <h2>CORS — por que um site não lê a resposta de outro por padrão</h2>
      <p>
        Por segurança, o navegador aplica a <strong>same-origin policy</strong>: JavaScript rodando em{" "}
        <code>app.exemplo.com</code> não consegue ler a resposta de uma requisição pra{" "}
        <code>api.outraempresa.com</code>, a menos que essa API explicitamente autorize, via header{" "}
        <code>Access-Control-Allow-Origin</code>. Sem CORS, qualquer site malicioso poderia usar sua sessão logada
        pra ler dados de outro serviço em seu nome.
      </p>
      <CodeExample
        label="resposta autorizando CORS"
        language="plaintext"
        code={`Access-Control-Allow-Origin: https://app.exemplo.com
Access-Control-Allow-Methods: GET, POST
Access-Control-Allow-Headers: Content-Type, Authorization`}
      />
      <p>
        Pra requisições que não são "simples" (métodos além de GET/POST básico, ou headers customizados como{" "}
        <code>Authorization</code>, ou <code>Content-Type: application/json</code>), o navegador manda um{" "}
        <strong>preflight request</strong> antes — um <code>OPTIONS</code> perguntando "essa requisição vai ser
        permitida?" — e só envia a requisição real se a resposta do preflight disser que sim.
      </p>

      <Exercise
        prompt={
          <p>
            Uma chamada <code>fetch</code> para <code>POST https://api.exemplo.com/pedidos</code>, com{" "}
            <code>Content-Type: application/json</code>, feita a partir de <code>https://app.exemplo.com</code>,
            dispara uma requisição <code>OPTIONS</code> antes da de verdade. Por que ela é considerada "não simples",
            e o que a API precisa responder pro navegador deixar a requisição real acontecer?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`"application/json" não está na pequena lista de content-types
considerados "simples" pelo CORS (só text/plain,
multipart/form-data e application/x-www-form-urlencoded entram
nessa lista) — então o navegador trata como requisição que precisa
de permissão explícita antes.

A API precisa responder o OPTIONS com:
  Access-Control-Allow-Origin: https://app.exemplo.com
  Access-Control-Allow-Methods: POST
  Access-Control-Allow-Headers: Content-Type

Só depois desse "sim" o navegador manda o POST de verdade com o
corpo JSON.`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/cors">
        A configuração de CORS usada no frontend do padrão está documentada no Padrão Frontend.
      </Callout>
      <Callout href="/padrao-api/seguranca/cors">
        A política de CORS do lado da API (quem pode chamar o quê) está documentada no Padrão API.
      </Callout>

      <h2>Set-Cookie e sessão — como o servidor "lembra" de você</h2>
      <p>
        HTTP não guarda estado entre requisições por conta própria — cada requisição chega "sem memória" da anterior.
        Login funciona porque o servidor manda um <code>Set-Cookie</code> na resposta, e o navegador reenvia esse
        valor automaticamente em toda requisição seguinte pro mesmo domínio.
      </p>
      <CodeExample
        label="Set-Cookie de uma sessão de login"
        language="plaintext"
        code={`Set-Cookie: sessao=abc123; HttpOnly; Secure; SameSite=Lax; Max-Age=86400`}
      />
      <CodeExample
        language="plaintext"
        code={`HttpOnly   → JavaScript no navegador não consegue ler esse cookie (reduz o
              impacto de um ataque XSS que tentasse roubar a sessão)
Secure     → só é enviado em conexões HTTPS, nunca em HTTP puro
SameSite   → controla se o cookie é enviado em requisições vindas de outro
              site (proteção contra CSRF)`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que uma resposta 304 Not Modified é útil no fluxo de cache?",
            options: [
              "Ela força o navegador a apagar imediatamente o conteúdo salvo em cache local",
              "Ela indica que o recurso pedido não existe mais no servidor e deve ser removido",
              "Ela substitui a necessidade de qualquer header de cache-control no restante da sessão",
              "Ela avisa o navegador que o conteúdo em cache ainda é válido, evitando reenviar o corpo inteiro do recurso de novo",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que um preflight request (OPTIONS) existe no CORS?",
            options: [
              "Pra criptografar o corpo da requisição antes de mandar pro servidor de destino",
              "Pra dar ao navegador uma chance de perguntar ao servidor se aquela requisição cross-origin é permitida, antes de enviar a requisição real com dados",
              "Pra reduzir a latência, já que OPTIONS é sempre mais rápido que a requisição original",
              "Pra validar se o domínio de destino possui um certificado TLS válido",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
