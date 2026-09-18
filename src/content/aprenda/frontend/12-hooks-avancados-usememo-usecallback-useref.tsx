import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-hooks-avancados-usememo-usecallback-useref",
  title: "useMemo, useCallback e useRef",
  summary: "\"Usa sempre que puder\" é o conselho errado — cada um resolve um problema bem específico, e usar sem necessidade também tem custo.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao12HooksAvancadosUsememoUsecallbackUseref() {
  return (
    <LessonBody>
      <p>
        É comum ouvir "usa <code>useMemo</code> e <code>useCallback</code> em tudo, por garantia". Isso é conselho
        ruim: os dois têm um custo real (guardar valor em memória, comparar o array de dependências a cada render), e
        cada um existe pra resolver um problema específico — não pra "otimizar" de forma genérica.
      </p>

      <h2>useMemo — cachear um valor calculado caro</h2>
      <p>
        Sem <code>useMemo</code>, uma computação cara dentro do componente roda de novo a <strong>cada</strong>{" "}
        render — inclusive quando o render foi causado por algo que não tem nada a ver com aquele cálculo.
      </p>
      <CodeExample
        label="Sem useMemo — recalcula sempre"
        language="typescript"
        code={`function ListaDeProdutos({ produtos, termoBusca }: Props) {
  const [tema, setTema] = useState("light"); // mudar isso recalcula a lista inteira também

  const filtrados = produtos
    .filter((p) => p.nome.includes(termoBusca))
    .sort((a, b) => a.preco - b.preco); // caro se a lista for grande

  return <ul>{filtrados.map((p) => <li key={p.id}>{p.nome}</li>)}</ul>;
}`}
      />
      <CodeExample
        label="Com useMemo — só recalcula quando produtos ou termoBusca mudam"
        language="typescript"
        code={`function ListaDeProdutos({ produtos, termoBusca }: Props) {
  const [tema, setTema] = useState("light");

  const filtrados = useMemo(
    () => produtos.filter((p) => p.nome.includes(termoBusca)).sort((a, b) => a.preco - b.preco),
    [produtos, termoBusca]
  );

  return <ul>{filtrados.map((p) => <li key={p.id}>{p.nome}</li>)}</ul>;
}`}
      />

      <h2>useCallback — cachear a identidade de uma função</h2>
      <p>
        <code>useCallback</code> não cacheia um valor calculado — ele cacheia a <strong>referência</strong> de uma
        função, pra ela não virar uma função "nova" a cada render. Isso importa quando essa função é prop de um
        componente memoizado com <code>React.memo</code>, ou dependência de outro hook.
      </p>
      <CodeExample
        label="Sem useCallback — memo do filho não adianta"
        language="typescript"
        code={`const BotaoCurtir = memo(function BotaoCurtir({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>❤ Curtir</button>;
});

function Post({ id }: { id: string }) {
  const [tema, setTema] = useState("light");
  const curtir = () => enviarLike(id); // nova função a cada render de Post

  return <BotaoCurtir onClick={curtir} />; // memo não evita re-render: a prop "onClick" sempre muda
}`}
      />
      <CodeExample
        label="Com useCallback — a referência se mantém entre renders"
        language="typescript"
        code={`function Post({ id }: { id: string }) {
  const [tema, setTema] = useState("light");
  const curtir = useCallback(() => enviarLike(id), [id]);

  return <BotaoCurtir onClick={curtir} />; // agora o memo funciona de verdade
}`}
      />

      <h2>useRef — valor mutável que não dispara render</h2>
      <p>
        <code>useState</code> guarda valor e causa re-render quando muda. <code>useRef</code> guarda valor e{" "}
        <strong>não</strong> causa re-render — útil pra coisas que o componente precisa lembrar entre renders, mas
        que não fazem parte do que é exibido na tela: o ID de um <code>setTimeout</code>, o valor anterior de uma
        prop, uma referência a um elemento do DOM.
      </p>
      <CodeExample
        label="useRef — guardando um id de timeout sem re-renderizar"
        language="typescript"
        code={`function CampoComAutoSalvar({ valor, onSalvar }: Props) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(novoValor: string) {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onSalvar(novoValor), 800);
  }

  return <input defaultValue={valor} onChange={(e) => handleChange(e.target.value)} />;
}`}
      />

      <h2>O custo de otimizar sem necessidade</h2>
      <p>
        <code>useMemo</code> e <code>useCallback</code> não são "grátis": React precisa guardar o valor anterior e
        comparar o array de dependências a cada render. Pra um cálculo barato (somar dois números, formatar uma
        string curta), esse custo de comparação pode ser maior que o custo de simplesmente recalcular. A regra
        prática: meça antes de otimizar (React DevTools Profiler mostra onde o tempo realmente vai) — não adicione os
        dois hooks por reflexo em todo componente que você escrever.
      </p>

      <Exercise
        prompt={
          <p>
            No componente abaixo, <code>ordenarPedidos</code> é uma função cara e <code>ListaPedidos</code> é
            memoizado com <code>React.memo</code>. Toda vez que o componente pai re-renderiza (por qualquer motivo),
            a lista inteira é reordenada e o memo do filho não evita re-render nenhum. Reescreva usando{" "}
            <code>useMemo</code> e <code>useCallback</code> onde fizer sentido.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`function PainelDePedidos({ pedidos }: { pedidos: Pedido[] }) {
  const [aberto, setAberto] = useState(false); // mudar isso não deveria reordenar nada

  const pedidosOrdenados = useMemo(
    () => [...pedidos].sort((a, b) => b.data.getTime() - a.data.getTime()),
    [pedidos]
  );

  const handleSelecionar = useCallback((id: string) => {
    console.log("selecionado:", id);
  }, []);

  return <ListaPedidos pedidos={pedidosOrdenados} onSelecionar={handleSelecionar} />;
}`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que useCallback memoriza, diferente do useMemo?",
            options: [
              "O valor de retorno da função, exatamente como o useMemo faz",
              "O estado do componente inteiro entre renders",
              "O DOM do componente, evitando que ele seja recriado",
              "A identidade (referência) da função em si, não o resultado de uma computação",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que usar useMemo e useCallback em todo lugar 'por garantia' pode ser pior do que não usar?",
            options: [
              "Porque esses hooks só funcionam dentro de Server Components",
              "Porque comparar o array de dependências e manter o valor em cache também tem custo, que pode superar o ganho em cálculos baratos",
              "Porque o React remove esses hooks automaticamente do build de produção",
              "Porque eles impedem o componente de receber novas props depois da primeira renderização",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
