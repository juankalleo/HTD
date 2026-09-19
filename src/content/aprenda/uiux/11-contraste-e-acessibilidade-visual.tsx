import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Callout } from "@/components/aprenda/callout";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-contraste-e-acessibilidade-visual",
  title: "Contraste e acessibilidade visual",
  summary: "Um texto cinza-claro sobre branco pode parecer elegante pra você e ser ilegível pra uma parte real de quem usa a tela.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao11ContrasteEAcessibilidadeVisual() {
  return (
    <LessonBody>
      <p>
        Esta lição olha pra acessibilidade do lado da <strong>percepção</strong>: o que faz um contraste ser
        suficiente ou insuficiente, e por que informação que depende só de cor exclui uma parte real de quem usa sua
        tela. A implementação em código — label associado, foco visível, HTML semântico — fica pra frente na trilha
        de Frontend.
      </p>

      <h2>O que o número de contraste realmente mede</h2>
      <p>
        O WCAG define uma razão de contraste mínima de <strong>4.5:1</strong> entre texto e fundo para texto normal
        (3:1 pra texto grande). Esse número não é sobre "usar preto e branco" — é sobre a diferença de{" "}
        <strong>luminância</strong> entre as duas cores ser grande o suficiente pra a maioria das pessoas distinguir o
        texto sem esforço extra, mesmo com telas de qualidade variável, luz ambiente forte, ou visão reduzida. Texto
        claro sobre fundo escuro pode passar tão bem quanto texto escuro sobre fundo claro — o que importa é a
        diferença entre os dois, não qual lado é mais escuro.
      </p>
      <CodeExample
        label="Contraste insuficiente vs. suficiente"
        language="css"
        code={`/* #cbd5e1 sobre #ffffff: contraste baixo demais para texto de corpo */
.texto-fraco { color: #cbd5e1; background: #ffffff; }

/* #475569 sobre #ffffff: passa no contraste mínimo de 4.5:1 */
.texto-legivel { color: #475569; background: #ffffff; }`}
      />

      <h2>Cor sozinha nunca deveria carregar a informação inteira</h2>
      <p>
        Um erro comum: sinalizar erro de um campo só mudando a cor da borda pra vermelho, sem mais nada. Isso falha
        pra quem tem daltonismo — o mais comum é a dificuldade de distinguir vermelho de verde — porque a diferença de
        cor que parece óbvia pra você pode não ser perceptível pra essa pessoa. A cor pode (e deve) reforçar a
        mensagem, mas nunca deveria ser o único canal.
      </p>
      <Compare
        badLabel="Só cor"
        goodLabel="Cor + ícone + texto"
        bad={
          <div style={{ width: 220 }}>
            <div style={{ border: "2px solid #dc2626", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#334155" }}>
              usuario@email
            </div>
          </div>
        }
        good={
          <div style={{ width: 220 }}>
            <div style={{ border: "2px solid #dc2626", borderRadius: 8, padding: "8px 10px", fontSize: 13, color: "#334155" }}>
              usuario@email
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 6, color: "#dc2626", fontSize: 12 }}>
              <span aria-hidden="true">⚠</span>
              <span>E-mail inválido — falta o domínio (ex: @gmail.com)</span>
            </div>
          </div>
        }
      />

      <Callout
        title="A implementação em código está na trilha de Frontend"
        href="/aprenda/frontend/13-acessibilidade-na-pratica"
        linkLabel="Ver aula de Frontend →"
      >
        Label associado por <code>htmlFor</code>/<code>id</code>, <code>focus-visible</code>, e como testar contraste
        no DevTools — tudo isso do lado da implementação está detalhado na aula de acessibilidade na prática da
        trilha de Frontend.
      </Callout>

      <Callout href="/padrao-frontend/conceitos-tecnicos/acessibilidade">
        As convenções completas de acessibilidade do padrão de produção — semântica de HTML, ARIA quando necessário,
        checklist de revisão — estão documentadas no Padrão Frontend.
      </Callout>

      <Exercise
        prompt={
          <p>
            Um formulário de cadastro sinaliza campo obrigatório não preenchido apenas deixando a borda do campo
            vermelha, sem nenhum outro elemento. Aponte por que isso é insuficiente e o que adicionar.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Insuficiente porque depende só da cor pra comunicar o problema — quem tem
dificuldade de distinguir vermelho (a confusão mais comum é vermelho-verde)
pode não perceber a borda como "diferente" o suficiente. Adicionar um ícone
de alerta e um texto curto explicando o que falta ("Campo obrigatório")
garante que a informação chegue por pelo menos dois canais, não só cor.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O contraste mínimo do WCAG AA (aproximadamente 4.5:1) pra texto normal existe pra garantir o quê, na prática?",
            options: [
              "Que a diferença de luminância entre texto e fundo seja grande o suficiente pra a maioria das pessoas conseguir ler sem esforço extra",
              "Que o texto sempre apareça em preto e o fundo sempre em branco",
              "Que o navegador aplique automaticamente um filtro de escala de cinza na página",
              "Que a fonte usada tenha um peso mínimo de 700 (bold)",
            ],
            correctIndex: 0,
          },
          {
            question: "Por que uma mensagem de erro que só muda a cor da borda do campo pra vermelho, sem ícone nem texto, é insuficiente?",
            options: [
              "Porque a cor vermelha é tecnicamente reservada pelo navegador pra outros usos",
              "Porque bordas coloridas não são suportadas em campos do tipo password",
              "Porque isso deixa o campo mais lento para validar no formulário",
              "Porque quem tem daltonismo (como o mais comum, vermelho-verde) pode não perceber a diferença de cor sozinha",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
