import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "02-endereco-ip-e-portas",
  title: "Endereço IP e portas",
  summary: "O endereço de um computador na rede, e como várias aplicações compartilham o mesmo endereço.",
  estimatedMinutes: 12,
};

export default function Licao02EnderecoIpEPortas() {
  return (
    <LessonBody>
      <h2>IP — o endereço de um dispositivo na rede</h2>
      <p>
        Todo dispositivo conectado à internet tem um endereço IP — um identificador numérico único naquela rede,
        parecido com um endereço de casa (rua, número).
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`64: en0: flags=8863 mtu 1500
 inet 192.168.1.42 netmask 0xffffff00 broadcast 192.168.1.255`}
        code={`ifconfig    # (no Linux/Mac) mostra o IP local da sua máquina`}
      />
      <CodeExample
        label="terminal — descobrindo o IP de um domínio"
        language="bash"
        result={`howtodev.site has address 76.76.21.21`}
        code={`nslookup howtodev.site`}
      />
      <p>
        <code>192.168.1.42</code> é IPv4 (4 números de 0-255, o formato mais comum ainda hoje).{" "}
        <code>IPv6</code> existe porque IPv4 tem só ~4 bilhões de endereços possíveis — insuficiente pra todos os
        dispositivos do mundo hoje — e se parece com{" "}
        <code>2001:0db8:85a3:0000:0000:8a2e:0370:7334</code>.
      </p>

      <h2>Porta — qual aplicação, dentro do mesmo endereço</h2>
      <p>
        Um servidor pode rodar várias aplicações ao mesmo tempo (um site, um banco de dados, um servidor de e-mail)
        — todas no mesmo IP. A <strong>porta</strong> é o número que diferencia qual aplicação deve receber aquela
        conexão, de 0 a 65535.
      </p>
      <CodeExample
        label="portas conhecidas"
        language="plaintext"
        code={`80    → HTTP (site sem criptografia)
443   → HTTPS (site com criptografia)
22    → SSH (acesso remoto ao servidor)
5432  → PostgreSQL
3306  → MySQL
6379  → Redis`}
      />
      <CodeExample
        label="uma URL completa, com porta explícita"
        language="plaintext"
        code={`http://192.168.1.42:8080/produtos
       \\__________/ \\__/ \\_______/
          IP         porta   caminho

// quando a porta não aparece na URL (http://site.com/produtos),
// o navegador assume 80 (HTTP) ou 443 (HTTPS) por padrão`}
      />

      <Exercise
        prompt={
          <p>
            Um servidor Next.js roda localmente em <code>http://localhost:3000</code>. Qual IP essa URL representa,
            e por que 3000 não é uma porta "padrão" que pode ser omitida?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`localhost representa 127.0.0.1 — o "endereço de loopback", que sempre
aponta pra própria máquina, nunca sai pra rede de verdade.

3000 não é padrão como 80/443, então precisa aparecer explicitamente
na URL — sem isso, o navegador tentaria a porta 80 (HTTP padrão), que
não é onde o servidor de desenvolvimento está escutando.`}
      />

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual o papel da porta, já que o dispositivo já tem um IP?",
            options: [
              "Não tem função real, é só decorativo",
              "Diferencia qual aplicação, dentro do mesmo IP, deve receber aquela conexão específica",
              "É outro nome pro mesmo IP",
              "Só existe em servidores, nunca em computador pessoal",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que http://site.com/produtos funciona sem porta na URL?",
            options: [
              "HTTP não usa porta",
              "O navegador assume a porta padrão (80 para HTTP, 443 para HTTPS) quando nenhuma é especificada",
              "A porta é sempre 3000",
              "site.com já contém a porta escondida",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
