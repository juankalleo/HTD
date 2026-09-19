import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "03-criando-e-removendo-arquivos",
  title: "Criando, copiando e removendo arquivos",
  summary: "Criar é tranquilo, copiar é tranquilo — remover é o único desses quatro comandos que exige respeito.",
  estimatedMinutes: 14,
  level: "fundamentos",
};

export default function Licao03CriandoERemovendoArquivos() {
  return (
    <LessonBody>
      <p>
        Depois de saber navegar, o próximo passo natural é manipular o que existe dentro das pastas: criar,
        copiar, mover e apagar. Os quatro comandos desta lição — <code>mkdir</code>, <code>touch</code>,{" "}
        <code>cp</code>, <code>mv</code> e <code>rm</code> — cobrem praticamente tudo que você vai precisar fazer
        com arquivos no dia a dia sem tocar em nenhuma interface gráfica.
      </p>

      <h2>mkdir — criando pastas</h2>
      <CodeExample label="terminal" language="bash" code={`mkdir projeto-novo`} />
      <p>
        Cria a pasta <code>projeto-novo</code> dentro da pasta atual. Se você quiser criar uma estrutura de várias
        pastas aninhadas de uma vez, a flag <code>-p</code> cria os níveis intermediários que ainda não existem:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`mkdir -p projeto-novo/src/components`}
        result={`# sem erro, mesmo que "projeto-novo" e "src" ainda não existissem`}
      />
      <p>Sem o <code>-p</code>, esse mesmo comando falharia se <code>projeto-novo</code> ainda não existisse.</p>

      <h2>touch — criando um arquivo vazio</h2>
      <CodeExample label="terminal" language="bash" code={`touch README.md`} />
      <p>
        <code>touch</code> cria um arquivo vazio se ele não existir. Se o arquivo <strong>já existir</strong>,{" "}
        <code>touch</code> não apaga nem altera o conteúdo — ele só atualiza a data de "última modificação" do
        arquivo. É um comando pequeno, mas aparece o tempo todo pra criar rapidamente um arquivo em branco antes de
        editá-lo.
      </p>

      <h2>cp — copiando</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`cp README.md README-backup.md`}
        result={`# cria uma cópia independente — mudar uma não afeta a outra`}
      />
      <p>
        Para copiar uma <strong>pasta inteira</strong> (com tudo dentro dela), <code>cp</code> sozinho não basta —
        precisa da flag <code>-r</code> (<em>recursive</em>), que diz "entre em cada subpasta e copie tudo também":
      </p>
      <CodeExample label="terminal" language="bash" code={`cp -r projeto-novo projeto-novo-copia`} />

      <h2>mv — movendo e renomeando</h2>
      <p>
        <code>mv</code> (<em>move</em>) faz duas coisas que parecem diferentes, mas são o mesmo comando por baixo:
        mover um arquivo pra outra pasta, ou renomeá-lo (que é, tecnicamente, "mover" pro mesmo lugar com nome
        novo).
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`mv README-backup.md README.old.md
mv README.old.md arquivados/`}
      />
      <p>
        A primeira linha renomeia; a segunda move o arquivo renomeado pra dentro da pasta <code>arquivados/</code>.
        Diferente de <code>cp</code>, <code>mv</code> não deixa o original pra trás — o arquivo simplesmente "vira"
        outro nome ou local.
      </p>

      <h2>rm — removendo, e por que isso merece respeito</h2>
      <CodeExample label="terminal" language="bash" code={`rm README.old.md`} />
      <p>
        Isso apaga o arquivo. Pra apagar uma <strong>pasta</strong>, de novo é preciso <code>-r</code>:
      </p>
      <CodeExample label="terminal" language="bash" code={`rm -r projeto-novo-copia`} />
      <p>
        Até aqui, nada muito diferente de clicar em "mover pra lixeira". A diferença crítica é que{" "}
        <strong>não existe lixeira no terminal</strong>. Quando você roda <code>rm</code>, o arquivo não vai pra
        nenhum lugar de onde dá pra recuperar — ele é apagado direto. E existe uma flag que piora isso ainda mais:{" "}
        <code>-f</code> (<em>force</em>), que ignora avisos de confirmação e remove mesmo arquivos protegidos contra
        escrita, sem perguntar nada.
      </p>
      <CodeExample
        label="o comando mais perigoso desta lição"
        language="bash"
        code={`rm -rf pasta-antiga/`}
        result={`# nenhuma saída, nenhuma confirmação — a pasta e tudo dentro dela
# simplesmente deixam de existir, sem possibilidade de desfazer`}
      />
      <p>
        <code>rm -rf</code> combina "apaga recursivamente" com "não pergunte nada" — é rápido, é poderoso, e é
        exatamente por isso que developers experientes conferem duas vezes o caminho antes de apertar Enter nesse
        comando específico. Um espaço digitado no lugar errado (<code>rm -rf pasta /antiga</code> em vez de{" "}
        <code>rm -rf pasta/antiga</code>) já foi responsável por muita dor de cabeça de gente experiente, imagine
        de quem está começando.
      </p>

      <Exercise
        prompt={
          <p>
            Você quer apagar uma pasta chamada <code>rascunhos</code> que tem vários arquivos dentro. Escreva o
            comando certo, e depois explique com suas palavras por que rodar isso sem verificar o nome da pasta
            antes é arriscado.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`rm -r rascunhos

# É arriscado porque não existe lixeira: uma vez rodado, os arquivos
# dentro de "rascunhos" são removidos permanentemente. Se o nome da
# pasta estiver errado (ex: outra pasta parecida no mesmo lugar), não
# tem como desfazer depois — por isso vale conferir com "ls" antes.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que 'rm -rf pasta/' é tão perigoso quanto 'sudo rm -rf pasta/' num terminal comum?",
            options: [
              "Porque o -f já ignora qualquer confirmação e apaga tudo recursivamente sem aviso, com ou sem sudo",
              "Porque o -r sozinho já pede confirmação, mas o -f desliga essa confirmação",
              "Porque sudo é obrigatório pra apagar qualquer pasta, então o comando sem sudo nem funcionaria",
              "Porque -rf só é perigoso dentro de pastas do sistema, nunca dentro da pasta do usuário",
            ],
            correctIndex: 0,
          },
          {
            question: "Qual a diferença real entre 'cp arquivo.txt copia.txt' e 'mv arquivo.txt copia.txt'?",
            options: [
              "'cp' só funciona com pastas, e 'mv' só funciona com arquivos individuais",
              "'cp' cria uma cópia e mantém o arquivo original; 'mv' transfere/renomeia sem deixar o original pra trás",
              "Os dois fazem a mesma coisa, 'mv' é apenas um apelido mais curto de 'cp'",
              "'mv' pede confirmação antes de executar, e 'cp' nunca pede confirmação",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
