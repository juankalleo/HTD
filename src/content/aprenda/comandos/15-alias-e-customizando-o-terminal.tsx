import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "15-alias-e-customizando-o-terminal",
  title: "Alias e customizando o terminal",
  summary: "Se você digita o mesmo comando longo todo dia, o terminal deixa você dar um apelido curto pra ele — permanente.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao15AliasECustomizandoOTerminal() {
  return (
    <LessonBody>
      <p>
        Depois de um tempo usando terminal, você percebe que repete os mesmos comandos longos o tempo todo —{" "}
        <code>git status</code>, <code>ls -la</code>, alguma combinação de flags que você sempre esquece metade. O
        recurso que resolve isso chama-se <strong>alias</strong>: um apelido curto que vira, na prática, um
        comando de verdade.
      </p>

      <h2>Criando um alias</h2>
      <CodeExample label="terminal" language="bash" code={`alias ll="ls -la"`} />
      <p>
        A partir desse momento, na mesma sessão de terminal, digitar <code>ll</code> executa exatamente{" "}
        <code>ls -la</code>:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ll`}
        result={`drwxr-xr-x  6 joana  staff   192 12 mar 10:00 .
drwxr-xr-x  9 joana  staff   288 10 mar 09:12 ..
-rw-r--r--  1 joana  staff   412 12 mar 10:00 .env
-rw-r--r--  1 joana  staff   180 09 mar 15:03 index.html`}
      />
      <p>
        Alguns exemplos comuns que economizam bastante digitação no dia a dia:
      </p>
      <CodeExample
        label="alias comuns"
        language="bash"
        code={`alias gs="git status"
alias ..="cd .."
alias cls="clear"`}
      />

      <h2>Onde esse apelido mora de verdade</h2>
      <p>
        Só que tem um detalhe: um <code>alias</code> criado direto no terminal, do jeito que fizemos acima, vale
        apenas <strong>pra sessão atual</strong> — feche o terminal, ou abra uma aba nova, e o alias desaparece.
        Pra ele existir sempre, ele precisa estar escrito dentro de um arquivo de configuração do shell, que é lido
        automaticamente toda vez que um terminal novo abre.
      </p>
      <p>
        Esse arquivo tem nome diferente dependendo do shell: no <code>bash</code>, normalmente é{" "}
        <code>~/.bashrc</code>; no <code>zsh</code> (padrão do macOS moderno), é <code>~/.zshrc</code>. Adicionar um
        alias permanente significa abrir esse arquivo num editor e incluir a linha ali dentro:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`nano ~/.zshrc`}
      />
      <CodeExample
        label="dentro de ~/.zshrc, adicione ao final"
        language="bash"
        code={`alias gs="git status"
alias ll="ls -la"`}
      />

      <h2>Por que o alias não funciona imediatamente depois de editar</h2>
      <p>
        Aqui mora a confusão mais comum desta lição: você edita o <code>~/.zshrc</code>, salva, sai do editor, tenta
        usar o alias novo — e não funciona. O motivo é que o shell só <strong>lê</strong> esse arquivo de
        configuração no momento em que uma sessão de terminal é aberta. Editar o arquivo depois que a sessão já
        está rodando não faz o shell reler nada sozinho.
      </p>
      <p>
        Duas formas de resolver isso: abrir um terminal novo (uma sessão nova sempre lê o arquivo do zero), ou
        forçar a sessão atual a reler o arquivo com <code>source</code>:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`source ~/.zshrc`}
      />
      <p>
        <code>source</code> executa o conteúdo do arquivo dentro da sessão atual, como se cada linha tivesse sido
        digitada ali na hora — inclusive os <code>alias</code> que foram adicionados. Depois disso, o alias novo
        já funciona sem precisar fechar o terminal.
      </p>

      <Exercise
        prompt={
          <p>
            Você adicionou <code>alias gs="git status"</code> no final do seu <code>~/.zshrc</code>, salvou, e
            digitou <code>gs</code> na mesma janela de terminal onde estava editando — mas apareceu{" "}
            <code>command not found: gs</code>. O que aconteceu e como resolver sem fechar o terminal?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`source ~/.zshrc

# O ~/.zshrc só é lido quando uma sessão de terminal é ABERTA. Editar
# o arquivo depois que a sessão já estava rodando não faz o shell
# reler sozinho — "source" força essa releitura na sessão atual, sem
# precisar fechar e abrir um terminal novo.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que um alias criado direto no terminal (sem editar nenhum arquivo) desaparece ao fechar a sessão?",
            options: [
              "Porque todo alias tem um limite de 24 horas de duração antes de expirar automaticamente",
              "Porque ele só existe na sessão atual — pra valer sempre, precisa estar escrito num arquivo como ~/.zshrc",
              "Porque alias só funcionam dentro de scripts, nunca digitados diretamente no prompt",
              "Porque o sistema apaga automaticamente qualquer alias que comece com letras minúsculas",
            ],
            correctIndex: 1,
          },
          {
            question: "Depois de adicionar um alias novo dentro do ~/.zshrc já com o terminal aberto, o que 'source ~/.zshrc' resolve?",
            options: [
              "Ele cria uma cópia de backup do arquivo, evitando perder o alias em caso de erro futuro",
              "Ele apaga todos os alias antigos, deixando só o que foi adicionado por último",
              "Ele força a sessão atual a reler o arquivo agora, sem precisar abrir um terminal novo pra usar o alias",
              "Ele converte o alias em uma variável de ambiente permanente do sistema operacional",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
