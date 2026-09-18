import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-acessibilidade-na-pratica",
  title: "Acessibilidade na prática",
  summary: "Não é 'polimento pra depois' — é o que decide se quem usa teclado ou leitor de tela consegue usar a tela.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao13AcessibilidadeNaPratica() {
  return (
    <LessonBody>
      <p>
        É fácil tratar acessibilidade como "polimento pra depois do prazo" — mas ela não é sobre deixar a tela mais
        bonita pra uma minoria. É sobre se uma parte real dos seus usuários — quem navega só com teclado, quem usa
        leitor de tela, quem tem baixa visão — consegue <strong>usar</strong> a funcionalidade, não só vê-la.
      </p>

      <h2>Label associado a input</h2>
      <p>
        Usar só um <code>placeholder</code> como identificação de campo é um erro comum: o placeholder{" "}
        <strong>desaparece assim que o usuário começa a digitar</strong>, e nem todo leitor de tela o anuncia como
        rótulo do campo.
      </p>
      <CodeExample
        label="Errado — só placeholder"
        language="xml"
        code={`<input type="email" placeholder="E-mail" class="border rounded-lg px-3 py-2" />`}
      />
      <CodeExample
        label="Certo — label associado por htmlFor/id"
        language="xml"
        code={`<label htmlFor="email" class="text-sm font-medium text-slate-700">E-mail</label>
<input id="email" type="email" class="border rounded-lg px-3 py-2" />`}
      />

      <h2>Foco de teclado</h2>
      <p>
        Muita gente navega uma tela inteira só com <kbd>Tab</kbd>, sem tocar no mouse. Se você remove o contorno
        padrão de foco (<code>outline: none</code>) sem colocar nada visível no lugar, essa pessoa perde a referência
        de qual elemento está ativo — o teclado continua funcionando, mas ninguém enxerga onde ele está.
      </p>
      <CodeExample
        label="Substituindo o outline padrão por um estilo de foco visível"
        language="xml"
        code={`<button class="bg-blue-600 text-white px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2">
  Salvar
</button>`}
      />
      <p>
        <code>focus-visible:</code> aplica o anel só quando o foco veio do teclado (não de um clique de mouse) — o
        melhor dos dois mundos: sem anel "sujando" o clique do mouse, mas com referência clara pra quem navega via
        teclado.
      </p>

      <h2>Contraste de cor</h2>
      <p>
        Texto cinza-claro sobre fundo branco pode parecer "elegante" e ser ilegível pra quem tem baixa visão. A regra
        do WCAG pra texto normal é uma razão de contraste mínima de <strong>4.5:1</strong> entre texto e fundo (3:1
        pra texto grande) — dá pra checar isso com o próprio DevTools do navegador, sem ferramenta externa.
      </p>
      <CodeExample
        label="Contraste insuficiente vs. suficiente"
        language="xml"
        code={`<!-- text-slate-300 sobre bg-white: contraste baixo demais pra texto de corpo -->
<p class="text-slate-300 bg-white">Texto quase ilegível</p>

<!-- text-slate-600 sobre bg-white: passa no contraste mínimo -->
<p class="text-slate-600 bg-white">Texto legível</p>`}
      />

      <h2>Por que isso não é "polimento de depois"</h2>
      <p>
        Adicionar label, foco visível e contraste correto <strong>depois</strong> que a tela já foi construída sem
        eles custa muito mais do que fazer certo desde o início — cada componente novo criado sem esse cuidado é mais
        um lugar pra corrigir depois. E o problema não é abstrato: sem isso, uma pessoa real fica de fato bloqueada de
        completar uma tarefa, não é só uma questão estética.
      </p>

      <Exercise
        prompt={
          <p>
            O formulário abaixo tem dois problemas de acessibilidade. Encontre e corrija os dois.
            <br />
            <code>{'<input placeholder="Senha" type="password" class="outline-none border rounded-lg px-3 py-2" />'}</code>
          </p>
        }
        solutionLanguage="xml"
        solutionCode={`<!-- Problema 1: só placeholder, sem label associado.
     Problema 2: outline-none remove o foco sem substituir por nada visível. -->

<label htmlFor="senha" class="text-sm font-medium text-slate-700">Senha</label>
<input
  id="senha"
  type="password"
  class="border rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
/>`}
      />

      <Callout href="/padrao-frontend/conceitos-tecnicos/acessibilidade">
        As convenções completas de acessibilidade do padrão — semântica de HTML, ARIA quando necessário, checklist de
        revisão — estão documentadas no Padrão Frontend.
      </Callout>

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que usar só um placeholder como identificação do campo é um problema de acessibilidade?",
            options: [
              "Porque placeholder não é uma propriedade válida em HTML, só em React",
              "Porque o navegador ignora completamente qualquer input sem um value inicial",
              "Porque o placeholder desaparece assim que o usuário digita, e nem todo leitor de tela o anuncia como rótulo do campo",
              "Porque placeholder deixa o formulário mais lento para carregar",
            ],
            correctIndex: 2,
          },
          {
            question: "O que está errado em remover o outline do foco (outline: none) sem colocar nada no lugar?",
            options: [
              "Quem navega só pelo teclado perde a referência visual de qual elemento está focado na tela",
              "Nada — outline é só um detalhe visual sem nenhum efeito funcional",
              "Isso quebra o CSS do restante da página, fazendo elementos vizinhos sumirem",
              "Isso faz o formulário parar de validar os campos ao enviar",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
