import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "10-variaveis-de-ambiente-e-path",
  title: "Variáveis de ambiente e o PATH",
  summary: "'Command not found' quase sempre é um problema de PATH, não um problema do programa que você instalou.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao10VariaveisDeAmbienteEPath() {
  return (
    <LessonBody>
      <p>
        Toda sessão de terminal carrega um conjunto de <strong>variáveis de ambiente</strong> — valores que ficam
        disponíveis pra qualquer comando ou programa que você rodar dali. Uma dessas variáveis, o{" "}
        <code>PATH</code>, é responsável por uma das mensagens de erro mais comuns do terminal:{" "}
        <code>command not found</code>. Entender o porquê resolve boa parte da confusão de quem está começando.
      </p>

      <h2>Criando e lendo uma variável</h2>
      <p>
        Pra criar uma variável de ambiente na sessão atual do shell, usa-se <code>export</code>:
      </p>
      <CodeExample label="terminal" language="bash" code={`export NOME_DO_USUARIO="joana"`} />
      <p>
        Pra ler o valor de qualquer variável, coloca-se <code>$</code> antes do nome — sem o <code>$</code>, o
        shell trataria <code>NOME_DO_USUARIO</code> como texto comum, não como referência a uma variável.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`echo $NOME_DO_USUARIO`}
        result={`joana`}
      />
      <p>
        Uma variável criada com <code>export</code> num terminal só existe <strong>nessa sessão</strong> — feche o
        terminal e ela desaparece. Pra ela existir toda vez que você abre um terminal novo, o <code>export</code>{" "}
        precisa estar escrito dentro de um arquivo de configuração do shell (como <code>~/.zshrc</code>), assunto
        que a lição 15 cobre em detalhe.
      </p>

      <h2>O que é o PATH</h2>
      <p>
        Quando você digita um comando como <code>node</code> ou <code>git</code>, o shell precisa descobrir{" "}
        <strong>onde no disco</strong> está o programa que corresponde a esse nome — ele não procura a máquina
        inteira, procura só numa lista específica de pastas. Essa lista é a variável <code>PATH</code>.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`echo $PATH`}
        result={`/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`}
      />
      <p>
        Cada pasta nessa lista é separada por <code>:</code>. Quando você roda <code>git</code>, o shell procura,
        em ordem, um arquivo executável chamado <code>git</code> dentro de cada uma dessas pastas — assim que
        encontra o primeiro, executa e para de procurar.
      </p>

      <h2>Por que 'command not found' acontece</h2>
      <p>
        Se você instala um programa novo e o executável dele fica salvo numa pasta que <strong>não</strong> está
        listada no <code>PATH</code>, o shell simplesmente não sabe que ele existe — mesmo que o arquivo esteja lá,
        íntegro, funcionando.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`meu_programa`}
        result={`zsh: command not found: meu_programa`}
      />
      <p>
        Isso não significa que o programa não foi instalado — muitas vezes significa só que ele foi instalado numa
        pasta que o <code>PATH</code> desconhece. A correção é adicionar essa pasta ao <code>PATH</code>:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`export PATH="$PATH:/caminho/onde/meu_programa/esta"`}
      />
      <p>
        Repare no truque: <code>$PATH</code> do lado direito pega o valor <strong>atual</strong> da variável, e o
        comando inteiro recria <code>PATH</code> como "tudo que já tinha, mais essa pasta nova no final". Se você
        esquecer o <code>$PATH</code> ali e escrever só{" "}
        <code>export PATH="/caminho/onde/meu_programa/esta"</code>, você <strong>substitui</strong> o PATH inteiro
        por essa única pasta — e de repente comandos básicos como <code>ls</code> também param de funcionar,
        porque as pastas onde eles moram saíram da lista.
      </p>

      <Exercise
        prompt={
          <p>
            Você acabou de instalar uma ferramenta de linha de comando chamada <code>minhaferramenta</code>, que
            ficou salva em <code>/opt/minhaferramenta/bin</code>. Ao digitar <code>minhaferramenta</code>, aparece{" "}
            <code>command not found</code>. Explique a causa provável e o comando que resolve.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`export PATH="$PATH:/opt/minhaferramenta/bin"

# A causa provável é que /opt/minhaferramenta/bin não está listada no
# PATH — o shell não sabe procurar ali. Adicionando essa pasta ao PATH
# (mantendo o que já existia com "$PATH:"), o comando passa a ser
# encontrado. Pra isso valer em todo terminal novo, essa linha
# precisaria ir pro arquivo de configuração do shell (lição 15).`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que a variável PATH realmente contém e pra que ela serve?",
            options: [
              "Contém o histórico dos últimos comandos digitados, usado pela tecla seta pra cima",
              "Contém uma lista de pastas onde o shell procura o executável correspondente a um comando digitado",
              "Contém a senha do usuário logado, usada automaticamente em comandos que pedem sudo",
              "Contém o caminho absoluto da pasta pessoal do usuário, usado pelo atalho '~'",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que escrever 'export PATH=\"/nova/pasta\"' (sem incluir '$PATH' dentro do valor) é arriscado?",
            options: [
              "Não é arriscado, é exatamente a forma recomendada de adicionar uma pasta nova ao PATH",
              "Porque isso apaga permanentemente a pasta '/nova/pasta' do disco, não só da variável",
              "Porque isso faz o shell fechar imediatamente, exigindo reiniciar o terminal",
              "Porque isso substitui o PATH inteiro por essa única pasta, fazendo comandos básicos como 'ls' pararem de ser encontrados",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
