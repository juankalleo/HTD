import { LessonBody } from "@/components/aprenda/lesson-body";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-revisando-uma-tela-ruim",
  title: "Projeto guiado: revisando uma tela ruim",
  summary: "Pega uma tela real de cadastro cheia de problemas e aplica, um a um, os quinze princípios anteriores da trilha.",
  estimatedMinutes: 24,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoRevisandoTelaRuim() {
  return (
    <LessonBody>
      <p>
        Chegou a hora de juntar tudo. Imagine uma tela de cadastro de projeto com a seguinte descrição: um cabeçalho
        com gradiente roxo-azul-rosa cobrindo a tela inteira, um título com um emoji 🚀 antes do texto, um card de
        formulário com efeito de vidro (glassmorphism) sobre esse fundo, cinco cores diferentes espalhadas nos
        elementos (incluindo bordas laranja e ícones verdes sem relação nenhuma entre si), campos de input só com
        placeholder (sem label), nenhum feedback de erro visível além de uma borda vermelha, textos todos do mesmo
        tamanho e peso, elementos desalinhados entre si, e um botão final escrito apenas "Enviar".
      </p>
      <p>
        Essa lista de problemas não é exagero — é uma combinação real de tudo que as quinze lições anteriores
        ensinaram a evitar. Vamos revisar um por um.
      </p>

      <h2>1. Hierarquia visual (lição 2)</h2>
      <p>
        Título, labels e texto de apoio com o mesmo tamanho e peso não dão nenhuma pista de onde começar. A correção:
        título maior e mais pesado, labels com peso médio, texto de apoio menor e com contraste reduzido —
        estabelecendo uma ordem clara de leitura.
      </p>

      <h2>2. Cor com propósito, não cinco cores brigando (lição 3)</h2>
      <p>
        Reduzir pra uma paleta de três papéis seguindo 60-30-10: uma cor neutra dominante de fundo, uma secundária
        pra textos de apoio e ícones, e uma única cor de destaque reservada pro botão principal — nada de laranja,
        verde e roxo competindo sem relação entre si.
      </p>

      <h2>3. Cortando o visual genérico de IA (lição 9)</h2>
      <p>
        O gradiente decorativo, o emoji 🚀 no título e o glassmorphism sem propósito saem. No lugar: um fundo sólido
        neutro, um título sem emoji (ou com um ícone SVG de verdade, se fizer sentido), e o card do formulário com uma
        superfície opaca de contraste real, sem depender de blur.
      </p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
        bad={
          <div
            style={{
              background: "linear-gradient(135deg,#7c3aed,#3b82f6,#ec4899)",
              borderRadius: 16,
              padding: "24px",
              width: 260,
            }}
          >
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>🚀 Novo projeto</div>
            <div
              style={{
                background: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255,255,255,0.35)",
                borderRadius: 12,
                padding: "14px",
                color: "rgba(255,255,255,0.85)",
                fontSize: 13,
              }}
            >
              nome do projeto
            </div>
          </div>
        }
        good={
          <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "24px", width: 260 }}>
            <div style={{ color: "#0f172a", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>Novo projeto</div>
            <div style={{ fontSize: 12, color: "#475569", marginBottom: 4 }}>Nome do projeto</div>
            <div style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: "#94a3b8" }}>
              ex: Site institucional
            </div>
          </div>
        }
      />

      <h2>4. Labels de verdade, não só placeholder (lições 6 e 11)</h2>
      <p>
        Cada campo ganha um label visível e associado por <code>htmlFor</code>/<code>id</code>, além do placeholder
        que serve só de dica de formato. Isso resolve tanto a affordance do campo quanto o problema de o placeholder
        desaparecer assim que a pessoa começa a digitar.
      </p>

      <h2>5. Erro com mais de um canal (lição 11)</h2>
      <p>
        A borda vermelha sozinha vira borda vermelha + ícone + texto explicando o problema — garantindo que a
        informação chegue mesmo pra quem não distingue bem a cor vermelha isoladamente.
      </p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
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
              <span>Falta o domínio do e-mail (ex: @gmail.com)</span>
            </div>
          </div>
        }
      />

      <h2>6. Alinhamento e grid de espaçamento (lição 10)</h2>
      <p>
        Cada campo, label e botão passa a se alinhar à mesma borda esquerda do card, e os espaçamentos internos
        (entre label e campo, entre campos, antes do botão) seguem uma escala de 8px em vez de valores soltos —
        nada fica "quase alinhado".
      </p>

      <h2>7. Microcopy específica no botão (lição 13)</h2>
      <p>
        "Enviar" vira "Criar projeto" — o texto do botão passa a dizer exatamente o que a ação faz, sem exigir que a
        pessoa releia o formulário inteiro pra ter certeza.
      </p>

      <h2>8. Estado de loading no envio (lição 8)</h2>
      <p>
        Ao clicar em "Criar projeto", o botão reduz opacidade e mostra um indicador de carregamento, impedindo clique
        duplicado enquanto a requisição não retorna — resolvendo a confusão entre "não funcionou" e "está
        processando".
      </p>

      <Exercise
        prompt={
          <p>
            A mesma tela também tem dois botões com exatamente a mesma aparência visual: "Criar projeto" (ação
            principal) e "Cancelar" (ação secundária, que descarta o formulário). Qual princípio das lições
            anteriores explica por que isso é um problema, e como corrigir?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Hierarquia visual (lição 2) e proporção de cor (lição 3): duas ações com
peso visual idêntico não comunicam qual é a principal, e uma ação
destrutiva/secundária com o mesmo destaque de uma ação de confirmação pode
até ser clicada por engano. A correção é dar à ação principal ("Criar
projeto") o tratamento da cor de destaque (10% da paleta) e deixar
"Cancelar" com um estilo neutro e discreto, como texto ou contorno sem
preenchimento.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Numa revisão de tela, qual é a ordem de raciocínio mais direta pra identificar hierarquia visual quebrada?",
            options: [
              "Contar quantas cores diferentes existem na tela e reduzir pela metade",
              "Verificar se todo elemento tem a mesma sombra aplicada, para parecer consistente",
              "Checar se tamanho, peso e contraste guiam o olho pro que é mais importante primeiro, ou se tudo compete pela mesma atenção",
              "Medir o tempo de carregamento da página em milissegundos",
            ],
            correctIndex: 2,
          },
          {
            question: "Ao revisar uma tela com visual 'genérico de IA' (gradiente decorativo, emoji em vez de ícone, glassmorphism sem propósito), qual é o critério prático pra decidir o que trocar?",
            options: [
              "Remover toda cor da tela e deixar apenas preto e branco",
              "Trocar qualquer elemento arredondado por um elemento totalmente quadrado",
              "Manter os elementos decorativos, mas reduzir o tamanho da fonte do restante do texto",
              "Perguntar se aquele elemento tem uma função real na hierarquia e no significado da marca, ou se está lá só pra 'parecer moderno'",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
