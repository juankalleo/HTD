import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "11-bisect-e-debug-de-regressao",
  title: "git bisect: achando o commit que quebrou tudo",
  summary:
    "'Funcionava semana passada' entre 40 commits não é motivo pra revisar um por um — é busca binária automática.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao11BisectEDebugDeRegressao() {
  return (
    <LessonBody>
      <p>
        Um bug apareceu em produção. Você sabe que a versão de duas semanas atrás funcionava, e de lá pra cá foram
        40 commits. Revisar um por um, testando manualmente cada um, seria lento e chato. <code>git bisect</code>{" "}
        resolve isso com busca binária: em vez de testar 40 commits, você testa no máximo{" "}
        <code>log₂(40) ≈ 6</code>.
      </p>

      <h2>Como a busca binária funciona aqui</h2>
      <p>
        Você diz ao git um commit <strong>bom</strong> (onde o bug não existia) e um commit <strong>ruim</strong>{" "}
        (onde existe). O git faz <code>checkout</code> automaticamente no commit bem no meio dos dois. Você testa
        manualmente se o bug está presente naquele ponto, e responde "bom" ou "ruim" — o git corta a metade
        irrelevante e escolhe o próximo meio, repetindo até sobrar um único commit: o culpado.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`Bisecting: 20 revisions left to test after this (roughly 5 steps)
[7c8d9e0...] Atualiza dependência do parser de datas`}
        code={`git bisect start
git bisect bad                  # o commit atual (HEAD) tem o bug
git bisect good v1.4.0           # essa tag antiga não tinha o bug`}
      />
      <p>
        A cada passo, você testa o app naquele ponto do histórico e responde:
      </p>
      <CodeExample
        label="terminal — repetindo até achar o culpado"
        language="bash"
        result={`7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e is the first bad commit
commit 7c8d9e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e
Author: Ana Silva <ana@empresa.com>
Date:   Tue Sep 2 14:30:00 2026 -0300

    Atualiza dependência do parser de datas`}
        code={`git bisect good   # se o bug NÃO aparece nesse commit
# ou
git bisect bad    # se o bug aparece

# repete até o git apontar exatamente 1 commit como responsável`}
      />
      <CodeExample label="terminal — terminando" language="bash" code={`git bisect reset   # volta pro estado (branch) de antes de começar`} />

      <h2>Automatizando ainda mais com um script de teste</h2>
      <p>
        Se o bug pode ser detectado por um comando (um teste que falha, um script que retorna erro), dá pra
        automatizar o processo inteiro — sem precisar testar manualmente a cada passo.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git bisect start
git bisect bad HEAD
git bisect good v1.4.0
git bisect run npm test -- --testPathPattern=checkout
# o git roda "npm test..." em cada commit automaticamente
# e usa o código de saída (0 = passou = good, != 0 = falhou = bad)
# pra decidir sozinho o próximo passo, até achar o culpado`}
      />

      <h2>Por que isso é mais rápido que revisar manualmente</h2>
      <p>
        Revisar 40 commits um por um, lendo o diff de cada um tentando adivinhar qual mudou o comportamento, é lento
        e falível — é fácil passar batido pelo commit certo se a mudança for sutil (uma dependência atualizada, uma
        condição invertida). Bisect não depende de adivinhar pela leitura do código: você só precisa saber{" "}
        <strong>testar</strong> se o bug está presente, e a busca binária faz o resto convergir em poucos passos,
        não importa se são 40 ou 4.000 commits no intervalo.
      </p>

      <Exercise
        prompt={
          <p>
            Você tem 100 commits entre a última versão estável (tag <code>v2.0.0</code>) e o <code>HEAD</code> atual,
            que está com bug. Quantos commits, no pior caso, você vai precisar testar manualmente usando{" "}
            <code>git bisect</code> até achar o culpado (aproximadamente)?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Aproximadamente log2(100) ≈ 7 testes.

Cada resposta ("good" ou "bad") elimina metade dos commits restantes,
então o número de passos cresce muito devagar em relação ao total de
commits — é por isso que bisect escala bem mesmo com centenas de commits
no intervalo.`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Como git bisect encontra o commit responsável por uma regressão?",
            options: [
              "Usando busca binária: testa o commit do meio entre um ponto bom e um ruim, e a cada resposta elimina metade dos commits restantes",
              "Comparando o tamanho em linhas de cada commit e apontando o maior como suspeito",
              "Lendo as mensagens de commit em busca de palavras como 'fix' ou 'bug' automaticamente",
              "Testando os commits em ordem cronológica, do mais antigo para o mais recente, um por um",
            ],
            correctIndex: 0,
          },
          {
            question: "Para que serve git bisect run em conjunto com um comando de teste?",
            options: [
              "Para gerar automaticamente novos testes unitários para o commit suspeito",
              "Para reverter automaticamente o commit culpado assim que ele for identificado",
              "Para automatizar todo o processo — o git roda o comando em cada commit e usa o código de saída para decidir sozinho se é 'good' ou 'bad'",
              "Para acelerar o clone do repositório durante a sessão de bisect",
            ],
            correctIndex: 2,
          },
        ]}
      />
    </LessonBody>
  );
}
