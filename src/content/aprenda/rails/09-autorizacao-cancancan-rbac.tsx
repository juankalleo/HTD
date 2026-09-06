import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-autorizacao-cancancan-rbac",
  title: "Autorização (CanCanCan) e RBAC",
  summary: "Autenticação prova quem você é; autorização decide o que você pode fazer — são coisas diferentes.",
  estimatedMinutes: 16,
};

export default function Licao09AutorizacaoCancancanRbac() {
  return (
    <LessonBody>
      <p>
        Devise (lição anterior) resolve <strong>autenticação</strong>: provar quem o usuário é. Isso não diz nada
        sobre o que ele <em>pode fazer</em> — um usuário comum autenticado não deveria poder deletar o pedido de
        outra pessoa só porque está logado. Essa segunda pergunta é <strong>autorização</strong>, e{" "}
        <strong>RBAC</strong> (Role-Based Access Control) é o modelo mais comum de resolver: cada usuário tem um{" "}
        <em>papel</em> (role), e o papel define o que é permitido.
      </p>

      <h2>CanCanCan — regras centralizadas numa Ability</h2>
      <CodeExample
        label="app/models/ability.rb"
        language="ruby"
        code={`class Ability
  include CanCan::Ability

  def initialize(usuario)
    return unless usuario   # visitante não autenticado não tem nenhuma permissão

    if usuario.admin?
      can :manage, :all                       # admin pode tudo, em qualquer recurso
    else
      can :read, Produto                       # qualquer usuário logado pode ler produtos
      can [:create, :update], Pedido, usuario_id: usuario.id  # só os PRÓPRIOS pedidos
      cannot :destroy, Pedido                   # ninguém além de admin cancela pedido
    end
  end
end`}
      />
      <p>
        <code>usuario_id: usuario.id</code> é a parte que importa: a regra não é só "pode editar Pedido" — é "pode
        editar Pedido, <strong>desde que</strong> seja o dono dele". Isso é o que evita um usuário comum editar o
        pedido de outra pessoa só trocando o <code>id</code> na URL (o problema chamado IDOR).
      </p>

      <h2>Usando no controller</h2>
      <CodeExample
        label="app/controllers/pedidos_controller.rb"
        language="ruby"
        code={`class PedidosController < ApplicationController
  load_and_authorize_resource   # carrega @pedido E checa a Ability automaticamente

  def update
    if @pedido.update(pedido_params)
      render json: @pedido
    else
      render json: { errors: @pedido.errors.full_messages }, status: :unprocessable_entity
    end
  end
end`}
      />
      <p>
        Se a Ability recusar, o CanCanCan levanta <code>CanCan::AccessDenied</code> — que, tratado em{" "}
        <code>ApplicationController</code> (mesma ideia de <code>rescue_from</code> da lição de controllers), vira um{" "}
        <code>403 Forbidden</code> na resposta, sem uma linha de <code>if</code> a mais dentro de cada action.
      </p>

      <Exercise
        prompt={
          <p>
            Um papel novo, <code>gerente</code>, pode ler e atualizar qualquer <code>Pedido</code> (não só o
            próprio), mas não pode deletar nenhum. Adicione essa regra à <code>Ability</code>.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`if usuario.admin?
  can :manage, :all
elsif usuario.gerente?
  can [:read, :update], Pedido
  cannot :destroy, Pedido
else
  can :read, Produto
  can [:create, :update], Pedido, usuario_id: usuario.id
  cannot :destroy, Pedido
end`}
      />

      <Callout href="/padrao-api/tecnologias/cancancan">
        O mapeamento completo de roles e regras do padrão — incluindo como testar uma Ability isoladamente — está
        documentado no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre autenticação e autorização?",
            options: [
              "São a mesma coisa com nomes diferentes",
              "Autenticação prova quem o usuário é; autorização decide o que ele pode fazer",
              "Autorização vem sempre antes da autenticação",
              "Autenticação só existe em API, autorização só em app com view",
            ],
            correctIndex: 1,
          },
          {
            question: "O que a condição usuario_id: usuario.id numa regra can :update, Pedido garante?",
            options: [
              "Nada, é só documentação",
              "Que o usuário só pode atualizar pedidos que pertencem a ele mesmo, não qualquer pedido",
              "Que só admin pode atualizar pedido",
              "Que o pedido precisa ter status 'pendente'",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
