import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-http-e-https",
  title: "HTTP e HTTPS",
  summary: "O protocolo que toda requisição de site usa — método, status code, header, e o \"S\" que criptografa tudo isso.",
  estimatedMinutes: 16,
};

export default function Licao04HttpEHttps() {
  return (
    <LessonBody>
      <h2>Uma requisição HTTP, de verdade</h2>
      <CodeExample
        label="requisição crua"
        language="plaintext"
        code={`GET /produtos HTTP/1.1
Host: howtodev.site
Accept: text/html
Cookie: sessao=abc123`}
      />
      <CodeExample
        label="resposta"
        language="plaintext"
        code={`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 4213

<html>...</html>`}
      />
      <p>
        Todo <code>fetch()</code>, todo carregamento de página, é essa troca de texto — método, cabeçalhos, e um
        corpo opcional — por trás de qualquer biblioteca que abstrai isso.
      </p>

      <h2>Os métodos HTTP mais comuns</h2>
      <CodeExample
        language="plaintext"
        code={`GET     → buscar dado, sem mudar nada no servidor
POST    → criar algo novo
PUT     → substituir um recurso inteiro
PATCH   → atualizar parcialmente
DELETE  → remover`}
      />

      <h2>Status code — a categoria já diz o tipo de resposta</h2>
      <CodeExample
        language="plaintext"
        code={`2xx → sucesso           (200 OK, 201 Created, 204 No Content)
3xx → redirecionamento  (301 Moved Permanently, 304 Not Modified)
4xx → erro do cliente   (400 Bad Request, 401 Unauthorized, 404 Not Found)
5xx → erro do servidor  (500 Internal Server Error, 503 Service Unavailable)`}
      />
      <p>
        Só olhando o primeiro dígito já dá pra saber de quem é o problema — <code>4xx</code> significa "você (cliente)
        pediu algo errado"; <code>5xx</code> significa "o servidor quebrou processando, mesmo com um pedido válido".
      </p>

      <h2>O "S" de HTTPS — criptografia, não um protocolo diferente</h2>
      <p>
        HTTPS é HTTP normal, rodando dentro de uma camada de criptografia chamada <strong>TLS</strong>. Sem HTTPS,
        qualquer um no meio do caminho (o Wi-Fi público da cafeteria, o provedor de internet) consegue{" "}
        <strong>ler e até alterar</strong> o conteúdo da requisição — senha, número de cartão, tudo em texto puro.
        Com TLS, o conteúdo é criptografado entre o navegador e o servidor; quem está no meio só vê dado ilegível.
      </p>
      <CodeExample
        label="o handshake TLS, resumido"
        language="plaintext"
        code={`1. Navegador: "Quero conexão segura, aqui estão os algoritmos que suporto"
2. Servidor: manda seu CERTIFICADO (prova de identidade, emitido por uma autoridade confiável)
3. Navegador valida o certificado e negocia uma chave de criptografia só pra essa sessão
4. A partir daqui, todo o tráfego HTTP normal é criptografado com essa chave`}
      />
      <p>
        O certificado é o que faz o navegador mostrar o cadeado — ele prova que você está falando com o servidor
        real de <code>howtodev.site</code>, não com um impostor interceptando a conexão.
      </p>

      <Callout href="/padrao-frontend/seguranca/cabecalhos-de-seguranca-http">
        Headers de segurança HTTP adicionais (HSTS, CSP, X-Frame-Options) que reforçam o HTTPS estão documentados no
        Padrão Frontend.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Um status 404 indica erro de quem?",
            options: [
              "Do servidor, sempre",
              "Do cliente — ele pediu um recurso que não existe (categoria 4xx = erro do cliente)",
              "Da rede, não do cliente nem do servidor",
              "404 não é um erro, é sucesso",
            ],
            correctIndex: 1,
          },
          {
            question: "O que o TLS (o 'S' de HTTPS) realmente faz?",
            options: [
              "É um protocolo completamente diferente do HTTP",
              "Criptografa a comunicação HTTP normal entre navegador e servidor, impedindo que quem está no meio leia ou altere o conteúdo",
              "Só torna o site mais rápido",
              "Substitui a necessidade de DNS",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
