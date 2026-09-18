import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-projeto-guiado-client-de-api-tipado",
  title: "Projeto guiado: client de API com generics e erro tipado",
  summary: "Junta generics, discriminated union e Zod pra um client de API que não confia cegamente em nada que a rede manda.",
  estimatedMinutes: 22,
  level: "intermediario",
};

export default function Licao14ProjetoGuiadoClientDeApiTipado() {
  return (
    <LessonBody>
      <p>
        Na lição 07 você construiu um <code>buscarApi{"<T>"}</code> genérico que confiava cegamente no{" "}
        <code>res.json()</code>. Agora, com discriminated union, generics e Zod já vistos nesta trilha, dá pra
        construir a versão que checa de verdade o que a API devolveu — antes de tratar aquele dado como confiável.
      </p>

      <h2>1. O formato do resultado — Ok&lt;T&gt; | Err</h2>
      <p>
        Em vez de lançar exceção, a função devolve um discriminado por <code>kind</code> — o mesmo padrão da lição de
        enums e discriminated unions, só que batizado <code>Ok</code>/<code>Err</code>, nome comum nesse tipo de API:
      </p>
      <CodeExample
        language="typescript"
        code={`type Ok<T> = { kind: "ok"; data: T };
type Err = { kind: "err"; error: string };
type Resultado<T> = Ok<T> | Err;`}
      />

      <h2>2. A função genérica, agora validando com Zod</h2>
      <CodeExample
        language="typescript"
        code={`import { z } from "zod";

async function buscarApi<T>(url: string, schema: z.ZodType<T>): Promise<Resultado<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { kind: "err", error: \`Erro \${res.status}\` };
    }

    const bruto = await res.json();
    const validado = schema.safeParse(bruto);

    if (!validado.success) {
      return { kind: "err", error: "Formato de resposta inesperado" };
    }

    return { kind: "ok", data: validado.data };
  } catch {
    return { kind: "err", error: "Falha de rede" };
  }
}`}
      />
      <p>
        O generic <code>{"<T>"}</code> garante o tipo certo pra quem chama a função; o <code>schema</code> garante
        que o valor que chega de verdade bate com aquele tipo. Uma coisa não substitui a outra — <code>T</code> some
        na compilação, só o schema continua de pé quando o código está rodando.
      </p>

      <h2>3. Definindo o schema e derivando o tipo</h2>
      <CodeExample
        language="typescript"
        code={`const PedidoSchema = z.object({
  id: z.string(),
  status: z.enum(["pendente", "pago", "cancelado"]),
  total: z.number(),
});

type Pedido = z.infer<typeof PedidoSchema>;`}
      />

      <h2>4. Usando — narrowing pelo discriminante kind</h2>
      <CodeExample
        language="typescript"
        code={`async function carregarPedido(id: string) {
  const resultado = await buscarApi(\`/api/pedidos/\${id}\`, PedidoSchema);

  switch (resultado.kind) {
    case "ok":
      return resultado.data; // TS sabe: é um Pedido de verdade, checado
    case "err":
      console.error(resultado.error); // TS sabe: só "error" existe aqui
      return null;
  }
}`}
      />

      <Exercise
        prompt={
          <p>
            Escreva uma função <code>buscarUsuario(id: string)</code> que usa <code>buscarApi</code> com um{" "}
            <code>UsuarioSchema</code> (<code>{"{ nome: string; email: string }"}</code>) pra buscar{" "}
            <code>{"/api/usuarios/:id"}</code>, e trata o <code>Resultado</code> com um switch sobre{" "}
            <code>kind</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`import { z } from "zod";

const UsuarioSchema = z.object({
  nome: z.string(),
  email: z.string(),
});

async function buscarUsuario(id: string) {
  const resultado = await buscarApi(\`/api/usuarios/\${id}\`, UsuarioSchema);

  switch (resultado.kind) {
    case "ok":
      return resultado.data; // { nome: string; email: string }, checado em runtime
    case "err":
      console.error(resultado.error);
      return null;
  }
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Nesse client de API, por que buscarApi recebe um schema Zod como parâmetro, além do generic <T>?",
            options: [
              "Porque o generic sozinho já impede qualquer dado malformado de chegar até o schema",
              "Porque TypeScript exige um schema Zod para toda função async que usa fetch internamente",
              "Porque o generic só garante tipo em tempo de compilação; o schema garante que o dado real bate com esse tipo em runtime",
              "Porque o schema substitui a necessidade de declarar o tipo T na assinatura da função",
            ],
            correctIndex: 2,
          },
          {
            question: "No discriminated union Resultado<T> = Ok<T> | Err, qual o papel do campo kind?",
            options: [
              "Ele define em qual ordem os campos data e error aparecem quando o objeto é serializado",
              "Ele não tem papel especial — poderia ser removido sem afetar o narrowing dentro do switch",
              "Ele obriga o TypeScript a validar o valor de data em runtime, substituindo o Zod",
              "Ele é o discriminante que permite o narrowing automático dentro de cada case do switch",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
