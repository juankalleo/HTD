import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-dns",
  title: "DNS — traduzindo nomes em endereços",
  summary: "Ninguém decora IP — o DNS é a 'agenda de contatos' que traduz howtodev.site pra um número.",
  estimatedMinutes: 15,
};

export default function Licao03Dns() {
  return (
    <LessonBody>
      <p>
        Você nunca digita <code>76.76.21.21</code> pra visitar um site — digita <code>howtodev.site</code>. O{" "}
        <strong>DNS</strong> (Domain Name System) é o sistema que traduz esse nome legível em endereço IP, antes de
        qualquer requisição HTTP sequer começar.
      </p>

      <NetworkDiagram
        height={230}
        nodes={[
          { id: "client", label: "Navegador", kind: "client", x: 12, y: 50 },
          { id: "dns", label: "Servidor DNS", kind: "dns", x: 50, y: 20 },
          { id: "server", label: "Servidor do site", kind: "server", x: 88, y: 50 },
        ]}
        hops={[
          { from: "client", to: "dns", caption: "1. \"Qual o IP de howtodev.site?\"" },
          { from: "dns", to: "client", caption: "2. DNS responde: \"76.76.21.21\"." },
          { from: "client", to: "server", caption: "3. Só agora o navegador conecta direto no IP e manda a requisição HTTP." },
        ]}
      />

      <h2>Um domínio tem vários "tipos de registro"</h2>
      <CodeExample
        label="dig howtodev.site (tipos de registro DNS mais comuns)"
        language="plaintext"
        code={`A       → aponta pra um IPv4 (howtodev.site → 76.76.21.21)
AAAA    → aponta pra um IPv6
CNAME   → aponta pra OUTRO nome de domínio, não um IP direto
MX      → pra onde mandar e-mail desse domínio
TXT     → texto livre — usado pra verificação de propriedade, SPF, etc.`}
      />

      <h2>Cache — por que a mudança de DNS demora pra "propagar"</h2>
      <p>
        Consultar o DNS a cada requisição seria lento — por isso o resultado fica em{" "}
        <strong>cache</strong> em vários níveis: no seu navegador, no seu sistema operacional, no roteador da sua
        rede, no provedor de internet. Cada nível guarda a resposta por um tempo (o <code>TTL</code>, Time To Live,
        definido pelo dono do domínio). É por isso que mudar o IP de um domínio não reflete instantaneamente pra
        todo mundo — quem tem a resposta antiga em cache só vai perguntar de novo depois que o TTL expirar.
      </p>

      <Exercise
        prompt={<p>Por que um site troca de servidor (novo IP) sem que os usuários percebam interrupção, na maioria das vezes?</p>}
        solutionLanguage="plaintext"
        solutionCode={`Porque o registro DNS tipo A é atualizado pro novo IP, e conforme o
cache antigo (em cada nível) expira pelo TTL, cada visitante passa a
resolver pro IP novo automaticamente — sem precisar mudar nada na URL
que o usuário digita, só o que ela aponta por trás.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Em que momento do carregamento de um site o DNS entra em ação?",
            options: [
              "Depois que a página já apareceu na tela",
              "Antes de qualquer requisição HTTP — o navegador precisa saber o IP antes de conseguir se conectar ao servidor",
              "Só quando o site usa HTTPS",
              "DNS não tem relação com carregar um site",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que uma mudança de DNS não reflete instantaneamente pra todo mundo?",
            options: [
              "É um bug do sistema",
              "A resposta fica em cache em vários níveis (navegador, SO, provedor), cada um expirando conforme o TTL configurado",
              "DNS não suporta atualização",
              "Só afeta usuários fora do país do servidor",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
