import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-autenticacao-por-sessao-e-cookie",
  title: "Autenticação por sessão e cookie: o mecanismo clássico",
  summary:
    "'O navegador manda o cookie sozinho' esconde um mecanismo inteiro — vale entender o que acontece entre o login e a segunda requisição.",
  estimatedMinutes: 18,
  level: "fundamentos",
};

export default function Licao02AutenticacaoPorSessaoECookie() {
  return (
    <LessonBody>
      <p>
        HTTP não tem memória — cada requisição chega no servidor sem nenhuma lembrança da anterior. Isso significa
        que, sem nenhum mecanismo extra, todo clique num site com login precisaria mandar email e senha de novo. O
        jeito mais antigo (e ainda hoje o mais comum pra aplicação web tradicional) de resolver isso é{" "}
        <strong>sessão com cookie</strong> — vale entender o mecanismo completo, não só decorar que "o navegador
        manda o cookie sozinho".
      </p>

      <h2>O fluxo completo, passo a passo</h2>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "cliente", label: "Navegador", kind: "client", x: 12, y: 50 },
          { id: "servidor", label: "Servidor", kind: "server", x: 50, y: 50 },
          { id: "banco", label: "Banco / store de sessão", kind: "database", x: 88, y: 50 },
        ]}
        hops={[
          { from: "cliente", to: "servidor", caption: "1. POST /login com email e senha, digitados uma única vez." },
          { from: "servidor", to: "banco", caption: "2. Servidor busca o usuário pelo email e compara o hash da senha recebida com o hash salvo." },
          { from: "servidor", to: "banco", caption: "3. Senha confere: servidor cria um registro de sessão novo (um ID aleatório e a quem ele pertence)." },
          { from: "servidor", to: "cliente", caption: "4. Servidor responde com Set-Cookie: sessao=abc123; HttpOnly — o navegador guarda esse valor." },
          { from: "cliente", to: "servidor", caption: "5. Toda requisição seguinte pro mesmo domínio já sai com Cookie: sessao=abc123, sem o dev escrever isso manualmente." },
        ]}
      />
      <p>
        O passo 5 é o detalhe que costuma passar despercebido: o navegador reenviar o cookie automaticamente não é
        "mágica de framework" — é um comportamento do <strong>protocolo HTTP em si</strong>, implementado em todo
        navegador. Qualquer requisição (fetch, formulário, até uma tag <code>&lt;img&gt;</code>) pro mesmo domínio que
        emitiu o cookie carrega ele junto, automaticamente. Isso é exatamente o que torna CSRF possível — assunto da
        lição 8 — mas por ora fica o ponto: ninguém no seu código está lendo <code>localStorage</code> e anexando
        header a cada chamada. É o navegador fazendo isso sozinho.
      </p>

      <h2>O que um cookie fisicamente é</h2>
      <p>
        Um cookie não é um objeto complexo — é só um par <code>chave=valor</code>, mais um punhado de atributos que
        controlam quando e pra onde ele é enviado. O header que o servidor manda pra criar um se parece com isto:
      </p>
      <CodeExample
        label="header de resposta do login"
        language="plaintext"
        code={`Set-Cookie: sessao=a1b2c3d4e5; Path=/; Max-Age=86400; HttpOnly`}
      />
      <p>
        <code>sessao=a1b2c3d4e5</code> é o par chave/valor propriamente dito — nesse caso, o valor é só um{" "}
        <strong>identificador</strong> aleatório, não a sessão inteira. <code>Path=/</code> diz em quais rotas do
        domínio o cookie se aplica; <code>Max-Age=86400</code> diz que ele expira em 24h; <code>HttpOnly</code> é um
        dos atributos de segurança aprofundados na próxima lição. O navegador guarda isso associado ao domínio que o
        emitiu e decide sozinho, a cada requisição, se aquele cookie se aplica ali.
      </p>

      <h2>Onde a sessão de verdade mora — e por que o cookie é só um ponteiro</h2>
      <p>
        Um erro comum de quem está aprendendo é achar que o cookie <em>é</em> a sessão. Não é — o cookie carrega
        só um <strong>ID</strong>. Os dados de verdade (qual usuário está logado, desde quando, talvez preferências
        temporárias) ficam guardados do lado do servidor, numa tabela de banco de dados ou num store rápido como
        Redis, indexados por esse mesmo ID:
      </p>
      <CodeExample
        label="tabela de sessões, simplificada"
        language="sql"
        code={`CREATE TABLE sessoes (
  id            VARCHAR(64) PRIMARY KEY,  -- o mesmo valor que vai no cookie
  usuario_id    INTEGER NOT NULL REFERENCES usuarios(id),
  criado_em     TIMESTAMP NOT NULL,
  expira_em     TIMESTAMP NOT NULL
);`}
      />
      <p>
        Isso explica por que "derrubar a sessão de um usuário" é possível mesmo sem acesso ao navegador dele: basta
        apagar (ou marcar como inválida) a linha correspondente nessa tabela. Na próxima requisição, o servidor busca
        pelo ID recebido, não encontra sessão válida, e trata como se o usuário nunca tivesse feito login — mesmo que
        o cookie continue fisicamente guardado no navegador dele. Esse controle central é o principal trunfo de
        sessão por cookie sobre JWT, que a lição 5 mostra ser bem mais difícil de revogar.
      </p>

      <h2>Logout, na prática</h2>
      <p>
        "Fazer logout" é, do lado do servidor, simplesmente apagar (ou marcar como expirado) o registro daquele ID de
        sessão. O servidor também costuma mandar um <code>Set-Cookie</code> de resposta pedindo pro navegador
        esquecer o cookie (<code>Max-Age=0</code>), mas a parte que realmente importa pra segurança é a exclusão do
        lado do servidor — mesmo que alguém copie o valor do cookie antes do logout, ele para de funcionar assim que
        a sessão correspondente deixa de existir no banco.
      </p>

      <Exercise
        prompt={
          <p>
            Um usuário faz login em dois navegadores diferentes (celular e notebook) com a mesma conta. Ele clica
            "sair de todos os dispositivos" no notebook. Descreva, em termos da tabela <code>sessoes</code> do
            exemplo acima, o que essa ação precisa fazer pra realmente derrubar a sessão do celular também.
          </p>
        }
        solutionLanguage="sql"
        solutionCode={`-- Cada login cria uma linha nova na tabela "sessoes" com um ID
-- diferente (uma sessão pro celular, outra pro notebook) — ambas
-- ligadas ao mesmo usuario_id.

-- "Sair de todos os dispositivos" precisa apagar TODAS as sessões
-- daquele usuário, não só a do dispositivo atual:
DELETE FROM sessoes WHERE usuario_id = 42;

-- Na próxima requisição do celular, o servidor busca pelo ID do
-- cookie dele, não encontra mais a linha correspondente, e trata
-- como deslogado — mesmo que o cookie continue fisicamente salvo
-- no celular.`}
      />

      <Callout href="/padrao-api/seguranca/autenticacao">
        O mecanismo de autenticação (sessão e token) usado em produção pelo padrão está documentado no Padrão API.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o cookie de sessão (Set-Cookie: sessao=abc123) realmente carrega?",
            options: [
              "Os dados completos do usuário logado, incluindo permissões e preferências, prontos pra leitura",
              "Um identificador que aponta pra um registro de sessão guardado do lado do servidor — os dados de verdade não viajam no cookie",
              "A senha do usuário, criptografada de forma que só o navegador consegue decodificar",
              "Uma cópia da última resposta HTTP recebida, usada pra evitar refazer o login a cada página",
            ],
            correctIndex: 1,
          },
          {
            question:
              "Por que o navegador consegue reenviar o cookie de sessão automaticamente em toda requisição seguinte, sem o desenvolvedor escrever nada pra isso?",
            options: [
              "Porque o framework do backend injeta um script no HTML que copia o cookie manualmente a cada clique",
              "Porque o navegador guarda o cookie em cache local e o reenvia só quando a página é recarregada",
              "Porque é um comportamento do próprio protocolo HTTP, implementado por todo navegador: qualquer requisição pro domínio que emitiu o cookie carrega ele automaticamente",
              "Porque o servidor consulta o navegador do cliente em segundo plano perguntando qual cookie usar",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
