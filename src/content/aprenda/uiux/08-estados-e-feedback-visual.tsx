import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-estados-e-feedback-visual",
  title: "Estados e feedback visual",
  summary: "Um botão que não muda de cara enquanto processa engana a pessoa a clicar de novo — e ela clica mesmo.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao08EstadosEFeedbackVisual() {
  return (
    <LessonBody>
      <p>
        Um componente interativo nunca existe em um único estado visual. Ele muda de cara conforme a situação:
        parado, sob o mouse, focado pelo teclado, sendo clicado, desabilitado, carregando, com erro. Ignorar esses
        estados — codar só a aparência "parada" e nada mais — é a diferença entre um componente que parece confiável
        e um que parece quebrado, mesmo funcionando por baixo.
      </p>

      <h2>Os estados essenciais</h2>
      <ul>
        <li><code>:hover</code> — sinaliza "isso é interativo" quando o mouse passa por cima, antes de qualquer clique.</li>
        <li><code>:focus-visible</code> — sinaliza qual elemento está ativo pra navegação via teclado.</li>
        <li><code>:active</code> — feedback imediato de que o clique foi registrado, no instante em que ele acontece.</li>
        <li><code>disabled</code> — sinaliza que a ação não está disponível agora (não que ela nunca vai estar).</li>
        <li><strong>loading</strong> — sinaliza que uma ação está em andamento e ainda não terminou.</li>
        <li><strong>erro</strong> — sinaliza que algo deu errado e, idealmente, o que fazer a respeito.</li>
      </ul>
      <CodeExample
        label="Estados de um botão em CSS"
        language="css"
        code={`.botao {
  background: #2563eb;
  transition: background 150ms ease;
}
.botao:hover      { background: #1d4ed8; }
.botao:active     { background: #1e40af; transform: translateY(1px); }
.botao:disabled   { opacity: 0.5; cursor: not-allowed; }
.botao:focus-visible { outline: 2px solid #93c5fd; outline-offset: 2px; }`}
      />

      <h2>Por que o estado de loading não é opcional</h2>
      <p>
        Considere um botão "Salvar" que dispara uma requisição de rede e demora 800ms pra responder. Se o botão não
        muda de aparência nesse intervalo, a pessoa que clicou não tem nenhuma confirmação de que algo está
        acontecendo — o cérebro dela conclui "não funcionou" e ela <strong>clica de novo</strong>. Se a ação não for
        idempotente (por exemplo, criar um registro), isso pode disparar a mesma ação duas vezes.
      </p>
      <CodeExample
        label="Estado de loading evitando clique duplicado"
        language="css"
        code={`.botao.is-loading {
  pointer-events: none; /* impede novo clique enquanto processa */
  opacity: 0.7;
}
.botao.is-loading::after {
  content: "";
  /* spinner ou indicador visual entra aqui */
}`}
      />
      <p>
        O ponto central: o feedback visual não é sobre deixar a interface "mais viva" — é sobre a pessoa nunca ficar
        na dúvida entre "não funcionou" e "está processando". Essas duas situações exigem reações opostas (clicar de
        novo vs. esperar), e sem feedback visual claro é impossível saber qual delas é a verdadeira.
      </p>

      <Exercise
        prompt={
          <p>
            Um formulário de cadastro envia os dados ao clicar em "Criar conta", mas o botão continua com a mesma
            aparência durante os 2 segundos que o servidor demora pra responder. Que classe de estado está faltando, e
            o que ela deveria fazer visualmente e funcionalmente?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Falta o estado de loading. Visualmente, o botão deveria mudar de aparência
(por exemplo, reduzir opacidade e mostrar um spinner) assim que o clique é
registrado. Funcionalmente, ele deveria impedir novos cliques enquanto a
requisição está em andamento (pointer-events: none ou disabled), pra evitar
que a pessoa crie a conta duas vezes por achar que o primeiro clique não
funcionou.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um botão sem nenhum feedback visual de 'carregando' durante uma ação assíncrona é um problema?",
            options: [
              "Porque o navegador bloqueia automaticamente qualquer clique repetido nesse botão",
              "Porque isso é uma violação técnica da especificação HTML de formulários",
              "Porque a pessoa acha que o clique não funcionou e clica de novo, podendo disparar a ação em duplicidade",
              "Porque isso impede a página de carregar qualquer outro elemento na tela",
            ],
            correctIndex: 2,
          },
          {
            question: "O que diferencia visualmente um botão no estado disabled de um botão comum?",
            options: [
              "O disabled sempre precisa ter uma cor de fundo vermelha, independente do contexto",
              "Nenhuma diferença é necessária — o cursor já indica sozinho que o botão está desabilitado",
              "O disabled deve ficar do mesmo tamanho que os outros estados, só mudando o texto",
              "Reduzir contraste/opacidade pra sinalizar visualmente que ele não é interativo no momento",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
