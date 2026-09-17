"use client";

import { useState, useSyncExternalStore } from "react";
import { ThemeToggle } from "./theme-toggle";
import { SearchCommand } from "./search-command";
import { useLocale } from "./locale-provider";
import type { AreaKey } from "@/lib/i18n";
import type { SearchEntry } from "@/lib/search-index";

type AreaItem = { area: AreaKey; href: string; icon: React.ReactNode };
type MegaLink = { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode; description?: string; active?: boolean };
type MegaColumn = { title: string; links: MegaLink[] };
type MegaId = "explorar" | "padroes" | "aprender" | "sistema";

const AREA_ITEMS: AreaItem[] = [
  {
    area: "padrao-frontend",
    href: "/padrao-frontend",
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8.5 19.5v-5M15.5 19.5v-5" />
      </>
    ),
  },
  {
    area: "padrao-api",
    href: "/padrao-api",
    icon: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />,
  },
  {
    area: "padrao-banco-de-dados",
    href: "/padrao-banco-de-dados",
    icon: (
      <>
        <ellipse cx="12" cy="6" rx="7.5" ry="3" />
        <path d="M4.5 6v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3V6" />
        <path d="M4.5 12v6c0 1.66 3.36 3 7.5 3s7.5-1.34 7.5-3v-6" />
      </>
    ),
  },
  {
    area: "padrao-infraestrutura",
    href: "/padrao-infraestrutura",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="6" rx="2" />
        <rect x="4" y="14" width="16" height="6" rx="2" />
        <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
      </>
    ),
  },
];

const AREA_LABELS_PT: Record<AreaKey, string> = {
  "padrao-frontend": "Padrão Frontend",
  "padrao-api": "Padrão API",
  "padrao-banco-de-dados": "Padrão Banco de Dados",
  "padrao-infraestrutura": "Padrão Infraestrutura",
  examples: "Exemplos",
};

const CREDITS_ICON: React.ReactNode = (
  <>
    <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
    <path d="M8 4v13a3 3 0 0 0 3 3M9 8h6M9 12h5" />
  </>
);

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  window.addEventListener("resize", callback);
  return () => {
    window.removeEventListener("scroll", callback);
    window.removeEventListener("resize", callback);
  };
}

function getScrolledSnapshot() {
  return window.scrollY > 12;
}

function getServerScrolledSnapshot() {
  return false;
}

function useNavbarScrolled() {
  return useSyncExternalStore(subscribeToScroll, getScrolledSnapshot, getServerScrolledSnapshot);
}

function NavIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      className="nexttech-nav-icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2.15}
    >
      {children}
    </svg>
  );
}

function BrandMark() {
  return (
    <span className="nexttech-brand-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false">
        <circle cx="7.5" cy="7.5" r="1.8" />
        <circle cx="16.5" cy="7.5" r="1.8" />
        <circle cx="12" cy="12" r="1.8" />
        <circle cx="7.5" cy="16.5" r="1.8" />
        <circle cx="16.5" cy="16.5" r="1.8" />
      </svg>
    </span>
  );
}

/**
 * Grupo expansível "Documentação" do menu mobile — substitui os 4 links de
 * área que antes ficavam soltos no topo do drawer. Mesmo padrão de toggle
 * (useState + chevron) que `SidebarNode` já usa em sidebar.tsx.
 */
