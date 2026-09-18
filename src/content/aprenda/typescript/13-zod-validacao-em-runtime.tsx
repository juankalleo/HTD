import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-zod-validacao-em-runtime",
  title: "Zod: tipo estático não é validação em runtime",
  summary: "Seu tipo Pedido promete um formato — mas nada confere se a API realmente devolveu isso, até o Zod entrar.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao13ZodValidacaoEmRuntime() {
  return (
    <LessonBody>
      <p>
        Lá na primeira lição desta trilha: os tipos do TypeScript são <strong>apagados</strong> na compilação — o
        navegador (ou o Node) nunca vê um único tipo, só JavaScript puro. Isso tem uma consequência que passa
        despercebida até morder: <strong>nenhum tipo protege seu código de dado errado vindo de fora</strong>.
      </p>

      <h2>O problema real: dado de fora não é confiável</h2>
      <CodeExample
        language="typescript"
        code={`interface Pedido {
  id: string;
  status: "pendente" | "pago" | "cancelado";
  total: number;
}

async function buscarPedido(id: string): Promise<Pedido> {
  const res = await fetch(\`/api/pedidos/\${id}\`);
  const dado = await res.json();
  return dado as Pedido; // "as" é só uma afirmação — não checa NADA em runtime
}

const pedido = await buscarPedido("1");
pedido.total.toFixed(2);
// se a API mudou e "total" agora vem como string "99.90", isso compila liso
// e quebra em runtime: "pedido.total.toFixed is not a function"`}
      />
      <p>
        O <code>as Pedido</code> não valida o formato do JSON — só diz pro compilador "trate isso como um Pedido, eu
        prometo que é". Se a promessa for falsa (API mudou, bug no backend, resposta de erro inesperada), o TS não
        tem como saber: ele já apagou toda essa checagem antes do código rodar.
      </p>

      <h2>Zod — validação de verdade, em runtime</h2>
      <p>
        Zod é uma biblioteca que descreve o formato esperado de um dado como um <strong>schema</strong>, e sabe
        checar, durante a execução, se um valor real bate com esse formato:
      </p>
      <CodeExample
        language="typescript"
        code={`import { z } from "zod";

const PedidoSchema = z.object({
  id: z.string(),
  status: z.enum(["pendente", "pago", "cancelado"]),
  total: z.number(),
});

async function buscarPedido(id: string) {
  const res = await fetch(\`/api/pedidos/\${id}\`);
  const bruto = await res.json();

  const resultado = PedidoSchema.safeParse(bruto);
  if (!resultado.success) {
    console.error("Formato inesperado:", resultado.error);
    return null;
  }

  return resultado.data; // aqui sim, checado de verdade — "total" É number, na prática
}`}
      />
      <p>
        <code>safeParse</code> não lança exceção — devolve um objeto com <code>success</code>, exatamente como o
        discriminated union de resultado que você já usou nesta trilha. Se o dado real não bater com o schema (campo
        faltando, tipo errado), você descobre <em>ali</em>, com uma mensagem clara, em vez de um erro genérico três
        camadas depois.
      </p>

      <h2>z.infer — o tipo TypeScript nasce do schema, não o contrário</h2>
      <CodeExample
        language="typescript"
        code={`const PedidoSchema = z.object({
  id: z.string(),
  status: z.enum(["pendente", "pago", "cancelado"]),
  total: z.number(),
});

type Pedido = z.infer<typeof PedidoSchema>;
// { id: string; status: "pendente" | "pago" | "cancelado"; total: number }
// — o tipo é derivado do schema, então os dois nunca ficam dessincronizados`}
      />
      <p>
        Sem <code>z.infer</code>, seria fácil manter uma <code>interface Pedido</code> e um{" "}
        <code>PedidoSchema</code> separados — e um dia mudar só um dos dois. Derivando o tipo do schema, existe uma
        única fonte de verdade.
      </p>

      <Callout
        title="Zod é usado assim em produção"
        href="/padrao-frontend/tecnologias/zod"
        linkLabel="Ver na documentação →"
      >
        O Padrão Frontend documenta exatamente esse uso de Zod — validar resposta de API e formulário — como padrão
        oficial do projeto.
      </Callout>

      <Exercise
        prompt={
          <p>
            Escreva um schema Zod <code>UsuarioSchema</code> pra <code>{"{ nome: string; email: string; idade: number }"}</code>{" "}
            e derive o tipo <code>Usuario</code> a partir dele com <code>z.infer</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`import { z } from "zod";

const UsuarioSchema = z.object({
  nome: z.string(),
  email: z.string(),
  idade: z.number(),
});

type Usuario = z.infer<typeof UsuarioSchema>;
// { nome: string; email: string; idade: number }`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que const dado = await res.json() as Pedido não garante que dado realmente tem o formato de Pedido?",
            options: [
              "Porque as Pedido é só uma afirmação para o compilador — não existe checagem nenhuma acontecendo em runtime",
              "Porque res.json() sempre retorna undefined quando a API está fora do ar, mesmo com tipo declarado",
              "Porque o operador as só funciona corretamente dentro de componentes React, não em funções soltas",
              "Porque Pedido precisaria estar marcado como readonly para essa afirmação funcionar de verdade",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual é a vantagem de usar z.infer<typeof PedidoSchema> em vez de escrever a interface Pedido separadamente?",
            options: [
              "z.infer roda mais rápido em produção porque elimina a necessidade do schema Zod",
              "O tipo TypeScript é derivado direto do schema, então schema e tipo nunca ficam dessincronizados",
              "z.infer substitui completamente a validação do Zod, tornando o safeParse desnecessário",
              "z.infer só funciona em schemas que não têm nenhum campo opcional",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
