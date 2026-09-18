import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "17-testando-componentes",
  title: "Testando componentes com Testing Library",
  summary: "Testar 'como o componente foi implementado' quebra a cada refatoração; testar o que o usuário vê e faz não.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao17TestandoComponentes() {
  return (
    <LessonBody>
      <p>
        Um erro comum ao testar componente é testar <strong>detalhe de implementação</strong> — acessar estado
        interno, checar se uma função específica foi chamada por dentro. Esse tipo de teste quebra toda vez que você
        refatora o componente, mesmo sem mudar nada do que o usuário vê. Testing Library evita isso de propósito: ela
        só te dá acesso ao que aparece na tela e ao que o usuário consegue fazer.
      </p>

      <h2>O que testar</h2>
      <p>
        Em vez de "a função <code>handleSubmit</code> foi chamada", teste{" "}
        <strong>comportamento visível</strong>: "quando eu clico em Salvar com os campos preenchidos, a mensagem de
        sucesso aparece na tela". Se você conseguir reescrever o componente inteiro por dentro e o teste continuar
        passando sem mudar uma linha, o teste está no nível certo.
      </p>

      <h2>render, screen e userEvent</h2>
      <CodeExample
        label="Estrutura básica de um teste"
        language="typescript"
        code={`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";

test("mostra erro quando o e-mail é inválido", async () => {
  render(<LoginForm />);
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("E-mail"), "nao-e-um-email");
  await user.click(screen.getByRole("button", { name: "Entrar" }));

  expect(await screen.findByText("E-mail inválido")).toBeInTheDocument();
});`}
      />
      <p>
        <code>render</code> monta o componente num DOM virtual; <code>screen</code> é onde você busca elementos —{" "}
        <code>getByRole</code>, <code>getByLabelText</code> — sempre preferindo a forma como um usuário real
        encontraria aquele elemento (por texto do botão, por label do campo), não por um seletor de CSS interno.{" "}
        <code>userEvent</code> simula interação real: digitar, clicar, disparando os mesmos eventos que uma
        interação de verdade dispararia.
      </p>

      <h2>Um exemplo completo</h2>
      <CodeExample
        label="contador-de-likes.test.tsx"
        language="typescript"
        code={`import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContadorDeLikes } from "./contador-de-likes";

test("incrementa o contador ao clicar", async () => {
  render(<ContadorDeLikes inicial={3} />);
  const user = userEvent.setup();

  expect(screen.getByText("❤ 3")).toBeInTheDocument();

  await user.click(screen.getByRole("button"));

  expect(screen.getByText("❤ 4")).toBeInTheDocument();
});`}
      />
      <p>
        Repare que o teste não sabe (nem precisa saber) que existe um <code>useState</code> por trás — ele só sabe
        que, depois do clique, o texto na tela mudou de <code>❤ 3</code> pra <code>❤ 4</code>.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva um teste pro componente <code>ContadorDeLikes</code> (da lição de Server vs. Client Components)
            que verifica que ele começa mostrando o valor de <code>inicial</code>, sem clicar em nada ainda.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`import { render, screen } from "@testing-library/react";
import { ContadorDeLikes } from "./contador-de-likes";

test("mostra o valor inicial de likes", () => {
  render(<ContadorDeLikes inicial={10} />);
  expect(screen.getByText("❤ 10")).toBeInTheDocument();
});`}
      />

      <Callout href="/padrao-frontend/tecnologias/vitest">
        A configuração de teste do projeto — Vitest como executor, integração com Testing Library, convenções de
        nomeação de arquivo — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual é a diferença central entre testar comportamento e testar detalhe de implementação?",
            options: [
              "Não existe diferença real, os dois termos descrevem a mesma prática",
              "Testar comportamento só é possível em componentes de classe, nunca em componentes de função",
              "Testar comportamento verifica o que o usuário vê e faz na tela; testar implementação verifica detalhes internos que podem mudar numa refatoração sem quebrar o app",
              "Testar implementação é sempre mais rápido de escrever, então é sempre preferível",
            ],
            correctIndex: 2,
          },
          {
            question: "Pra que serve userEvent.click(button) num teste com Testing Library?",
            options: [
              "Simula uma interação real do usuário clicando naquele elemento, disparando os mesmos eventos que um clique de verdade dispararia",
              "Renderiza o componente pela primeira vez na árvore de teste",
              "Verifica se o elemento existe na tela, sem simular clique nenhum",
              "Compara um snapshot do HTML antes e depois da renderização",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
