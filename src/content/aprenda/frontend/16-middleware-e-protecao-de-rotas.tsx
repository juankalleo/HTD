import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-middleware-e-protecao-de-rotas",
  title: "Middleware e proteção de rotas",
  summary: "Um grupo (dashboard) organiza o layout de rotas autenticadas — mas nada nele impede alguém de acessar a URL direto sem sessão.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao16MiddlewareEProtecaoDeRotas() {
  return (
    <LessonBody>
      <p>
        Na lição sobre grupos de rota, um grupo como <code>(dashboard)</code> organiza o layout de telas autenticadas
        — mas isso é só organização visual. Nada nesse grupo impede alguém de digitar <code>/relatorios</code> direto
        na barra de endereço sem estar logado. Checar sessão de verdade é outro problema, e o Next.js resolve isso com{" "}
        <code>middleware.ts</code>.
      </p>

      <h2>middleware.ts — roda antes da rota renderizar</h2>
      <p>
        Um arquivo <code>middleware.ts</code> na raiz do projeto exporta uma função que intercepta requisições{" "}
        <strong>antes</strong> de qualquer <code>page.tsx</code> renderizar. Ele pode deixar a requisição seguir,
        redirecionar, ou reescrever a URL.
      </p>
      <CodeExample
        label="middleware.ts"
        language="typescript"
        code={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next(); // segue normalmente pra rota pedida
}`}
      />

      <h2>Checando sessão antes de renderizar</h2>
      <p>
        O exemplo acima só verifica se o cookie <code>session</code> existe — uma checagem rápida, sem consultar
        banco de dados. Isso é proposital: o middleware do Next.js roda no <strong>Edge Runtime</strong> por padrão,
        um ambiente mais restrito que o Node.js completo, então validações pesadas (decodificar um JWT complexo,
        bater num banco relacional) costumam ficar melhor no próprio layout ou página protegida, depois que o
        middleware já barrou o caso óbvio de "nem tem cookie nenhum".
      </p>

      <h2>config.matcher — só rodar onde importa</h2>
      <p>
        Sem um <code>matcher</code>, o middleware roda em <strong>toda</strong> requisição — inclusive pedidos de
        imagem, fonte, arquivo estático. O <code>config.matcher</code> limita isso às rotas que de fato precisam da
        checagem.
      </p>
      <CodeExample
        label="middleware.ts — limitando o escopo"
        language="typescript"
        code={`export const config = {
  matcher: ["/dashboard/:path*", "/relatorios/:path*"],
};`}
      />

      <Exercise
        prompt={
          <p>
            Escreva um <code>middleware.ts</code> que protege qualquer rota abaixo de <code>/dashboard</code>,
            redirecionando pra <code>/login</code> quando não existir um cookie chamado <code>token</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Quando o middleware.ts roda em relação à renderização da página?",
            options: [
              "Depois que o Server Component da página já terminou de renderizar",
              "Só depois que o usuário interage com algum botão da página",
              "Só em ambiente de desenvolvimento, nunca em produção",
              "Antes — ele intercepta a requisição e pode redirecionar sem nunca chegar a renderizar o componente da rota",
            ],
            correctIndex: 3,
          },
          {
            question: "Pra que serve o config.matcher num middleware.ts?",
            options: [
              "Definir o schema de validação Zod usado pelo middleware",
              "Limitar em quais rotas o middleware roda, evitando executá-lo em toda requisição, inclusive assets estáticos",
              "Escolher qual banco de dados o middleware vai consultar",
              "Substituir o layout.tsx daquele grupo de rotas",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
