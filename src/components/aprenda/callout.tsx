/**
 * Bloco de destaque no final de uma lição, linkando pro conteúdo de
 * referência já existente (padrao-frontend/api/banco-de-dados/infra) —
 * é o mecanismo de cross-link do Aprenda com a documentação "de verdade".
 */
export function Callout({
  title = "Quer o padrão completo de produção?",
  href,
  children,
}: {
  title?: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <aside className="nexttech-callout">
      <span className="nexttech-callout-icon" aria-hidden="true" />
      <div className="nexttech-callout-body">
        <strong>{title}</strong>
        <p>{children}</p>
        {href && (
          <a className="nexttech-callout-link" href={href}>
            Ver na documentação →
          </a>
        )}
      </div>
    </aside>
  );
}
