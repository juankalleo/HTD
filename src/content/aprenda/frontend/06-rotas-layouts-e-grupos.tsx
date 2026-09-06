import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-rotas-layouts-e-grupos",
  title: "Rotas, layouts e pastas privadas/públicas",
  summary: "layout.tsx, grupos de rota (auth)/(dashboard), e como separar telas públicas de autenticadas.",
  estimatedMinutes: 15,
};

export default function Licao06RotasLayoutsEGrupos() {
  return (
    <LessonBody>
      <h2>layout.tsx — chrome que persiste entre navegações</h2>
      <p>
        Um <code>layout.tsx</code> envolve todas as rotas dentro da sua pasta e <strong>não remonta</strong> quando
        você navega entre elas — perfeito pra uma sidebar ou navbar que não deveria "piscar" a cada clique.
      </p>
      <CodeExample
        label="app/(dashboard)/layout.tsx"
        language="typescript"
        code={`export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}`}
      />

      <h2>Grupos de rota — organizar sem afetar a URL</h2>
      <p>
        Uma pasta entre parênteses, tipo <code>(auth)</code>, agrupa rotas e permite um layout compartilhado só pra
        elas — mas o nome do grupo <strong>não entra na URL</strong>.
      </p>
      <CodeExample
        label="estrutura de pastas"
        language="plaintext"
        code={`app/
  (auth)/
    layout.tsx        → só se aplica às rotas abaixo
    login/
      page.tsx        → /login  (não /auth/login)
    cadastro/
      page.tsx        → /cadastro
  (dashboard)/
    layout.tsx        → sidebar + navbar autenticados
    relatorios/
      page.tsx        → /relatorios`}
      />
      <p>
        É assim que uma aplicação separa "tela pública com layout de login" de "tela autenticada com sidebar" sem
        duplicar rota nenhuma — cada grupo tem seu próprio <code>layout.tsx</code>, e o Next.js decide qual usar pela
        pasta, não por uma configuração central de rotas.
      </p>

      <Exercise
        prompt={
          <p>
            Desenhe (em texto, como no exemplo acima) a estrutura de pastas pra uma rota pública <code>/</code> e uma
            rota autenticada <code>/perfil</code>, cada uma com seu próprio grupo e layout.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`app/
  (public)/
    layout.tsx
    page.tsx          → /
  (app)/
    layout.tsx
    perfil/
      page.tsx        → /perfil`}
      />

      <Callout href="/padrao-frontend/roteamento">
        A separação real entre rotas públicas e privadas do HTD — incluindo onde entra a checagem de sessão — está
        documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Uma pasta chamada (auth) na URL vira...",
            options: ["/auth/login", "/login — o nome do grupo não aparece na URL", "Erro de build", "/(auth)/login"],
            correctIndex: 1,
          },
          {
            question: "Por que usar layout.tsx em vez de repetir a sidebar em cada page.tsx?",
            options: [
              "Não tem diferença nenhuma",
              "O layout não remonta ao navegar entre rotas filhas, então a sidebar não pisca",
              "layout.tsx é mais rápido de escrever, só isso",
              "page.tsx não pode conter componentes visuais",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
