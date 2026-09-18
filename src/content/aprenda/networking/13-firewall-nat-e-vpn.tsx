import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-firewall-nat-e-vpn",
  title: "Firewall, NAT e VPN",
  summary: "Três peças que decidem o que entra, quem compartilha um mesmo IP, e o que parece vir de outro lugar.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao13FirewallNatEVpn() {
  return (
    <LessonBody>
      <h2>Firewall — filtrando tráfego por regra</h2>
      <p>
        Um <strong>firewall</strong> examina cada pacote que entra (ou sai) de uma máquina ou rede e decide, com base
        em regras (IP de origem, porta de destino, protocolo), se deixa passar ou bloqueia. No Linux, isso roda no
        próprio kernel via <code>netfilter</code>, geralmente configurado através do <code>iptables</code> ou de
        ferramentas mais recentes construídas em cima dele.
      </p>
      <CodeExample
        label="regra de firewall simplificada"
        language="bash"
        code={`# permite entrada na porta 443 (HTTPS)
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# bloqueia todo o resto de entrada por padrão
iptables -A INPUT -j DROP`}
      />
      <p>
        Um firewall <strong>stateful</strong> (a maioria hoje) lembra do estado de uma conexão já estabelecida — se
        seu computador abriu uma conexão de saída para um site, ele libera automaticamente o tráfego de volta dessa
        mesma conversa, sem precisar de uma regra explícita de entrada pra cada resposta possível.
      </p>

      <h2>NAT — como a casa inteira compartilha 1 IP público</h2>
      <p>
        Sua casa provavelmente tem vários dispositivos (notebook, celular, smart TV), cada um com um IP{" "}
        <strong>privado</strong> na rede local — mas só <strong>um</strong> IP público, atribuído pelo provedor ao
        roteador. O roteador faz <strong>NAT</strong> (Network Address Translation): troca o IP de origem de cada
        pacote de saída pelo IP público dele, e guarda uma tabela interna pra saber pra qual dispositivo devolver
        cada resposta que chegar.
      </p>
      <CodeExample
        label="NAT, resumido"
        language="plaintext"
        code={`Notebook   192.168.1.10  ─┐
Celular    192.168.1.11  ─┼─► roteador (NAT) ─► internet, saindo como 203.0.113.7
Smart TV   192.168.1.12  ─┘

// a resposta que volta pra 203.0.113.7 é redirecionada, pela tabela
// de NAT, de volta pro dispositivo certo que fez aquela requisição`}
      />
      <p>
        Isso existe, em parte, porque IPv4 tem endereços insuficientes pra dar um IP público único a cada dispositivo
        do planeta — NAT permite que uma casa inteira "pareça" um único dispositivo pra internet.
      </p>

      <h2>VPN — um túnel criptografado até outro ponto da rede</h2>
      <p>
        Uma <strong>VPN</strong> cria uma conexão criptografada entre seu dispositivo e um servidor VPN; todo o seu
        tráfego passa por esse túnel antes de sair pra internet "de verdade", saindo com o IP do servidor VPN, não o
        seu. Dois usos comuns: acessar recursos internos de uma empresa que não estão expostos na internet pública
        (como se seu notebook estivesse fisicamente dentro da rede do escritório), ou evitar que a rede local (Wi-Fi
        de aeroporto, por exemplo) veja o conteúdo do seu tráfego.
      </p>
      <p>
        Uma VPN não te torna anônimo de forma absoluta — ela só troca quem consegue ver seu tráfego bruto: em vez do
        seu provedor de internet local, passa a ser o provedor da VPN.
      </p>

      <Exercise
        prompt={
          <p>
            Um funcionário remoto reclama que, depois de conectar na VPN da empresa, até o Netflix (sem nenhuma
            relação com os sistemas internos) ficou mais lento. Qual configuração de VPN provavelmente causa isso?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Provavelmente é uma VPN configurada em modo "full tunnel" — TODO o
tráfego do dispositivo, incluindo o que não tem nada a ver com a
rede interna da empresa, passa pelo túnel até o servidor VPN antes
de seguir pra internet. Isso adiciona um salto de rede extra (e às
vezes um servidor VPN congestionado) até pra tráfego que não
precisava passar por ali. A alternativa é um "split tunnel", onde só
o tráfego destinado à rede interna da empresa passa pela VPN, e o
resto (Netflix, sites públicos) sai direto pela internet normal.`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall">
        A configuração real de firewall (netfilter/iptables) usada em produção pelo padrão está documentada no
        Padrão Infraestrutura.
      </Callout>
      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/fail2ban-e-controle-de-acesso">
        Bloqueio automático de IPs abusivos (fail2ban) complementa o firewall e está documentado no Padrão
        Infraestrutura.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que vários dispositivos numa mesma casa conseguem acessar a internet usando um único IP público?",
            options: [
              "Porque o provedor de internet atribui um IP público diferente pra cada dispositivo automaticamente",
              "O roteador faz NAT, traduzindo o IP privado de cada dispositivo para o IP público compartilhado, e mantém uma tabela pra rotear as respostas de volta certo",
              "Porque todos os dispositivos da casa compartilham fisicamente o mesmo cabo de rede até o provedor",
              "Porque o IPv6 eliminou a necessidade de qualquer tradução de endereço dentro da rede local",
            ],
            correctIndex: 1,
          },
          {
            question: "O que uma VPN realmente faz quando você conecta nela?",
            options: [
              "Remove completamente a possibilidade de qualquer site rastrear sua navegação",
              "Aumenta a velocidade da sua conexão, já que os dados passam por menos saltos de rede",
              "Substitui a necessidade de HTTPS, já que todo tráfego já sai criptografado por padrão",
              "Cria um túnel criptografado até o servidor da VPN, fazendo seu tráfego parecer que sai do IP desse servidor, não do seu",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
