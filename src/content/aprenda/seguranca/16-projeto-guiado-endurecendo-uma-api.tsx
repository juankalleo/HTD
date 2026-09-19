import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "16-projeto-guiado-endurecendo-uma-api",
  title: "Projeto guiado: endurecendo uma API vulnerável",
  summary:
    "Uma API de pedidos fictícia, cheia de falhas discutidas nesta trilha, corrigida uma a uma — fechando fundamentos e intermediário juntos.",
  estimatedMinutes: 25,
  level: "intermediario",
};

export default function Licao16ProjetoGuiadoEndurecendoUmaApi() {
  return (
    <LessonBody>
      <p>
        Esta é a API fictícia de pedidos que vamos herdar: login por sessão, um endpoint pra ver o próprio pedido, e
        uma seção de comentários no pedido. Ela "funciona" — passa em todo teste manual óbvio — e tem pelo menos
        quatro problemas que essa trilha já explicou em profundidade, espalhados por ela. Vamos encontrar e corrigir
        cada um, na ordem em que apareceriam numa revisão de segurança de verdade.
      </p>

      <h2>1. Cookie de sessão sem nenhum atributo de proteção</h2>
      <p>
        O login está funcionando — usuário manda credencial, servidor cria sessão e devolve o cookie (lição 2). O
        problema mora nos atributos que faltam (lição 3):
      </p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
        bad={<CodeExample language="ruby" code={`cookies["sessao"] = sessao.id
# gera: Set-Cookie: sessao=abc123`} />}
        good={
          <CodeExample
            language="ruby"
            code={`cookies["sessao"] = {
  value: sessao.id,
  httponly: true,   # JS não lê — reduz o estrago de um XSS que roube cookie
  secure: true,      # só trafega em HTTPS
  same_site: :lax,   # bloqueia o cenário comum de CSRF (POST disparado por outro site)
}`}
          />
        }
      />
      <p>
        Sem esses três atributos, o cookie estava simultaneamente exposto a roubo via XSS (se existisse algum, e
        existe — problema 4 desta lista), a interceptação em rede sem HTTPS, e a CSRF. Nenhum dos três exige mudança
        de arquitetura — só configuração correta no momento de criar o cookie.
      </p>

      <h2>2. IDOR no endpoint de pedido</h2>
      <p>O endpoint que devolve o pedido buscava só pelo id, sem checar dono (lição 10):</p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
        bad={
          <CodeExample
            language="ruby"
            code={`def show
  pedido = Pedido.find(params[:id])   # qualquer pedido, de qualquer usuário
  render json: pedido
end`}
          />
        }
        good={
          <CodeExample
            language="ruby"
            code={`def show
  pedido = current_usuario.pedidos.find(params[:id])  # escopo restrito ao dono
  render json: pedido
end
# id de outro usuário: RecordNotFound → 404, sem revelar que o pedido existe`}
          />
        }
      />
      <p>
        A correção restringe a própria <strong>query</strong> ao usuário atual, em vez de buscar livremente e confiar
        que ninguém vai testar um id alheio — a mesma diferença entre autenticação (quem você é, já garantida antes
        desse trecho) e autorização (o que você pode acessar, que faltava completamente aqui).
      </p>

      <h2>3. Login sem limite de tentativas</h2>
      <p>O endpoint de login aceitava tentativas ilimitadas, sem penalidade nenhuma (lição 11):</p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
        bad={
          <CodeExample
            language="ruby"
            code={`def create
  usuario = Usuario.find_by(email: params[:email])
  if usuario&.authenticate(params[:senha])
    iniciar_sessao(usuario)
  else
    render json: { error: "Credenciais inválidas" }, status: :unauthorized
  end
end
# nenhum limite — um script pode tentar milhares de senhas por minuto`}
          />
        }
        good={
          <CodeExample
            language="ruby"
            code={`class Rack::Attack
  throttle("login/email", limit: 5, period: 60) do |req|
    req.params.dig("email")&.downcase if req.path == "/login" && req.post?
  end
end
# depois de 5 tentativas em 60s pro mesmo email, novas tentativas
# recebem 429 antes mesmo de chegar no controller`}
          />
        }
      />
      <p>
        O limite entra numa camada antes do controller — o próprio controller de login não muda nada em si, o
        throttle intercepta a requisição antes dela ser processada. Isso é intencional: separar "quem pode tentar
        fazer login agora" de "a lógica de verificar a senha em si" evita misturar as duas responsabilidades no mesmo
        método.
      </p>

      <h2>4. Comentário do pedido renderizado sem sanitizar</h2>
      <p>O frontend renderizava o comentário do pedido direto como HTML, sem tratamento (lição 7):</p>
      <Compare
        badLabel="Antes"
        goodLabel="Depois"
        bad={
          <CodeExample
            language="jsx"
            code={`function ComentarioPedido({ texto }) {
  return <div dangerouslySetInnerHTML={{ __html: texto }} />;
}
# um comentário salvo como "<script>roubaCookie()</script>" executa
# na tela de QUALQUER pessoa que abrir esse pedido`}
          />
        }
        good={
          <CodeExample
            language="jsx"
            code={`function ComentarioPedido({ texto }) {
  return <div>{texto}</div>;  // renderização normal já escapa HTML
}
# "<script>" vira texto literal na tela — nunca é interpretado`}
          />
        }
      />
      <p>
        Como o comentário não precisava de nenhuma formatação rica (negrito, link), a correção mais simples e mais
        segura foi parar de usar <code>dangerouslySetInnerHTML</code> — voltando pra renderização padrão do React, que
        já escapa conteúdo dinâmico por conta própria.
      </p>

      <h2>O que essas quatro correções têm em comum</h2>
      <p>
        Nenhuma delas exigiu reescrever arquitetura, trocar de framework ou adicionar uma dependência pesada nova.
        Cada uma foi um ajuste pontual — um atributo de cookie, uma cláusula a mais numa query, uma regra de throttle,
        a remoção de um <code>dangerouslySetInnerHTML</code> desnecessário. É exatamente o ponto da lição 1: segurança
        raramente é sobre grandes decisões de arquitetura tomadas uma vez — é sobre um conjunto de hábitos aplicados
        de forma consistente em cada decisão pequena.
      </p>

      <Exercise
        prompt={
          <p>
            A mesma API tem um quinto problema, ainda não listado: o endpoint de busca de pedidos por descrição usa{" "}
            <code>{`Pedido.where("descricao LIKE '%#{params[:busca]}%'")`}</code>. Identifique a vulnerabilidade,
            qual lição desta trilha a cobre, e reescreva a linha corrigida.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`# Vulnerabilidade: SQL injection (lição 9) — o valor de params[:busca]
# é interpolado direto na string SQL, podendo alterar o SIGNIFICADO
# da query (ex.: "%' OR '1'='1" retornaria todos os pedidos, não só
# os que batem com a busca).

# Corrigido, com placeholder:
current_usuario.pedidos.where("descricao LIKE ?", "%#{params[:busca]}%")
# o "?" isola o valor externo da estrutura da query — o banco
# compila o comando antes de qualquer valor ser inserido, então o
# conteúdo de params[:busca] não tem mais como mudar o SELECT em si.
# (repare que o escopo também ficou restrito a current_usuario.pedidos,
# corrigindo de brinde o mesmo IDOR do problema 2 nesse endpoint)`}
      />

      <Callout href="/padrao-api">
        Este projeto guiado reduz boa parte da trilha a uma única API pequena — vale ler a documentação completa de
        segurança do padrão agora que cada peça, isoladamente, já faz sentido.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que a correção do IDOR (current_usuario.pedidos.find em vez de Pedido.find) não exigiu nenhuma biblioteca nova?",
            options: [
              "Porque IDOR não é uma vulnerabilidade real, então nenhuma correção de fato era necessária",
              "Porque o problema estava no algoritmo de hash da senha, não relacionado a bibliotecas",
              "Porque a correção depende inteiramente de um serviço de terceiros de autorização",
              "Porque o problema era só o escopo da query buscar em Pedido (todos os registros) em vez de current_usuario.pedidos (só os do usuário atual) — um ajuste na própria consulta já resolve, sem depender de ferramenta externa",
            ],
            correctIndex: 3,
          },
          {
            question:
              "O que as quatro correções desta lição guiada têm em comum, segundo o fechamento da lição?",
            options: [
              "Todas dependiam de reescrever a arquitetura da aplicação do zero",
              "Todas exigiram trocar o banco de dados por um mais seguro",
              "Cada uma foi um ajuste pontual e específico (atributo de cookie, escopo de query, regra de throttle, remoção de renderização insegura) — segurança nesse caso foi hábito consistente em decisões pequenas, não uma grande mudança única",
              "Todas as correções só funcionam se a aplicação for reescrita em outra linguagem",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
