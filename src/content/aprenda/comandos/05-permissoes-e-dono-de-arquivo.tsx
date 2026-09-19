import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "05-permissoes-e-dono-de-arquivo",
  title: "Permissões e dono de arquivo",
  summary: "Aquele bloco 'rwxr-xr-x' que aparece no ls -l não é ruído — é a resposta pra 'por que eu não consigo executar/editar isso'.",
  estimatedMinutes: 15,
  level: "fundamentos",
};

export default function Licao05PermissoesEDonoDeArquivo() {
  return (
    <LessonBody>
      <p>
        Se você já tentou rodar um script e recebeu <code>Permission denied</code>, ou tentou editar um arquivo e o
        editor recusou salvar, o motivo quase sempre está numa combinação de dono e permissões — um sistema que
        existe desde os primórdios do Unix e que continua sendo a base de como Linux e macOS controlam quem pode
        fazer o quê com cada arquivo.
      </p>

      <h2>Lendo a saída de ls -l</h2>
      <p>Volte pro <code>ls -la</code> da lição 2 e olhe com atenção pra primeira coluna de cada linha:</p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ls -l deploy.sh`}
        result={`-rwxr-xr-x  1 joana  staff  312 12 mar 10:00 deploy.sh`}
      />
      <p>
        Esse bloco <code>-rwxr-xr-x</code> tem 10 caracteres, e cada posição tem um significado fixo. O primeiro
        caractere diz o <strong>tipo</strong>: <code>-</code> pra arquivo comum, <code>d</code> pra pasta. Os nove
        seguintes se dividem em três grupos de três:
      </p>
      <CodeExample
        label="os 9 caracteres de permissão, em 3 grupos de 3"
        language="plaintext"
        code={`rwx      r-x      r-x
dono     grupo    outros

r = read (ler)       w = write (escrever/modificar)      x = execute (executar)
"-" no lugar da letra significa que aquela permissão está desligada`}
      />
      <p>
        No exemplo, o <strong>dono</strong> (<code>joana</code>) pode ler, escrever e executar (<code>rwx</code>); o{" "}
        <strong>grupo</strong> dono do arquivo pode ler e executar, mas não escrever (<code>r-x</code>); e{" "}
        <strong>outros</strong> (todo mundo mais) também só pode ler e executar (<code>r-x</code>). Faz sentido pra
        um script: qualquer um pode rodar, só a Joana pode editar.
      </p>

      <h2>chmod numérico</h2>
      <p>
        <code>chmod</code> (<em>change mode</em>) muda essas permissões. O jeito mais comum é o formato numérico,
        onde cada permissão vale um número que se soma: <code>r=4</code>, <code>w=2</code>, <code>x=1</code>. Somando
        as três de um grupo, você chega num dígito de 0 a 7.
      </p>
      <CodeExample
        label="como rwx vira 7, r-x vira 5, r-- vira 4"
        language="plaintext"
        code={`rwx = 4+2+1 = 7     (lê, escreve e executa)
r-x = 4+0+1 = 5     (lê e executa, não escreve)
r-- = 4+0+0 = 4     (só lê)
rw- = 4+2+0 = 6     (lê e escreve, não executa)`}
      />
      <p>
        Um dígito por grupo (dono, grupo, outros), nessa ordem, dá o número de três dígitos que você vê em comandos
        reais:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`chmod 755 deploy.sh   # rwx pro dono, r-x pro grupo, r-x pra outros — típico de script executável
chmod 644 config.txt  # rw- pro dono, r-- pro grupo, r-- pra outros — típico de arquivo comum, não executável`}
      />
      <p>
        <code>755</code> e <code>644</code> não são números mágicos decorados sem entender — são exatamente os
        exemplos acima traduzidos: <code>755</code> = dono pode tudo, o resto só lê e executa; <code>644</code> =
        dono lê e escreve, o resto só lê.
      </p>

      <h2>chmod simbólico</h2>
      <p>
        Quando você só quer mudar <strong>uma</strong> permissão sem recalcular o número inteiro, o formato
        simbólico é mais direto:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`chmod +x script.sh    # adiciona permissão de execução pra todo mundo
chmod u+x script.sh   # adiciona execução só pro dono (u = user)
chmod g-w arquivo.txt # remove escrita do grupo`}
      />
      <p>
        Isso é exatamente o que resolve o erro clássico de "tentei rodar meu script e deu Permission denied": o
        arquivo existe, o conteúdo está certo, só falta a permissão de execução — <code>chmod +x</code> resolve.
      </p>

      <h2>chown — mudando o dono</h2>
      <p>
        <code>chown</code> (<em>change owner</em>) muda quem é o <strong>dono</strong> do arquivo — diferente de{" "}
        <code>chmod</code>, que muda o que cada grupo pode fazer, mas não quem pertence a cada grupo.
      </p>
      <CodeExample label="terminal" language="bash" code={`sudo chown joana arquivo.txt`} />
      <p>
        Normalmente precisa de <code>sudo</code> porque trocar o dono de um arquivo é uma operação sensível — você
        não deveria conseguir "roubar" a posse de um arquivo de outra pessoa sem privilégio de administrador.
      </p>

      <Exercise
        prompt={
          <p>
            Você criou um script <code>backup.sh</code> e, ao rodar <code>./backup.sh</code>, recebeu{" "}
            <code>Permission denied</code>. O conteúdo do arquivo está correto. Qual comando resolve, e por quê?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`chmod +x backup.sh

# O erro não é de conteúdo, é de permissão: o arquivo não tinha o bit
# de execução (x) ativado pro dono. "chmod +x" liga essa permissão sem
# mexer em nada mais, permitindo rodar "./backup.sh" normalmente.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Na saída '-rwxr-xr-x', o que a segunda parte ('r-x') representa?",
            options: [
              "A permissão do dono do arquivo sobre ele mesmo",
              "O tipo do arquivo, indicando se é uma pasta ou um arquivo comum",
              "A permissão do grupo dono do arquivo — nesse caso, ler e executar, mas não escrever",
              "A permissão que qualquer usuário do sistema tem, incluindo o próprio dono",
            ],
            correctIndex: 2,
          },
          {
            question: "Qual a diferença entre 'chmod' e 'chown'?",
            options: [
              "Os dois fazem a mesma coisa, 'chown' é só um apelido mais antigo de 'chmod'",
              "'chmod' só funciona em pastas, e 'chown' só funciona em arquivos individuais",
              "'chown' muda as permissões de leitura/escrita/execução, e 'chmod' muda o dono do arquivo",
              "'chmod' muda as permissões (o que dono/grupo/outros podem fazer); 'chown' muda quem é o dono do arquivo",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
