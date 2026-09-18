import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-prototypes-e-classes",
  title: "Prototypes e classes ES6",
  summary: "class parece Java ou C#, mas por baixo é o mesmo mecanismo de protótipo que sempre existiu em JavaScript.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao11PrototypesEClasses() {
  return (
    <LessonBody>
      <p>
        JavaScript não tem herança por classe "de verdade" como Java ou C# — o que existe por baixo é{" "}
        <strong>herança prototípica</strong>. <code>class</code> é uma forma mais legível de escrever a mesma coisa,
        não um mecanismo novo.
      </p>

      <h2>Todo objeto tem um protótipo</h2>
      <p>
        Quando você acessa uma propriedade que um objeto não tem diretamente, o motor de JavaScript procura no{" "}
        <strong>protótipo</strong> desse objeto — um outro objeto ligado a ele por baixo dos panos.
      </p>
      <CodeExample
        language="javascript"
        code={`const animal = {
  emitirSom() {
    console.log("Algum som genérico");
  },
};

const cachorro = Object.create(animal); // cachorro nasce com "animal" como seu protótipo
cachorro.emitirSom(); // "Algum som genérico" — cachorro não tem esse método, mas encontra no protótipo

Object.getPrototypeOf(cachorro) === animal; // true`}
      />

      <h2>A forma antiga: função construtora + prototype</h2>
      <p>
        Antes do <code>class</code> existir (ES6, 2015), esse mesmo padrão era escrito com função construtora e o
        objeto <code>.prototype</code> dela:
      </p>
      <CodeExample
        language="javascript"
        code={`function Animal(nome) {
  this.nome = nome;
}
Animal.prototype.emitirSom = function () {
  console.log(\`\${this.nome} faz um som\`);
};

const rex = new Animal("Rex");
rex.emitirSom(); // "Rex faz um som" — o método está em Animal.prototype, não em rex diretamente
rex.hasOwnProperty("emitirSom"); // false — confirma que veio do protótipo, não do próprio rex`}
      />

      <h2>class, extends e super</h2>
      <CodeExample
        language="javascript"
        code={`class Animal {
  constructor(nome) {
    this.nome = nome;
  }
  emitirSom() {
    console.log(\`\${this.nome} faz um som\`);
  }
}

class Cachorro extends Animal {
  emitirSom() {
    super.emitirSom(); // chama a versão de Animal antes de continuar
    console.log(\`\${this.nome} late: Au au!\`);
  }
}

const rex = new Cachorro("Rex");
rex.emitirSom();
// "Rex faz um som"
// "Rex late: Au au!"`}
      />
      <p>
        <code>extends</code> monta a cadeia de protótipos pra você; <code>super</code> chama o construtor ou método
        da classe pai a partir da classe filha.
      </p>

      <h2>Por que class é "açúcar sintático"</h2>
      <p>
        Nenhum mecanismo novo foi criado no ES6 — <code>class</code> só organiza o mesmo padrão de função construtora
        + prototype numa sintaxe mais parecida com outras linguagens.
      </p>
      <CodeExample
        language="javascript"
        code={`typeof Animal; // "function" — por baixo, uma class é uma função especial

Object.getPrototypeOf(rex) === Cachorro.prototype;             // true
Object.getPrototypeOf(Cachorro.prototype) === Animal.prototype; // true — a cadeia que extends monta`}
      />

      <Exercise
        prompt={
          <p>
            Crie uma classe <code>Veiculo</code> com <code>constructor(marca)</code> e um método{" "}
            <code>descrever()</code> que retorna <code>"Veículo da marca X"</code>. Depois crie{" "}
            <code>Carro extends Veiculo</code> que sobrescreve <code>descrever()</code> chamando{" "}
            <code>super.descrever()</code> e completando com <code>", tipo carro"</code>.
          </p>
        }
        solutionLanguage="javascript"
        solutionCode={`class Veiculo {
  constructor(marca) {
    this.marca = marca;
  }
  descrever() {
    return \`Veículo da marca \${this.marca}\`;
  }
}

class Carro extends Veiculo {
  descrever() {
    return super.descrever() + ", tipo carro";
  }
}

const meuCarro = new Carro("Toyota");
meuCarro.descrever(); // "Veículo da marca Toyota, tipo carro"`}
      />

      <Quiz
        track="javascript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que dizemos que class é 'açúcar sintático' em JavaScript?",
            options: [
              "Porque class não existe de verdade — é convertida em JSON antes de rodar",
              "Porque toda class é obrigatoriamente convertida num arquivo separado antes da execução",
              "Porque por baixo ela usa o mesmo mecanismo de função construtora e prototype que já existia antes do ES6, só com uma sintaxe mais legível",
              "Porque class só funciona dentro de módulos ES, nunca em código solto",
            ],
            correctIndex: 2,
          },
          {
            question: "O que Object.create(animal) faz ao criar cachorro?",
            options: [
              "Cria um objeto novo cujo protótipo é animal — métodos de animal ficam acessíveis em cachorro por herança",
              "Copia todas as propriedades de animal pra dentro de cachorro, criando duas cópias independentes",
              "Cria uma classe nova chamada cachorro, que futuramente poderá usar extends",
              "Impede que cachorro tenha suas próprias propriedades além das herdadas de animal",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
