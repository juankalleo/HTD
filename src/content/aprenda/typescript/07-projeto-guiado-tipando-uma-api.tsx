import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-projeto-guiado-tipando-uma-api",
  title: "Projeto guiado: tipando uma API",
  summary: "Junta interface, union, generics e utilitários numa função real de busca de dado.",
  estimatedMinutes: 20,
  level: "fundamentos",
};

export default function Licao07ProjetoGuiadoTipandoUmaApi() {
  return (
    <LessonBody>
      <p>
        Uma função <code>buscarPedido</code> que chama uma API de verdade, tipada do jeito que apareceria num projeto
        Next.js real — encadeando tudo que as 6 lições anteriores cobriram.
      </p>

      <h2>1. O formato dos dados (interface)</h2>
      <CodeExample
        language="typescript"
        code={`interface Pedido {
  id: string;
  status: "pendente" | "pago" | "cancelado";
  total: number;
  itens: ItemPedido[];
}

interface ItemPedido {
  produto: string;
  quantidade: number;
}`}
      />

      <h2>2. O formato da resposta — sucesso ou erro (discriminated union + generics)</h2>
      <CodeExample
        language="typescript"
        code={`type ResultadoApi<T> =
  | { sucesso: true; dado: T }
  | { sucesso: false; erro: string };`}
      />

      <h2>3. A função — genérica, reutilizável pra qualquer endpoint</h2>
      <CodeExample
        language="typescript"
        code={`async function buscarApi<T>(url: string): Promise<ResultadoApi<T>> {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { sucesso: false, erro: \`Erro \${res.status}\` };
    }
    const dado: T = await res.json();
    return { sucesso: true, dado };
  } catch {
    return { sucesso: false, erro: "Falha de rede" };
  }
}`}
      />

      <h2>4. Usando — o generic "vaza" o tipo certo pra quem chama</h2>
      <CodeExample
        language="typescript"
        code={`async function carregarPedido(id: string) {
  const resultado = await buscarApi<Pedido>(\`/api/pedidos/\${id}\`);

  if (!resultado.sucesso) {
    console.error(resultado.erro); // TS sabe que só "erro" existe aqui
    return null;
  }

  return resultado.dado; // TS sabe que é um Pedido completo aqui, com autocomplete de .status, .itens...
}`}
      />

      <h2>5. Formulário de edição — Partial entra aqui</h2>
      <CodeExample
        language="typescript"
        code={`async function atualizarPedido(id: string, mudancas: Partial<Omit<Pedido, "id">>) {
  return buscarApi<Pedido>(\`/api/pedidos/\${id}\`); // simplificado — na prática seria um PATCH
}

// só manda o que mudou, sem precisar reconstruir o Pedido inteiro:
atualizarPedido("1", { status: "pago" });`}
      />

      <p>
        Nenhuma dessas 5 partes existe isolada num projeto real — <code>ResultadoApi{"<T>"}</code> é o mesmo formato
        de "sucesso ou erro tipado" que aparece no Padrão API (lá, do lado do Rails, como{" "}
        <code>ServiceResult</code>); é o mesmo contrato, dos dois lados da rede.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva a assinatura de tipo de uma função <code>criarPedido</code> que recebe os dados de um pedido{" "}
            <strong>sem</strong> <code>id</code> e <strong>sem</strong> <code>status</code> (o backend define os
            dois), e devolve um <code>ResultadoApi{"<Pedido>"}</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`async function criarPedido(
  dados: Omit<Pedido, "id" | "status">,
): Promise<ResultadoApi<Pedido>> {
  return buscarApi<Pedido>("/api/pedidos"); // simplificado — seria um POST de verdade
}`}
      />

      <Callout href="/padrao-api/conceitos-tecnicos/service-result">
        O ResultadoApi&lt;T&gt; construído aqui é a versão TypeScript do padrão de resposta tipada que o Padrão API
        usa do lado do Rails — vale ver os dois lado a lado.
      </Callout>

      <Callout
        title="Isso é aprofundado no intermediário"
        href="/aprenda/typescript/13-zod-validacao-em-runtime"
        linkLabel="Ver aula completa →"
      >
        Repare que buscarApi confia cegamente no que vem de res.json() — o TypeScript não valida nada em runtime. A
        aula sobre Zod mostra como checar esse dado de verdade antes de tratá-lo como um Pedido.
      </Callout>

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que buscarApi é genérica (buscarApi<T>) em vez de tipada só pra Pedido?",
            options: [
              "Porque funções async no TypeScript são obrigadas a declarar um parâmetro de tipo",
              "Porque isso faz a função rodar de forma síncrona em vez de retornar uma Promise",
              "Uma única função funciona pra qualquer endpoint/formato de dado, sem duplicar a lógica de fetch pra cada tipo",
              "Porque sem o <T> o fetch não teria permissão para acessar URLs externas",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que Partial<Omit<Pedido, 'id'>> faz sentido pra uma função de atualização?",
            options: [
              "Porque Partial e Omit precisam sempre ser usados juntos, nunca isoladamente",
              "Omit tira o id (não muda numa atualização); Partial deixa o resto opcional, já que uma atualização parcial não manda todos os campos",
              "Porque isso transforma Pedido inteiro em opcional, incluindo o próprio id removido",
              "Porque Partial sozinho já removeria o id automaticamente, tornando o Omit redundante",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
