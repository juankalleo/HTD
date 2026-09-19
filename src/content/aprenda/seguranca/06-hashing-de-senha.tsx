import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-hashing-de-senha",
  title: "Por que senha nunca é armazenada em texto puro (nem 'criptografada')",
  summary: "'A senha está criptografada no banco' é a frase mais comum e mais tecnicamente errada sobre segurança.",
  estimatedMinutes: 17,
  level: "fundamentos",
};

export default function Licao06HashingDeSenha() {
  return (
    <LessonBody>
      <p>
        É comum ouvir "não se preocupe, a senha está criptografada no banco" — e essa frase, tecnicamente, está
        errada. O que protege senha não é criptografia, é <strong>hashing</strong>, e a diferença entre os dois não é
        só de vocabulário: ela muda o que é matematicamente possível fazer com o dado guardado.
      </p>

      <h2>Criptografia é reversível; hash não é</h2>
      <p>
        Criptografia (a mesma família de coisa usada em TLS, lição 14) é feita pra ser <strong>revertida</strong> por
        quem tem a chave certa — cifra e decifra, de propósito, porque em algum momento alguém legítimo precisa ler o
        conteúdo original de volta. Hashing é o oposto: é uma função <strong>de mão única</strong>. Dado um hash, não
        existe operação matemática que devolva a senha original — nem com a "chave certa", porque não existe chave
        nenhuma envolvida no processo.
      </p>
      <CodeExample
        label="o que existe (e o que não existe) pra reverter cada um"
        language="plaintext"
        code={`Criptografia:  texto_original --[chave]--> cifrado --[MESMA chave]--> texto_original
               (decifrar é uma operação válida e esperada)

Hashing:       senha --[algoritmo]--> hash
               (não existe "dehash" — a única forma de checar uma senha é
                gerar o hash de novo e COMPARAR os dois hashes)`}
      />
      <p>
        É por isso que "esqueci minha senha" nunca resulta em receber a senha antiga de volta por e-mail — se um
        sistema faz isso, é sinal quase certo de que ele está guardando a senha de forma reversível (ou em texto
        puro), o que é uma falha grave. O fluxo correto de redefinição, sem nunca reexpor a senha antiga, é
        aprofundado na lição 12.
      </p>

      <h2>Como o login funciona, então, sem nunca "descriptografar" nada</h2>
      <p>
        No cadastro, o sistema gera o hash da senha digitada e guarda só o hash. No login, ele gera o hash da senha{" "}
        <strong>que acabou de ser digitada</strong> e compara os dois hashes — nunca olha pra senha original de
        novo, porque ela nunca ficou guardada em lugar nenhum.
      </p>
      <CodeExample
        label="pseudocódigo do login"
        language="plaintext"
        code={`# cadastro
hash_gerado = bcrypt(senha_digitada)
salvar_no_banco(hash_gerado)

# login (dias depois, sessão nova)
hash_da_tentativa = bcrypt(senha_que_a_pessoa_digitou_agora)
if hash_da_tentativa == hash_guardado_no_banco:
    login_permitido()
else:
    login_negado()`}
      />
      <p>
        <code>bcrypt</code> é a família de algoritmo de hash desenhada especificamente pra senha — diferente de um
        hash genérico (como <code>SHA-256</code>, usado pra checar integridade de arquivo), <code>bcrypt</code> é{" "}
        <strong>deliberadamente lento</strong>, com um "fator de custo" configurável. Isso é uma escolha de design, não
        um defeito: um algoritmo rápido permitiria testar bilhões de senhas por segundo num vazamento de hashes; um
        algoritmo lento reduz isso a poucos milhares por segundo, tornando um ataque de força bruta contra o hash
        impraticável em escala.
      </p>

      <h2>Salt — por que duas senhas iguais não geram o mesmo hash</h2>
      <p>
        Se dois usuários usam a senha <code>123456</code> e o hash fosse gerado só a partir da senha, os dois teriam
        exatamente o mesmo valor salvo no banco — visível pra quem tiver acesso à tabela, e explorável em massa via{" "}
        <strong>rainbow tables</strong> (tabelas pré-computadas de hash de senhas comuns). O <strong>salt</strong>{" "}
        resolve isso: um valor aleatório, diferente pra cada usuário, é combinado com a senha antes de gerar o hash.
        Bibliotecas modernas de bcrypt já geram e guardam esse salt automaticamente junto do próprio hash — é por
        isso que duas senhas idênticas produzem hashes completamente diferentes no banco.
      </p>

      <Compare
        badLabel="Senha em texto puro"
        goodLabel="Hash com salt (bcrypt)"
        bad={
          <CodeExample
            language="plaintext"
            code={`id | email              | senha
1  | ana@exemplo.com    | 123456
2  | bruno@exemplo.com  | 123456   ← mesma senha, visível igual`}
          />
        }
        good={
          <CodeExample
            language="plaintext"
            code={`id | email              | senha_hash
1  | ana@exemplo.com    | $2a$12$N9qo8uLOickgx2ZMRZoMy...
2  | bruno@exemplo.com  | $2a$12$K7bpZ1WdX3fJs9RyTmVeQ...  ← mesma senha, hash totalmente diferente`}
          />
        }
      />
      <p>
        Um vazamento da tabela "ruim" expõe a senha de todo mundo instantaneamente. Um vazamento da tabela "boa"
        expõe só os hashes — um atacante ainda precisaria quebrar cada um individualmente, num processo caro por
        design, pra chegar na senha original.
      </p>

      <Exercise
        prompt={
          <p>
            Um colega sugere: "em vez de bcrypt, vamos usar SHA-256 pra hash de senha — é o mesmo princípio e é bem
            mais rápido, então o login fica mais ágil". O que está errado nesse raciocínio?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`SHA-256 é um hash de propósito geral (feito pra checar integridade
de arquivo, por exemplo), não um hash de senha. A velocidade que
parece uma vantagem ("login mais ágil") é exatamente o problema:
SHA-256 é rápido o suficiente pra um atacante testar bilhões de
combinações por segundo contra uma tabela de hashes vazada.

bcrypt (ou algoritmos equivalentes como Argon2 e scrypt) é
deliberadamente lento e tem um fator de custo ajustável — a
diferença de tempo é imperceptível pra um único login legítimo (uma
fração de segundo), mas se torna proibitiva em escala pra quem está
tentando quebrar hashes em massa. "Mais rápido" não é uma qualidade
desejável nesse contexto específico.`}
      />

      <Callout
        title="Isso já acontece por baixo dos panos"
        href="/aprenda/rails/08-autenticacao-com-devise"
        linkLabel="Ver aula sobre Devise →"
      >
        O Devise (gem de autenticação do Rails) já faz exatamente esse fluxo de hashing com bcrypt — a coluna{" "}
        <code>encrypted_password</code>, apesar do nome, guarda um hash, não algo reversível.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença fundamental entre hashing e criptografia no contexto de senha?",
            options: [
              "Hashing é mais rápido de calcular do que criptografia, mas cumpre exatamente a mesma função",
              "Criptografia é reversível por quem tem a chave certa; hashing é uma função de mão única — não existe operação que devolva a senha original a partir do hash",
              "Criptografia só funciona em conexões HTTPS; hashing funciona em qualquer conexão",
              "Hashing exige um servidor dedicado; criptografia pode ser feita direto no banco de dados",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que bcrypt é deliberadamente mais lento que um algoritmo de hash genérico como SHA-256?",
            options: [
              "Porque bcrypt precisa consultar o banco de dados a cada cálculo de hash",
              "Porque bcrypt gera um hash de tamanho maior, o que aumenta o tempo de processamento",
              "Porque a lentidão é um efeito colateral não intencional do algoritmo, ainda não corrigido",
              "Porque a lentidão é proposital: reduz drasticamente quantas tentativas de senha um atacante consegue testar por segundo contra hashes vazados, sem afetar perceptivelmente um login legítimo",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
