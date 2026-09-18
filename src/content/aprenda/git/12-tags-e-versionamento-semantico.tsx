import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-tags-e-versionamento-semantico",
  title: "Tags, releases e versionamento semântico",
  summary:
    "Um commit marca 'o que mudou'; uma tag marca 'isso aqui foi uma versão publicada' — e o número da versão devia contar uma história.",
  estimatedMinutes: 14,
  level: "intermediario",
};

export default function Licao12TagsEVersionamentoSemantico() {
  return (
    <LessonBody>
      <p>
        <code>git log</code> mostra dezenas de commits, mas nem todos representam algo publicado. Uma{" "}
        <strong>tag</strong> marca um commit específico como "isso aqui é a versão 2.1.0" — um ponto fixo no
        histórico que não se move, diferente de uma branch (que avança a cada commit novo).
      </p>

      <h2>Tag leve vs. tag anotada</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`git tag v2.1.0                          # tag leve — só um ponteiro pro commit, sem metadado
git tag -a v2.1.0 -m "Release 2.1.0"    # tag anotada — guarda autor, data e mensagem, como um commit`}
      />
      <p>
        Tag leve é um apelido rápido pra um commit, sem mais informação. Tag anotada é um objeto completo no git —
        guarda quem criou, quando, e uma mensagem — e por isso é a recomendada pra marcar releases de verdade:
        se alguém perguntar "quem gerou a v2.1.0 e por quê", a resposta está na própria tag.
      </p>
      <CodeExample
        label="terminal"
        language="bash"
        result={`tag v2.1.0
Tagger: Ana Silva <ana@empresa.com>
Date:   Tue Sep 8 10:00:00 2026 -0300

Release 2.1.0

commit a3f9e2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9
Author: Ana Silva <ana@empresa.com>
Date:   Tue Sep 8 09:55:00 2026 -0300

    Adiciona exportação de relatório em PDF`}
        code={`git show v2.1.0`}
      />
      <CodeExample
        label="terminal — tags não sobem no push normal"
        language="bash"
        code={`git push origin v2.1.0     # manda uma tag específica
git push origin --tags      # manda todas as tags locais que ainda não estão no remoto`}
      />

      <h2>Versionamento semântico (semver): major.minor.patch</h2>
      <p>
        Semver é uma convenção pra que o número da versão sozinho já diga o tamanho e o risco da mudança, sem
        precisar ler o changelog inteiro: <code>MAJOR.MINOR.PATCH</code>, por exemplo <code>2.1.3</code>.
      </p>
      <CodeExample
        label="o que cada número significa"
        language="plaintext"
        code={`MAJOR (2.x.x) → mudança incompatível — quebra quem usa a versão anterior (breaking change)
MINOR (x.1.x) → funcionalidade nova, mas compatível com o que já existia
PATCH (x.x.3) → correção de bug, sem adicionar funcionalidade nem quebrar nada`}
      />
      <p>
        Isso importa na prática: uma biblioteca que vai de <code>2.4.0</code> pra <code>2.5.0</code> deveria ser
        segura de atualizar sem revisar código; de <code>2.4.0</code> pra <code>3.0.0</code> exige atenção, porque
        algo que funcionava pode ter mudado de comportamento ou sido removido.
      </p>

      <h2>Tags e releases no GitHub</h2>
      <p>
        No GitHub, uma "Release" normalmente é criada <strong>a partir</strong> de uma tag — a tag marca o commit
        exato no git; a release adiciona uma camada em cima (notas da versão, binários anexados, changelog gerado
        automaticamente a partir dos PRs mergeados desde a tag anterior). A tag é o dado que o git entende; a
        release é a vitrine legível pra quem só quer saber "o que mudou nessa versão".
      </p>

      <Exercise
        prompt={
          <p>
            Uma biblioteca está na versão <code>1.8.2</code>. Você corrigiu um bug sem adicionar nada novo nem
            quebrar compatibilidade. Qual deveria ser a próxima versão, seguindo semver, e qual comando cria a tag
            anotada correspondente?
          </p>
        }
        solutionLanguage="bash"
        solutionCode={`Próxima versão: 1.8.3 (incrementa só o PATCH, porque é correção de
bug sem funcionalidade nova nem breaking change)

git tag -a v1.8.3 -m "Corrige validação de e-mail com espaço em branco"
git push origin v1.8.3`}
      />

      <Quiz
        track="git"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Qual a diferença entre uma tag leve e uma tag anotada?",
            options: [
              "Tag leve só pode ser criada em main; tag anotada funciona em qualquer branch",
              "Tag anotada expira automaticamente depois de um ano; tag leve é permanente",
              "Tag leve funciona apenas localmente; tag anotada é sincronizada automaticamente com o remoto",
              "Tag leve é só um ponteiro pro commit, sem metadado; tag anotada guarda autor, data e mensagem, como um objeto completo no git",
            ],
            correctIndex: 3,
          },
          {
            question: "Em versionamento semântico (major.minor.patch), quando o número MAJOR deve ser incrementado?",
            options: [
              "A cada release, independente do que mudou",
              "Quando há uma mudança incompatível que quebra quem usa a versão anterior",
              "Somente quando um novo desenvolvedor entra no time responsável pelo projeto",
              "Quando o número de commits desde a última release passa de 100",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
