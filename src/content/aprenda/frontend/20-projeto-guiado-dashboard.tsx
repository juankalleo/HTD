import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "20-projeto-guiado-dashboard",
  title: "Projeto guiado: dashboard com tabela, filtro e upload",
  summary: "Junta middleware, tabela paginada, filtro debounced e upload numa única tela: um dashboard de pedidos protegido.",
  estimatedMinutes: 26,
  level: "intermediario",
};

export default function Licao20ProjetoGuiadoDashboard() {
  return (
    <LessonBody>
      <p>
        Hora de juntar o intermediário inteiro numa tela: <code>middleware.ts</code> protegendo a rota, um Server
        Component buscando pedidos paginados e filtrados, um Client Component isolado só pro filtro com debounce, e
        um upload de comprovante via Server Action. O projeto: um dashboard de pedidos.
      </p>

      <h2>1. A rota protegida</h2>
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
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};`}
      />

      <h2>2. A tabela de pedidos paginada (Server Component)</h2>
      <CodeExample
        label="app/dashboard/pedidos/page.tsx"
        language="typescript"
        code={`type Props = { searchParams: Promise<{ page?: string; q?: string }> };

async function getPedidos(page: number, termo: string) {
  const res = await fetch(
    \`https://api.exemplo.com/pedidos?page=\${page}&pageSize=20&q=\${termo}\`,
    { cache: "no-store" }
  );
  return res.json() as Promise<{ itens: Pedido[]; total: number }>;
}

export default async function PedidosPage({ searchParams }: Props) {
  const { page = "1", q = "" } = await searchParams;
  const { itens, total } = await getPedidos(Number(page), q);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Pedidos</h1>
      <FiltroPedidos termoInicial={q} />

      <table className="w-full mt-4 border-collapse">
        <tbody>
          {itens.map((pedido) => (
            <tr key={pedido.id} className="border-b">
              <td className="py-2">{pedido.cliente}</td>
              <td className="py-2 text-right">R$ {pedido.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="text-sm text-slate-500 mt-2">
        Página {page} — {total} pedidos no total
      </p>
    </div>
  );
}`}
      />

      <h2>3. O filtro com debounce (Client Component)</h2>
      <p>
        O filtro precisa de estado local e de um evento de digitação — por isso é o único pedaço marcado{" "}
        <code>"use client"</code>. Ao mudar, ele atualiza a URL (<code>?q=...</code>), o que faz o Next.js
        re-executar o Server Component acima com o novo filtro.
      </p>
      <CodeExample
        label="app/dashboard/pedidos/filtro-pedidos.tsx"
        language="typescript"
        code={`"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

function useDebouncedValue<T>(valor: T, delay: number) {
  const [debounced, setDebounced] = useState(valor);
  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timeout);
  }, [valor, delay]);
  return debounced;
}

export function FiltroPedidos({ termoInicial }: { termoInicial: string }) {
  const [termo, setTermo] = useState(termoInicial);
  const termoDebounced = useDebouncedValue(termo, 300);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (termoDebounced) params.set("q", termoDebounced);
    else params.delete("q");
    router.push(\`\${pathname}?\${params.toString()}\`);
  }, [termoDebounced, pathname, router, searchParams]);

  return (
    <input
      value={termo}
      onChange={(e) => setTermo(e.target.value)}
      placeholder="Buscar por cliente..."
      className="border rounded-lg px-3 py-2 w-full"
    />
  );
}`}
      />

      <h2>4. Upload do comprovante (Server Action)</h2>
      <CodeExample
        label="app/dashboard/pedidos/actions.ts"
        language="typescript"
        code={`"use server";

import { revalidatePath } from "next/cache";

export async function enviarComprovante(formData: FormData) {
  const arquivo = formData.get("arquivo") as File;
  const pedidoId = formData.get("pedidoId") as string;

  if (!arquivo || arquivo.size === 0) throw new Error("Selecione um arquivo");

  await salvarComprovante(pedidoId, arquivo);
  revalidatePath("/dashboard/pedidos"); // tabela reflete o novo status no próximo carregamento
}`}
      />
      <CodeExample
        label="app/dashboard/pedidos/upload-comprovante-form.tsx"
        language="typescript"
        code={`import { enviarComprovante } from "./actions";

export function UploadComprovanteForm({ pedidoId }: { pedidoId: string }) {
  return (
    <form action={enviarComprovante} className="flex items-center gap-2">
      <input type="hidden" name="pedidoId" value={pedidoId} />
      <input type="file" name="arquivo" accept="image/*,application/pdf" />
      <button type="submit" className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm">
        Enviar comprovante
      </button>
    </form>
  );
}`}
      />

      <p>
        O ponto central da tela inteira: <code>PedidosPage</code> é <code>async</code> e busca dado já paginado e
        filtrado (lições 8 e 19); <code>FiltroPedidos</code> é <code>"use client"</code> só porque precisa de estado
        de digitação e debounce (lição 12); e <code>UploadComprovanteForm</code> nem precisa de{" "}
        <code>"use client"</code> — ele usa uma Server Action direto como <code>action</code> do form (lição 15), que
        chama <code>revalidatePath</code> pra garantir que a tabela mostre o pedido atualizado na próxima navegação.
        Tudo isso só existe porque o <code>middleware.ts</code> já garantiu, antes de qualquer coisa renderizar, que
        quem chegou até aqui está autenticado (lição 16).
      </p>

      <Exercise
        prompt={
          <p>
            Depois que <code>enviarComprovante</code> roda com sucesso, o usuário ainda está vendo a tabela antiga na
            tela (o <code>revalidatePath</code> só afeta a <strong>próxima</strong> navegação/carregamento). O que
            você adicionaria no <code>UploadComprovanteForm</code> pra tabela atualizar imediatamente após o envio,
            sem o usuário precisar recarregar a página manualmente?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Precisa virar um Client Component: marcar "use client", trocar o <form action={...}>
por um onSubmit que chama a Server Action manualmente (ela continua podendo
ser chamada assim) e, depois do await, chamar router.refresh() (useRouter,
de next/navigation) — o mesmo router.refresh() da lição 10, que reexecuta os
Server Components da rota atual sem perder o estado client já carregado.`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Nesta tela, por que a checagem de sessão fica no middleware.ts em vez de dentro do page.tsx da rota de pedidos?",
            options: [
              "Porque page.tsx não tem acesso a cookies nem a headers da requisição",
              "Porque middleware.ts é o único lugar onde dá pra usar Server Components",
              "Porque colocar a checagem no middleware é mais rápido de escrever, sem outro motivo técnico",
              "Porque o middleware roda antes da rota renderizar, bloqueando o acesso sem precisar duplicar a checagem em cada page.tsx protegida",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que o filtro de pedidos precisa ser um Client Component, enquanto a tabela que lista os pedidos continua um Server Component?",
            options: [
              "Porque toda tabela HTML precisa obrigatoriamente rodar no cliente",
              "Porque o filtro precisa de estado local pro texto digitado e de um evento onChange — coisas que só existem no navegador; a tabela só busca e exibe dado",
              "Porque Server Components não podem renderizar dentro de uma rota que usa middleware",
              "Porque o filtro faz upload de arquivo, e upload só funciona em Client Components",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
