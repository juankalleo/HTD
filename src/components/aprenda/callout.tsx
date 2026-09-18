/**
 * Bloco de destaque no final (ou meio) de uma lição. Serve dois papéis: link
 * pro conteúdo de referência já existente (padrao-frontend/api/banco-de-dados/infra,
 * que funciona como o "glossário" técnico do site) e link pra outra lição do
 * Aprenda — normalmente uma lição de fundamentos apontando pro tópico que só é
 * coberto de verdade no intermediário. `linkLabel` diferencia os dois casos.
 */
export function Callout({
  title = "Quer o padrão completo de produção?",
  href,
  linkLabel = "Ver na documentação →",
  children,
}: {
  title?: string;
  href?: string;
  linkLabel?: string;
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
            {linkLabel}
          </a>
        )}
      </div>
    </aside>
  );
}
