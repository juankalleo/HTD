import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-server-actions",
  title: "Server Actions: mutação sem API route",
  summary: "Antes, toda mutação exigia criar uma API route e chamar fetch nela. Agora um form pode chamar uma função de servidor direto.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao15ServerActions() {
  return (
    <LessonBody>
      <p>
        Historicamente, qualquer mutação — criar, editar, apagar algo — significava criar um endpoint (
        <code>route.ts</code>) e chamar ele via <code>fetch</code> do client, como no projeto guiado da lição 10.
        Server Actions permitem pular essa etapa: uma função marcada com <code>"use server"</code> pode ser chamada
        direto por um componente, inclusive como <code>action</code> de um <code>{"<form>"}</code>.
      </p>

      <h2>"use server" — uma função que roda no servidor</h2>
      <CodeExample
        label="app/tarefas/actions.ts"
        language="typescript"
        code={`"use server";

import { revalidatePath } from "next/cache";

export async function criarTarefa(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  if (!titulo || titulo.length < 3) throw new Error("Título muito curto");

  await db.tarefa.create({ data: { titulo } });
  revalidatePath("/tarefas"); // invalida o cache da rota, próxima visita busca dado novo
}`}
      />
      <p>
        Essa função nunca vira JavaScript enviado ao navegador — o Next.js gera, por baixo dos panos, uma requisição
        que executa ela no servidor. <code>revalidatePath</code> avisa o Next que os dados daquela rota mudaram, sem
        você reimplementar cache manualmente.
      </p>

      <h2>Form chamando a Server Action direto</h2>
      <CodeExample
        label="app/tarefas/nova-tarefa-form.tsx"
        language="typescript"
        code={`import { criarTarefa } from "./actions";

export function NovaTarefaForm() {
  return (
    <form action={criarTarefa} className="flex gap-2">
      <input name="titulo" placeholder="Nova tarefa" className="flex-1 border rounded-lg px-3 py-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Adicionar
      </button>
    </form>
  );
}`}
      />
      <p>
        Repare que <code>NovaTarefaForm</code> nem precisa de <code>"use client"</code> aqui — não há{" "}
        <code>onSubmit</code>, <code>useState</code> nem <code>fetch</code> manual. O <code>action={"{criarTarefa}"}</code>{" "}
        é a submissão real do formulário; o Next.js conecta isso à Server Action.
      </p>

      <h2>Quando ainda faz sentido ter uma API route de verdade</h2>
      <p>
        Server Actions são pensadas pra mutações chamadas pela sua própria UI React. Uma API route continua sendo a
        peça certa quando quem consome a mutação <strong>não é o seu próprio app Next</strong> — um webhook de um
        serviço de pagamento, um aplicativo mobile separado, uma integração pública de terceiros. Nesses casos você
        precisa de uma URL HTTP estável e documentável, não de uma função interna do seu bundle.
      </p>

      <Exercise
        prompt={
          <p>
            Pegue o <code>NovaTarefaForm</code> da lição 10, que faz <code>fetch("https://api.exemplo.com/tarefas", {"{ method: \"POST\" }"})</code>{" "}
            dentro de um <code>onSubmit</code> num Client Component, e reescreva-o usando Server Action.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`// app/tarefas/actions.ts
"use server";
import { revalidatePath } from "next/cache";

export async function criarTarefa(formData: FormData) {
  const titulo = formData.get("titulo") as string;
  await db.tarefa.create({ data: { titulo } });
  revalidatePath("/tarefas");
}

// app/tarefas/nova-tarefa-form.tsx — não precisa mais de "use client"
import { criarTarefa } from "./actions";

export function NovaTarefaForm() {
  return (
    <form action={criarTarefa} className="flex gap-2">
      <input name="titulo" placeholder="Nova tarefa" className="flex-1 border rounded-lg px-3 py-2" />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg">Adicionar</button>
    </form>
  );
}`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que a diretiva \"use server\" marca?",
            options: [
              "Uma função que roda no servidor e pode ser chamada diretamente por um componente, inclusive como action de um form",
              "Um componente que nunca pode receber props de um Server Component pai",
              "Um arquivo que só pode conter código CSS, sem nenhuma lógica de servidor",
              "Uma rota de API tradicional, equivalente a criar um route.ts",
            ],
            correctIndex: 0,
          },
          {
            question: "Quando ainda faz sentido criar uma API route em vez de usar só Server Actions?",
            options: [
              "Sempre — Server Actions não substituem API routes em nenhum caso",
              "Nunca — Server Actions resolvem 100% dos casos de mutação de qualquer aplicação",
              "Quando a mutação precisa ser consumida por um cliente externo ao seu app Next, como um app mobile separado ou um webhook de terceiro",
              "Só quando o formulário tem mais de um campo obrigatório",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
