import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-tsconfig-e-modo-strict",
  title: "tsconfig.json e o que o modo strict realmente liga",
  summary: "strict: true não é uma flag isolada — é um pacote de várias, e cada uma pega um tipo de bug diferente.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao10TsconfigEModoStrict() {
  return (
    <LessonBody>
      <p>
        É comum ver gente desligando <code>strict</code> num projeto TypeScript pra "parar de dar tanto erro", sem
        saber exatamente o que está desligando junto. <code>strict</code> não é um único comportamento — é um atalho
        que liga várias checagens independentes de uma vez.
      </p>

      <h2>tsconfig.json — onde o compilador é configurado</h2>
      <CodeExample
        language="json"
        code={`{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "skipLibCheck": true
  }
}`}
      />
      <p>
        Esse arquivo controla como o <code>tsc</code> (ou o Next.js, por baixo) compila e checa o projeto. A maioria
        das opções liga ou desliga um tipo específico de checagem — e <code>strict</code> é a mais importante delas.
      </p>

      <h2>strict não é uma flag, é um pacote</h2>
      <p>
        Marcar <code>"strict": true</code> equivale a ligar, de uma vez, um grupo de flags menores — entre as mais
        relevantes no dia a dia:
      </p>
      <CodeExample
        language="typescript"
        code={`// o que "strict": true liga por baixo (versão simplificada):
// noImplicitAny          — parâmetro sem tipo não vira "any" silencioso
// strictNullChecks       — null/undefined não se encaixam em qualquer tipo
// strictFunctionTypes    — checagem mais rígida de parâmetros de função
// strictPropertyInitializer — campo de classe não pode ficar sem valor inicial
// noImplicitThis         — "this" sem tipo definido vira erro, não "any"`}
      />

      <h2>noImplicitAny — o parâmetro que virava any sem avisar</h2>
      <CodeExample
        language="typescript"
        code={`// com noImplicitAny desligado, isso compila sem erro nenhum:
function formatar(valor) {
  return valor.toUpperCase(); // "valor" é any — TS não checa nada aqui
}

// com noImplicitAny ligado (dentro de strict), o mesmo código dá erro:
function formatar(valor) {
  return valor.toUpperCase();
}
// Error: Parameter 'valor' implicitly has an 'any' type.`}
      />

      <h2>strictNullChecks — provavelmente a mais importante</h2>
      <p>
        Sem essa flag, <code>null</code> e <code>undefined</code> são aceitos em qualquer lugar, mesmo onde o tipo
        diz <code>string</code> ou <code>number</code> — a origem clássica de "Cannot read properties of undefined"
        em produção:
      </p>
      <CodeExample
        language="typescript"
        code={`function saudar(nome: string) {
  return nome.toUpperCase();
}

let usuario: string | undefined = buscarUsuario();

saudar(usuario);
// com strictNullChecks: Error: Argument of type 'string | undefined' is not
// assignable to parameter of type 'string'.
// sem strictNullChecks: compila normalmente — e quebra em runtime se usuario vier undefined

if (usuario) {
  saudar(usuario); // aqui o narrowing já eliminou o "undefined" — TS libera a chamada
}`}
      />

      <h2>Por que todo projeto novo deveria nascer com strict: true</h2>
      <p>
        Ativar <code>strict</code> desde o primeiro commit custa pouco: o projeto ainda não tem código pra migrar.
        Ativar depois de meses de código escrito sem essas checagens costuma revelar centenas de erros de uma vez —
        a maioria bugs reais que só não tinham aparecido ainda. Por isso é bem mais barato nascer estrito do que virar
        estrito depois.
      </p>

      <Exercise
        prompt={
          <p>
            Um projeto tem <code>"strict": false</code> no tsconfig. A função{" "}
            <code>{"function calcular(taxa) { return 100 * taxa; }"}</code> compila sem nenhum erro, mesmo sem tipo
            no parâmetro <code>taxa</code>. Explique qual flag dentro de <code>strict</code> pegaria esse problema, e
            reescreva a função corrigindo.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`// noImplicitAny é a flag responsável — com strict: true, "taxa" sem tipo
// já seria erro de compilação ("implicitly has an 'any' type").

function calcular(taxa: number): number {
  return 100 * taxa;
}`}
      />

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que a flag strict do tsconfig.json realmente representa?",
            options: [
              "Um único comportamento: impedir o uso da palavra-chave any em qualquer lugar do projeto",
              "Um conjunto de várias flags independentes (noImplicitAny, strictNullChecks, entre outras) ativadas juntas",
              "Uma opção que só afeta a velocidade de compilação, sem mudar quais erros aparecem",
              "Um modo exclusivo para projetos que não usam nenhuma biblioteca externa com tipos",
            ],
            correctIndex: 1,
          },
          {
            question: "Sem strictNullChecks ativado, o que o TypeScript deixa passar sem erro?",
            options: [
              "Atribuir null ou undefined a uma variável tipada como string, sem nenhum aviso do compilador",
              "Declarar duas variáveis com o mesmo nome dentro do mesmo escopo de função",
              "Usar any em qualquer parte do código, mesmo com noImplicitAny ativado",
              "Importar um módulo que não existe no projeto, sem gerar erro nenhum",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
