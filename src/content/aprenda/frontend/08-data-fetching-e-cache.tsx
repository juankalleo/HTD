import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-data-fetching-e-cache",
  title: "Data fetching e cache",
  summary: "Buscar dado direto no componente de servidor, e por que TanStack Query entra no client depois disso.",
  estimatedMinutes: 16,
};

export default function Licao08DataFetchingECache() {
  return (
    <LessonBody>
      <h2>No servidor: fetch direto no componente</h2>
      <p>
        Como a página inteira já roda no servidor por padrão (lição anterior), buscar dado é só um{" "}
        <code>await</code> dentro do componente — sem <code>useEffect</code>, sem estado de loading manual.
      </p>
      <CodeExample
        label="app/produtos/page.tsx"
        language="typescript"
        code={`async function getProdutos() {
  const res = await fetch("https://api.exemplo.com/produtos", {
    next: { revalidate: 60 }, // cache por 60s, depois revalida
  });
  return res.json();
}

export default async function ProdutosPage() {
  const produtos = await getProdutos();
  return <ProdutosList produtos={produtos} />;
}`}
      />
      <p>
        <code>next: {"{ revalidate: 60 }"}</code> é o cache do próprio Next.js: a resposta fica guardada por 60
        segundos antes de buscar de novo, sem você escrever lógica de cache nenhuma.
      </p>

      <h2>No client: por que ainda existe TanStack Query</h2>
      <p>
        Fetch no servidor resolve a carga inicial da página. Mas e uma ação do usuário depois disso — curtir um post,
        editar um formulário, recarregar uma lista sem dar refresh na página inteira? Isso já é interação, então já é
        client-side — e é aí que entra o <strong>TanStack Query</strong>: cache de requisição no navegador,
        invalidação, retry automático, sem reinventar isso na mão.
      </p>
      <CodeExample
        label="Client Component"
        language="typescript"
        code={`"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function usePosts() {
  return useQuery({ queryKey: ["posts"], queryFn: () => fetch("/api/posts").then((r) => r.json()) });
}

function useLikePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => fetch(\`/api/posts/\${id}/like\`, { method: "POST" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["posts"] }),
  });
}`}
      />
      <p>
        A regra prática: <strong>fetch direto no servidor</strong> pra carga inicial de página; <strong>TanStack
        Query</strong> pra qualquer coisa que precisa reagir a uma ação do usuário depois que a página já carregou.
      </p>

      <Callout href="/padrao-frontend/tecnologias/react-query">
        Convenções de query key, invalidação e mutation do padrão estão documentadas no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Pra carga inicial de uma página, qual é a forma mais direta de buscar dado no App Router?",
            options: [
              "useEffect + fetch dentro de um Client Component",
              "await fetch(...) direto dentro do Server Component da página",
              "Sempre via TanStack Query",
              "Não dá pra buscar dado na página inicial",
            ],
            correctIndex: 1,
          },
          {
            question: "Quando faz sentido usar TanStack Query em vez de só um fetch no servidor?",
            options: [
              "Nunca, é redundante",
              "Quando a busca/atualização acontece por uma ação do usuário depois que a página já carregou",
              "Só em projetos muito grandes",
              "TanStack Query substitui o servidor inteiro",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
