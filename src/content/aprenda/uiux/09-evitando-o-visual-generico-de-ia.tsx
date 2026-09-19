import { LessonBody } from "@/components/aprenda/lesson-body";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-evitando-o-visual-generico-de-ia",
  title: "Evitando o visual genérico de IA (AI slop)",
  summary: "Gradiente roxo-azul, emoji em botão, glassmorphism em tudo — um punhado de atalhos que virou sinônimo de 'ninguém pensou nisso de verdade'.",
  estimatedMinutes: 18,
  level: "intermediario",
};

export default function Licao09EvitandoOVisualGenericoDeIa() {
  return (
    <LessonBody>
      <p>
        Você já viu uma tela que "grita" ser genérica antes mesmo de saber por quê. Não é preconceito contra
        ferramentas de IA — é que um punhado de decisões visuais virou atalho tão repetido (por templates, gerador de
        landing page, ferramentas de geração de UI) que passou a significar, pra quem olha, <strong>"ninguém tomou
        uma decisão de verdade aqui"</strong>. Reconhecer esses padrões é o primeiro passo pra evitá-los.
      </p>

      <h2>Gradiente roxo-azul-rosa genérico</h2>
      <p>
        Um gradiente diagonal saindo de roxo pra azul (às vezes terminando em rosa) virou o "papel de parede padrão"
        de quem quer parecer moderno sem tomar nenhuma decisão de marca. O problema não é o gradiente em si — é que{" "}
        <strong>essa combinação específica não significa nada sobre o produto</strong>. Ela não vem da paleta da
        marca, não segue o raciocínio de proporção da lição 3, está ali só porque "parece tech". Uma paleta com
        propósito, mesmo que mais simples (uma cor sólida com significado, seguindo 60-30-10), comunica mais cuidado
        do que um gradiente bonito e vazio.
      </p>

      <h2>Emoji no lugar de ícone</h2>
      <p>
        Usar <strong>✨</strong>, <strong>🚀</strong> ou <strong>💡</strong> dentro de um botão ou título, no lugar de
        um ícone de verdade, é outro atalho comum. O problema prático: emoji renderiza de forma diferente em cada
        sistema operacional e navegador — você não controla o traço, o peso nem a cor dele do mesmo jeito que
        controla um ícone de biblioteca (Lucide, Heroicons, Phosphor). Ele também não tem estado (não muda de cor no{" "}
        <code>:hover</code>, não herda o peso visual do resto do design) e frequentemente destoa do resto da
        composição tipográfica. Um ícone SVG de verdade, no stroke-width e tamanho combinando com o restante da
        interface, comunica a mesma ideia com controle total sobre a aparência.
      </p>

      <h2>Glassmorphism forçado sem propósito</h2>
      <p>
        Blur de fundo (<code>backdrop-filter: blur(...)</code>) combinado com transparência pode ser uma técnica
        legítima — quando existe um propósito real de camada, como um menu flutuante sobre conteúdo dinâmico que
        precisa continuar parcialmente visível atrás dele. O problema é aplicar esse efeito em <strong>tudo</strong> —
        cards, botões, seções inteiras — só pela estética "vidro fosco". Isso reduz contraste (o texto some contra o
        fundo variável atrás do blur, entrando em conflito direto com o que a lição 11 cobre sobre acessibilidade) e
        vira ruído visual sem hierarquia: se tudo é "vidro flutuante", nada realmente flutua.
      </p>

      <h2>Border-radius exagerado e sombra flutuante "fofinha"</h2>
      <p>
        Cantos extremamente arredondados (perto de virar pílula) combinados com uma sombra suave e difusa em{" "}
        <strong>todo</strong> elemento — botão, card, input, imagem — sem exceção, é outro padrão que ficou associado
        a "gerado rápido, sem hierarquia real". Quando cada elemento recebe exatamente o mesmo tratamento visual,
        elementos de importância diferente (uma ação principal e uma legenda secundária, por exemplo) ficam com o
        mesmo peso visual — o oposto do que a lição 2 ensina sobre hierarquia.
      </p>

      <h2>Comparando lado a lado</h2>
      <Compare
        badLabel="Genérico"
        goodLabel="Com propósito"
        bad={
          <div
            style={{
              background: "linear-gradient(135deg,#7c3aed,#3b82f6,#ec4899)",
              borderRadius: 24,
              padding: "20px 32px",
              color: "#fff",
              fontWeight: 700,
              boxShadow: "0 25px 50px rgba(124,58,237,.5)",
            }}
          >
            ✨ Turbine seus resultados
          </div>
        }
        good={
          <div style={{ background: "#0f172a", borderRadius: 8, padding: "12px 22px", color: "#fff", fontWeight: 600 }}>
            Ver relatório completo
          </div>
        }
      />
      <Compare
        badLabel="Vidro sem propósito"
        goodLabel="Superfície com contraste real"
        bad={
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 20,
              padding: "18px 24px",
              color: "rgba(255,255,255,0.85)",
              width: 220,
            }}
          >
            Plano Pro — R$ 49/mês
          </div>
        }
        good={
          <div
            style={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 10,
              padding: "18px 24px",
              color: "#f1f5f9",
              width: 220,
              fontWeight: 500,
            }}
          >
            Plano Pro — R$ 49/mês
          </div>
        }
      />

      <Exercise
        prompt={
          <p>
            Uma landing page tem: fundo com gradiente roxo-azul-rosa cobrindo a tela inteira, título com emoji 🚀
            antes do texto, cards de preço em vidro semitransparente com blur, e todos os botões com{" "}
            <code>border-radius</code> de 999px (formato pílula) e sombra flutuante colorida. Escolha dois desses
            quatro elementos e diga o que trocaria por algo com mais propósito.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Exemplo de resposta: trocaria o fundo em gradiente por uma cor sólida
neutra (60% da paleta) com o roxo aparecendo só como cor de destaque (10%)
em pontos específicos, seguindo 60-30-10. E trocaria o emoji 🚀 do título
por nenhum ícone, ou por um ícone SVG de verdade combinando com o peso da
fonte do título — o emoji não agrega significado, só decora.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um gradiente roxo-azul-rosa genérico, usado só 'pra parecer moderno', é visto como sinal de pouco cuidado de design?",
            options: [
              "Porque gradientes são tecnicamente impossíveis de implementar em CSS puro",
              "Porque virou um atalho repetido sem relação com a identidade real do produto, ao contrário de uma paleta escolhida com propósito",
              "Porque gradientes sempre reduzem o contraste do texto abaixo do mínimo de acessibilidade",
              "Porque esse gradiente específico é registrado como marca por uma empresa de design",
            ],
            correctIndex: 1,
          },
          {
            question: "Qual é o principal problema de usar emoji (✨🚀💡) como substituto de ícone em um botão ou título?",
            options: [
              "O emoji renderiza de forma inconsistente entre sistemas e não tem o mesmo controle de estilo, peso e estado que um ícone de biblioteca",
              "Emoji não é suportado por nenhum navegador moderno em elementos de interface",
              "Usar emoji torna o HTML tecnicamente inválido segundo a especificação",
              "Emoji sempre aumenta o tamanho do arquivo CSS de forma proibitiva",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
