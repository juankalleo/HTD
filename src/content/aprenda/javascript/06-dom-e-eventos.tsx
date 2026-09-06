import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-dom-e-eventos",
  title: "DOM e eventos",
  summary: "Como o JavaScript enxerga e modifica uma página HTML — antes de qualquer framework fazer isso pra você.",
  estimatedMinutes: 16,
};

export default function Licao06DomEEventos() {
  return (
    <LessonBody>
      <p>
        O <strong>DOM</strong> (Document Object Model) é a representação da página HTML como uma árvore de objetos
        que o JavaScript consegue ler e modificar. React/Next.js fazem isso por baixo dos panos — mas entender o que
        está por baixo ajuda a entender o que o framework está poupando você de escrever.
      </p>

      <h2>Selecionar um elemento</h2>
      <CodeExample
        language="javascript"
        code={`const titulo = document.querySelector("h1");        // primeiro <h1> encontrado
const botoes = document.querySelectorAll("button");   // TODOS os <button>, como uma lista`}
      />

      <h2>Ler e mudar conteúdo</h2>
      <CodeExample
        language="javascript"
        code={`const titulo = document.querySelector("h1");

titulo.textContent;             // lê o texto atual
titulo.textContent = "Novo título";  // muda o texto
titulo.classList.add("destaque");     // adiciona uma classe CSS
titulo.style.color = "blue";           // muda estilo direto (evite em excesso — prefira classe)`}
      />

      <h2>Eventos — reagir a uma ação do usuário</h2>
      <CodeExample
        language="javascript"
        code={`const botao = document.querySelector("#salvar");

botao.addEventListener("click", () => {
  console.log("Botão clicado!");
});

// o objeto do evento carrega informação sobre o que aconteceu
const input = document.querySelector("input");
input.addEventListener("input", (evento) => {
  console.log("Valor atual:", evento.target.value);
});`}
      />

      <h2>Criar elemento na hora</h2>
      <CodeExample
        language="javascript"
        code={`const lista = document.querySelector("ul");

const novoItem = document.createElement("li");
novoItem.textContent = "Nova tarefa";
lista.appendChild(novoItem);`}
      />
      <p>
        Isso — criar elemento, inserir na árvore, atualizar manualmente a cada mudança — é exatamente o trabalho
        repetitivo que o React resolve com um modelo declarativo (você descreve o resultado final, o React calcula o
        que mudar no DOM sozinho). Depois desta lição, a trilha de Frontend faz muito mais sentido: agora você sabe o
        que está sendo abstraído.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva o código que: seleciona um botão com id <code>contador</code>, e a cada clique aumenta em 1 um
            número mostrado dentro dele.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const botao = document.querySelector("#contador");
let cliques = 0;

botao.addEventListener("click", () => {
  cliques++;
  botao.textContent = \`Cliques: \${cliques}\`;
});`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que é o DOM?",
            options: [
              "Uma biblioteca externa que precisa ser instalada",
              "A representação da página HTML como uma árvore de objetos que o JavaScript consegue ler e modificar",
              "Um tipo de banco de dados",
              "Um framework, alternativa ao React",
            ],
            correctIndex: 1,
          },
          {
            question: "O que addEventListener('click', fn) faz?",
            options: [
              "Executa fn imediatamente, uma vez",
              "Registra fn pra ser chamada toda vez que aquele elemento for clicado",
              "Remove o elemento da página",
              "Só funciona com botões, nenhum outro elemento",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
