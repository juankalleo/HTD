export function Footer() {
  return (
    <footer className="theme-layout-footer footer footer--dark">
      <div className="container container-fluid">
        <div className="footer__bottom text--center">
          <div className="margin-bottom--sm nexttech-footer-brand">How to Dev</div>
          <nav className="nexttech-footer-links" aria-label="Rodapé">
            <a href="/aprenda">Aprenda</a>
            <a href="/frontend">Frontend</a>
            <a href="/api">API</a>
            <a href="/database">Banco de dados</a>
            <a href="/security">Segurança</a>
            <a href="/infrastructure">Infraestrutura</a>
            <a href="/about">Sobre</a>
          </nav>
          <div className="footer__copyright">© 2026 How to Dev</div>
        </div>
      </div>
    </footer>
  );
}
