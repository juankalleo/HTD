import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-politica-de-senha-e-redefinicao-segura",
  title: "Política de senha e um fluxo seguro de 'esqueci minha senha'",
  summary: "Exigir símbolo e maiúscula obrigatórios protege menos do que parece — e um reset de senha mal feito é uma porta de entrada por si só.",
  estimatedMinutes: 18,
  level: "intermediario",
};

export default function Licao12PoliticaDeSenhaERedefinicaoSegura() {
  return (
    <LessonBody>
      <p>
        Duas coisas que parecem "só burocracia de formulário" — regra de senha e o fluxo de "esqueci minha senha" —
        são, na prática, superfície de ataque real. Uma política de senha mal pensada não protege ninguém de verdade;
        um fluxo de reset mal implementado pode virar um jeito de sequestrar a conta de outra pessoa sem nunca
        precisar adivinhar senha nenhuma.
      </p>

      <h2>Por que comprimento importa mais que exigir símbolo e maiúscula</h2>
      <p>
        A intuição comum é: exigir letra maiúscula, número e símbolo obrigatórios torna a senha mais forte. Na
        prática, isso costuma levar as pessoas a criar senhas como <code>Senha123!</code> — tecnicamente cumprindo
        toda regra, mas extremamente previsível, porque a maioria resolve a exigência sempre do mesmo jeito
        (maiúscula no início, número e símbolo no fim). O que realmente aumenta o espaço de possibilidades que um
        atacante precisaria testar é o <strong>comprimento</strong>: uma senha longa, mesmo só com letras minúsculas,
        tem exponencialmente mais combinações possíveis do que uma curta cheia de regras artificiais.
      </p>
      <CodeExample
        label="o que realmente reduz a chance de força bruta"
        language="plaintext"
        code={`"Senha123!"           →  9 caracteres, segue toda regra clássica, mas é um
                          padrão extremamente comum (previsível pra quem ataca)

"cavalo-batata-nuvem"  →  20 caracteres, só letras minúsculas e hífen,
                          mas o espaço de combinações possíveis é
                          MUITO maior — e é mais fácil de lembrar`}
      />
      <p>
        Isso não significa "não exigir nada" — comprimento mínimo (14+ caracteres é uma recomendação comum hoje) e
        checar a senha contra uma lista de senhas vazadas/comuns conhecidas continuam sendo defesas úteis. O ponto é
        que regra de composição forçada (maiúscula+número+símbolo obrigatórios) tem efeito bem menor do que parece, e
        empurra o usuário a comportamentos previsíveis.
      </p>

      <h2>O fluxo correto de "esqueci minha senha"</h2>
      <p>
        A lição 6 já estabeleceu que não existe "recuperar" uma senha — ela nunca fica guardada de um jeito que
        permita isso. Um fluxo de reset correto não devolve a senha antiga; ele dá ao usuário um jeito de{" "}
        <strong>definir uma senha nova</strong>, provando antes que ele realmente tem acesso à conta.
      </p>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "cliente", label: "Navegador", kind: "client", x: 12, y: 50 },
          { id: "servidor", label: "Servidor", kind: "server", x: 50, y: 50 },
          { id: "email", label: "Caixa de e-mail", kind: "server", x: 88, y: 50 },
        ]}
        hops={[
          { from: "cliente", to: "servidor", caption: "1. Usuário informa o email em 'Esqueci minha senha'." },
          { from: "servidor", to: "email", caption: "2. Servidor gera um token aleatório de uso único, salva com expiração curta (ex.: 30min), e envia um link contendo esse token por e-mail." },
          { from: "email", to: "cliente", caption: "3. Usuário abre o e-mail e clica no link — só quem tem acesso àquela caixa de entrada chega até aqui." },
          { from: "cliente", to: "servidor", caption: "4. Servidor valida o token (existe? não expirou? não foi usado ainda?) e, se ok, permite definir uma senha NOVA — nunca revela a antiga." },
        ]}
      />
      <CodeExample
        label="o que o token de reset precisa garantir"
        language="plaintext"
        code={`- Aleatório e longo o suficiente pra não ser adivinhável
- De uso único — usado uma vez, é invalidado imediatamente
- Expiração curta (minutos, não dias) — reduz a janela de um link
  de e-mail antigo sendo reaproveitado por alguém que não deveria
- Vinculado a UM usuário específico — não serve pra resetar
  a senha de ninguém além de quem o solicitou`}
      />
      <p>
        O detalhe que mais separa um fluxo seguro de um vulnerável: o sistema nunca deveria reenviar a senha atual
        por e-mail, nem em texto puro nem de nenhuma forma — se um sistema faz isso, é sinal de que a senha está
        guardada de forma reversível, contrariando tudo que a lição 6 explicou sobre hashing.
      </p>

      <h2>Não revelar se um email existe na base</h2>
      <p>
        Um detalhe fácil de esquecer: a resposta de "esqueci minha senha" não deveria diferenciar visivelmente entre
        "email enviado" e "esse email não existe na nossa base" — mostrar essa segunda mensagem permite que qualquer
        um descubra, testando emails um por um, quais estão cadastrados no sistema (um problema chamado{" "}
        <em>user enumeration</em>). A resposta correta é sempre genérica: "se esse email existir na nossa base, um
        link de redefinição foi enviado" — verdadeira nos dois casos, sem vazar informação nenhuma.
      </p>

      <Exercise
        prompt={
          <p>
            Um formulário de "esqueci minha senha" responde "Email enviado com sucesso!" quando o email existe, e
            "Este email não está cadastrado" quando não existe. Por que isso é um problema de segurança, mesmo sem
            nenhuma senha sendo exposta diretamente?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Isso permite "user enumeration": um atacante consegue descobrir
quais emails estão cadastrados no sistema simplesmente testando uma
lista de endereços e observando qual mensagem volta — sem nunca
tentar adivinhar senha nenhuma. Combinado com um vazamento de senhas
de outro serviço (muita gente reutiliza senha entre sites), isso dá
ao atacante uma lista já confirmada de "contas válidas aqui" pra
tentar essas senhas vazadas contra elas (um ataque chamado
credential stuffing).

A correção é responder sempre a MESMA mensagem genérica
independente do email existir ou não: "se esse email estiver
cadastrado, você vai receber um link em instantes".`}
      />

      <Callout href="/padrao-frontend/seguranca/politica-de-senha">
        A política de senha (comprimento mínimo, checagem contra senhas vazadas) usada em produção pelo padrão está
        documentada no Padrão Frontend.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/redefinicao-de-senha">
        O fluxo completo de redefinição de senha do padrão — geração de token, expiração, invalidação — está
        documentado no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que exigir maiúscula, número e símbolo obrigatórios protege menos do que parece, comparado a exigir um comprimento mínimo maior?",
            options: [
              "Porque símbolos e números não são suportados por todos os bancos de dados",
              "Porque regras de composição forçada costumam levar a padrões previsíveis (ex.: maiúscula no início, número e símbolo no fim), enquanto uma senha mais longa aumenta exponencialmente o espaço de combinações possíveis",
              "Porque senhas com símbolo demoram mais tempo para o servidor processar no login",
              "Porque exigir símbolo obrigatório é, na prática, idêntico a não exigir nenhuma regra",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que um fluxo de redefinição de senha nunca deveria reenviar a senha atual por e-mail?",
            options: [
              "Porque e-mails com texto longo demoram mais para ser entregues pelo provedor",
              "Porque isso violaria uma norma de formatação de e-mail, sem relação com segurança",
              "Porque o provedor de e-mail bloqueia mensagens que contenham a palavra 'senha'",
              "Porque, se a senha estiver armazenada com hash (como deveria, pela lição 6), ela nunca poderia ser recuperada em texto puro para reenvio — reenviá-la seria sinal de que está guardada de forma reversível, uma falha grave",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
