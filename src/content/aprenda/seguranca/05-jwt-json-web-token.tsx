import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-jwt-json-web-token",
  title: "JWT: o token que carrega a própria assinatura",
  summary: "Um JWT não esconde nada de quem o lê — ele só prova que ninguém alterou o que está escrito ali.",
  estimatedMinutes: 18,
  level: "fundamentos",
};

export default function Licao05JwtJsonWebToken() {
  return (
    <LessonBody>
      <p>
        JWT (JSON Web Token) é o formato mais comum de bearer token hoje. A diferença dele pra um token aleatório
        qualquer (como o ID de sessão da lição 2) é que um JWT carrega <strong>dados legíveis dentro de si mesmo</strong>{" "}
        — quem é o usuário, quando o token expira — e uma assinatura que prova que ninguém alterou esses dados no
        caminho. Isso muda completamente como ele deve ser tratado, e onde ele quebra.
      </p>

      <h2>As três partes, separadas por ponto</h2>
      <CodeExample
        label="um JWT real, separado nas 3 partes"
        language="plaintext"
        code={`eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoidXN1YXJpbyIsImV4cCI6MTc1ODIwMDAwMH0.k3f9A1z...

╰──────── header ────────╯╰──────────── payload ────────────╯╰── assinatura ──╯`}
      />
      <CodeExample
        label="header e payload, decodificados"
        language="json"
        code={`// header — qual algoritmo foi usado pra assinar
{ "alg": "HS256" }

// payload — os dados de fato ("claims")
{ "sub": "123", "role": "usuario", "exp": 1758200000 }`}
      />
      <p>
        <code>header</code> e <code>payload</code> são só JSON convertido pra Base64 — <strong>não</strong> são
        criptografados. A terceira parte, a assinatura, é o resultado de rodar um algoritmo (HMAC-SHA256, no exemplo
        acima) sobre o header e o payload combinados, usando uma <strong>chave secreta</strong> que só o servidor
        conhece. É essa assinatura que garante que, se um byte do payload mudar, o resultado do algoritmo muda junto
        — e deixa de bater com a assinatura original.
      </p>

      <h2>"Assinado, não criptografado" — o que isso muda na prática</h2>
      <p>
        Qualquer pessoa com o token em mãos consegue decodificar o header e o payload sozinha, sem chave nenhuma —
        é só Base64, o mesmo que colar num decodificador online. O que ninguém sem a chave secreta consegue fazer é{" "}
        <strong>gerar uma assinatura válida</strong> pra um payload alterado. É por isso que um JWT nunca deve
        carregar dado sensível no payload (senha, número de cartão) — ele não está escondido, só está assinado.
      </p>
      <Compare
        badLabel="Payload adulterado"
        goodLabel="Payload original"
        bad={
          <CodeExample
            language="http"
            code={`Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ.k3f9A1z...
// alguém editou "role":"usuario" pra "role":"admin" no payload,
// mas manteve a MESMA assinatura antiga (não tem como recalcular
// sem a chave secreta)

// servidor recalcula o HMAC do novo payload e compara:
// resultado NÃO bate com "k3f9A1z..." → 401, token rejeitado`}
          />
        }
        good={
          <CodeExample
            language="http"
            code={`Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJyb2xlIjoidXN1YXJpbyJ9.k3f9A1z...
// payload intacto, exatamente como o servidor emitiu

// servidor recalcula o HMAC e compara:
// resultado bate com "k3f9A1z..." → token aceito`}
          />
        }
      />
      <p>
        Note que o atacante do exemplo "ruim" nem precisa entender criptografia pra tentar o ataque — o Base64 é
        trivial de editar. O que impede o ataque é só uma coisa: ele não tem a chave secreta pra gerar uma nova
        assinatura válida pro payload que ele acabou de alterar.
      </p>

      <h2>exp — o token tem prazo de validade embutido</h2>
      <p>
        O campo <code>exp</code> ("expiration") guarda um timestamp; o servidor confere esse valor a cada requisição
        e rejeita qualquer token com <code>exp</code> no passado, mesmo que a assinatura continue perfeitamente
        válida. É comum ver tokens de acesso com vida curta (minutos a poucas horas) acompanhados de um segundo
        token, o <em>refresh token</em>, guardado de forma mais protegida e usado só pra pedir um token de acesso
        novo sem repetir login inteiro — mas o mecanismo de expiração em si é sempre o mesmo campo <code>exp</code>.
      </p>

      <h2>Por que revogar um JWT antes do exp é difícil</h2>
      <p>
        Aqui está a diferença mais importante em relação à sessão por cookie da lição 2. Lá, "derrubar uma sessão"
        era apagar uma linha numa tabela — o servidor consultava aquela tabela a cada requisição de qualquer jeito.
        Um JWT foi desenhado pra ser <strong>stateless</strong>: o servidor não guarda uma lista de "tokens ativos"
        pra consultar, ele só reconfere a assinatura matematicamente a cada requisição. Isso é ótimo pra escalar
        (nenhum banco é consultado só pra validar identidade) — mas significa que não existe um "apagar esse token"
        de verdade antes do <code>exp</code> chegar. Se um JWT vazar, ele continua válido até expirar sozinho, a não
        ser que a aplicação implemente uma lista de revogação separada (voltando a depender de uma consulta central,
        o que anula parte do ganho de ser stateless).
      </p>

      <Exercise
        prompt={
          <p>
            Um time decide guardar <code>{`{ "saldo_conta": 15000 }`}</code> dentro do payload de um JWT, pra evitar
            uma consulta ao banco a cada requisição. Explique por que isso é perigoso, mesmo o token estando
            assinado corretamente.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`A assinatura garante que ninguém ALTEROU o payload sem ser
detectado — mas não esconde o conteúdo dele. Qualquer pessoa com o
token (o próprio usuário, alguém que intercepte a requisição, uma
extensão de navegador mal-intencionada) consegue decodificar o
Base64 e ler "saldo_conta: 15000" diretamente, sem precisar de
nenhuma chave.

Pior ainda: se esse saldo for usado depois em alguma decisão sem
reconferir no banco, um saldo desatualizado (o usuário gastou algo
entre a emissão do token e essa checagem) levaria a uma decisão
errada. Dado sensível ou que muda com frequência não deveria viver
no payload de um JWT — o token deveria carregar só um identificador,
e o servidor buscar o dado atual quando precisar dele.`}
      />

      <Callout href="/padrao-frontend/seguranca/jwt">
        A estrutura de JWT usada em produção pelo padrão — claims obrigatórios, tempo de expiração, estratégia de
        refresh token — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um JWT é descrito como 'assinado, não criptografado'?",
            options: [
              "Porque qualquer pessoa consegue decodificar e ler o payload, mas só quem tem a chave secreta consegue gerar uma assinatura válida para um payload alterado",
              "Porque o payload é compactado antes de ser enviado, o que impede leitura direta sem descompactar",
              "Porque a assinatura muda a cada requisição, tornando o token de uso único",
              "Porque o token só funciona se o servidor tiver a chave pública do cliente que o gerou",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Por que revogar um JWT antes do seu exp expirar é mais difícil do que invalidar uma sessão por cookie?",
            options: [
              "Porque o campo exp de um JWT não pode ser lido pelo servidor depois de emitido",
              "Porque JWT usa um algoritmo de criptografia que impede qualquer verificação posterior",
              "Porque um JWT é stateless — o servidor valida a assinatura matematicamente a cada requisição, sem consultar uma lista central de tokens ativos que poderia simplesmente remover uma entrada",
              "Porque apenas o próprio usuário tem permissão para invalidar o token que criou",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
