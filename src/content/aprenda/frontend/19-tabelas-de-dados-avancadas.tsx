import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "19-tabelas-de-dados-avancadas",
  title: "Tabelas de dados: paginação, ordenação e filtro",
  summary: "Buscar tudo com um fetch (lição 8) funciona com 20 linhas. Com 5 mil, a lista inteira em memória vira o problema.",
  estimatedMinutes: 18,
  level: "intermediario",
};

export default function Licao19TabelasDeDadosAvancadas() {
  return (
    <LessonBody>
      <p>
        Buscar dado com um <code>fetch</code> direto no Server Component, como na lição de data fetching, funciona
        muito bem pra uma lista de 20 itens. Quando a lista cresce pra centenas ou milhares de linhas, isso deixa de
        ser só "como buscar" e vira "como buscar <strong>em pedaços</strong>" — é aí que entram paginação, ordenação e
        filtro como parte do próprio fetching, não só da exibição.
      </p>

      <h2>Paginação client-side vs. server-side</h2>
      <p>
        <strong>Client-side:</strong> busca a lista inteira de uma vez e corta em páginas no navegador. Simples de
        implementar, mas ruim quando o total de linhas é grande — o navegador precisa baixar e manter tudo em memória
        mesmo mostrando só uma página. <strong>Server-side:</strong> cada página é uma requisição nova (
        <code>?page=2&pageSize=20</code>), o backend devolve só aquele pedaço. Escala melhor, ao custo de uma
        requisição por troca de página.
      </p>
      <CodeExample
        label="Paginação server-side"
        language="typescript"
        code={`async function getPedidos(page: number, pageSize = 20) {
  const res = await fetch(\`https://api.exemplo.com/pedidos?page=\${page}&pageSize=\${pageSize}\`, {
    cache: "no-store",
  });
  return res.json() as Promise<{ itens: Pedido[]; total: number }>;
}`}
      />

      <Callout href="/padrao-frontend/tabelas">
        As convenções de tabela do padrão — paginação, estados de vazio/erro/carregando, densidade de linha — estão
        documentadas no Padrão Frontend.
      </Callout>

      <h2>Filtro com debounce</h2>
      <p>
        Se cada tecla digitada num campo de busca disparasse um novo <code>fetch</code>, uma busca de 10 caracteres
        viraria 10 requisições. <strong>Debounce</strong> espera o usuário parar de digitar por um tempo (ex.: 300ms)
        antes de disparar a busca de verdade.
      </p>
      <CodeExample
        label="use-debounced-value.ts"
        language="typescript"
        code={`function useDebouncedValue<T>(valor: T, delay: number) {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timeout); // cancela se o valor mudar antes do delay passar
  }, [valor, delay]);

  return debounced;
}

function FiltroDePedidos({ onBuscar }: { onBuscar: (termo: string) => void }) {
  const [termo, setTermo] = useState("");
  const termoDebounced = useDebouncedValue(termo, 300);

  useEffect(() => {
    onBuscar(termoDebounced); // só dispara 300ms depois da última tecla
  }, [termoDebounced, onBuscar]);

  return <input value={termo} onChange={(e) => setTermo(e.target.value)} placeholder="Buscar pedido..." />;
}`}
      />

      <Callout href="/padrao-frontend/componentes/filtros">
        O padrão de filtros do HTD — combinação de múltiplos critérios, persistência na URL — está documentado no
        Padrão Frontend.
      </Callout>

      <Callout href="/padrao-frontend/componentes/busca">
        O componente de busca padrão, incluindo debounce e estado de carregando, está documentado no Padrão
        Frontend.
      </Callout>

      <h2>TanStack Table — quando a tabela cresce em complexidade</h2>
      <p>
        TanStack Table é <strong>headless</strong>: ele não renderiza HTML nenhum pronto, só cuida da lógica — quais
        linhas mostrar, em que ordem, como paginar — e deixa você desenhar o JSX/Tailwind por cima. Vale a pena
        quando a tabela ganha colunas configuráveis, ordenação múltipla, ou lógica de linha complexa demais pra
        reimplementar na mão.
      </p>
      <CodeExample
        label="Uso simplificado do TanStack Table"
        language="typescript"
        code={`import { useReactTable, getCoreRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";

const columns = [
  { accessorKey: "cliente", header: "Cliente" },
  { accessorKey: "total", header: "Total" },
];

function TabelaDePedidos({ pedidos }: { pedidos: Pedido[] }) {
  const table = useReactTable({
    data: pedidos,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), // ordenação por coluna, sem reimplementar na mão
  });

  return (
    <table>
      <tbody>
        {table.getRowModel().rows.map((row) => (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}`}
      />

      <Callout href="/padrao-frontend/tecnologias/tanstack-table">
        A configuração padrão do TanStack Table no projeto — colunas reutilizáveis, integração com paginação
        server-side — está documentada no Padrão Frontend.
      </Callout>

      <Exercise
        prompt={<p>Implemente um hook <code>useDebouncedValue(valor, delay)</code> do zero (sem olhar o exemplo acima) que só atualiza o valor retornado depois que <code>valor</code> parar de mudar por <code>delay</code> milissegundos.</p>}
        solutionLanguage="typescript"
        solutionCode={`function useDebouncedValue<T>(valor: T, delay: number): T {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
}`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual é a principal desvantagem de paginação client-side pra uma tabela com um volume grande de dados?",
            options: [
              "O navegador precisa buscar e manter todas as linhas em memória de uma vez, mesmo mostrando só uma página por vez",
              "Ela não permite nenhum tipo de ordenação de coluna",
              "Ela exige uma nova requisição ao servidor a cada troca de página",
              "Ela só funciona em tabelas com menos de duas colunas",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que aplicar debounce num campo de busca antes de refazer o fetch?",
            options: [
              "Pra validar o formato do texto digitado antes de enviar",
              "Pra armazenar o valor digitado permanentemente no localStorage",
              "Pra evitar disparar uma requisição a cada tecla digitada, esperando o usuário pausar antes de buscar",
              "Pra converter o texto digitado em maiúsculas antes da busca",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
