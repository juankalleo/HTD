import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-tls-handshake-e-certificados",
  title: "TLS na prática: handshake e certificados",
  summary: "O cadeado no navegador não significa 'site confiável' — significa só 'ninguém no meio consegue ler isso'.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao09TlsHandshakeECertificados() {
  return (
    <LessonBody>
      <p>
        A lição de HTTP/HTTPS já mostrou que o "S" significa criptografia via TLS. O que faltou explicar é{" "}
        <strong>como</strong> os dois lados chegam a uma chave de criptografia em comum sem já compartilhar um
        segredo antes, e por que o navegador confia no certificado que o servidor apresenta.
      </p>

      <h2>O handshake, passo a passo</h2>
      <NetworkDiagram
        height={230}
        nodes={[
          { id: "client", label: "Navegador", kind: "client", x: 15, y: 50 },
          { id: "server", label: "Servidor", kind: "server", x: 85, y: 50 },
        ]}
        hops={[
          { from: "client", to: "server", caption: "1. ClientHello — versões de TLS suportadas e conjuntos de cifra disponíveis." },
          { from: "server", to: "client", caption: "2. ServerHello + certificado — inclui a chave pública do servidor, assinada por uma CA." },
          { from: "client", to: "server", caption: "3. O navegador valida o certificado e envia material para derivar uma chave de sessão." },
          { from: "server", to: "client", caption: "4. A partir daqui, todo o tráfego HTTP flui criptografado com essa chave de sessão." },
        ]}
      />

      <p>
        Repare que a chave de criptografia usada depois do handshake é <strong>gerada na hora, só pra essa sessão</strong>{" "}
        — nem cliente nem servidor precisavam conhecer essa chave antes da conversa começar. O certificado do passo 2
        não serve pra criptografar o tráfego em si; ele serve pra provar identidade antes de qualquer chave ser
        combinada.
      </p>

      <h2>Certificado — quem garante que ele é legítimo?</h2>
      <p>
        Um certificado é assinado por uma <strong>autoridade certificadora</strong> (CA — Certificate Authority), uma
        entidade cuja chave pública raiz já vem <strong>pré-instalada como confiável</strong> no seu sistema
        operacional e no seu navegador. Se o certificado do servidor faz parte de uma cadeia que termina numa dessas
        raízes confiáveis, o navegador aceita sem perguntar nada a você.
      </p>
      <CodeExample
        label="terminal — inspecionando a cadeia de certificado"
        language="bash"
        code={`curl -vI https://howtodev.site 2>&1 | grep -E "subject|issuer"`}
        result={`*  subject: CN=howtodev.site
*  issuer: C=US; O=Let's Encrypt; CN=R3`}
      />
      <p>
        <code>issuer</code> é quem assinou o certificado; nesse exemplo, a <strong>Let's Encrypt</strong> — uma CA
        gratuita e automatizada, que emite certificados via um protocolo chamado ACME. Uma ferramenta como o{" "}
        <code>certbot</code> automatiza esse processo inteiro: prova que você controla o domínio, recebe o
        certificado, e agenda a renovação sozinha (certificados da Let's Encrypt valem só ~90 dias, de propósito,
        justamente pra forçar esse tipo de automação em vez de renovação manual esquecida).
      </p>

      <h2>O que o cadeado NÃO garante</h2>
      <p>
        O cadeado prova só duas coisas: <strong>a conexão está criptografada</strong>, e{" "}
        <strong>o certificado corresponde ao domínio que você está acessando</strong>. Ele não prova que o site por
        trás é confiável, legítimo, ou que a empresa é quem diz ser. Uma página de phishing registrada em{" "}
        <code>seu-banc0-online.com</code> consegue um certificado válido gratuito com a mesma facilidade que qualquer
        outro site — a CA verifica só que quem pediu o certificado controla aquele domínio, não a reputação de quem
        está por trás dele.
      </p>

      <Exercise
        prompt={
          <p>
            Um colega diz: "não tem como ser phishing, o site tem cadeado e certificado válido". O que está errado
            nesse raciocínio?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`O cadeado só confirma que a conexão está criptografada e que o
certificado bate com aquele domínio específico — não confirma que o
dono do domínio é confiável. Um certificado de validação de domínio
(o tipo mais comum, inclusive o da Let's Encrypt) prova apenas
controle sobre o domínio, algo que um atacante registrando um
domínio parecido consegue com a mesma facilidade que qualquer site
legítimo. Confiança no CONTEÚDO do site precisa vir de outro lugar
(reputação do domínio, verificação manual da URL, etc.), não do
cadeado.`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls">
        A configuração real de TLS usada em produção pelo padrão — incluindo renovação automática de certificado —
        está documentada no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que o cadeado do navegador realmente garante?",
            options: [
              "Que o site foi verificado manualmente por uma autoridade que confirma que ele é confiável",
              "Que a conexão está criptografada e o certificado corresponde àquele domínio — não que o site por trás é confiável ou legítimo",
              "Que o servidor nunca sofreu nenhum tipo de invasão anterior",
              "Que os dados enviados não podem ser interceptados nem mesmo pelo próprio servidor",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que uma autoridade certificadora (CA) como a Let's Encrypt é confiável para o navegador?",
            options: [
              "Porque a CA paga uma taxa anual para aparecer na lista de fornecedores recomendados do navegador",
              "Porque toda CA precisa registrar cada certificado emitido diretamente no servidor DNS do domínio",
              "Porque o navegador consulta a CA em tempo real a cada requisição HTTPS para confirmar a validade",
              "Porque a chave pública raiz dessa CA já vem pré-instalada como confiável no sistema operacional ou navegador, formando uma cadeia de confiança até o certificado do site",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
