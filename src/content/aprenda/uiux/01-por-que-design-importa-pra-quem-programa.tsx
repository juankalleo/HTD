import { LessonBody } from "@/components/aprenda/lesson-body";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-design-importa-pra-quem-programa",
  title: "Por que design importa pra quem programa",
  summary: "Não é sobre deixar bonito — é sobre reduzir o esforço que a pessoa gasta pra entender sua tela.",
  estimatedMinutes: 12,
  level: "fundamentos",
};

export default function Licao01PorQueDesignImporta() {
  return (
    <LessonBody>
      <p>
        Você termina uma funcionalidade, o código está limpo, os testes passam, e ainda assim vem o pedido: "muda um
        monte de coisa aqui, não sei explicar bem o quê". Essa frustração — de quem programou e de quem pediu — quase
        sempre não é sobre o código. É sobre a tela exigir esforço demais de quem vai usá-la, e ninguém no time ter
        vocabulário pra apontar isso com precisão.
      </p>

      <h2>UI, UX e o que fica no meio</h2>
      <p>
        <strong>UI</strong> (interface) é o que a pessoa vê e toca: botão, cor, espaçamento, fonte. <strong>UX</strong>{" "}
        (experiência) é o resultado disso tudo: será que ela entende o que fazer, decide com confiança e completa a
        tarefa sem travar? Dá pra ter uma UI bonita e uma UX ruim — uma tela visualmente caprichada onde ninguém acha
        o botão de salvar é exatamente isso.
      </p>

      <h2>O verdadeiro custo: esforço cognitivo</h2>
      <p>
        Toda vez que alguém olha pra uma tela, o cérebro faz perguntas silenciosas: "o que isso é? o que eu faço
        primeiro? isso é clicável?". Cada elemento mal posicionado, cada cor sem propósito, cada texto ambíguo é mais
        uma pergunta que a pessoa precisa resolver antes de conseguir agir. <strong>Boas decisões de design não são
        enfeite — são a remoção dessas perguntas.</strong> Uma tela "boa" é uma tela que exige menos raciocínio pra
        ser entendida, não uma tela mais decorada.
      </p>

      <h2>Por que isso importa especificamente pra quem programa</h2>
      <p>
        Você não precisa virar designer, mas entender os princípios por trás das decisões visuais muda três coisas no
        seu dia a dia:
      </p>
      <p>
        Primeiro, você evita retrabalho — quando entende <em>por que</em> um layout foi feito de um jeito, consegue
        prever se uma variação sua (um card a mais, um texto mais longo) vai quebrar a lógica visual antes de codar e
        descobrir depois. Segundo, você discute com argumento em vez de gosto — em vez de "acho que fica melhor
        assim", você aponta "esse botão não tem contraste suficiente com o fundo" ou "esses dois elementos parecem
        agrupados, mas não são relacionados". Terceiro, você toma pequenas decisões sozinho sem travar esperando um
        designer — ordem de campos num formulário, texto de um estado vazio, espaçamento de um card novo.
      </p>

      <h2>Design não é gosto pessoal disfarçado</h2>
      <p>
        A parte mais importante desta trilha: boa parte do que parece "preferência estética" tem uma explicação
        perceptiva ou cognitiva por trás, testável e nomeada — como o olho humano agrupa elementos (Gestalt), como
        contraste de cor afeta legibilidade, por que memória de curto prazo limita quantas opções alguém processa por
        vez. Isso não significa que toda regra de design é lei absoluta — várias são convenções fortes com exceções
        legítimas, e esta trilha vai deixar claro quando é uma coisa ou outra.
      </p>

      <Exercise
        prompt={
          <p>
            Duas telas de cadastro fazem exatamente a mesma coisa. Na primeira, todos os campos têm o mesmo tamanho de
            fonte, a mesma cor, e o botão de enviar tem a mesma aparência dos campos de texto. Na segunda, o título é
            visivelmente maior, os campos obrigatórios têm um indicador diferente, e o botão de enviar se destaca em
            cor e peso dos demais elementos. Sem pensar em "gosto", explique em uma frase por que a segunda exige
            menos esforço cognitivo de quem preenche.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Na segunda tela, contraste de tamanho, peso e cor cria uma hierarquia visual
que responde as perguntas "o que é mais importante aqui?" e "o que eu clico
pra terminar?" antes mesmo da pessoa ler o texto — na primeira, tudo parece
igualmente importante, e a pessoa precisa ler tudo com atenção só pra
descobrir qual campo é obrigatório e onde está o botão de ação.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que significa dizer que um design 'reduz o esforço cognitivo' de quem usa a tela?",
            options: [
              "Que a tela usa menos processamento do navegador, deixando o carregamento mais rápido",
              "Que a pessoa precisa pensar menos pra entender o que a tela oferece e o que fazer em seguida",
              "Que o código por trás da interface tem menos linhas e menos componentes",
              "Que a equipe de design gastou menos tempo produzindo aquela tela",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que entender princípios básicos de design ajuda um dev a evitar retrabalho?",
            options: [
              "Porque isso substitui a necessidade de um designer no time",
              "Porque toda decisão visual vira uma regra fixa, sem qualquer exceção possível",
              "Porque o CSS gerado fica automaticamente mais curto e mais rápido de rodar",
              "Porque o dev entende o porquê de uma decisão e discute mudanças com argumento concreto, não só gosto",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
