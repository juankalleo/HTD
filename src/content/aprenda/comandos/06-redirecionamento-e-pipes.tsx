import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-redirecionamento-e-pipes",
  title: "Redirecionamento e pipes",
  summary: "O terminal fica exponencialmente mais útil no momento em que você aprende a ligar a saída de um comando na entrada de outro.",
  estimatedMinutes: 15,
  level: "fundamentos",
};

export default function Licao06RedirecionamentoEPipes() {
  return (
    <LessonBody>
      <p>
        Todo comando de terminal, por padrão, imprime o resultado na tela. Mas a tela não é o único destino
        possível — você pode redirecionar essa saída pra um arquivo, ou "encanar" ela direto pra dentro de outro
        comando. Isso é o que torna o terminal muito mais que uma lista de comandos isolados: dá pra combiná-los.
      </p>

      <h2>{`>`} — redirecionar a saída pra um arquivo (sobrescrevendo)</h2>
      <p>
        O sinal <code>{`>`}</code> pega tudo que o comando imprimiria na tela e manda pra dentro de um arquivo em
        vez disso.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`echo "primeira linha" > notas.txt
cat notas.txt`}
        result={`primeira linha`}
      />
      <p>
        Até aqui parece só uma forma diferente de criar arquivo. O detalhe importante aparece se você rodar de
        novo:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`echo "segunda linha" > notas.txt
cat notas.txt`}
        result={`segunda linha`}
      />
      <p>
        A "primeira linha" sumiu. <code>{`>`}</code> <strong>sobrescreve</strong> o conteúdo do arquivo inteiro toda
        vez que roda — não acrescenta, substitui.
      </p>

      <h2>{`>>`} — acrescentar sem apagar o que já tinha</h2>
      <p>
        Quando o objetivo é <strong>adicionar</strong> uma linha nova sem perder o que já estava no arquivo, o
        operador certo é <code>{`>>`}</code> (dois sinais de maior):
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`echo "primeira linha" > notas.txt
echo "segunda linha" >> notas.txt
cat notas.txt`}
        result={`primeira linha
segunda linha`}
      />
      <p>
        Essa confusão entre <code>{`>`}</code> e <code>{`>>`}</code> é um dos erros mais comuns de quem está
        começando — usar <code>{`>`}</code> quando queria acrescentar acaba apagando tudo que existia no arquivo
        sem aviso nenhum.
      </p>

      <h2>{`<`} — redirecionar um arquivo pra ser a entrada de um comando</h2>
      <p>
        O sentido contrário também existe: <code>{`<`}</code> alimenta um comando com o conteúdo de um arquivo, em
        vez do comando ter que abrir o arquivo ele mesmo.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`wc -l < notas.txt`}
        result={`2`}
      />
      <p>
        <code>wc -l</code> (<em>word count</em>, contando linhas) recebeu o conteúdo de <code>notas.txt</code> como
        entrada e respondeu que o arquivo tem 2 linhas — sem que <code>wc</code> precisasse saber o nome do
        arquivo, só recebeu o conteúdo já pronto.
      </p>

      <h2>| — o pipe, encanando um comando no outro</h2>
      <p>
        O <strong>pipe</strong> (<code>|</code>) é o operador mais poderoso dos três: ele pega a saída de um
        comando e usa como entrada do próximo, sem precisar de arquivo intermediário nenhum.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ls -la | grep ".txt"`}
        result={`-rw-r--r--  1 joana  staff   28 12 mar 10:05 notas.txt`}
      />
      <p>
        Aqui, <code>ls -la</code> lista tudo da pasta normalmente, mas em vez de essa lista ir pra tela, ela é
        "encanada" (o <code>|</code>) direto pra dentro do <code>grep ".txt"</code>, que filtra e mostra só as
        linhas que contêm <code>.txt</code>. O resultado final na tela já vem filtrado — você nunca vê a lista
        completa passando por trás.
      </p>
      <p>
        Dá pra encadear vários pipes seguidos, cada comando refinando o resultado do anterior:
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ls -la | grep ".txt" | wc -l`}
        result={`1`}
      />
      <p>
        Lista tudo → filtra só o que tem <code>.txt</code> → conta quantas linhas sobraram. Três comandos simples
        combinados resolvem uma pergunta que nenhum dos três resolveria sozinho.
      </p>

      <Exercise
        prompt={
          <p>
            Você quer saber quantos arquivos <code>.log</code> existem na pasta atual, sem listar cada um — só o
            número final. Combine <code>ls</code>, <code>grep</code> e <code>wc -l</code> num único comando com
            pipes.
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`ls | grep ".log" | wc -l

# "ls" lista os arquivos, o pipe manda essa lista pro "grep .log", que
# filtra só os que têm ".log" no nome, e o segundo pipe manda esse
# resultado filtrado pro "wc -l", que conta quantas linhas (arquivos) sobraram.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença prática entre 'comando > arquivo.txt' e 'comando >> arquivo.txt'?",
            options: [
              "'>' funciona só com texto, e '>>' funciona com qualquer tipo de arquivo binário",
              "'>>' é mais rápido de executar, mas o resultado final gravado no arquivo é idêntico ao de '>'",
              "'>' só funciona se o arquivo já existir, e '>>' cria o arquivo automaticamente se não existir",
              "'>' sobrescreve todo o conteúdo do arquivo; '>>' acrescenta o novo conteúdo mantendo o que já existia",
            ],
            correctIndex: 3,
          },
          {
            question: "No comando 'ls -la | grep \".txt\"', qual é exatamente o papel do símbolo '|'?",
            options: [
              "Ele salva a saída do 'ls -la' num arquivo temporário antes do 'grep' processar",
              "Ele pega a saída do comando à esquerda e usa como entrada do comando à direita, sem arquivo intermediário",
              "Ele executa os dois comandos ao mesmo tempo, em paralelo, e combina os dois resultados",
              "Ele serve só como separador visual entre comandos, sem afetar como eles executam",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
