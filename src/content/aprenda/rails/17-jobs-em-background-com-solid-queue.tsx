import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "17-jobs-em-background-com-solid-queue",
  title: "Background jobs com Solid Queue",
  summary:
    "Se a resposta HTTP só pode voltar depois que um e-mail terminar de ser enviado, o usuário está esperando por algo que não devia bloquear a requisição.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao17JobsEmBackgroundComSolidQueue() {
  return (
    <LessonBody>
      <p>
        Enviar e-mail, chamar uma API externa lenta, gerar um relatório pesado — nada disso precisa (nem deveria)
        rodar <strong>dentro</strong> do ciclo de um request. Se acontece ali, o usuário fica esperando a resposta
        até esse trabalho terminar, e se o serviço externo estiver lento ou fora do ar, o request inteiro trava ou
        estoura timeout por causa de algo que não tinha relação direta com o que ele pediu.
      </p>

      <h2>deliver_now vs. deliver_later — a diferença que a lição de service objects não explicou</h2>
      <p>
        O service <code>FinalizarPedido</code> de lições anteriores já usava{" "}
        <code>PedidoMailer.confirmacao(@pedido).deliver_later</code> sem detalhar o porquê. Compare:
      </p>
      <CodeExample
        label="bloqueia a resposta"
        language="ruby"
        code={`PedidoMailer.confirmacao(@pedido).deliver_now   # espera o servidor de e-mail responder antes de continuar`}
      />
      <CodeExample
        label="não bloqueia — enfileira e segue"
        language="ruby"
        code={`PedidoMailer.confirmacao(@pedido).deliver_later   # devolve na hora; o envio roda depois, fora do request`}
      />
      <p>
        <code>deliver_later</code> não envia nada na hora — ele enfileira um job via Active Job. Quem realmente
        processa essa fila depois é o <strong>adapter</strong> configurado no projeto; em apps Rails mais novos, o
        padrão passou a ser o <code>Solid Queue</code>.
      </p>

      <h2>O que o Solid Queue resolve</h2>
      <p>
        <code>Solid Queue</code> grava os jobs pendentes numa tabela do próprio banco de dados relacional da
        aplicação, em vez de depender de um serviço externo à parte (como Redis, que ferramentas mais antigas como
        Sidekiq exigem) só pra manter a fila. Um processo separado (o worker) lê essa tabela e executa os jobs
        pendentes, na ordem e com as tentativas configuradas.
      </p>

      <h2>Um job próprio, além de mailer</h2>
      <CodeExample
        label="app/jobs/notificar_estoque_baixo_job.rb"
        language="ruby"
        code={`class NotificarEstoqueBaixoJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :polynomially_longer, attempts: 5

  def perform(produto)
    return unless produto.estoque < 10
    EstoqueMailer.alerta_baixo(produto).deliver_now
  end
end`}
      />
      <CodeExample
        label="enfileirando o job"
        language="ruby"
        code={`NotificarEstoqueBaixoJob.perform_later(produto)`}
      />
      <p>
        <code>perform_later</code> enfileira o job e retorna imediatamente — quem chamou não espera{" "}
        <code>perform</code> rodar. <code>retry_on StandardError, wait: :polynomially_longer, attempts: 5</code> diz
        ao Active Job: se <code>perform</code> levantar essa exceção, tente de novo automaticamente, até 5 vezes,
        esperando mais tempo a cada nova tentativa. Sem isso, uma falha temporária (rede instável, serviço externo
        fora do ar por alguns segundos) perderia o job silenciosamente, sem nenhuma nova tentativa.
      </p>

      <Exercise
        prompt={
          <p>
            Uma action hoje chama <code>RelatorioService.new(pedido).gerar_e_enviar</code> de forma síncrona,
            travando a resposta até o relatório terminar. Transforme isso num job assíncrono chamado por essa
            action.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class GerarRelatorioJob < ApplicationJob
  queue_as :default
  retry_on StandardError, wait: :polynomially_longer, attempts: 3

  def perform(pedido)
    RelatorioService.new(pedido).gerar_e_enviar
  end
end

# na action:
def gerar_relatorio
  GerarRelatorioJob.perform_later(@pedido)
  render json: { status: "relatório sendo processado" }, status: :accepted
end`}
      />

      <Callout href="/padrao-api/tecnologias/solid-queue">
        A configuração completa do Solid Queue do padrão — número de workers, filas separadas por prioridade,
        monitoramento — está documentada no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que enviar e-mail dentro do ciclo do request, com deliver_now, é um problema em produção?",
            options: [
              "Porque a resposta HTTP só volta depois que o envio terminar, deixando o usuário esperando por algo que não deveria bloquear a requisição",
              "Porque deliver_now só funciona em ambiente de desenvolvimento, nunca em produção",
              "Porque e-mails enviados com deliver_now não chegam ao destinatário corretamente",
              "Porque o Rails bloqueia automaticamente qualquer chamada de mailer fora de um job",
            ],
            correctIndex: 0,
          },
          {
            question: "O que retry_on StandardError, wait: :polynomially_longer, attempts: 5 configura num job?",
            options: [
              "Que o job será executado 5 vezes em paralelo, ao mesmo tempo, para garantir que funcione",
              "Que o Rails vai ignorar qualquer erro levantado dentro de perform, sem nenhum log",
              "Que, se perform levantar essa exceção, o Active Job tenta de novo automaticamente, até 5 vezes, esperando mais tempo a cada tentativa",
              "Que o job só roda se o Solid Queue detectar que há 5 outros jobs na fila",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
