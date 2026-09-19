import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-cabecalhos-de-seguranca-http",
  title: "Cabeçalhos HTTP que blindam sua aplicação",
  summary: "Um punhado de headers de resposta faz o navegador da vítima recusar sozinho boa parte dos ataques mais comuns.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao13CabecalhosDeSegurancaHttp() {
  return (
    <LessonBody>
      <p>
        Além de tudo que já foi visto (sanitização, hashing, autorização), existe uma camada extra de defesa que
        vive inteiramente em <strong>headers de resposta</strong> — instruções que o servidor manda pro navegador
        seguir, mesmo que alguma outra defesa falhe antes. Nenhum desses headers substitui as defesas anteriores;
        eles são justamente a "defesa em profundidade" da lição 1 em forma concreta.
      </p>

      <h2>Content-Security-Policy — uma segunda camada contra XSS</h2>
      <p>
        A lição 7 mostrou como escapar/sanitizar input evita XSS. <code>Content-Security-Policy</code> (CSP) é uma
        camada <strong>adicional</strong>: mesmo que um script malicioso consiga, de algum jeito, se infiltrar na
        página, o CSP diz ao navegador exatamente de quais origens ele tem permissão de carregar e executar script —
        um script injetado inline, ou vindo de um domínio não listado, é simplesmente recusado pelo navegador antes
        de rodar.
      </p>
      <CodeExample
        label="header CSP restringindo origem de script"
        language="plaintext"
        code={`Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.exemplo.com`}
      />
      <p>
        <code>default-src 'self'</code> diz "por padrão, só carregue recursos do próprio domínio";{" "}
        <code>script-src</code> refina isso especificamente pra scripts, permitindo também um CDN confiável. Um
        script injetado via XSS, hospedado em <code>atacante.com</code> ou inserido inline sem estar na lista
        permitida, é bloqueado pelo navegador mesmo que tenha passado por toda sanitização do servidor — é
        literalmente uma segunda chance depois que a primeira falhou.
      </p>

      <h2>X-Frame-Options — evitando clickjacking</h2>
      <p>
        <strong>Clickjacking</strong> é um ataque que não injeta código nenhum — ele engana visualmente. O atacante
        embute o site legítimo (ex.: <code>banco.com/transferir</code>) dentro de um <code>&lt;iframe&gt;</code>{" "}
        invisível (opacidade zero), posicionado exatamente sobre um botão inofensivo de uma página que ele controla
        ("Clique aqui para ganhar um prêmio"). A vítima acha que está clicando no botão do prêmio, mas na verdade
        está clicando no botão real de <code>banco.com</code>, escondido embaixo — e, como o iframe carrega a página
        legítima de verdade, o cookie de sessão da vítima vai junto normalmente.
      </p>
      <CodeExample
        label="header impedindo que o site seja embutido em iframe"
        language="plaintext"
        code={`X-Frame-Options: DENY
// ou, permitindo iframe só do próprio domínio:
X-Frame-Options: SAMEORIGIN`}
      />
      <p>
        Com <code>DENY</code>, o navegador simplesmente recusa renderizar a página dentro de qualquer{" "}
        <code>&lt;iframe&gt;</code>, não importa de qual site — o truque do iframe invisível deixa de funcionar
        porque não existe mais nada pra sobrepor.
      </p>

      <h2>X-Content-Type-Options — impedindo o navegador de "adivinhar" o tipo de arquivo</h2>
      <p>
        Por padrão, alguns navegadores tentam "adivinhar" o tipo real de um arquivo servido, mesmo que o servidor já
        tenha declarado um <code>Content-Type</code> — um comportamento chamado <em>MIME sniffing</em>. Isso vira
        risco quando um arquivo pensado como inofensivo (uma imagem enviada por um usuário, por exemplo) é
        reinterpretado pelo navegador como HTML/JavaScript executável, abrindo mais uma via de XSS indireta.
      </p>
      <CodeExample label="desativando esse comportamento" language="plaintext" code={`X-Content-Type-Options: nosniff`} />

      <h2>O antes e depois, lado a lado</h2>
      <Compare
        badLabel="Resposta sem headers de proteção"
        goodLabel="Resposta com headers de proteção"
        bad={
          <CodeExample
            language="plaintext"
            code={`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 4821`}
          />
        }
        good={
          <CodeExample
            language="plaintext"
            code={`HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 4821
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff`}
          />
        }
      />

      <Exercise
        prompt={
          <p>
            Um site de banco não tem <code>X-Frame-Options</code> configurado. Um atacante cria uma página com um{" "}
            <code>&lt;iframe&gt;</code> invisível carregando <code>banco.com/transferir?valor=5000&destino=atacante</code>,
            posicionado sobre um botão falso de "Baixar cupom". Explique por que isso funciona mesmo que{" "}
            <code>banco.com</code> tenha proteção CSRF via token — e o que o header resolveria.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Funciona porque clickjacking não FALSIFICA uma requisição nova
(como CSRF) — ele faz a vítima interagir com a página REAL de
banco.com, carregada de verdade dentro do iframe invisível. O token
CSRF está lá, correto, porque a página é genuína; só a aparência
visual foi manipulada pra vítima clicar sem perceber o que estava
fazendo. Proteção contra falsificação de requisição não ajuda quando
a requisição não foi falsificada — foi um clique real, só que
induzido por engano visual.

X-Frame-Options: DENY resolveria porque impede que o navegador
renderize banco.com dentro de QUALQUER iframe — o ataque inteiro
depende de conseguir sobrepor a página real sobre o conteúdo
enganoso, e isso deixa de ser possível.`}
      />

      <Callout href="/padrao-frontend/seguranca/cabecalhos-de-seguranca-http">
        O conjunto completo de headers de segurança exigidos pelo padrão em toda resposta HTTP está documentado no
        Padrão Frontend.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/csp">
        A política de CSP detalhada do padrão — diretivas usadas e como evoluir sem quebrar recursos legítimos —
        está documentada no Padrão Frontend.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/clickjacking">
        A defesa completa contra clickjacking do padrão está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que o CSP é descrito como uma 'segunda camada' contra XSS, e não a defesa principal?",
            options: [
              "Porque ele age como reforço mesmo se um script malicioso já tiver se infiltrado na página — o navegador ainda recusa executar script de origem não permitida, independente da sanitização do servidor ter falhado ou não",
              "Porque CSP substitui completamente a necessidade de sanitizar input no servidor",
              "Porque CSP só funciona em navegadores muito antigos, sendo irrelevante hoje",
              "Porque CSP impede exclusivamente ataques de SQL injection, não XSS",
            ],
            correctIndex: 0,
          },
          {
            question: "O que torna o clickjacking diferente de CSRF, mesmo os dois envolvendo enganar a vítima?",
            options: [
              "Clickjacking sempre exige roubo prévio do cookie de sessão; CSRF nunca depende do cookie",
              "Clickjacking só funciona em conexões HTTP, nunca em HTTPS; CSRF funciona nos dois",
              "Clickjacking não falsifica nenhuma requisição — ele engana a vítima a interagir de verdade com a página legítima, escondida visualmente sob um conteúdo enganoso; CSRF faz o navegador enviar uma requisição forjada",
              "Clickjacking é bloqueado automaticamente por qualquer política de SameSite no cookie",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
