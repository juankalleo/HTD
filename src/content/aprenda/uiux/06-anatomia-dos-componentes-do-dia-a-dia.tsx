import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-anatomia-dos-componentes-do-dia-a-dia",
  title: "Componentes que você já usa todo dia: anatomia de um bom exemplar",
  summary: "Botão, input, card, modal — você já codou cem vezes, mas talvez nunca tenha parado pra ver o que separa um bom exemplar de um ruim.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao06AnatomiaDosComponentes() {
  return (
    <LessonBody>
      <p>
        Você provavelmente já implementou dezenas de botões, inputs, cards e modais. Mas implementar a estrutura
        (HTML/JSX) é diferente de entender o que faz um componente parecer certo — o tipo de coisa que só percebemos
        quando está faltando.
      </p>

      <h2>Botão: affordance é a palavra-chave</h2>
      <p>
        <strong>Affordance</strong> é a pista visual que sugere o que um elemento faz e como interagir com ele. Um
        botão precisa <em>parecer clicável</em> antes mesmo de alguém passar o mouse: contraste de cor em relação ao
        fundo, bordas ou sombra sutil que sugerem "isso está acima da superfície", cursor de ponteiro. Um botão que
        parece um texto qualquer (mesma cor, sem contorno, sem peso diferente) obriga a pessoa a testar clicando pra
        descobrir se funciona — isso é affordance fraca.
      </p>
      <CodeExample
        label="Contraste que sinaliza affordance"
        language="css"
        code={`.botao-fraco {
  background: transparent;
  color: #64748b;
  border: none;
} /* parece texto comum, não sinaliza que é clicável */

.botao-com-affordance {
  background: #2563eb;
  color: white;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: 600;
  cursor: pointer;
}`}
      />

      <h2>Input: placeholder não é label</h2>
      <p>
        O <code>placeholder</code> é uma dica de formato (<em>"ex: joao@email.com"</em>), não uma identificação
        permanente do campo — ele desaparece assim que a pessoa começa a digitar. Um input bem feito tem sempre um{" "}
        <code>label</code> visível e associado (via <code>htmlFor</code>/<code>id</code>), independente de também ter
        um placeholder pra formato.
      </p>

      <h2>Card: fronteira clara</h2>
      <p>
        Um card existe pra agrupar informação relacionada e separá-la visualmente do resto — ele só cumpre esse papel
        se tiver uma fronteira perceptível (borda sutil, sombra leve, ou diferença de cor de fundo em relação ao que
        está atrás). Um "card" sem nenhuma dessas pistas não é um card, é só texto solto que por acaso está dentro de
        uma <code>div</code> — o princípio de figura-fundo da Gestalt (lição 5) só funciona se existir alguma
        diferença perceptível entre o card e o que está ao redor dele.
      </p>

      <h2>Modal: foco e saída óbvios</h2>
      <p>
        Um modal bem feito escurece o resto da tela (reforçando que ela virou "fundo" temporariamente), captura o
        foco de teclado dentro dele, e oferece uma saída óbvia — um botão de fechar visível, e geralmente também a
        tecla <kbd>Esc</kbd> e o clique fora dele. Um modal sem essas três coisas prende a pessoa numa caixa sem
        indicar como sair, o que é frustrante mesmo que a ação dentro dele esteja correta.
      </p>

      <Exercise
        prompt={
          <p>
            Um formulário de login tem um campo só com <code>placeholder="Senha"</code>, sem label, e um botão de
            entrar que é um texto azul sublinhado sem nenhum fundo ou borda. Aponte os dois problemas de affordance e
            proponha a correção de cada um.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`1. O campo depende só do placeholder, que some ao digitar — precisa de um
   label visível e associado ("Senha") além do placeholder de formato.
2. O botão "Entrar" como texto sublinhado tem affordance fraca de botão —
   parece mais um link. Precisa de um tratamento visual de botão (fundo com
   contraste, padding, radius) pra sinalizar claramente que é a ação
   principal da tela.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que é 'affordance' num componente de interface, como um botão?",
            options: [
              "A quantidade de JavaScript necessária para o componente funcionar corretamente",
              "O nome técnico da propriedade CSS que define a cor de fundo de um elemento",
              "A validação que impede o usuário de clicar em um botão desabilitado",
              "A pista visual que sugere o que o elemento faz e como interagir com ele, como parecer clicável",
            ],
            correctIndex: 3,
          },
          {
            question: "Qual é a diferença essencial entre um placeholder e um label num campo de formulário?",
            options: [
              "Placeholder é obrigatório por lei de acessibilidade, label é opcional",
              "Não existe diferença prática — os dois têm exatamente o mesmo comportamento visual",
              "O label permanece visível mesmo depois que o usuário preenche o campo; o placeholder some assim que a digitação começa",
              "O placeholder muda de cor conforme o estado do campo, e o label nunca muda",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
