import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "13-gerenciadores-de-pacote",
  title: "Gerenciadores de pacote: apt e brew",
  summary: "Instalar programas sem baixar instalador nenhum — e por que 'sudo' em tudo, sem pensar, é o hábito mais arriscado desta lição.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao13GerenciadoresDePacote() {
  return (
    <LessonBody>
      <p>
        Instalar um programa fora do terminal normalmente significa baixar um arquivo, abrir um instalador,
        clicar em "avançar" algumas vezes. No terminal, esse trabalho é feito por um{" "}
        <strong>gerenciador de pacotes</strong> — uma ferramenta que baixa, instala, atualiza e remove programas a
        partir de um repositório confiável, tudo com um único comando.
      </p>

      <h2>apt — o gerenciador padrão em distribuições baseadas em Debian/Ubuntu</h2>
      <p>
        Em servidores Linux (a grande maioria roda Ubuntu ou Debian), o gerenciador mais comum é o{" "}
        <code>apt</code>. Antes de instalar qualquer coisa nova, o primeiro passo quase sempre é atualizar a lista
        de pacotes disponíveis:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`sudo apt update`}
        result={`Lendo listas de pacotes... Pronto
Todos os pacotes estão atualizados.`}
      />
      <p>
        <code>apt update</code> não instala nem atualiza programa nenhum ainda — ele só baixa a{" "}
        <strong>lista</strong> mais recente de quais versões estão disponíveis em cada repositório configurado.
        Sem rodar isso primeiro, o <code>apt</code> pode tentar instalar uma versão desatualizada, ou nem encontrar
        um pacote que foi adicionado recentemente ao repositório.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`sudo apt install htop`}
        result={`Lendo listas de pacotes... Pronto
As seguintes pacotes NOVOS serão instalados: htop
Configurando htop (3.0.5-7) ...`}
      />
      <CodeExample
        label="terminal"
        language="bash"
        code={`sudo apt upgrade   # atualiza todos os pacotes instalados pra versão mais recente
sudo apt remove htop  # remove o pacote`}
      />

      <h2>brew — o gerenciador mais comum no macOS</h2>
      <p>
        O macOS não vem com <code>apt</code> nem com gerenciador de pacotes nenhum instalado por padrão — o{" "}
        <strong>Homebrew</strong> (comando <code>brew</code>) preenche esse espaço e virou o padrão de facto entre
        quem desenvolve em Mac. A lógica dos comandos é praticamente a mesma do <code>apt</code>:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`brew update
brew install htop
brew upgrade
brew uninstall htop`}
      />
      <p>
        Uma diferença notável: o <code>brew</code> instala pacotes na pasta do próprio usuário (normalmente sem
        precisar de <code>sudo</code>), enquanto o <code>apt</code> instala em pastas do sistema que exigem
        privilégio de administrador — por isso os exemplos de <code>apt</code> acima levam <code>sudo</code> e os
        de <code>brew</code> não.
      </p>

      <h2>Por que sudo em tudo, sem entender, é arriscado</h2>
      <p>
        <code>sudo</code> (<em>superuser do</em>) executa um comando com privilégios de administrador — sem as
        restrições normais de permissão que protegem o sistema de mudanças acidentais. É necessário pra várias
        operações legítimas, como o <code>apt install</code> acima. O problema é o hábito de colar{" "}
        <code>sudo</code> na frente de <strong>qualquer</strong> comando que dá erro de permissão, sem entender{" "}
        <em>por que</em> ele pediu privilégio.
      </p>
      <p>
        Um comando rodado com <code>sudo</code> tem poder de alterar ou apagar praticamente qualquer arquivo do
        sistema, inclusive arquivos essenciais pro sistema operacional funcionar. Rodar <code>sudo rm -rf</code>{" "}
        num caminho errado, por exemplo, não tem a proteção que normalmente impediria apagar arquivos de sistema
        sem privilégio — o <code>sudo</code> remove justamente essa proteção. A regra prática: use{" "}
        <code>sudo</code> quando você entende por que aquele comando específico precisa de privilégio elevado,
        nunca como reflexo automático pra "fazer o erro sumir".
      </p>

      <Exercise
        prompt={
          <p>
            Num servidor Ubuntu novo, você precisa instalar o <code>curl</code>. Escreva a sequência completa de
            comandos, na ordem certa, explicando o motivo do primeiro passo.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`sudo apt update
sudo apt install curl

# "apt update" primeiro garante que a lista de pacotes disponíveis está
# atualizada — sem isso, o "apt install" poderia não encontrar o
# pacote mais recente ou falhar por estar usando uma lista desatualizada.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que exatamente 'sudo apt update' faz, sem ainda instalar nada?",
            options: [
              "Instala automaticamente a versão mais recente de todos os pacotes já presentes no sistema",
              "Remove pacotes antigos que não são mais usados, liberando espaço em disco",
              "Atualiza a lista de pacotes disponíveis nos repositórios configurados, preparando o terreno pra um install ou upgrade",
              "Reinicia o serviço de gerenciamento de pacotes do sistema, sem alterar nenhum pacote",
            ],
            correctIndex: 2,
          },
          {
            question: "Por que colocar 'sudo' na frente de qualquer comando que dá erro de permissão, sem entender o motivo, é um hábito arriscado?",
            options: [
              "Porque 'sudo' só funciona uma vez por sessão de terminal, então o segundo uso sempre falha",
              "Porque comandos com 'sudo' rodam mais lentamente, consumindo mais recursos do sistema sem necessidade",
              "Porque 'sudo' exige que o usuário tenha uma conta de administrador cadastrada previamente no repositório",
              "Porque 'sudo' remove as restrições normais de permissão, dando ao comando poder de alterar arquivos essenciais do sistema",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
