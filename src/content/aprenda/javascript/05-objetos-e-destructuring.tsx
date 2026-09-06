import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-objetos-e-destructuring",
  title: "Objetos e destructuring",
  summary: "Spread, destructuring e por que 'copiar' um objeto com = não copia nada.",
  estimatedMinutes: 15,
};

export default function Licao05ObjetosEDestructuring() {
  return (
    <LessonBody>
      <h2>Objeto — chave e valor</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = {
  nome: "Ana",
  idade: 28,
  endereco: { cidade: "Porto Velho", uf: "RO" },
};

usuario.nome;            // "Ana"
usuario["nome"];          // "Ana" — mesma coisa, útil quando a chave é dinâmica
usuario.endereco.cidade;  // "Porto Velho"`}
      />

      <h2>Destructuring — extrair campos direto</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = { nome: "Ana", idade: 28 };

// sem destructuring
const nome = usuario.nome;
const idade = usuario.idade;

// com destructuring — mesma coisa, uma linha
const { nome, idade } = usuario;

// renomeando e com valor padrão
const { nome: nomeCompleto, cidade = "não informada" } = usuario;`}
      />
      <p>
        Isso também funciona em <strong>parâmetro de função</strong> — muito comum em componente React, que recebe
        props como um objeto:
      </p>
      <CodeExample
        language="javascript"
        code={`function Cartao({ titulo, preco }) {
  return \`\${titulo}: R$ \${preco}\`;
}
// em vez de: function Cartao(props) { return \`\${props.titulo}...\`; }`}
      />

      <h2>Spread — copiar e sobrescrever, sem mutar o original</h2>
      <CodeExample
        language="javascript"
        code={`const usuario = { nome: "Ana", idade: 28 };

// ATENÇÃO: isso NÃO copia, cria uma segunda referência pro MESMO objeto
const copiaErrada = usuario;
copiaErrada.nome = "Bia";
usuario.nome; // "Bia" — o original mudou também!

// spread cria um objeto NOVO de verdade
const copiaCerta = { ...usuario, nome: "Bia" };
usuario.nome;     // "Ana" — original intacto
copiaCerta.nome;  // "Bia"`}
      />
      <p>
        Esse é um dos bugs mais comuns pra quem começa: <code>=</code> em objeto/array copia a{" "}
        <strong>referência</strong>, não o conteúdo. Mudar a "cópia" muda o original junto, porque os dois apontam pro
        mesmo lugar na memória. <code>{"{ ...objeto }"}</code> (ou <code>[...array]</code>) resolve criando algo
        realmente novo.
      </p>

      <Exercise
        prompt={
          <p>
            Dado <code>{'const produto = { nome: "Mouse", preco: 80 }'}</code>, crie um novo objeto{" "}
            <code>produtoComDesconto</code> com o mesmo nome mas <code>preco: 72</code>, sem alterar{" "}
            <code>produto</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`const produto = { nome: "Mouse", preco: 80 };
const produtoComDesconto = { ...produto, preco: 72 };

produto.preco;            // 80 — intacto
produtoComDesconto.preco; // 72`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que const copia = original faz com um objeto?",
            options: [
              "Cria uma cópia independente do conteúdo",
              "Cria uma segunda variável apontando pro MESMO objeto — mudar uma muda a outra",
              "Gera um erro",
              "Congela o objeto original",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que { ...produto, preco: 72 } é diferente de produto.preco = 72?",
            options: [
              "Não tem diferença nenhuma",
              "O spread cria um objeto novo (o original fica intacto); a atribuição direta muda o objeto original",
              "Spread só funciona com array",
              "Spread é mais lento sempre",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
