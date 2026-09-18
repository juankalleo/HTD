import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-performance-e-core-web-vitals",
  title: "Performance: code-splitting, lazy loading e Core Web Vitals",
  summary: "\"Carregou rápido no meu Wi-Fi\" não é métrica — Core Web Vitals é o que o navegador de verdade mede.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao14PerformanceECoreWebVitals() {
  return (
    <LessonBody>
      <p>
        "Carregou rápido pra mim" não diz nada sobre performance real — você provavelmente está numa máquina boa,
        numa conexão boa, com o site em cache. Performance de verdade se mede com métricas padronizadas, e é isso que
        o <strong>Core Web Vitals</strong> do Google formaliza.
      </p>

      <h2>Code-splitting e dynamic import</h2>
      <p>
        O Next.js já divide o JavaScript por rota automaticamente — quem visita <code>/login</code> não baixa o
        código de <code>/dashboard</code>. Mas dentro de uma mesma rota, um componente pesado que só é usado às vezes
        (um editor de texto rico, um modal complexo, um gráfico) pode ser carregado <strong>sob demanda</strong> com{" "}
        <code>next/dynamic</code>, em vez de entrar no bundle inicial da página inteira.
      </p>
      <CodeExample
        label="app/relatorios/page.tsx"
        language="typescript"
        code={`import dynamic from "next/dynamic";

const GraficoDeVendas = dynamic(() => import("./grafico-de-vendas"), {
  loading: () => <p>Carregando gráfico...</p>,
  ssr: false, // o gráfico só faz sentido no navegador
});

export default function RelatoriosPage() {
  return (
    <div>
      <h1>Relatórios</h1>
      <GraficoDeVendas />
    </div>
  );
}`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/code-splitting">
        Quando vale a pena dividir um bundle em pedaços menores, e quando isso só adiciona complexidade sem ganho real,
        está documentado no Padrão Frontend.
      </Callout>

      <h2>Lazy loading de imagem</h2>
      <p>
        O componente <code>next/image</code> já adia (lazy-load) o carregamento de imagens fora da tela visível por
        padrão. O cuidado inverso importa tanto quanto: a imagem que aparece <strong>acima da dobra</strong> (o
        banner principal, por exemplo) deveria usar <code>priority</code>, pra não competir por prioridade de rede com
        conteúdo menos importante.
      </p>
      <CodeExample
        label="Imagem crítica vs. imagem lazy"
        language="typescript"
        code={`import Image from "next/image";

// Acima da dobra — carrega com prioridade, não espera lazy load
<Image src="/banner.jpg" alt="Banner" width={1200} height={400} priority />

// Mais abaixo na página — lazy load automático, não compete pela rede logo de cara
<Image src="/produto-relacionado.jpg" alt="Produto relacionado" width={300} height={300} />`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/lazy-loading">
        As convenções de lazy loading do padrão — imagens, componentes e quando NÃO adiar algo crítico — estão
        documentadas no Padrão Frontend.
      </Callout>

      <h2>CSS crítico</h2>
      <p>
        CSS que bloqueia a renderização (o navegador precisa baixar e processar antes de mostrar qualquer coisa)
        atrasa a primeira pintura da página. A ideia de <strong>CSS crítico</strong> é isolar só o estilo necessário
        pro conteúdo visível imediatamente e entregá-lo o mais rápido possível, deixando o resto do CSS carregar sem
        bloquear.
      </p>

      <Callout href="/padrao-frontend/conceitos-tecnicos/critical-css">
        A estratégia de CSS crítico adotada no projeto está documentada no Padrão Frontend.
      </Callout>

      <h2>Core Web Vitals, em uma frase cada</h2>
      <ul>
        <li>
          <strong>LCP</strong> (Largest Contentful Paint) — tempo até o maior elemento visível da tela terminar de
          carregar, geralmente uma imagem grande ou um bloco de texto no topo da página.
        </li>
        <li>
          <strong>CLS</strong> (Cumulative Layout Shift) — o quanto elementos da página se deslocam inesperadamente
          enquanto ela ainda está carregando, como quando uma imagem sem dimensão reservada empurra o texto abaixo
          dela.
        </li>
        <li>
          <strong>INP</strong> (Interaction to Next Paint) — tempo entre uma interação do usuário (clique, toque) e a
          próxima atualização visual na tela; é a métrica de responsividade que substituiu o antigo FID.
        </li>
      </ul>

      <Exercise
        prompt={
          <p>
            Uma página tem um botão "Ver detalhes do produto" que abre um modal com um editor de avaliação em texto
            rico (uma lib pesada, só usada por quem clica nesse botão). Ela também tem uma imagem de banner logo no
            topo. Qual técnica desta lição se aplica a cada um dos dois casos?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Editor de texto rico no modal: code-splitting com next/dynamic — só carrega
o JavaScript da lib quando o usuário realmente clica em "Ver detalhes",
em vez de incluir no bundle inicial de todo mundo que visita a página.

Imagem de banner no topo: next/image com "priority" — ela é o conteúdo
mais provável de contar como LCP, então não deveria esperar lazy load.`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o code-splitting via next/dynamic conquista na prática?",
            options: [
              "Divide o CSS do projeto em vários arquivos menores para o navegador escolher",
              "Adia o carregamento do JavaScript de um componente pesado até o momento em que ele é realmente necessário",
              "Remove código não utilizado do bundle final durante o build, sem nenhuma mudança em runtime",
              "Compacta as imagens da página automaticamente antes de enviar para o servidor",
            ],
            correctIndex: 1,
          },
          {
            question: "O que a métrica CLS (Cumulative Layout Shift) mede?",
            options: [
              "O tempo entre o clique do usuário e a próxima atualização visual na tela",
              "O tempo até o maior elemento visível da página terminar de carregar",
              "A quantidade de requisições HTTP feitas até a página ficar interativa",
              "O quanto elementos da página se deslocam inesperadamente enquanto ela ainda está carregando",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
