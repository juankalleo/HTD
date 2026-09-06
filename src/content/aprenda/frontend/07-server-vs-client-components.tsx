import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "07-server-vs-client-components",
  title: "Componentes de servidor vs. cliente",
  summary: "Por padrão tudo roda no servidor — \"use client\" é a exceção, não a regra.",
  estimatedMinutes: 14,
};

export default function Licao07ServerVsClientComponents() {
  return (
    <LessonBody>
      <p>
        No App Router, <strong>todo componente é Server Component por padrão</strong>. Ele roda no servidor, nunca
        manda seu próprio JavaScript pro navegador, e por isso pode fazer coisas que o navegador não devia fazer
        diretamente — ler um banco de dados, usar uma variável de ambiente secreta, chamar uma API interna.
      </p>

      <CodeExample
        label="Server Component (padrão, sem diretiva nenhuma)"
        language="typescript"
        code={`// roda só no servidor — pode até acessar banco/arquivo direto
async function ListaDeProdutos() {
  const produtos = await buscarProdutosNoBanco();
  return (
    <ul>
      {produtos.map((p) => <li key={p.id}>{p.nome}</li>)}
    </ul>
  );
}`}
      />

      <h2>Quando você precisa de "use client"</h2>
      <p>
        Um componente só precisa da diretiva <code>"use client"</code> quando ele usa algo que <strong>só existe no
        navegador</strong>: <code>useState</code>, <code>useEffect</code>, <code>onClick</code>, <code>localStorage</code>,
        qualquer evento de interação.
      </p>
      <CodeExample
        label="Client Component — precisa de interatividade"
        language="typescript"
        code={`"use client";

import { useState } from "react";

export function ContadorDeLikes({ inicial }: { inicial: number }) {
  const [likes, setLikes] = useState(inicial);
  return <button onClick={() => setLikes((n) => n + 1)}>❤ {likes}</button>;
}`}
      />

      <h2>Os dois convivem na mesma árvore</h2>
      <p>
        Um Server Component pode renderizar um Client Component como filho (o contrário — Client importando Server
        direto — não funciona). Na prática: busque o dado no servidor, passe como prop, e isole a interatividade num
        componente filho pequeno e marcado com <code>"use client"</code> — em vez de marcar a página inteira.
      </p>
      <CodeExample
        label="app/produtos/page.tsx"
        language="typescript"
        code={`import { ContadorDeLikes } from "./contador-de-likes";

export default async function ProdutosPage() {
  const produtos = await buscarProdutosNoBanco(); // roda no servidor
  return (
    <ul>
      {produtos.map((p) => (
        <li key={p.id}>
          {p.nome} <ContadorDeLikes inicial={p.likes} /> {/* só esse pedaço vira JS no navegador */}
        </li>
      ))}
    </ul>
  );
}`}
      />

      <Exercise
        prompt={
          <p>
            Um formulário de busca com um <code>{"<input onChange>"}</code> precisa de "use client"? E a página que
            lista os resultados da busca, que só recebe o termo e busca no banco?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Sim pro input: onChange é um evento de navegador, exige "use client".
Não pra página de resultados: ela só recebe um parâmetro e busca dado —
nenhuma API de navegador envolvida, continua Server Component.`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No App Router, qual é o padrão quando nenhuma diretiva é escrita?",
            options: [
              "Client Component",
              "Server Component",
              "Depende do nome do arquivo",
              "Depende de estar dentro de app/ ou não",
            ],
            correctIndex: 1,
          },
          {
            question: "Quando um componente PRECISA de \"use client\"?",
            options: [
              "Sempre que ele importa outro componente",
              "Quando usa useState/useEffect/eventos de interação — coisas que só existem no navegador",
              "Sempre que renderiza uma lista",
              "Nunca — a diretiva é só estética",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
