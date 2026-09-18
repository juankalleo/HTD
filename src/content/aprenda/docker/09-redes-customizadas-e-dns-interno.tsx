import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "09-redes-customizadas-e-dns-interno",
  title: "Redes Docker de verdade: bridge, host e networks customizadas",
  summary: "A rede automática do compose resolve o caso comum — mas isolar ambientes ou conectar projetos diferentes exige entender o que tem por trás.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao09RedesCustomizadasEDnsInterno() {
  return (
    <LessonBody>
      <p>
        Na trilha de fundamentos, subir um <code>docker-compose.yml</code> "simplesmente funciona": os serviços se
        enxergam pelo nome, sem configurar IP nenhum. Isso não é mágica do Docker em geral — é um comportamento
        específico da rede que o Compose cria pra você. Fora do Compose, ou quando você precisa de mais controle,
        existe uma camada inteira aqui que vale entender.
      </p>

      <h2>Os drivers de rede: bridge, host e none</h2>
      <p>
        Toda rede Docker usa um <strong>driver</strong>, que define como o tráfego se comporta. Os três mais comuns:
      </p>
      <CodeExample
        label="drivers de rede"
        language="plaintext"
        code={`bridge (customizada)   Rede isolada, virtual. Containers na mesma rede bridge customizada se
                        enxergam por NOME (DNS interno). É o que o Compose cria automaticamente.
bridge (padrão)         A rede "docker0" que existe sozinha em toda instalação do Docker. Containers
                        soltos com "docker run" sem --network caem aqui — e essa rede NÃO resolve nome
                        de container por DNS, só por IP.
host                    O container usa a rede do host diretamente, sem isolamento nem NAT. Não precisa
                        de "-p" pra publicar porta — o container já escuta direto na porta do host.
none                    Sem rede nenhuma. O container não tem nem interface de loopback além da própria.`}
      />
      <p>
        O detalhe que costuma confundir: existe <strong>uma</strong> rede chamada "bridge" que já vem pronta com o
        Docker (a rede padrão), e existe o <strong>driver</strong> "bridge", que você usa pra criar outras redes,
        customizadas, com nome próprio. São coisas diferentes com o mesmo nome. A rede bridge padrão não faz DNS por
        nome de container — é por isso que, historicamente, quem usava só <code>docker run</code> precisava descobrir
        o IP do outro container na mão. Uma rede bridge <strong>customizada</strong> (criada com <code>docker network
        create</code>, ou automaticamente pelo Compose) já resolve isso.
      </p>

      <h2>Criando e conectando uma rede na mão</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`a4f8e21b9c3d...
NETWORK ID     NAME          DRIVER    SCOPE
a4f8e21b9c3d   minha-rede    bridge    local`}
        code={`docker network create minha-rede
docker network ls`}
      />
      <p>
        Com a rede criada, qualquer container iniciado com <code>--network minha-rede</code> entra nela e passa a
        resolver os outros containers da mesma rede pelo nome (ou pelo <code>--name</code> que você deu a eles).
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`docker run -d --name api --network minha-rede minha-api:latest
docker run -d --name worker --network minha-rede minha-api:latest node worker.js`}
      />
      <p>
        Dentro do container <code>worker</code>, <code>ping api</code> resolve — os dois estão na mesma rede
        customizada, exatamente como acontece entre serviços de um mesmo <code>docker-compose.yml</code>.
      </p>

      <h2>Conectando containers de composes (ou projetos) diferentes</h2>
      <p>
        Por padrão, cada <code>docker-compose.yml</code> cria a <strong>própria</strong> rede isolada — mesmo que dois
        projetos estejam rodando na mesma VPS, os containers de um não enxergam os do outro. Isso é bom (isolamento),
        mas às vezes você precisa que dois projetos separados se falem — por exemplo, uma API que fica num
        repositório e um serviço de monitoramento que fica em outro. A solução é declarar uma rede{" "}
        <strong>externa</strong>, criada fora de qualquer compose específico, e referenciá-la nos dois arquivos.
      </p>
      <CodeExample
        label="terminal — criando a rede compartilhada uma vez"
        language="bash"
        code={`docker network create rede-compartilhada`}
      />
      <CodeExample
        label="projeto-api/docker-compose.yml"
        language="yaml"
        code={`services:
  api:
    build: .
    networks:
      - default
      - rede-compartilhada

networks:
  rede-compartilhada:
    external: true`}
      />
      <CodeExample
        label="projeto-monitoramento/docker-compose.yml"
        language="yaml"
        code={`services:
  monitor:
    image: monitor:latest
    networks:
      - rede-compartilhada

networks:
  rede-compartilhada:
    external: true`}
      />
      <p>
        Com isso, <code>monitor</code> consegue chamar <code>http://api:3000</code> mesmo os dois serviços vindo de
        arquivos de compose (e possivelmente pastas/repositórios) completamente diferentes — o que importa é os dois
        estarem conectados à mesma rede <code>rede-compartilhada</code>, marcada como <code>external</code> porque ela
        não foi criada por nenhum dos dois composes, já existia antes.
      </p>

      <h2>Inspecionando uma rede</h2>
      <CodeExample
        label="terminal"
        language="bash"
        result={`"Containers": {
  "3f2a1b...": { "Name": "api", "IPv4Address": "172.20.0.2/16" },
  "9c8d7e...": { "Name": "monitor", "IPv4Address": "172.20.0.3/16" }
}`}
        code={`docker network inspect rede-compartilhada`}
      />
      <p>
        <code>docker network inspect</code> mostra exatamente quem está conectado, com qual IP — o primeiro lugar pra
        olhar quando um container "deveria" enxergar outro e não enxerga.
      </p>

      <h2>Por que isolar rede por ambiente importa</h2>
      <p>
        Se staging e produção rodam na mesma VPS sem redes separadas, um container de staging comprometido (ou só mal
        configurado) pode alcançar o banco de produção diretamente, sem passar por autenticação nenhuma de borda — a
        rede interna do Docker não sabe distinguir "ambiente de teste" de "ambiente real", só distingue quem está
        conectado em qual rede. Dar uma rede própria pra cada ambiente (ou pra cada projeto) faz esse isolamento
        existir de verdade, não só na cabeça de quem escreveu o compose.
      </p>

      <Exercise
        prompt={
          <p>
            Dois composes na mesma VPS: <code>loja/docker-compose.yml</code> (serviços <code>loja-api</code> e{" "}
            <code>loja-db</code>) e <code>blog/docker-compose.yml</code> (serviços <code>blog-api</code> e{" "}
            <code>blog-db</code>). Eles não deveriam se enxergar. O time reclama que, ao rodar{" "}
            <code>docker compose up</code> nos dois ao mesmo tempo, nada quebrou — mas querem confirmar que estão
            isolados de verdade. Que comando confirma isso, e o que esperar ver?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`docker network ls
# Duas redes distintas devem aparecer, uma por projeto
# (ex.: loja_default e blog_default), cada uma com driver bridge.

docker network inspect loja_default
# Só loja-api e loja-db devem aparecer na lista de "Containers".
# Se blog-api aparecer aqui também, os dois NÃO estão isolados —
# alguém declarou uma rede "external" compartilhada sem necessidade.`}
      />

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/rede-e-protocolos">
        Os conceitos de rede por trás disso (IP, porta, protocolo, isolamento) estão documentados em detalhe no
        Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre a rede bridge padrão do Docker e uma rede bridge customizada?",
            options: [
              "A rede bridge customizada resolve containers por nome (DNS interno); a padrão não faz isso, só por IP",
              "Não existe diferença nenhuma, os dois nomes descrevem exatamente o mesmo comportamento",
              "A rede padrão é mais rápida porque não passa pelo driver bridge do Docker",
              "A rede customizada só existe dentro de um docker-compose.yml, nunca fora dele",
            ],
            correctIndex: 0,
          },
          {
            question: "Como fazer dois containers de docker-compose.yml diferentes (projetos separados) se enxergarem pelo nome?",
            options: [
              "Isso não é possível — cada compose sempre fica isolado dos demais permanentemente",
              "Copiando o docker-compose.yml de um projeto para dentro da pasta do outro projeto",
              "Rodando os dois composes com o mesmo nome de projeto na flag -p do Docker Compose",
              "Criando uma rede externa com docker network create e referenciando-a como external: true nos dois arquivos",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
