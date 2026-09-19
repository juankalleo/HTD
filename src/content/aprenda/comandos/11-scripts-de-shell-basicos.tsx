import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-scripts-de-shell-basicos",
  title: "Scripts de shell básicos",
  summary: "Um script é só uma sequência de comandos que você já digitaria à mão, salva num arquivo pra nunca mais precisar redigitar.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao11ScriptsDeShellBasicos() {
  return (
    <LessonBody>
      <p>
        Depois de acumular alguns comandos que você roda sempre na mesma sequência, o próximo passo natural é
        parar de digitar tudo à mão toda vez e salvar essa sequência num arquivo — um <strong>script de shell</strong>.
        Não tem mistério: um script é um arquivo de texto comum com comandos, um por linha, executado de cima pra
        baixo.
      </p>

      <h2>A linha shebang</h2>
      <p>
        Todo script de shell começa com uma linha especial chamada <strong>shebang</strong>, que diz ao sistema
        qual programa deve interpretar o resto do arquivo:
      </p>
      <CodeExample label="script.sh" language="bash" code={`#!/bin/bash`} />
      <p>
        Apesar de parecer um comentário (começa com <code>#</code>), essa linha específica no topo do arquivo tem
        um significado especial pro sistema operacional: <code>#!/bin/bash</code> diz "rode este arquivo usando o
        interpretador <code>bash</code> que está em <code>/bin/bash</code>". Sem essa linha, o sistema não saberia
        automaticamente que tipo de script está executando.
      </p>

      <h2>Variáveis dentro de um script</h2>
      <p>
        Variáveis dentro de um script funcionam igual às da lição anterior, sem <code>export</code> quando o valor
        só é usado dentro do próprio script:
      </p>
      <CodeExample
        label="script.sh"
        language="bash"
        code={`#!/bin/bash
nome="mundo"
echo "Olá, $nome!"`}
        result={`Olá, mundo!`}
      />

      <h2>if/else — decisões condicionais</h2>
      <CodeExample
        label="script.sh"
        language="bash"
        code={`#!/bin/bash
idade=20

if [ $idade -ge 18 ]; then
  echo "Maior de idade"
else
  echo "Menor de idade"
fi`}
        result={`Maior de idade`}
      />
      <p>
        A sintaxe estranha com colchetes (<code>[ $idade -ge 18 ]</code>) é assim mesmo no bash — os espaços dentro
        dos colchetes são obrigatórios, e <code>-ge</code> significa <em>greater or equal</em> ("maior ou igual").
        Todo bloco <code>if</code> em shell script termina com <code>fi</code> (o próprio <code>if</code>{" "}
        escrito ao contrário — é assim que o bash sabe onde o bloco acaba).
      </p>

      <h2>Um loop for simples</h2>
      <CodeExample
        label="script.sh"
        language="bash"
        code={`#!/bin/bash
for arquivo in *.txt; do
  echo "Processando: $arquivo"
done`}
        result={`Processando: notas.txt
Processando: tarefas.txt`}
      />
      <p>
        Esse <code>for</code> percorre cada arquivo <code>.txt</code> da pasta atual, um de cada vez, executando o
        bloco entre <code>do</code> e <code>done</code> pra cada um. É o tipo de repetição que substituiria rodar o
        mesmo comando manualmente uma vez por arquivo.
      </p>

      <h2>Tornando o script executável e rodando</h2>
      <p>
        Lembra da lição 5, sobre permissões? Um arquivo de script criado normalmente <strong>não</strong> vem com
        permissão de execução — sem isso, o sistema recusa rodar o arquivo como programa, mesmo que o conteúdo
        esteja certo.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`chmod +x script.sh
./script.sh`}
        result={`Olá, mundo!
Maior de idade
Processando: notas.txt
Processando: tarefas.txt`}
      />
      <p>
        Repare no <code>./</code> antes do nome do script — isso é necessário porque, por segurança, o shell não
        procura por programas executáveis na pasta atual dentro do <code>PATH</code> (lição anterior). O{" "}
        <code>./</code> diz explicitamente "execute o arquivo que está bem aqui, nesta pasta", sem depender do
        PATH pra encontrá-lo.
      </p>

      <Exercise
        prompt={
          <p>
            Escreva um script <code>saudacao.sh</code> que recebe o nome de um dia da semana numa variável, e
            imprime "Bom trabalho!" se for de segunda a sexta, ou "Aproveite o descanso!" se for sábado ou domingo
            (pode simplificar checando só se é "sabado" ou "domingo" contra qualquer outro valor). Lembre de deixar
            o script executável.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`#!/bin/bash
dia="sabado"

if [ "$dia" = "sabado" ] || [ "$dia" = "domingo" ]; then
  echo "Aproveite o descanso!"
else
  echo "Bom trabalho!"
fi

# No terminal, depois de salvar como saudacao.sh:
# chmod +x saudacao.sh
# ./saudacao.sh`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a função exata da linha '#!/bin/bash' no topo de um script?",
            options: [
              "É apenas um comentário decorativo, sem efeito nenhum na execução do script",
              "Ela impede que o script seja editado depois de criado, funcionando como uma trava de somente leitura",
              "Ela define o nome que o script terá quando listado com 'ls', substituindo o nome do arquivo",
              "Ela diz ao sistema qual interpretador deve rodar o restante do arquivo, mesmo parecendo um comentário comum",
            ],
            correctIndex: 3,
          },
          {
            question: "Por que rodar um script recém-criado com './script.sh' costuma dar 'Permission denied' antes de outro comando?",
            options: [
              "Porque o nome do arquivo precisa terminar obrigatoriamente com '.bash', nunca com '.sh'",
              "Porque scripts só podem ser executados por um usuário com privilégio de administrador (sudo)",
              "Porque falta rodar 'chmod +x script.sh' antes — o arquivo ainda não tem permissão de execução",
              "Porque o script tem uma variável declarada sem usar 'export' antes da primeira linha",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
