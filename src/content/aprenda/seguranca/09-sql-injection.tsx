import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-sql-injection",
  title: "SQL injection: quando input vira comando de banco",
  summary: "A frase que uma pessoa digita num campo de busca não deveria ter poder nenhum sobre a QUERY em si — quando tem, é injeção de SQL.",
  estimatedMinutes: 18,
  level: "intermediario",
};

export default function Licao09SqlInjection() {
  return (
    <LessonBody>
      <p>
        SQL injection é um dos ataques mais antigos da web, e continua aparecendo até hoje pelo mesmo motivo: alguém
        monta uma query concatenando texto vindo do usuário direto na string SQL, achando que aquele texto é só{" "}
        <strong>dado</strong>. Pro banco de dados, texto dentro de uma string SQL não é "só dado" — é parte do
        comando que ele vai executar, palavra por palavra.
      </p>

      <h2>O clássico: ' OR '1'='1</h2>
      <p>Imagine um login construído concatenando email e senha direto numa query:</p>
      <CodeExample
        label="NUNCA faça isso"
        language="sql"
        code={`-- código do backend monta isto:
SELECT * FROM usuarios WHERE email = '\${email}' AND senha = '\${senha}'`}
      />
      <p>
        Num login normal, <code>email</code> e <code>senha</code> viram só os valores esperados. Mas se o campo{" "}
        <code>email</code> receber <code>{`' OR '1'='1`}</code>, a query final fica assim:
      </p>
      <CodeExample
        label="a query depois da concatenação maliciosa"
        language="sql"
        code={`SELECT * FROM usuarios WHERE email = '' OR '1'='1' AND senha = ''`}
      />
      <p>
        <code>{`'1'='1'`}</code> é sempre verdadeiro — então a condição inteira do <code>WHERE</code> passa a
        selecionar <strong>todos</strong> os usuários da tabela, não só quem tem aquele email e senha específicos. O
        atacante não "adivinhou" a senha de ninguém; ele mudou o <strong>significado</strong> da query em si,
        transformando uma checagem de identidade numa condição sempre verdadeira.
      </p>

      <h2>A causa raiz: concatenar string onde deveria haver um parâmetro</h2>
      <p>
        O problema nunca é "o usuário digitou algo estranho" — é o código tratar o valor digitado como se fosse{" "}
        <strong>texto de comando confiável</strong>, em vez de um dado que só deveria ser comparado. Toda vez que uma
        query é montada por concatenação ou interpolação de string com valor externo, esse valor tem o poder de
        alterar a estrutura da query, não só o valor sendo buscado — não importa se é <code>SELECT</code>,{" "}
        <code>UPDATE</code>, ou <code>DELETE</code>.
      </p>

      <h2>Prepared statement / query parametrizada: por que já resolve por padrão</h2>
      <p>
        A defesa correta não é "filtrar aspas simples do input" (existem dezenas de variações de bypass pra esse
        tipo de filtro manual) — é nunca deixar o valor externo virar parte do <strong>texto</strong> da query. Uma{" "}
        <em>prepared statement</em> manda a estrutura da query e os valores <strong>separadamente</strong> pro banco:
        o banco compila o comando primeiro, sem nenhum valor ainda, e só depois substitui os placeholders — nesse
        ponto, não existe mais espaço pra um valor alterar a estrutura, porque a estrutura já foi fixada antes.
      </p>
      <Compare
        badLabel="Concatenação direta"
        goodLabel="Query parametrizada"
        bad={<CodeExample language="ruby" code={`Usuario.where("email = '#{params[:email]}'")`} />}
        good={<CodeExample language="ruby" code={`Usuario.where("email = ?", params[:email])`} />}
      />
      <p>
        Um Object-Relational Mapper (ORM) como o Active Record do Rails já usa placeholder por baixo dos panos toda
        vez que você chama métodos como <code>where(coluna: valor)</code> — na prática, um desenvolvedor precisa
        escrever SQL cru de propósito (via interpolação de string) pra reabrir essa vulnerabilidade. É um dos raros
        casos em que a ferramenta já protege por padrão, e o erro exige um passo extra e deliberado pra acontecer.
      </p>

      <Exercise
        prompt={
          <p>
            Um endpoint de busca de produtos recebe <code>params[:categoria]</code> e monta a query como{" "}
            <code>{`Produto.where("categoria = '#{params[:categoria]}'")`}</code>. Reescreva usando parâmetro, e
            explique o que um atacante conseguiria fazer com{" "}
            <code>{`categoria = "x' OR '1'='1"`}</code> na versão vulnerável.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`Produto.where("categoria = ?", params[:categoria])
# ou, de forma equivalente e mais idiomática:
Produto.where(categoria: params[:categoria])

# Na versão vulnerável, "x' OR '1'='1" transforma a query em:
# SELECT * FROM produtos WHERE categoria = 'x' OR '1'='1'
# "'1'='1'" é sempre verdadeiro, então a condição inteira passa a
# retornar TODOS os produtos da tabela, ignorando completamente o
# filtro de categoria pretendido — inclusive produtos que talvez
# não devessem ser listados publicamente.`}
      />

      <Callout
        title="Já visto em contexto de filtro de API"
        href="/aprenda/rails/14-paginacao-e-filtros-de-api"
        linkLabel="Ver aula sobre paginação e filtros →"
      >
        A mesma falha (interpolação direta de string numa query <code>where</code>) já apareceu na lição de
        paginação e filtros de API — vale revisitar aquele exemplo agora com o mecanismo completo em mente.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "No exemplo com email = ' OR '1'='1, o que exatamente acontece com a query quando esse valor é concatenado direto na string SQL?",
            options: [
              "A condição do WHERE deixa de checar email e senha específicos e passa a ser sempre verdadeira, retornando todos os registros da tabela",
              "O banco de dados detecta automaticamente a tentativa e recusa a conexão do cliente",
              "A query trava com erro de sintaxe e nenhum dado é retornado",
              "Apenas o usuário com aquele email exato é retornado, sem nenhuma alteração no comportamento esperado",
            ],
            correctIndex: 0,
          },
          {
            question:
              "Por que uma query parametrizada (prepared statement) resolve SQL injection de forma mais confiável do que filtrar caracteres como aspas simples do input?",
            options: [
              "Porque ela criptografa o valor do input antes de enviá-lo ao banco de dados",
              "Porque ela roda mais rápido, o que impede o ataque de ter tempo de ser concluído",
              "Porque a estrutura da query é fixada e compilada pelo banco antes de qualquer valor ser inserido — o valor externo não tem mais como alterar o comando em si, diferente de um filtro manual de caracteres, que pode ser contornado",
              "Porque ela impede que o input do usuário seja lido por qualquer script externo",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
