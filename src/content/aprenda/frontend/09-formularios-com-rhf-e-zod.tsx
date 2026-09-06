import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-formularios-com-rhf-e-zod",
  title: "Formulários com React Hook Form + Zod",
  summary: "Um formulário de verdade tem validação, mensagem de erro e estado de envio — não só um onSubmit.",
  estimatedMinutes: 18,
};

export default function Licao09FormulariosComRhfEZod() {
  return (
    <LessonBody>
      <p>
        Um <code>{"<form onSubmit>"}</code> cru não valida nada, não mostra erro por campo, e reconstrói o objeto do
        zero a cada tecla se você tentar controlar tudo com <code>useState</code>. React Hook Form resolve o estado
        do formulário; Zod resolve a validação — e os dois se encaixam através de um "resolver".
      </p>

      <h2>1. O schema — a validação como dado, não como if/else</h2>
      <CodeExample
        label="schema.ts"
        language="typescript"
        code={`import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Mínimo de 8 caracteres"),
});

export type LoginForm = z.infer<typeof loginSchema>;`}
      />
      <p>
        <code>z.infer</code> gera o tipo TypeScript <strong>a partir</strong> do schema — o tipo e a validação nunca
        ficam dessincronizados, porque são a mesma fonte.
      </p>

      <h2>2. O formulário — RHF cuida do estado, Zod valida</h2>
      <CodeExample
        label="login-form.tsx"
        language="typescript"
        code={`"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm } from "./schema";

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    await fetch("/api/login", { method: "POST", body: JSON.stringify(data) });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 max-w-sm">
      <input {...register("email")} placeholder="E-mail" className="border rounded-lg px-3 py-2" />
      {errors.email && <span className="text-sm text-red-600">{errors.email.message}</span>}

      <input {...register("senha")} type="password" placeholder="Senha" className="border rounded-lg px-3 py-2" />
      {errors.senha && <span className="text-sm text-red-600">{errors.senha.message}</span>}

      <button disabled={isSubmitting} className="bg-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-50">
        {isSubmitting ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}`}
      />
      <p>
        <code>register("email")</code> conecta o input ao RHF sem precisar de <code>value</code>/<code>onChange</code>{" "}
        manuais; <code>errors.email.message</code> já vem com a mensagem do próprio schema Zod; <code>isSubmitting</code>{" "}
        vem de graça, sem um <code>useState</code> extra pra loading.
      </p>

      <Exercise
        prompt={
          <p>
            Adicione ao <code>loginSchema</code> um campo opcional <code>lembrarDeMim</code> do tipo booleano, e um
            checkbox correspondente no formulário.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`export const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(8, "Mínimo de 8 caracteres"),
  lembrarDeMim: z.boolean().optional(),
});

// no form:
<input type="checkbox" {...register("lembrarDeMim")} /> Lembrar de mim`}
      />

      <Callout href="/padrao-frontend/tecnologias/react-hook-form-zod">
        O padrão completo de formulários — schemas compartilhados, mensagens de erro, upload de arquivo — está
        documentado no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que z.infer<typeof schema> resolve?",
            options: [
              "Faz a requisição HTTP",
              "Gera o tipo TypeScript direto do schema Zod, sem duplicar a definição",
              "Renderiza o formulário",
              "Só funciona em runtime, não em build",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve register(\"campo\") do React Hook Form?",
            options: [
              "Envia o formulário",
              "Conecta o input ao estado do formulário sem precisar de value/onChange manuais",
              "Valida o campo sozinho, sem Zod",
              "Só funciona em Server Components",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
