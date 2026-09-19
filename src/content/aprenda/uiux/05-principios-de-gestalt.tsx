import { LessonBody } from "@/components/aprenda/lesson-body";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-principios-de-gestalt",
  title: "Princípios de Gestalt aplicados a interface",
  summary: "O cérebro agrupa elementos automaticamente, com ou sem sua permissão — é melhor saber como.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao05PrincipiosDeGestalt() {
  return (
    <LessonBody>
      <p>
        A psicologia da Gestalt (início do século XX) descreveu como o cérebro humano agrupa elementos visuais
        automaticamente, antes de qualquer raciocínio consciente. Isso importa pra interface porque{" "}
        <strong>esse agrupamento acontece de qualquer jeito</strong> — a única pergunta é se ele confirma a estrutura
        real da sua tela ou entra em conflito com ela.
      </p>

      <h2>Proximidade</h2>
      <p>
        Itens colocados fisicamente perto uns dos outros são percebidos como relacionados, mesmo sem nenhuma borda ou
        cor os conectando. É por isso que a distância entre um label e seu campo de formulário importa mais do que
        parece: se o espaço entre o label e o campo <em>seguinte</em> for menor do que o espaço entre o label e o
        campo que ele realmente descreve, o olho associa o label ao campo errado.
      </p>
      <Compare
        bad={
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 220 }}>
            <span style={{ fontSize: 13, color: "#475569" }}>Nome completo</span>
            <div style={{ height: 8 }} />
            <div style={{ background: "#e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "#94a3b8" }}>
              digite aqui
            </div>
            <span style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>E-mail</span>
          </div>
        }
        good={
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 220 }}>
            <span style={{ fontSize: 13, color: "#475569" }}>Nome completo</span>
            <div style={{ background: "#e2e8f0", borderRadius: 6, padding: "8px 10px", fontSize: 13, color: "#94a3b8" }}>
              digite aqui
            </div>
            <div style={{ height: 14 }} />
            <span style={{ fontSize: 13, color: "#475569" }}>E-mail</span>
          </div>
        }
      />
      <p>
        No primeiro caso, o label "Nome completo" fica mais perto do campo abaixo do espaço maior, e mais longe do
        campo que ele deveria descrever — a proximidade confunde qual label pertence a qual campo. No segundo, o
        espaçamento reforça o agrupamento correto: label colado no seu campo, respiro maior antes do próximo grupo.
      </p>

      <h2>Similaridade</h2>
      <p>
        Itens que compartilham aparência — mesma cor, forma ou tamanho — são percebidos como parte do mesmo grupo,
        mesmo estando fisicamente distantes. É por isso que todos os links de navegação costumam ter a mesma cor: essa
        cor sozinha já comunica "esses elementos fazem parte do mesmo conjunto", sem precisar de mais nenhuma
        explicação.
      </p>

      <h2>Continuidade</h2>
      <p>
        O olho tende a seguir linhas e alinhamentos, presumindo que elementos alinhados numa mesma direção continuam
        relacionados. Uma lista de itens alinhados à esquerda é lida como uma sequência única; se um item quebra esse
        alinhamento, ele é percebido como "fora do grupo" mesmo que pertença logicamente a ele.
      </p>

      <h2>Figura-fundo</h2>
      <p>
        A percepção separa automaticamente o que é "figura" (o que está em primeiro plano, recebendo atenção) do que é
        "fundo" (o que sustenta, mas não deveria competir por atenção). Um modal com um overlay escurecendo o resto da
        tela usa exatamente esse princípio: ele diz ao cérebro "isso aqui atrás virou fundo, o modal é a figura agora".
      </p>

      <h2>Fechamento</h2>
      <p>
        O cérebro completa formas incompletas automaticamente. Um ícone feito só de alguns traços soltos — como um
        contorno tracejado de um quadrado — ainda é percebido como um quadrado, porque o cérebro "fecha" a forma
        sozinho. É por isso que ícones minimalistas com poucos traços ainda funcionam: você não precisa desenhar cada
        detalhe, só o suficiente pra o cérebro completar o resto.
      </p>

      <Exercise
        prompt={
          <p>
            Um menu de navegação tem cinco links. Quatro deles são azuis e sublinhados; o quinto (que na verdade faz
            parte do mesmo menu) é cinza e sem sublinhado, só porque foi adicionado depois por outra pessoa do time.
            Qual princípio de Gestalt explica por que esse quinto link parece "não pertencer" ao menu, e como
            resolver?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Similaridade: itens com a mesma aparência (cor, sublinhado) são lidos como
parte do mesmo grupo. Como o quinto link tem estilo diferente dos outros
quatro, o cérebro naturalmente o separa do grupo, mesmo que estruturalmente
ele pertença ao mesmo menu. A correção é aplicar o mesmo estilo (cor e
sublinhado) aos cinco links.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O princípio de Gestalt da similaridade diz que:",
            options: [
              "Itens posicionados fisicamente perto uns dos outros são sempre lidos como duplicados",
              "Elementos alinhados em uma linha reta são percebidos como continuação um do outro",
              "Itens que compartilham a mesma aparência (cor, forma, tamanho) são percebidos como parte do mesmo grupo",
              "Um espaço vazio ao redor de um elemento aumenta o contraste dele com o fundo",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que um label posicionado mais perto do campo errado, num formulário, gera confusão mesmo que o texto esteja correto?",
            options: [
              "Porque o princípio da proximidade faz a pessoa associar o label ao elemento fisicamente mais próximo dele, não ao que faz sentido logicamente",
              "Porque o navegador ignora a ordem visual e sempre lê o HTML de cima pra baixo",
              "Porque isso quebra a validação HTML do formulário automaticamente",
              "Porque cores diferentes entre label e campo tornam a leitura impossível",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
