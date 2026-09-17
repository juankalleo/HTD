export function Footer() {
  return (
    <footer className="theme-layout-footer footer footer--dark">
      <div className="container container-fluid">
        <div className="footer__bottom text--center">
          <div className="margin-bottom--sm nexttech-footer-brand">How to Dev</div>
          <nav className="nexttech-footer-links" aria-label="Footer">
            <a href="/aprenda">Learn</a>
            <a href="/frontend">Frontend</a>
            <a href="/api">API</a>
            <a href="/database">Database</a>
            <a href="/security">Security</a>
            <a href="/infrastructure">Infrastructure</a>
            <a href="/about">About</a>
          </nav>
          <div className="footer__copyright">Copyright © 2026 How to Dev</div>
        </div>
      </div>
    </footer>
  );
}