function MobileDocsGroup({ activeHref, onNavigate }: { activeHref: string; onNavigate: () => void }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="nexttech-mobile-group">
      <button
        type="button"
        className="nexttech-mobile-group-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span>Documentação</span>
        <span
          className={`nexttech-mobile-group-chevron${open ? " nexttech-mobile-group-chevron--open" : ""}`}
          aria-hidden="true"
        >
          ⌄
        </span>
      </button>
      {open && (
        <div className="nexttech-mobile-group-items">
          {AREA_ITEMS.map((item) => {
            const active = activeHref === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`nexttech-mobile-link nexttech-mobile-link--nested${active ? " nexttech-mobile-link--active" : ""}`}
                onClick={onNavigate}
              >
                <NavIcon>{item.icon}</NavIcon>
                <span>{AREA_LABELS_PT[item.area]}</span>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MegaMenu({
  id,
  label,
  active,
  open,
  onOpen,
  columns,
}: {
  id: MegaId;
  label: string;
  active?: boolean;
  open: boolean;
  onOpen: (id: MegaId) => void;
  columns: MegaColumn[];
}) {
  return (
    <div
      className={`navbar__item nexttech-mega${open ? " nexttech-mega--open" : ""}${active ? " nexttech-mega--active" : ""}`}
      onMouseEnter={() => onOpen(id)}
      onFocusCapture={() => onOpen(id)}
    >
      <button
        type="button"
        className="navbar__link nexttech-mega-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => onOpen(id)}
      >
        {label}
      </button>
      <div className="dropdown__menu nexttech-mega-panel">
        <div className="nexttech-mega-panel__inner">
          {columns.map((column) => (
            <section className="nexttech-mega-column" key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.href ?? link.label}-${link.label}`}>
                    {link.href ? (
                      <a href={link.href} className={link.active ? "nexttech-mega-link--active" : undefined}>
                        {link.icon && <NavIcon>{link.icon}</NavIcon>}
                        <span>
                          <strong>{link.label}</strong>
                          {link.description && <small>{link.description}</small>}
                        </span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className={`nexttech-mega-action${link.active ? " nexttech-mega-link--active" : ""}`}
                        onClick={link.onClick}
                      >
                        {link.icon && <NavIcon>{link.icon}</NavIcon>}
                        <span>
                          <strong>{link.label}</strong>
                          {link.description && <small>{link.description}</small>}
                        </span>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Navbar({ activeHref, searchEntries }: { activeHref: string; searchEntries: SearchEntry[] }) {
  const { locale, setLocale } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaId | null>(null);
  const scrolled = useNavbarScrolled();

  const docsMenuActive = AREA_ITEMS.some((item) => item.href === activeHref);
  const creditsActive = activeHref === "/creditos";
  const aprendaActive = activeHref === "/aprenda" || activeHref.startsWith("/aprenda/");
  const examplesActive = activeHref === "/examples" || activeHref.startsWith("/examples/");
  const companyActive = activeHref === "/about" || creditsActive;
  const hubActive = ["/frontend", "/api", "/database", "/security", "/infrastructure"].includes(activeHref);
  const standardLinks: MegaLink[] = AREA_ITEMS.map((item) => ({
    label: AREA_LABELS_PT[item.area],
    href: item.href,
    icon: item.icon,
  }));
  const exploreColumns: MegaColumn[] = [
    {
      title: "Explorar",
      links: [
        { label: "Frontend", href: "/frontend", description: "Interfaces, formulários, rotas e segurança." },
        { label: "API", href: "/api", description: "Contratos HTTP, autenticação, paginação e erros." },
        { label: "Banco de dados", href: "/database", description: "Modelagem, SQL, migrations e auditoria." },
      ],
    },
    {
      title: "Atalhos",
      links: [
        { label: "Segurança", href: "/security" },
        { label: "Infraestrutura", href: "/infrastructure" },
        { label: AREA_LABELS_PT.examples, href: "/examples" },
      ],
    },
  ];
  const standardsColumns: MegaColumn[] = [
    {
      title: "Documentação",
      links: standardLinks,
    },
    {
      title: "Referências",
      links: [
        { label: "Checklist de segurança", href: "/padrao-frontend/seguranca" },
        { label: "Relatórios", href: "/padrao-frontend/relatorios" },
        { label: "Layout frontend", href: "/padrao-frontend/layout" },
      ],
    },
  ];
  const learnColumns: MegaColumn[] = [
    {
      title: "Aprender",
      links: [
        { label: "Todas as trilhas", href: "/aprenda", description: "Aulas práticas: 66" },
        { label: "Trilha de frontend", href: "/aprenda/frontend" },
        { label: "Trilha de TypeScript", href: "/aprenda/typescript" },
      ],
    },
    {
      title: "Fundamentos",
      links: [
        { label: "Git", href: "/aprenda/git" },
        { label: "Redes", href: "/aprenda/networking" },
        { label: "SQL", href: "/aprenda/sql" },
      ],
    },
  ];
  const companyColumns: MegaColumn[] = [
    {
      title: "Sistema",
      links: [
        { label: "Sobre o How to Dev", href: "/about" },
        { label: "Créditos", href: "/creditos", icon: CREDITS_ICON },
      ],
    },
    {
      title: "Idioma",
      links: [
        { label: "Português (BR)", onClick: () => setLocale("pt"), description: locale === "pt" ? "Selecionado" : "Trocar idioma", active: locale === "pt" },
        { label: "Inglês", onClick: () => setLocale("en"), description: locale === "en" ? "Selecionado" : "Trocar idioma", active: locale === "en" },
        { label: "GitHub", href: "https://github.com/juankalleo" },
      ],
    },
  ];

  return (
    <>
      <nav
        aria-label="Principal"
        className={`theme-layout-navbar navbar navbar--fixed-top${scrolled ? " nexttech-navbar-scrolled" : ""}${activeMega ? " nexttech-mega-is-open" : ""}${mobileOpen ? " navbar-sidebar--show" : ""}`}
        onMouseLeave={() => setActiveMega(null)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setActiveMega(null);
          }
        }}
      >
        <div className="navbar__inner">
          <div className="theme-layout-navbar-left navbar__items">
            <button
              aria-label="Abrir menu de navegação"
              aria-expanded={mobileOpen}
              className="navbar__toggle clean-btn"
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden="true">
                <path stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="2" d="M4 7h22M4 15h22M4 23h22" />
              </svg>
            </button>
            <a className="navbar__brand nexttech-brand" href="/">
              <BrandMark />
              <b className="navbar__title text--truncate">How to Dev</b>
            </a>
          </div>
          <div className="nexttech-mega-nav navbar__items">
            <MegaMenu id="explorar" label="Explorar" active={hubActive || examplesActive} open={activeMega === "explorar"} onOpen={setActiveMega} columns={exploreColumns} />
            <MegaMenu id="padroes" label="Padrões" active={docsMenuActive} open={activeMega === "padroes"} onOpen={setActiveMega} columns={standardsColumns} />
            <MegaMenu id="aprender" label="Aprender" active={aprendaActive} open={activeMega === "aprender"} onOpen={setActiveMega} columns={learnColumns} />
            <MegaMenu id="sistema" label="Sistema" active={companyActive} open={activeMega === "sistema"} onOpen={setActiveMega} columns={companyColumns} />
          </div>
          <div className="theme-layout-navbar-right navbar__items navbar__items--right">
            <SearchCommand entries={searchEntries} />
            <ThemeToggle />
          </div>
        </div>

        <div role="presentation" className="navbar-sidebar__backdrop" onClick={() => setMobileOpen(false)} />

        <div className="navbar-sidebar">
          <div className="navbar-sidebar__brand">
            <a className="navbar__brand nexttech-brand" href="/" onClick={() => setMobileOpen(false)}>
              <BrandMark />
              <b className="navbar__title text--truncate">How to Dev</b>
            </a>
            <button
              type="button"
              aria-label="Fechar menu de navegação"
              className="clean-btn navbar-sidebar__close"
              onClick={() => setMobileOpen(false)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round">
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>
          <div className="navbar-sidebar__items">
            <div className="navbar-sidebar__item nexttech-mobile-menu">
              <a
                href="/aprenda"
                aria-current={aprendaActive ? "page" : undefined}
                className={`nexttech-mobile-link nexttech-cta-aprenda-mobile${aprendaActive ? " nexttech-mobile-link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                Aprenda
              </a>

              <a
                href="/examples"
                aria-current={examplesActive ? "page" : undefined}
                className={`nexttech-mobile-link${examplesActive ? " nexttech-mobile-link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                {AREA_LABELS_PT.examples}
              </a>

              <MobileDocsGroup activeHref={activeHref} onNavigate={() => setMobileOpen(false)} />

              <a
                href="/creditos"
                aria-current={creditsActive ? "page" : undefined}
                className={`nexttech-mobile-link${creditsActive ? " nexttech-mobile-link--active" : ""}`}
                onClick={() => setMobileOpen(false)}
              >
                <NavIcon>{CREDITS_ICON}</NavIcon>
                <span>Créditos</span>
              </a>

              <div className="nexttech-mobile-divider" />

              <div className="nexttech-mobile-row">
                <span className="nexttech-mobile-row-label">Tema</span>
                <ThemeToggle />
              </div>

              <div className="nexttech-mobile-row">
                <span className="nexttech-mobile-row-label">Idioma</span>
                <div className="nexttech-mobile-lang">
                  <button
                    type="button"
                    className={`nexttech-mobile-lang-btn${locale === "en" ? " nexttech-mobile-lang-btn--active" : ""}`}
                    onClick={() => setLocale("en")}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    lang="pt-BR"
                    className={`nexttech-mobile-lang-btn${locale === "pt" ? " nexttech-mobile-lang-btn--active" : ""}`}
                    onClick={() => setLocale("pt")}
                  >
                    PT-BR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
