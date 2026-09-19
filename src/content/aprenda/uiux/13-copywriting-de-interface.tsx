import { LessonBody } from "@/components/aprenda/lesson-body";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-copywriting-de-interface",
  title: "Copywriting de interface (microcopy)",
  summary: "'Erro ocorreu' não ajuda ninguém — o texto de uma interface também é uma decisão de design, não só de conteúdo.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao13CopywritingDeInterface() {
  return (
    <LessonBody>
      <p>
        É comum tratar o texto de botões, erros e estados vazios como "detalhe que qualquer um preenche depois". Mas
        esse texto — chamado de <strong>microcopy</strong> — é parte do design tanto quanto cor e espaçamento: ele é
        a última coisa que confirma (ou não) se a pessoa entendeu o que vai acontecer antes de agir.
      </p>

      <h2>Texto de botão específico</h2>
      <p>
        Um botão com texto genérico como "Enviar" ou "OK" exige que a pessoa releia o contexto ao redor pra ter
        certeza do que vai acontecer ao clicar. Um texto específico como <strong>"Salvar alterações"</strong> ou{" "}
        <strong>"Criar conta"</strong> elimina essa incerteza — a ação e o resultado ficam claros só de olhar o
        botão, sem depender do resto da tela.
      </p>
      <Compare
        badLabel="Genérico"
        goodLabel="Específico"
        bad={<div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 600 }}>Enviar</div>}
        good={<div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 24px", color: "#fff", fontWeight: 600 }}>Publicar artigo</div>}
      />

      <h2>Mensagem de erro que orienta a próxima ação</h2>
      <p>
        "Erro ocorreu" ou "Algo deu errado" informa que existe um problema, mas não dá nenhuma pista do que fazer a
        respeito — a pessoa fica travada. Uma boa mensagem de erro nomeia o problema em termos que fazem sentido pra
        quem usa (não um código técnico interno) e sugere o próximo passo.
      </p>
      <Compare
        badLabel="Não orienta"
        goodLabel="Orienta a próxima ação"
        bad={
          <div style={{ color: "#dc2626", fontSize: 13, background: "#fef2f2", borderRadius: 8, padding: "10px 14px", width: 240 }}>
            Erro ocorreu. Tente novamente.
          </div>
        }
        good={
          <div style={{ color: "#dc2626", fontSize: 13, background: "#fef2f2", borderRadius: 8, padding: "10px 14px", width: 240 }}>
            Esse e-mail já está cadastrado — tente entrar ou recuperar sua senha.
          </div>
        }
      />

      <h2>Estado vazio que orienta em vez de só constatar</h2>
      <p>
        Um estado vazio dizendo apenas "Nada aqui" ou "Nenhum resultado" descreve a situação, mas não ajuda a pessoa a
        sair dela. Um bom texto de estado vazio orienta a próxima ação concreta: "Você ainda não tem nenhum projeto —
        crie o primeiro pra começar", com um botão logo abaixo já apontando pra essa ação.
      </p>

      <Exercise
        prompt={
          <p>
            Uma tela de configurações tem um botão "Enviar" que na verdade salva as preferências de notificação do
            usuário, e um estado vazio de "Nenhuma notificação" numa central de notificações vazia. Reescreva os dois
            textos seguindo os princípios desta lição.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Botão: "Salvar preferências" em vez de "Enviar" — nomeia exatamente o que
a ação faz.

Estado vazio: "Você está em dia — nenhuma notificação nova por enquanto"
em vez de "Nenhuma notificação" — confirma que não é um erro e tranquiliza
em vez de só constatar a ausência de conteúdo.`}
      />

      <Quiz
        track="uiux"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um texto de botão específico como 'Salvar alterações' é preferível a um genérico como 'Enviar' ou 'OK'?",
            options: [
              "Porque botões genéricos não são reconhecidos como elementos clicáveis pelos navegadores",
              "Porque textos mais longos sempre têm melhor contraste com o fundo do botão",
              "Porque o texto específico diz exatamente o que vai acontecer ao clicar, reduzindo a incerteza de quem usa",
              "Porque 'Enviar' e 'OK' são palavras reservadas que quebram formulários HTML",
            ],
            correctIndex: 2,
          },
          {
            question: "O que uma boa mensagem de erro deveria fazer além de avisar que algo deu errado?",
            options: [
              "Mostrar o código de erro técnico completo, retornado pelo servidor",
              "Indicar o que a pessoa pode fazer para resolver ou continuar a partir dali",
              "Usar sempre a cor vermelha em letras maiúsculas para chamar atenção",
              "Fechar automaticamente o formulário para evitar nova tentativa",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
