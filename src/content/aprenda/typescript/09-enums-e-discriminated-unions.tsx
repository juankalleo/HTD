import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-enums-e-discriminated-unions",
  title: "Enums, literal types e discriminated unions",
  summary: "enum parece o jeito 'oficial' de listar opções em TypeScript — na prática, boa parte do código moderno prefere string literal types.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao09EnumsEDiscriminatedUnions() {
  return (
    <LessonBody>
      <p>
        Quando você precisa representar "um valor entre um conjunto fixo de opções" — status de um pedido, tipo de
        pagamento, papel de um usuário — o TypeScript te dá duas ferramentas parecidas na superfície, mas com
        comportamentos bem diferentes por baixo: <code>enum</code> e union de string literals.
      </p>

      <h2>enum — o jeito "clássico"</h2>
      <CodeExample
        language="typescript"
        code={`enum Status {
  Pendente,
  Pago,
  Cancelado,
}

const statusAtual: Status = Status.Pago;

console.log(Status.Pago); // 1 — por padrão, enum numérico começa em 0`}
      />
      <p>
        Diferente de <code>interface</code> e <code>type</code>, um <code>enum</code> gera código JavaScript de
        verdade (um objeto) que existe em runtime — não é só uma checagem que desaparece na compilação. E um enum{" "}
        <strong>numérico</strong> tem uma pegadinha: por padrão, o TypeScript aceita qualquer <code>number</code> onde
        um <code>Status</code> é esperado, mesmo que não corresponda a nenhum membro declarado.
      </p>

      <h2>String literal union — a alternativa mais usada hoje</h2>
      <CodeExample
        language="typescript"
        code={`type Status = "pendente" | "pago" | "cancelado";

const statusAtual: Status = "pago";

function atualizarStatus(status: Status) {
  // autocomplete mostra exatamente as 3 opções — e só essas
}

atualizarStatus("enviado");
// Error: Argument of type '"enviado"' is not assignable to parameter of type 'Status'.`}
      />
      <p>
        Uma union de string literals não gera nenhum código extra em runtime (some na compilação, como qualquer
        outro tipo) e o valor que aparece no editor/debugger já é legível ("pago", não <code>1</code>). Por isso é a
        opção mais comum em código TypeScript moderno, especialmente em projetos que trafegam esses valores como
        JSON entre frontend e API.
      </p>

      <h2>Discriminated union com mais de duas variantes</h2>
      <p>
        Você já viu o formato básico de discriminated union (sucesso/erro). O mesmo padrão escala pra quantas
        variantes forem necessárias, contanto que exista um campo em comum — o <strong>discriminante</strong> — que
        muda de valor entre elas:
      </p>
      <CodeExample
        language="typescript"
        code={`type EstadoRequisicao<T> =
  | { kind: "carregando" }
  | { kind: "sucesso"; dado: T }
  | { kind: "erro"; mensagem: string };

function renderizar(estado: EstadoRequisicao<string[]>) {
  switch (estado.kind) {
    case "carregando":
      return "Carregando...";
    case "sucesso":
      return estado.dado.join(", "); // TS sabe que "dado" existe só aqui
    case "erro":
      return \`Erro: \${estado.mensagem}\`; // e "mensagem" só aqui
  }
}`}
      />

      <h2>Exhaustiveness checking — garantir que nenhum caso ficou de fora</h2>
      <p>
        Um truque comum: no <code>default</code> de um switch sobre um discriminante, atribuir o valor a uma
        variável do tipo <code>never</code>. Se alguém adicionar uma variante nova ao union e esquecer de tratá-la no
        switch, o TypeScript acusa erro de compilação — antes de virar bug em produção:
      </p>
      <CodeExample
        language="typescript"
        code={`function renderizarCompleto(estado: EstadoRequisicao<string[]>): string {
  switch (estado.kind) {
    case "carregando":
      return "Carregando...";
    case "sucesso":
      return estado.dado.join(", ");
    case "erro":
      return \`Erro: \${estado.mensagem}\`;
    default:
      const _exaustivo: never = estado; // se sobrar algum "kind" não tratado, erro aqui
      return _exaustivo;
  }
}`}
      />

      <Exercise
        prompt={
          <p>
            Modele um discriminated union <code>Pagamento</code> com 3 variantes pelo campo <code>metodo</code>:{" "}
            <code>"pix"</code> (com <code>chave: string</code>), <code>"cartao"</code> (com{" "}
            <code>parcelas: number</code>) e <code>"boleto"</code> (com <code>vencimento: string</code>). Escreva uma
            função que recebe um <code>Pagamento</code> e retorna uma descrição em texto, usando um switch sobre{" "}
            <code>metodo</code>.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`type Pagamento =
  | { metodo: "pix"; chave: string }
  | { metodo: "cartao"; parcelas: number }
  | { metodo: "boleto"; vencimento: string };

function descrever(pagamento: Pagamento): string {
  switch (pagamento.metodo) {
    case "pix":
      return \`Pix para a chave \${pagamento.chave}\`;
    case "cartao":
      return \`Cartão em \${pagamento.parcelas}x\`;
    case "boleto":
      return \`Boleto com vencimento em \${pagamento.vencimento}\`;
  }
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um enum numérico do TypeScript pode gerar confusão que uma union de string literals não gera?",
            options: [
              "Porque um enum numérico aceita, por padrão, qualquer number como valor válido no lugar de um membro nomeado",
              "Porque enums não existem mais nas versões atuais do TypeScript e sempre geram erro de compilação",
              "Porque uma union de string literals não pode ser usada dentro de uma interface ou type",
              "Porque um enum numérico obriga o programador a escrever cada valor manualmente em hexadecimal",
            ],
            correctIndex: 0,
          },
          {
            question: "Num switch sobre o campo discriminante de uma discriminated union, o que o TypeScript faz dentro de cada case?",
            options: [
              "Ignora completamente o campo discriminante, tratando todas as variantes como um único tipo genérico",
              "Estreita (narrowing) o tipo automaticamente, liberando acesso só aos campos daquela variante específica",
              "Exige que cada case declare manualmente os tipos de todos os campos daquela variante",
              "Converte o valor em any dentro do case, exigindo uma verificação adicional antes de usá-lo",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
