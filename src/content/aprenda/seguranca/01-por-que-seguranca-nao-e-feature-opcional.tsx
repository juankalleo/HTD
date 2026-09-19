import { LessonBody } from "@/components/aprenda/lesson-body";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-seguranca-nao-e-feature-opcional",
  title: "Por que segurança não é feature opcional",
  summary:
    "'Depois a gente adiciona segurança' é uma frase que só funciona se segurança fosse uma tela a mais — não é.",
  estimatedMinutes: 16,
  level: "fundamentos",
};

export default function Licao01PorQueSegurancaNaoEFeatureOpcional() {
  return (
    <LessonBody>
      <p>
        Um padrão comum em projeto real: o time entrega o cadastro, o login, a tela de pedidos — tudo funcionando —
        e deixa "revisar segurança" pra uma sprint futura que nunca chega, ou chega tarde demais, depois que alguém
        de fora já encontrou o problema. A ideia por trás dessa trilha é simples: segurança não é uma tela, um botão
        ou uma biblioteca que se adiciona depois. É uma característica de <strong>como cada decisão já foi tomada</strong>{" "}
        — como uma senha é guardada, como uma sessão é validada, como um dado de outro usuário é ou não exposto.
      </p>

      <h2>Por que "adicionar depois" quase sempre falha</h2>
      <p>
        Pega um exemplo concreto: um endpoint <code>GET /pedidos/:id</code> foi escrito checando só "existe usuário
        logado?" — não "esse pedido pertence a esse usuário?". Isso funciona perfeitamente nos testes manuais do
        time, porque quem testa só olha os próprios pedidos. O problema só aparece quando alguém troca o número na
        URL de propósito. Corrigir isso depois não é "adicionar uma feature" — é encontrar, em todo lugar do sistema
        que carrega um recurso por id, se essa checagem de dono existe. Quanto mais tarde isso é notado, mais lugares
        existem pra revisar, e mais tempo o problema já esteve exposto em produção.
      </p>
      <p>
        O mesmo vale pra decisões que parecem só "detalhe de implementação": guardar senha com hash em vez de texto
        puro, marcar um cookie de sessão como <code>HttpOnly</code>, escapar um texto antes de renderizar na tela.
        Nenhuma dessas coisas é visível pra quem usa o produto no dia a dia — só fica visível quando alguém tenta
        explorar a ausência delas.
      </p>

      <h2>Por onde um ataque entra numa requisição comum</h2>
      <p>
        Não existe "o lugar onde a segurança mora" num sistema — existe uma cadeia inteira, e cada elo dela é
        explorado de um jeito diferente. O diagrama abaixo segue uma requisição simples (usuário buscando o próprio
        pedido) e marca, em cada trecho do caminho, que tipo de problema mora ali — cada um vira uma lição adiante
        nesta trilha.
      </p>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "cliente", label: "Navegador", kind: "client", x: 10, y: 50 },
          { id: "rede", label: "Rede (Wi-Fi, provedor)", kind: "proxy", x: 37, y: 50 },
          { id: "servidor", label: "Servidor", kind: "server", x: 64, y: 50 },
          { id: "banco", label: "Banco de dados", kind: "database", x: 91, y: 50 },
        ]}
        hops={[
          { from: "cliente", to: "rede", caption: "1. A requisição sai do navegador — nessa rede alguém pode estar interceptando o tráfego (MITM, lição 14)." },
          { from: "rede", to: "servidor", caption: "2. Chega no servidor — um input não validado aqui vira SQL injection ou XSS (lições 7 e 9)." },
          { from: "servidor", to: "banco", caption: "3. O servidor consulta o banco — sem checar de QUEM é o dado pedido, vira IDOR (lição 10)." },
          { from: "servidor", to: "cliente", caption: "4. A resposta volta — se carregar algo digitado por outro usuário sem sanitizar, alimenta um XSS armazenado." },
        ]}
      />
      <p>
        Repare que "autenticação" (as próximas quatro lições) resolve só o primeiro pedaço dessa história: provar
        quem está falando com o servidor. Todo o resto do diagrama continua existindo mesmo com autenticação
        perfeita — um usuário autenticado de verdade ainda pode tentar acessar o pedido de outra pessoa, ainda pode
        injetar um script num campo de comentário, ainda pode estar numa rede comprometida.
      </p>

      <h2>Defesa em profundidade: nenhuma camada sozinha basta</h2>
      <p>
        Um erro comum é escolher <strong>uma</strong> defesa e tratá-la como suficiente — "usamos HTTPS, então
        estamos seguros" (HTTPS não impede XSS nem SQL injection), ou "validamos no frontend, então está protegido"
        (qualquer um consegue chamar a API direto, pulando o frontend inteiro). A prática que realmente funciona se
        chama <strong>defesa em profundidade</strong>: várias camadas independentes, de modo que a falha de uma
        sozinha não derruba o sistema inteiro. Um cookie <code>HttpOnly</code> (lição 3) não impede XSS — mas reduz o
        estrago de um XSS que já aconteceu, porque o script injetado não consegue ler o cookie de sessão mesmo assim.
      </p>

      <h2>O que esta trilha cobre</h2>
      <p>
        As primeiras lições respondem a pergunta que dá nome ao resumo desta trilha: como autenticação{" "}
        <strong>funciona de verdade</strong> — sessão com cookie, bearer token, JWT — não só os nomes, mas o
        mecanismo por trás de cada um. Depois disso, a trilha segue pelos ataques mais comuns contra aplicação web:
      </p>
      <ul>
        <li>Hashing de senha — por que "criptografar a senha" é a frase errada</li>
        <li>XSS e CSRF — quando o navegador de outra pessoa é usado contra ela mesma</li>
        <li>SQL injection e IDOR — quando input vira comando, ou autenticação existe mas autorização não</li>
        <li>Força bruta, política de senha e cabeçalhos HTTP de proteção</li>
        <li>MITM e OAuth — por que HTTPS importa, e como funciona o "Entrar com Google"</li>
      </ul>
      <p>A última lição junta boa parte disso num único exercício: pegar uma API cheia de falhas e corrigi-las uma a uma.</p>

      <Exercise
        prompt={
          <p>
            Um formulário de cadastro simples pede nome, e-mail e senha, e salva tudo direto numa tabela{" "}
            <code>usuarios</code>. Aponte dois pontos diferentes dessa história (armazenamento da senha, e a tela que
            lista os usuários cadastrados pro admin, por exemplo) onde existe risco de segurança, e qual lição desta
            trilha trata cada um.
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Ponto 1 — como a senha é armazenada: se for salva em texto puro
(ou "criptografada" de forma reversível), qualquer vazamento do
banco expõe a senha de todo mundo diretamente. Isso é tratado na
lição 6 (hashing de senha).

Ponto 2 — a tela do admin que lista usuários: se ela renderizar o
campo "nome" sem sanitizar, um usuário que se cadastrou com um nome
tipo "<script>roubaCookie()</script>" consegue rodar código na tela
de QUALQUER admin que abrir essa lista. Isso é tratado na lição 7
(XSS).

Os dois têm em comum o padrão desta lição: nenhum dos dois aparece
nos testes manuais óbvios do formulário — só aparece quando alguém
olha especificamente pra esse ângulo.`}
      />

      <Callout href="/padrao-frontend/seguranca/medidas-de-seguranca">
        A lista completa de medidas de segurança exigidas pelo padrão em todo projeto novo — o "mínimo não
        negociável" — está documentada no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que a estratégia de 'implementar a feature primeiro e adicionar segurança depois' costuma sair mais cara do que parece?",
            options: [
              "Porque decisões já tomadas (como um endpoint carregar um recurso sem checar o dono) precisam ser encontradas e corrigidas em todos os lugares do sistema, depois de já estarem em produção",
              "Porque frameworks modernos travam automaticamente o deploy de qualquer código sem revisão de segurança prévia",
              "Porque segurança só pode ser implementada por uma equipe externa contratada especificamente pra isso",
              "Porque o custo de segurança é sempre fixo, independente de quando ela é adicionada ao projeto",
            ],
            correctIndex: 0,
          },
          {
            question:
              "O que 'defesa em profundidade' significa na prática, no exemplo do cookie HttpOnly que não impede XSS mas reduz seu estrago?",
            options: [
              "Que uma única camada de proteção bem escolhida é sempre suficiente, se for a certa",
              "Que XSS deixa de ser um problema real assim que HttpOnly é configurado no cookie",
              "Que HTTPS sozinho já cobre esse cenário, tornando o HttpOnly desnecessário",
              "Que várias camadas independentes trabalham juntas, de forma que a falha de uma sozinha não compromete o sistema inteiro",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
