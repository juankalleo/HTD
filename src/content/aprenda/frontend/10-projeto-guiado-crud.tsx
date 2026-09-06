import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-projeto-guiado-crud",
  title: "Projeto guiado: tela CRUD do zero",
  summary: "Junta as 9 lições anteriores numa única tela: listar, criar e validar tarefas.",
  estimatedMinutes: 25,
};

export default function Licao10ProjetoGuiadoCrud() {
  return (
    <LessonBody>
      <p>
        Chegou a hora de juntar tudo: Tailwind pro visual, App Router pra rota, Server Component pra buscar dado,
        Client Component isolado só onde há interação, e formulário validado com RHF + Zod. O projeto: uma lista de
        tarefas com criação.
      </p>

      <h2>1. A rota e o Server Component que busca os dados</h2>
      <CodeExample
        label="app/tarefas/page.tsx"
        language="typescript"
        code={`import { NovaTarefaForm } from "./nova-tarefa-form";

async function getTarefas() {
  const res = await fetch("https://api.exemplo.com/tarefas", { cache: "no-store" });
  return res.json() as Promise<{ id: string; titulo: string; feita: boolean }[]>;
}

export default async function TarefasPage() {
  const tarefas = await getTarefas();

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tarefas</h1>

      <NovaTarefaForm />

      <ul className="mt-6 flex flex-col gap-2">
        {tarefas.map((tarefa) => (
          <li
            key={tarefa.id}
            className={\`border rounded-lg px-4 py-2 \${tarefa.feita ? "bg-slate-50 text-slate-400 line-through" : ""}\`}
          >
            {tarefa.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
}`}
      />

      <h2>2. O formulário — o único pedaço interativo</h2>
      <CodeExample
        label="app/tarefas/nova-tarefa-form.tsx"
        language="typescript"
        code={`"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
  titulo: z.string().min(3, "Mínimo de 3 caracteres"),
});
type FormValues = z.infer<typeof schema>;

export function NovaTarefaForm() {
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormValues) {
    await fetch("https://api.exemplo.com/tarefas", {
      method: "POST",
      body: JSON.stringify(data),
    });
    reset();
    router.refresh(); // reexecuta o Server Component da page, sem recarregar a página inteira
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
      <input
        {...register("titulo")}
        placeholder="Nova tarefa"
        className="flex-1 border rounded-lg px-3 py-2"
      />
      <button disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50">
        Adicionar
      </button>
      {errors.titulo && <p className="text-sm text-red-600">{errors.titulo.message}</p>}
    </form>
  );
}`}
      />

      <p>
        O ponto central: <code>TarefasPage</code> é <code>async</code> e busca dado direto (lição 8);{" "}
        <code>NovaTarefaForm</code> é o único componente marcado <code>"use client"</code> (lição 7), porque é o único
        que precisa de estado de formulário e evento de clique; e <code>router.refresh()</code> — em vez de{" "}
        <code>window.location.reload()</code> — reexecuta só o Server Component, sem perder o estado do resto da
        página.
      </p>

      <Exercise
        prompt={
          <p>
            Adicione um botão "Concluir" em cada item da lista que chama{" "}
            <code>{"PATCH /tarefas/:id"}</code> marcando <code>feita: true</code>, e depois de responder,{" "}
            <code>router.refresh()</code>. Em qual componente esse botão precisa morar — no <code>page.tsx</code> ou
            num novo Client Component?
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`// Precisa de useRouter() e onClick — vira um novo Client Component,
// ex.: tarefa-item.tsx, recebendo a tarefa como prop e renderizado
// dentro do .map() do Server Component (mesmo padrão do NovaTarefaForm).

"use client";
function TarefaItem({ tarefa }: { tarefa: { id: string; titulo: string; feita: boolean } }) {
  const router = useRouter();
  async function concluir() {
    await fetch(\`https://api.exemplo.com/tarefas/\${tarefa.id}\`, {
      method: "PATCH",
      body: JSON.stringify({ feita: true }),
    });
    router.refresh();
  }
  return (
    <li className="border rounded-lg px-4 py-2 flex justify-between items-center">
      {tarefa.titulo}
      {!tarefa.feita && <button onClick={concluir} className="text-sm text-blue-600">Concluir</button>}
    </li>
  );
}`}
      />

      <Callout href="/padrao-frontend/tratamento-de-dados">
        O tratamento completo de dados em mutação — otimista vs. pessimista, invalidação de cache — está documentado
        no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que só o formulário (NovaTarefaForm) precisa de \"use client\" nesta tela?",
            options: [
              "Porque formulários sempre precisam, por regra fixa",
              "Porque é o único pedaço que usa estado de interação (useForm, onClick) — o resto só busca e exibe dado",
              "Porque page.tsx nunca pode ter formulário",
              "Não tem motivo técnico, é só convenção",
            ],
            correctIndex: 1,
          },
          {
            question: "O que router.refresh() faz que window.location.reload() não faz?",
            options: [
              "É mais lento",
              "Reexecuta só os Server Components da rota atual, sem descartar o estado client já carregado",
              "Nada, são idênticos",
              "Só funciona em produção",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
