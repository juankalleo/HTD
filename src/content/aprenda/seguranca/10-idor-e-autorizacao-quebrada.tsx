import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-idor-e-autorizacao-quebrada",
  title: "IDOR: quando autenticação existe mas autorização não",
  summary: "Trocar um número na URL não deveria abrir a porta do vizinho — mas é exatamente isso que IDOR permite.",
  estimatedMinutes: 18,
  level: "intermediario",
};

export default function Licao10IdorEAutorizacaoQuebrada() {
  return (
    <LessonBody>
      <p>
        IDOR (Insecure Direct Object Reference) é, na prática, o exemplo mais direto de um princípio que essa trilha
        já mencionou algumas vezes sem aprofundar: autenticação e autorização são <strong>perguntas diferentes</strong>.
        Um sistema pode acertar 100% na primeira (provar quem você é) e falhar completamente na segunda (decidir o
        que você pode acessar) — e é exatamente isso que IDOR explora.
      </p>

      <h2>O cenário: trocar um número na URL</h2>
      <p>
        Uma usuária, Ana, está logada e acessa o próprio pedido:
      </p>
      <CodeExample label="requisição normal de Ana" language="http" code={`GET /pedidos/123 HTTP/1.1
Cookie: sessao=abc123   (sessão de Ana, autenticada normalmente)`} />
      <p>
        Nada impede Ana de simplesmente editar a URL na barra de endereço e pedir <code>/pedidos/124</code> — um
        pedido de outra pessoa. Se o servidor responder com os dados normalmente, é porque ele checou só "existe uma
        sessão válida aqui?" e nunca chegou a perguntar "esse pedido específico pertence a quem está pedindo?".
      </p>
      <CodeExample
        label="app/controllers/pedidos_controller.rb — a falha"
        language="ruby"
        code={`class PedidosController < ApplicationController
  before_action :authenticate_usuario!   # só confirma QUEM está logado

  def show
    pedido = Pedido.find(params[:id])    # busca QUALQUER pedido pelo id, sem checar dono
    render json: pedido
  end
end`}
      />
      <p>
        <code>authenticate_usuario!</code> cumpriu perfeitamente o papel dele — Ana está, de fato, autenticada.{" "}
        <code>Pedido.find(params[:id])</code> é onde a falha mora: ele busca o registro pelo id recebido, sem nenhuma
        cláusula que restrinja isso ao usuário atual.
      </p>

      <h2>Autenticação vs. autorização, sem confundir de novo</h2>
      <p>
        <strong>Autenticação</strong> responde "quem é você?" — login, sessão, token, tudo que essa trilha cobriu até
        aqui. <strong>Autorização</strong> responde "o que você, especificamente, tem permissão de fazer ou ver?" —
        uma pergunta que precisa ser refeita a cada recurso acessado, não só uma vez no início da requisição. Um
        sistema pode ter uma autenticação impecável (hash de senha correto, JWT bem assinado, cookie com todos os
        atributos certos) e ainda assim estar cheio de IDOR, porque essas são camadas completamente independentes.
      </p>

      <Compare
        badLabel="Só autenticação"
        goodLabel="Autenticação + autorização"
        bad={
          <CodeExample
            language="ruby"
            code={`def show
  pedido = Pedido.find(params[:id])
  render json: pedido
end
# responde com QUALQUER pedido que exista, de qualquer usuário`}
          />
        }
        good={
          <CodeExample
            language="ruby"
            code={`def show
  pedido = current_usuario.pedidos.find(params[:id])
  render json: pedido
end
# busca SÓ dentro da relação de pedidos do usuário atual —
# um id de outro usuário simplesmente não é encontrado (404)`}
          />
        }
      />
      <p>
        A correção nem precisa de uma biblioteca nova — trocar <code>Pedido.find(...)</code> por{" "}
        <code>current_usuario.pedidos.find(...)</code> já restringe a busca ao escopo certo desde a query. Se o id
        pedido não pertencer àquele usuário, o Active Record simplesmente não encontra nada e levanta{" "}
        <code>RecordNotFound</code> — que vira um <code>404</code>, sem expor nem a existência do recurso de outra
        pessoa.
      </p>

      <h2>Por que id sequencial torna o ataque trivial de automatizar</h2>
      <p>
        Um detalhe que agrava (mas não causa) o problema: quando o identificador do recurso é um número sequencial
        (<code>1</code>, <code>2</code>, <code>3</code>...), um atacante nem precisa adivinhar nada — ele só varre a
        sequência inteira, <code>/pedidos/1</code>, <code>/pedidos/2</code>, <code>/pedidos/3</code>, e assim por
        diante, coletando cada resposta que não retornar erro. Trocar o id sequencial por um identificador não
        previsível (um UUID, por exemplo) dificulta essa varredura automatizada — mas é importante entender os
        limites disso: um UUID torna o ataque mais <strong>trabalhoso</strong> (o atacante precisaria descobrir ids
        válidos por outro meio, como um vazamento em outra tela), não <strong>impossível</strong>. A correção real
        continua sendo a checagem de autorização a cada acesso; um id difícil de adivinhar é só uma camada extra de
        dificuldade, não uma substituição pra ela.
      </p>
      <CodeExample
        label="a diferença NÃO resolve o problema de fundo sozinha"
        language="plaintext"
        code={`/pedidos/124        → fácil de adivinhar varrendo sequência numérica
/pedidos/f3a9c1e8-... → difícil de adivinhar, mas AINDA precisa da checagem
                        de dono — um UUID vazado em outro lugar (um link
                        compartilhado, um log) continua funcionando sem ela`}
      />

      <Exercise
        prompt={
          <p>
            Um endpoint <code>PATCH /perfis/:id</code> permite editar dados de perfil, e está implementado como{" "}
            <code>{`Perfil.find(params[:id]).update(perfil_params)`}</code>, protegido só por{" "}
            <code>authenticate_usuario!</code>. Reescreva pra impedir que um usuário edite o perfil de outra pessoa,
            e explique por que isso ainda é considerado IDOR mesmo com autenticação funcionando perfeitamente.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`current_usuario.perfil.update(perfil_params)
# ou, se o recurso puder ter mais de um por usuário:
current_usuario.perfis.find(params[:id]).update(perfil_params)

# É IDOR porque "authenticate_usuario!" só prova QUEM está fazendo a
# requisição (autenticação) — nunca checou se o :id do perfil sendo
# editado pertence a essa mesma pessoa (autorização). As duas
# checagens são independentes; a primeira passar não implica a
# segunda também ter sido feita.`}
      />

      <Callout
        title="A defesa estrutural pra isso"
        href="/aprenda/rails/09-autorizacao-cancancan-rbac"
        linkLabel="Ver aula sobre CanCanCan e RBAC →"
      >
        A regra <code>can [:update], Pedido, usuario_id: usuario.id</code> da lição de CanCanCan é exatamente essa
        checagem de dono, centralizada numa Ability em vez de espalhada (e possivelmente esquecida) em cada action.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/idor-e-autorizacao">
        A checagem de autorização exigida pelo padrão em todo endpoint que carrega recurso por id está documentada
        no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No exemplo do controller com Pedido.find(params[:id]), o que exatamente está faltando?",
            options: [
              "Falta autenticação — o before_action não confirma corretamente quem é o usuário",
              "Falta uma checagem de autorização — o código nunca verifica se o pedido buscado pertence ao usuário autenticado, só confirma que existe uma sessão válida",
              "Falta um índice no banco de dados na coluna id da tabela pedidos",
              "Falta validar se o parâmetro id é um número, antes de buscar no banco",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que um sistema pode ter autenticação perfeita e ainda assim estar vulnerável a IDOR?",
            options: [
              "Porque IDOR só acontece em sistemas sem HTTPS, independente da autenticação",
              "Porque autenticação e hash de senha são, na prática, a mesma coisa que autorização",
              "Porque IDOR é causado exclusivamente por bugs no algoritmo de hash da senha",
              "Porque autenticação (provar quem é o usuário) e autorização (decidir o que ele pode acessar) são checagens independentes — uma funcionar bem não garante que a outra também foi implementada",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
