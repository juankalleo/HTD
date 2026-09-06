/**
 * Wrapper de prosa de uma lição — reusa a mesma classe `.markdown` que os
 * docs em markdown já usam (headings, parágrafo, lista, blockquote...
 * tudo já estilizado e ciente de tema claro/escuro), então texto normal
 * dentro de uma lição TSX não precisa de CSS novo nenhum.
 */
export function LessonBody({ children }: { children: React.ReactNode }) {
  return <div className="markdown nexttech-lesson-body">{children}</div>;
}
