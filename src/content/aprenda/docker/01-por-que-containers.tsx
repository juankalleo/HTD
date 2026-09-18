import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "01-por-que-containers",
  title: "Por que containers",
  summary: "\"Na minha máquina funciona\" é o problema; container empacota o ambiente inteiro, não só o código.",
  estimatedMinutes: 12,
  level: "fundamentos",
};

export default function Licao01PorQueContainers() {
  return (
    <LessonBody>
      <p>
        Um app raramente é só código — ele depende de uma versão específica do Ruby, do Node, de bibliotecas do
        sistema operacional, de variáveis de ambiente. "Funciona na minha máquina" normalmente significa: funciona
        com o ambiente que <em>eu</em> tenho instalado, não necessariamente o que está descrito em lugar nenhum. Um
        container resolve isso empacotando <strong>o ambiente inteiro</strong> — não só o código.
      </p>

      <h2>Container não é VM</h2>
      <p>
        Uma máquina virtual (VM) simula um computador inteiro, com seu próprio kernel — pesada, lenta pra iniciar. Um
        container compartilha o kernel do host e isola só o processo (sistema de arquivos, rede, processos) — por
        isso inicia em milissegundos e pesa megabytes, não gigabytes.
      </p>

      <CodeExample
        label="comparação"
        language="plaintext"
        code={`VM                              Container
├─ Kernel próprio               ├─ Compartilha o kernel do host
├─ Gigabytes de tamanho         ├─ Megabytes de tamanho
├─ Minutos pra iniciar          ├─ Milissegundos pra iniciar
└─ Isolamento total             └─ Isolamento de processo (namespaces/cgroups)`}
      />

      <h2>Imagem vs. container</h2>
      <p>
        Uma <strong>imagem</strong> é o "molde" — um arquivo somente leitura com tudo que o app precisa (sistema de
        arquivos, dependências, comando de inicialização). Um <strong>container</strong> é uma imagem em execução —
        você pode rodar vários containers a partir da mesma imagem, cada um isolado dos outros.
      </p>

      <CodeExample
        label="terminal"
        language="bash"
        result={`Unable to find image 'nginx:alpine' locally
alpine: Pulling from library/nginx
Status: Downloaded newer image for nginx:alpine
a3f9e2b1c8d4e5f6...`}
        code={`docker run -d -p 8080:80 nginx:alpine`}
      />
      <p>
        Isso baixa a imagem <code>nginx:alpine</code> (se ainda não existir localmente) e sobe um container a partir
        dela, mapeando a porta 80 do container pra 8080 da sua máquina (<code>-p</code>, próxima lição fala mais
        disso) — sem instalar nginx na sua máquina, sem configurar nada além dessa linha.
      </p>

      <Callout href="/padrao-infraestrutura/conceitos-tecnicos/vps-e-containers">
        A discussão completa de VPS vs. containers, incluindo quando cada um faz mais sentido, está documentada no
        Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="docker"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a principal diferença entre container e máquina virtual?",
            options: [
              "Container compartilha o kernel do host e isola só o processo; VM simula um computador inteiro com kernel próprio",
              "VM compartilha o kernel do host pra reduzir consumo de memória, e container sempre roda com seu próprio kernel isolado",
              "Container e VM usam exatamente a mesma técnica de virtualização, mudando apenas o nome comercial da ferramenta",
              "A diferença está no sistema de arquivos: VM usa disco físico e container só existe em memória RAM",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual a relação entre imagem e container?",
            options: [
              "Imagem e container são a mesma coisa depois do build, só muda o nome usado no terminal",
              "Imagem é o molde somente leitura; container é uma instância em execução dessa imagem",
              "Container é o arquivo salvo em disco, e a imagem é gerada automaticamente toda vez que ele inicia",
              "Uma imagem só existe de verdade depois que o primeiro container criado a partir dela é removido",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
