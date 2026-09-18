import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-estado-global-context-e-zustand",
  title: "Estado global: Context API vs. Zustand",
  summary: "Prop drilling incomoda, mas a resposta nem sempre é Context — às vezes é uma lib pequena que não re-renderiza a árvore inteira.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao11EstadoGlobalContextEZustand() {
  return (
    <LessonBody>
      <p>
        Prop drilling — passar uma prop por 3, 4, 5 componentes só pra ela chegar lá no fundo, sem que nenhum
        componente no meio do caminho use ela — é chato, mas não é sempre um problema de verdade. Vira problema
        quando o valor muda com frequência, é usado em pontos bem distantes da árvore, ou quando adicionar mais um
        nível de aninhamento significa tocar em componentes que não têm nada a ver com aquele dado.
      </p>

      <CodeExample
        label="Prop drilling — o dado passa por quem não usa"
        language="typescript"
        code={`function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  return <Layout usuario={usuario} />;
}

function Layout({ usuario }: { usuario: Usuario | null }) {
  return <Header usuario={usuario} />; // Layout não usa "usuario", só repassa
}

function Header({ usuario }: { usuario: Usuario | null }) {
  return <MenuDoUsuario usuario={usuario} />; // Header também só repassa
}`}
      />

      <h2>Context API — built-in, mas com um custo real</h2>
      <p>
        O Context resolve o repasse: qualquer componente dentro do <code>Provider</code> lê o valor direto com{" "}
        <code>useContext</code>, sem prop nenhuma no meio do caminho.
      </p>
      <CodeExample
        label="theme-context.tsx"
        language="typescript"
        code={`const ThemeContext = createContext<"light" | "dark">("light");

function App() {
  const [tema, setTema] = useState<"light" | "dark">("light");
  return (
    <ThemeContext.Provider value={tema}>
      <Layout />
    </ThemeContext.Provider>
  );
}

function BotaoTema() {
  const tema = useContext(ThemeContext); // sem prop nenhuma
  return <button className={tema === "dark" ? "bg-slate-800" : "bg-white"}>Alternar tema</button>;
}`}
      />
      <p>
        O detalhe que pega muita gente de surpresa: <strong>quando o valor do Context muda, todo componente que
        consome aquele Context via <code>useContext</code> re-renderiza</strong> — mesmo que ele só use uma parte
        pequena do valor, ou que o valor seja um objeto grande com vários campos independentes. Pra um tema que muda
        raramente, isso não importa. Pra um estado que muda a cada tecla digitada, importa muito.
      </p>

      <h2>Zustand — estado que muda com frequência sem re-renderizar tudo</h2>
      <p>
        Zustand é uma lib pequena e sem boilerplate de Provider: você cria uma <em>store</em> fora da árvore de
        componentes, e cada componente escolhe, via um <strong>seletor</strong>, só a fatia do estado que precisa.
      </p>
      <CodeExample
        label="carrinho-store.ts"
        language="typescript"
        code={`import { create } from "zustand";

type CarrinhoState = {
  itens: { id: string; nome: string }[];
  adicionar: (item: { id: string; nome: string }) => void;
};

export const useCarrinhoStore = create<CarrinhoState>((set) => ({
  itens: [],
  adicionar: (item) => set((state) => ({ itens: [...state.itens, item] })),
}));

// Um componente que só mostra a quantidade só re-renderiza quando "itens.length" muda:
function ContadorDoCarrinho() {
  const quantidade = useCarrinhoStore((state) => state.itens.length);
  return <span>{quantidade} itens</span>;
}`}
      />
      <p>
        Repare no seletor <code>{"(state) => state.itens.length"}</code>: o componente só re-renderiza quando{" "}
        <em>aquele valor específico</em> muda, não sempre que qualquer coisa na store muda. É essa diferença que faz
        Zustand escalar melhor pra estado que muda com frequência.
      </p>

      <h2>Quando usar qual</h2>
      <p>
        <strong>Context</strong> encaixa bem em valores que mudam raramente e são majoritariamente lidos — tema,
        idioma, o usuário autenticado. <strong>Zustand</strong> (ou lib parecida) encaixa melhor em estado que muda
        com frequência e onde componentes diferentes precisam de fatias diferentes dele — filtros de uma tabela,
        carrinho de compras, passos de um wizard.
      </p>

      <Exercise
        prompt={
          <p>
            Reescreva o <code>ContadorDoCarrinho</code> acima como se ele lesse de um <code>ThemeContext</code>-like
            Context em vez de Zustand. Depois explique, em uma frase, por que essa versão re-renderiza mais vezes que
            a versão com seletor do Zustand.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`const CarrinhoContext = createContext<{ itens: { id: string; nome: string }[] }>({ itens: [] });

function ContadorDoCarrinho() {
  const { itens } = useContext(CarrinhoContext);
  return <span>{itens.length} itens</span>;
}

// Motivo: qualquer mudança no valor do Context (ex.: adicionar um campo novo
// não relacionado à contagem) re-renderiza esse componente, porque ele consome
// o Context inteiro — não existe seletor de "só uma parte do valor" no Context puro.`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/state-management">
        A escolha entre Context, Zustand e outras estratégias de estado — incluindo quando nenhuma das duas é
        necessária — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual é uma limitação real do Context API que motiva usar Zustand em estado que muda com frequência?",
            options: [
              "Toda vez que o valor do Context muda, todo componente que consome aquele Context via useContext re-renderiza",
              "O Context API não permite compartilhar nenhum tipo de objeto, só valores primitivos",
              "O Context só funciona dentro de Server Components, nunca em componentes marcados com \"use client\"",
              "O Context não permite passar funções como valor, só dados serializáveis",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que uma store Zustand normalmente causa menos re-renders desnecessários que Context num estado que muda bastante?",
            options: [
              "Porque o Zustand roda inteiramente no servidor, fora do ciclo de renderização do React",
              "Porque o Zustand substitui o useState por padrão em todos os componentes da árvore",
              "Porque cada componente usa um seletor pra pegar só a fatia do estado que precisa, e só re-renderiza quando aquela fatia muda",
              "Porque o Zustand armazena o estado direto no localStorage, então o React nunca precisa re-renderizar",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
