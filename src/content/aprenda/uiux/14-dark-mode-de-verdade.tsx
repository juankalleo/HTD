import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { ColorSwatch } from "@/components/aprenda/color-swatch";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-dark-mode-de-verdade",
  title: "Dark mode de verdade",
  summary: "Inverter as cores não é dark mode — é recalcular contraste e elevação do zero.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao14DarkModeDeVerdade() {
  return (
    <LessonBody>
      <p>
        A forma mais rápida (e mais errada) de implementar dark mode é pegar cada cor do modo claro e inverter o
        valor de luminância. O resultado costuma ficar com contraste exagerado em uns lugares e insuficiente em
        outros, porque dark mode não é o modo claro de cabeça pra baixo — é um sistema com regras próprias de
        contraste e, principalmente, de <strong>elevação</strong>.
      </p>

      <h2>Elevação se inverte, não some</h2>
      <p>
        No modo claro, um elemento "elevado" (um card, um menu flutuante, um modal) costuma ficar branco ou quase
        branco, destacado do fundo por uma <strong>sombra</strong> — o convívio da sombra com um fundo claro sugere
        que aquele elemento está mais perto de quem olha. No modo escuro, sombra praticamente não aparece sobre um
        fundo já escuro — a convenção que substitui a sombra é a superfície ficar progressivamente{" "}
        <strong>mais clara</strong> quanto mais "elevada" (mais perto de quem olha) ela for.
      </p>
      <ColorSwatch
        colors={[
          { hex: "#121212", label: "Fundo", role: "base da tela, elevação 0" },
          { hex: "#1e1e1e", label: "Superfície 1", role: "card, elevação baixa" },
          { hex: "#2a2a2a", label: "Superfície 2", role: "menu, popover, elevação média" },
          { hex: "#383838", label: "Superfície 3", role: "modal, elevação alta" },
        ]}
      />
      <CodeExample
        label="Elevação em dark mode: mais claro = mais perto"
        language="css"
        code={`:root[data-theme="dark"] {
  --bg-base: #121212;
  --surface-1: #1e1e1e; /* card */
  --surface-2: #2a2a2a; /* menu, popover */
  --surface-3: #383838; /* modal */
}
/* no modo claro a lógica é oposta: a superfície mais elevada tende a ficar
   mais próxima do branco, apoiada por sombra, não por ficar mais escura */`}
      />

      <h2>Por que preto puro cansa mais do que cinza bem escuro</h2>
      <p>
        Usar <code>#000000</code> puro como fundo parece a escolha "mais escura possível", mas o contraste extremo
        entre preto absoluto e texto claro (branco puro, por exemplo) é desconfortável de sustentar por muito tempo —
        o olho precisa reajustar constantemente entre uma área com luminância zero e uma com luminância máxima bem
        ao lado. Um cinza bem escuro, como <code>#121212</code>, mantém contraste suficiente pra legibilidade sem
        esse salto extremo, e também disfarça melhor pequenas variações de tom entre elementos empilhados.
      </p>

      <h2>Contraste também precisa ser recalculado, não invertido</h2>
      <p>
        Uma cor de destaque saturada que funciona bem no modo claro (por exemplo, um azul vibrante sobre fundo branco)
        pode ficar com contraste insuficiente ou "vibrar" desconfortavelmente sobre um fundo escuro. Cores de
        destaque em dark mode geralmente precisam de ajuste de saturação e luminosidade — não é o mesmo hex
        reaproveitado direto do modo claro.
      </p>

      <Exercise
        prompt={
          <p>
            Um projeto implementou dark mode invertendo cada cor do modo claro (branco virou preto puro, preto virou
            branco puro, o mesmo azul do botão primário foi mantido idêntico). Um card que tinha sombra pra se
            destacar no modo claro ficou "sem destaque nenhum" no modo escuro. O que ajustar?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Trocar o fundo de preto puro por um cinza bem escuro (ex: #121212), e dar
ao card uma cor de superfície mais clara que o fundo (ex: #1e1e1e) em vez
de depender de sombra — no modo escuro, elevação se comunica por
luminosidade da superfície, não por sombra, que quase não aparece sobre
fundo escuro. O azul do botão também merece revisão de saturação, já que
o mesmo tom pode não ter o mesmo contraste sobre um fundo escuro.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que dark mode não pode ser tratado apenas como 'inverter as cores' do modo claro?",
            options: [
              "Porque contraste e elevação (o que parece 'mais perto' de quem olha) precisam ser recalculados, não só invertidos",
              "Porque o CSS não permite inverter cores automaticamente em nenhum navegador",
              "Porque inverter cores deixa o texto sempre maior do que no modo claro",
              "Porque isso removeria todas as imagens da interface automaticamente",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que um cinza bem escuro (como #121212) costuma cansar menos os olhos do que preto puro (#000) como fundo de dark mode?",
            options: [
              "Porque o preto puro não é reconhecido como cor válida em CSS",
              "Porque cinza escuro carrega mais rápido no navegador do que preto puro",
              "Porque preto puro reduz o brilho da tela a zero, desligando o retroiluminado",
              "Porque o contraste extremo entre preto puro e texto claro cansa a vista mais do que um contraste um pouco mais suave",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
