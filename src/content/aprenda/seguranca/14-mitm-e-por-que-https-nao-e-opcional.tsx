import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "14-mitm-e-por-que-https-nao-e-opcional",
  title: "Man-in-the-middle: por que HTTPS não é opcional",
  summary: "Todo cookie, token e senha que sua aplicação manda passa por uma rede que você não controla — a pergunta é só quem mais está olhando.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao14MitmEPorQueHttpsNaoEOpcional() {
  return (
    <LessonBody>
      <p>
        Man-in-the-middle (MITM) é o cenário em que alguém se posiciona entre o seu navegador e o servidor de
        destino, capaz de ler — e às vezes até alterar — o tráfego que passa por ali, sem que nenhum dos dois lados
        perceba nada de diferente. Não é um ataque contra o código da sua aplicação; é um ataque contra a{" "}
        <strong>rede</strong> que carrega os dados dela.
      </p>

      <h2>O cenário mais comum: Wi-Fi público</h2>
      <p>
        A situação clássica é um Wi-Fi público sem senha (aeroporto, cafeteria). Qualquer outro dispositivo na mesma
        rede — inclusive um notebook de um atacante rodando uma ferramenta de captura de pacotes — consegue ver o
        tráfego de rede de todo mundo conectado ali, porque é assim que esse tipo de rede compartilhada funciona
        fisicamente.
      </p>
      <NetworkDiagram
        height={260}
        nodes={[
          { id: "cliente", label: "Você (Wi-Fi público)", kind: "client", x: 12, y: 50 },
          { id: "atacante", label: "Atacante (mesma rede)", kind: "server", x: 50, y: 15 },
          { id: "servidor", label: "Servidor de destino", kind: "server", x: 88, y: 50 },
        ]}
        edges={[
          { from: "cliente", to: "servidor" },
          { from: "cliente", to: "atacante" },
        ]}
        hops={[
          { from: "cliente", to: "atacante", caption: "1. Numa rede compartilhada, o tráfego passa por onde o atacante consegue capturá-lo — mesmo sem ele estar 'no meio' fisicamente." },
          { from: "cliente", to: "servidor", caption: "2. SEM HTTPS: a requisição (login, cookie de sessão) viaja como texto puro — o atacante lê tudo diretamente." },
          { from: "cliente", to: "servidor", caption: "3. COM HTTPS: o mesmo tráfego capturado aparece como bytes criptografados — ilegível sem a chave de sessão, que só cliente e servidor combinaram (lição de TLS)." },
        ]}
      />
      <p>
        Repare que o atacante não precisa "invadir" nada — ele só precisa estar na mesma rede e rodar uma ferramenta
        de captura. Sem criptografia, ele lê o header <code>Cookie</code>, o header{" "}
        <code>Authorization: Bearer ...</code>, o corpo de um formulário de login com senha em texto puro — qualquer
        coisa que sua aplicação mande sem proteção.
      </p>

      <h2>Como o TLS impede isso — sem reexplicar o handshake do zero</h2>
      <p>
        O <em>como</em> o TLS estabelece uma chave de criptografia compartilhada sem os dois lados já se conhecerem
        de antes, e como o certificado prova a identidade do servidor, já foi coberto em profundidade na trilha de
        Networking. O ponto que importa aqui é o <strong>efeito</strong>: depois do handshake, todo o tráfego HTTP
        vira uma sequência de bytes criptografados que só cliente e servidor conseguem decifrar — um atacante
        capturando o mesmo tráfego na mesma rede vê só ruído, mesmo capturando exatamente os mesmos pacotes que veria
        sem HTTPS.
      </p>

      <h2>O que muda quando o atacante também consegue alterar, não só ler</h2>
      <p>
        Um MITM ativo não se limita a espionar — em uma conexão sem TLS, ele também pode <strong>modificar</strong> a
        resposta antes dela chegar até você: trocar um link de download por um malware, injetar um script na página
        (uma via adicional de XSS, dessa vez vinda da rede em vez do servidor), ou redirecionar um formulário de
        login pra uma página falsa idêntica à original. HTTPS impede isso da mesma forma que impede a leitura —
        qualquer alteração no tráfego criptografado quebra a verificação de integridade da conexão, e o navegador
        recusa a resposta adulterada.
      </p>

      <h2>O que o cadeado não resolve sozinho</h2>
      <p>
        Vale reforçar uma distinção que a trilha de Networking já faz: HTTPS garante que a conexão está protegida
        contra <strong>interceptação de rede</strong> — não protege contra XSS, SQL injection, senha fraca ou
        qualquer uma das outras lições desta trilha. Um site com HTTPS perfeito ainda pode ter todas essas
        vulnerabilidades; MITM é só um dos vários pontos do diagrama da lição 1, não o único.
      </p>

      <Exercise
        prompt={
          <p>
            Um app mobile faz login contra uma API usando HTTP puro (sem TLS) "porque é mais rápido em desenvolvimento",
            com plano de trocar pra HTTPS antes do lançamento. Um colega argumenta que, como o app só é testado em
            rede interna da empresa, o risco é baixo. O que está sendo ignorado nesse raciocínio?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Está sendo ignorado que "rede interna" ainda é uma rede
compartilhada com outros dispositivos e pessoas — qualquer um
conectado a ela (um colega curioso, um dispositivo comprometido, um
ponto de acesso Wi-Fi mal configurado) consegue capturar o tráfego
em texto puro da mesma forma que num Wi-Fi público. "Ambiente de
desenvolvimento" não é sinônimo de "rede sem risco de interceptação".

Além disso, credenciais reais costumam ser usadas mesmo em teste
("uso meu login de verdade pra testar mais rápido") — o que significa
que uma senha real pode vazar num ambiente pensado como "só teste,
sem risco". O hábito de usar HTTP "por enquanto" tende a sobreviver
além do previsto, então a defesa mais segura é nunca abrir essa
exceção, nem em desenvolvimento.`}
      />

      <Callout
        title="O mecanismo completo do TLS"
        href="/aprenda/networking/09-tls-handshake-e-certificados"
        linkLabel="Ver aula de TLS e certificados →"
      >
        Como o handshake estabelece uma chave de sessão sem compartilhar segredo prévio, e como o certificado prova
        identidade do servidor, estão explicados passo a passo nessa lição da trilha de Networking.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/mitm">
        As exigências do padrão contra interceptação de tráfego — HSTS, certificate pinning quando aplicável — estão
        documentadas no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Num ataque MITM em Wi-Fi público, o que exatamente o atacante consegue fazer sem TLS/HTTPS envolvido?",
            options: [
              "Nada — Wi-Fi público já criptografa automaticamente todo o tráfego dos dispositivos conectados",
              "Ler diretamente o conteúdo do tráfego (cookies, tokens, senha em formulário) porque ele viaja como texto puro pela rede compartilhada",
              "Apenas descobrir o nome da rede Wi-Fi, sem acesso a nenhum dado de aplicação",
              "Somente impedir a conexão de funcionar, sem conseguir ler nenhum dado",
            ],
            correctIndex: 1,
          },
          {
            question: "O que o cadeado (HTTPS) de um site garante — e o que ele explicitamente NÃO cobre?",
            options: [
              "Garante que o site não tem nenhuma vulnerabilidade de código, incluindo XSS e SQL injection",
              "Garante apenas que o servidor está fisicamente localizado num datacenter seguro",
              "Garante que ninguém pode se cadastrar no site com dados falsos",
              "Garante que a conexão está protegida contra interceptação e alteração por terceiros na rede — mas não protege contra XSS, SQL injection ou senha fraca, que são falhas na aplicação em si, não na rede",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
