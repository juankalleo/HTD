import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-nextjs-app-router",
  title: "Next.js: o que é, App Router na prática",
  summary: "De 'React com mais passos' pra um framework com roteamento, servidor e build embutidos.",
  estimatedMinutes: 15,
};

export default function Licao05NextjsAppRouter() {
  return (
    <LessonBody>
      <p>
        React sozinho não decide como uma URL vira uma tela, nem onde o código roda (servidor ou navegador) — ele só
        renderiza componentes. O Next.js resolve exatamente essas duas perguntas, e o <strong>App Router</strong> (a
        pasta <code>app/</code>) é como ele faz isso hoje: <strong>a estrutura de pastas é o roteamento</strong>.
      </p>

      <Callout title="A partir daqui, sem editor ao vivo">
        App Router, Server Components e data fetching dependem de um servidor Node rodando de verdade — não dá pra
        simular isso num editor client-side como o das lições anteriores. Os exemplos abaixo são reais, mas
        estáticos.
      </Callout>

      <h2>Pasta vira rota</h2>
      <CodeExample
        label="estrutura de pastas"
        language="plaintext"
        code={`app/
  page.tsx           → /
  sobre/
    page.tsx          → /sobre
  produtos/
    page.tsx          → /produtos
    [id]/
      page.tsx        → /produtos/123  (id é dinâmico)
  layout.tsx           → chrome compartilhado por tudo dentro de app/`}
      />
      <p>
        Um arquivo <code>page.tsx</code> é o que torna uma pasta uma rota de verdade — uma pasta sem{" "}
        <code>page.tsx</code> não vira URL nenhuma (útil pra organizar código sem criar rota, ou pra agrupar rotas com
        um layout comum sem aparecer na URL, usando <code>(nome-do-grupo)</code>).
      </p>

      <h2>O componente de uma rota</h2>
      <CodeExample
        label="app/produtos/[id]/page.tsx"
        language="typescript"
        code={`type Props = { params: Promise<{ id: string }> };

export default async function ProdutoPage({ params }: Props) {
  const { id } = await params;
  return <h1>Produto {id}</h1>;
}`}
      />
      <p>
        Repare que o componente é <code>async</code> e <code>params</code> vem como <code>Promise</code> — é assim
        no Next.js 15+: toda rota é potencialmente assíncrona por padrão, porque ela pode buscar dado antes de
        renderizar (próxima lição).
      </p>

      <Callout href="/padrao-frontend/roteamento">
        Convenções completas de roteamento do padrão — rotas privadas, grupos, layouts aninhados — estão
        documentadas no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que faz uma pasta dentro de app/ virar uma rota de verdade?",
            options: [
              "O nome da pasta",
              "A presença de um arquivo page.tsx dentro dela",
              "Ela precisa estar registrada num arquivo de rotas separado",
              "Toda pasta já é uma rota automaticamente",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que os exemplos desta lição em diante não têm editor ao vivo?",
            options: [
              "Por preguiça de configurar",
              "App Router/Server Components dependem de um servidor Node real, que não roda num editor client-side",
              "Next.js não suporta live preview em nenhum lugar",
              "É só uma limitação temporária, sem motivo técnico",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
