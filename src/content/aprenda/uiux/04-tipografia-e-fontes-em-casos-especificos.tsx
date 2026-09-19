import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "04-tipografia-e-fontes-em-casos-especificos",
  title: "Tipografia: pares de fonte e quando usar cada uma",
  summary: "A fonte 'bonita' errada comunica a mensagem errada — serifada e sans-serif não são intercambiáveis.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao04TipografiaEFontes() {
  return (
    <LessonBody>
      <p>
        Trocar a fonte de um projeto costuma ser tratado como decisão estética pura — "essa aqui é mais bonita". Mas
        cada família tipográfica carrega uma associação que o olho aprendeu a reconhecer com anos de exposição a
        jornal, livro, produto digital. Usar a fonte errada no contexto errado comunica algo que você não quis dizer.
      </p>

      <h2>Serifada vs. sem serifa: quando cada uma comunica melhor</h2>
      <p>
        Uma fonte <strong>serifada</strong> (com pequenos traços de acabamento nas letras, como Georgia ou Playfair
        Display) carrega peso editorial — remete a jornal, livro, revista, tradição impressa. Funciona bem em
        contextos onde você quer transmitir sofisticação, narrativa ou autoridade: uma landing page de produto de
        luxo, um blog editorial, um convite.
      </p>
      <p>
        Uma fonte <strong>sem serifa</strong> (sans-serif, como Inter ou Helvetica) tem traços limpos e uniformes, e
        tende a renderizar melhor em tamanhos pequenos na tela — por isso domina produto digital, dashboard,
        aplicativo: onde legibilidade em telas pequenas e "sensação de ferramenta confiável" importam mais do que
        narrativa.
      </p>
      <p>
        Isso não é regra absoluta — existem produtos digitais premiados que usam serifada com sucesso —, mas é um
        ponto de partida sólido: <strong>se a tela é primariamente uma ferramenta de trabalho, sans-serif costuma
        servir melhor; se é primariamente uma experiência editorial ou de marca, serifada pode comunicar mais.</strong>
      </p>

      <h2>Escala tipográfica: por que 3-4 tamanhos bastam</h2>
      <p>
        Um erro comum é criar um tamanho de fonte novo pra cada situação (<code>13px</code> aqui,{" "}
        <code>15px</code> ali, <code>17px</code> acolá). Isso quebra a consistência tratada na lição 7 e força quem
        usa a decorar hierarquias visuais diferentes em cada tela. Uma escala pequena e fixa — título, subtítulo,
        corpo, legenda — cobre a grande maioria dos casos reais.
      </p>
      <CodeExample
        label="Uma escala tipográfica enxuta"
        language="css"
        code={`--text-titulo:    1.5rem;   /* 24px */
--text-subtitulo: 1.125rem; /* 18px */
--text-corpo:     0.9375rem; /* 15px */
--text-legenda:   0.8125rem; /* 13px */`}
      />

      <h2><code>line-height</code>: o espaço entre as linhas</h2>
      <p>
        <code>line-height</code> (entrelinha) controla a distância vertical entre linhas de texto. Um valor muito
        apertado, perto de <code>1</code>, faz as linhas quase se tocarem — o olho perde a referência de onde a
        próxima linha começa quando volta pro início, e a leitura cansa rápido. Um <code>line-height</code> entre{" "}
        <code>1.4</code> e <code>1.6</code> costuma equilibrar bem legibilidade e densidade pra texto de corpo; títulos
        grandes toleram valores mais apertados porque têm menos linhas pra acompanhar.
      </p>
      <CodeExample
        label="line-height apertado demais vs. confortável"
        language="css"
        code={`.corpo-apertado { font-size: 1rem; line-height: 1; }     /* cansa a leitura */
.corpo-confortavel { font-size: 1rem; line-height: 1.5; } /* fácil de acompanhar */`}
      />

      <Callout
        title="Como o padrão de produção define isso"
        href="/padrao-frontend/estilos/tipografia"
        linkLabel="Ver na documentação →"
      >
        A escala tipográfica, os pesos e o <code>line-height</code> padrão do projeto já estão definidos como token —
        veja também como as fontes são carregadas com performance em{" "}
        <a href="/padrao-frontend/estilos/otimizacao-fontes">otimização de fontes</a>.
      </Callout>

      <Exercise
        prompt={
          <p>
            Uma landing page de um curso online usa uma fonte serifada decorativa em todos os textos, inclusive nos
            botões e no menu de navegação. O texto fica bonito, mas o time reclama que "parece pesado" e "difícil de
            escanear rápido". O que você sugeriria mudar, e por quê?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Manter a fonte serifada só no título/headline pra carregar a sensação
editorial que o curso quer passar, e trocar corpo de texto, menu e botões
pra uma fonte sans-serif — que escaneia mais rápido em tamanhos pequenos.
Misturar as duas com papéis diferentes é mais eficaz do que usar uma única
fonte decorativa em tudo.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que uma fonte serifada costuma comunicar melhor em contextos editoriais ou de luxo do que num dashboard de produto?",
            options: [
              "Porque fontes serifadas sempre carregam mais rápido que fontes sem serifa no navegador",
              "Porque o navegador aplica anti-aliasing diferente pra cada tipo de fonte automaticamente",
              "Porque fontes serifadas são tecnicamente proibidas de usar em tamanhos pequenos de texto",
              "Porque as serifas remetem à tradição do impresso, associada a sofisticação e narrativa, enquanto sans-serif tende a parecer mais limpa em telas de produto",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que um bloco de texto com line-height muito apertado (perto de 1) cansa a leitura?",
            options: [
              "Porque o navegador precisa recalcular a fonte a cada linha renderizada",
              "Porque o olho perde a referência de onde a próxima linha começa ao voltar pro início",
              "Porque isso reduz automaticamente o contraste entre o texto e o fundo",
              "Porque isso faz o texto ocupar menos espaço, forçando fonte menor",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
