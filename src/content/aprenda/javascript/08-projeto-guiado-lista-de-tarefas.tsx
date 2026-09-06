import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-projeto-guiado-lista-de-tarefas",
  title: "Projeto guiado: lista de tarefas em JS puro",
  summary: "Junta DOM, eventos, array e async num único mini-app — sem framework nenhum.",
  estimatedMinutes: 22,
};

export default function Licao08ProjetoGuiadoListaDeTarefas() {
  return (
    <LessonBody>
      <p>
        Sem React, sem Next.js — só o que as 7 lições anteriores já cobriram. O objetivo é sentir, na mão, o trabalho
        manual que um framework resolve por você (e é exatamente o trabalho que a trilha de Frontend vai automatizar
        a partir da próxima trilha).
      </p>

      <h2>1. O estado — um array simples guarda tudo</h2>
      <CodeExample
        language="javascript"
        code={`let tarefas = []; // cada item: { id, titulo, feita }

function adicionarTarefa(titulo) {
  tarefas.push({ id: Date.now(), titulo, feita: false });
  renderizar();
}

function alternarFeita(id) {
  tarefas = tarefas.map((t) => (t.id === id ? { ...t, feita: !t.feita } : t));
  renderizar();
}

function removerTarefa(id) {
  tarefas = tarefas.filter((t) => t.id !== id);
  renderizar();
}`}
      />
      <p>
        Repare o padrão: nenhuma dessas funções mexe direto no DOM. Elas só atualizam o array <code>tarefas</code> e
        chamam <code>renderizar()</code> — quem sabe desenhar a tela é uma função só, separada da lógica de dado.
        Esse é o mesmo princípio que o React formaliza (estado muda → tela é redesenhada a partir do estado).
      </p>

      <h2>2. Renderizar — reconstruir o DOM a partir do array</h2>
      <CodeExample
        language="javascript"
        code={`const lista = document.querySelector("#lista-tarefas");

function renderizar() {
  lista.innerHTML = ""; // limpa tudo — abordagem simples, um framework otimiza isso

  for (const tarefa of tarefas) {
    const item = document.createElement("li");
    item.textContent = tarefa.titulo;
    item.style.textDecoration = tarefa.feita ? "line-through" : "none";

    const botaoConcluir = document.createElement("button");
    botaoConcluir.textContent = tarefa.feita ? "Desfazer" : "Concluir";
    botaoConcluir.addEventListener("click", () => alternarFeita(tarefa.id));

    const botaoRemover = document.createElement("button");
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => removerTarefa(tarefa.id));

    item.append(botaoConcluir, botaoRemover);
    lista.appendChild(item);
  }
}`}
      />

      <h2>3. O formulário</h2>
      <CodeExample
        language="javascript"
        code={`const form = document.querySelector("#form-nova-tarefa");
const input = document.querySelector("#input-titulo");

form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // impede o recarregamento padrão da página
  if (input.value.trim() === "") return;

  adicionarTarefa(input.value.trim());
  input.value = "";
});`}
      />

      <h2>4. Carregando do "servidor" (simulado com async)</h2>
      <CodeExample
        language="javascript"
        code={`async function carregarTarefasIniciais() {
  // simula uma API real, que levaria um tempo pra responder
  const resposta = await new Promise((resolve) =>
    setTimeout(() => resolve([{ id: 1, titulo: "Estudar JS", feita: false }]), 500),
  );
  tarefas = resposta;
  renderizar();
}

carregarTarefasIniciais();`}
      />

      <Exercise
        prompt={
          <p>
            Adicione um contador que mostra "X de Y tarefas concluídas" acima da lista, atualizado toda vez que{" "}
            <code>renderizar()</code> roda.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const contador = document.querySelector("#contador");

function renderizar() {
  const concluidas = tarefas.filter((t) => t.feita).length;
  contador.textContent = \`\${concluidas} de \${tarefas.length} tarefas concluídas\`;

  lista.innerHTML = "";
  // ...resto igual
}`}
      />

      <Callout href="/padrao-frontend">
        Esse mesmo problema — estado, atualização de tela, formulário — reaparece na trilha de Frontend, resolvido
        com Tailwind, componentes e um framework em vez de manipulação manual do DOM.
      </Callout>

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que renderizar() fica separada das funções que mudam o array tarefas?",
            options: [
              "Não tem motivo, poderia estar tudo junto",
              "Separa a lógica de dado (o que mudou) da lógica de tela (como desenhar) — o mesmo princípio que frameworks formalizam",
              "É mais rápido separar sempre",
              "renderizar() precisa rodar antes das outras funções",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve evento.preventDefault() no submit do formulário?",
            options: [
              "Cancela a tarefa sendo criada",
              "Impede o comportamento padrão do navegador de recarregar a página ao enviar um formulário",
              "Impede o evento de disparar",
              "Só funciona em formulários com um campo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
