import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-tipos",
  title: "Por que tipos (JS vs TS)",
  summary: "TypeScript não é uma linguagem nova — é JavaScript mais uma camada de checagem que roda antes de executar.",
  estimatedMinutes: 12,
};

export default function Licao01PorQueTipos() {
  return (
    <LessonBody>
      <p>
        TypeScript é JavaScript com uma camada de <strong>tipos</strong> em cima — todo JavaScript válido já é
        TypeScript válido. A diferença: o compilador TS checa, <em>antes</em> do código rodar, se os tipos batem. Um
        erro que em JS só apareceria em produção (ou pior, silenciosamente) vira um erro no editor, na hora de
        escrever.
      </p>

      <h2>O bug clássico que TypeScript pega antes de rodar</h2>
      <CodeExample
        label="JavaScript — só quebra em runtime"
        language="javascript"
        code={`function calcularDesconto(preco, percentual) {
  return preco - preco * (percentual / 100);
}

calcularDesconto(100, "10"); // roda, mas "10"/100 vira NaN silenciosamente
calcularDesconto("100", 10);  // "100" - 10 vira NaN também — sem erro nenhum na hora`}
      />
      <CodeExample
        label="TypeScript — erro ANTES de rodar"
        language="typescript"
        code={`function calcularDesconto(preco: number, percentual: number): number {
  return preco - preco * (percentual / 100);
}

calcularDesconto(100, "10");
// Error: Argument of type 'string' is not assignable to parameter of type 'number'.
// — o editor já avisa, sem precisar rodar o código pra descobrir`}
      />

      <h2>TypeScript some no navegador</h2>
      <p>
        O navegador não entende TypeScript — nunca entendeu. O compilador (<code>tsc</code>, ou o próprio Next.js por
        baixo) transforma o código TS em JS puro antes de rodar; os tipos são <strong>apagados</strong> nesse
        processo, não sobram vestígios em produção. É por isso que TypeScript não deixa nada "mais lento" — é 100%
        checagem em tempo de desenvolvimento.
      </p>

      <h2>Quando isso compensa</h2>
      <p>
        Num script de 10 linhas, talvez não valha o esforço. Num projeto com várias pessoas, funções chamadas de
        muitos lugares, e um objeto que passa por 5 camadas até virar tela — os tipos documentam o contrato entre
        as partes, e o editor avisa no mesmo instante que alguém quebra esse contrato em qualquer lugar do código.
      </p>

      <Quiz
        track="typescript"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que acontece com os tipos do TypeScript quando o código chega no navegador?",
            options: [
              "Continuam lá, o navegador os interpreta",
              "São completamente apagados durante a compilação — o navegador só recebe JavaScript puro",
              "Viram comentários",
              "O navegador precisa de uma extensão especial",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual a principal vantagem de calcularDesconto(preco: number, ...) sobre a versão sem tipo?",
            options: [
              "O código roda mais rápido",
              "Passar um tipo errado (ex.: string em vez de number) já é sinalizado no editor, antes de rodar",
              "Não tem vantagem real",
              "Só funciona com essa vantagem em produção",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
