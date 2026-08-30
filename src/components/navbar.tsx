"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { useLocale } from "./locale-provider";
import type { AreaKey } from "@/lib/i18n";

type NavItem =
  | { area: AreaKey; href: string; icon: React.ReactNode }
  | { labelKey: "credits"; href: string; icon: React.ReactNode };

const NAV_ITEMS: NavItem[] = [
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
  {
    area: "examples",
    href: "/examples",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </>
    ),
  },
  {
    labelKey: "credits",
    href: "/creditos",
    icon: (
      <>
        <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4z" />
        <path d="M8 4v13a3 3 0 0 0 3 3M9 8h6M9 12h5" />
      </>
    ),
  },
];

export function Navbar({ activeHref }: { activeHref: string }) {
  const { locale, setLocale, t } = useLocale();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    document.documentElement.classList.add("nexttech-no-scroll");
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.classList.remove("nexttech-no-scroll");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  return (
    <nav aria-label="Main" className={`theme-layout-navbar navbar navbar--fixed-top${mobileOpen ? " navbar-sidebar--show" : ""}`}>
      <div className="navbar__inner">
        <div className="theme-layout-navbar-left navbar__items">
          <button
            aria-label="Toggle navigation bar"
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
            <b className="navbar__title text--truncate">How to Dev</b>
          </a>
          {NAV_ITEMS.map((item) => {
            const active = activeHref === item.href;
            return (
              <a
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={`navbar__item navbar__link${active ? " navbar__link--active" : ""} nexttech-nav-link`}
                href={item.href}
              >
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
                  {item.icon}
                </svg>
                <span>{"area" in item ? t.nav.areas[item.area] : t.nav[item.labelKey]}</span>
              </a>
            );
          })}
        </div>
        <div className="theme-layout-navbar-right navbar__items navbar__items--right">
          <div className="navbar__item dropdown dropdown--hoverable dropdown--right nexttech-static-select">
            <a className="navbar__link" aria-haspopup="true" aria-expanded="false" role="button" href="#">
              v1.0
            </a>
            <ul className="dropdown__menu">
              <li>
                <a className="dropdown__link dropdown__link--active" href="#">
                  v1.0
                </a>
              </li>
            </ul>
          </div>
          <div className="navbar__item dropdown dropdown--hoverable dropdown--right nexttech-static-select">
            <a href="#" aria-haspopup="true" aria-expanded="false" role="button" className="navbar__link">
              <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true" className="iconLanguage_wzn9">
                <path
                  fill="currentColor"
                  d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"
                />
              </svg>
              {t.nav.languageName}
            </a>
            <ul className="dropdown__menu">
              <li>
                <button
                  type="button"
                  className={`dropdown__link${locale === "en" ? " dropdown__link--active" : ""}`}
                  style={{ background: "none", border: 0, width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}
                  onClick={() => setLocale("en")}
                >
                  EN
                </button>
              </li>
              <li>
                <button
                  type="button"
                  lang="pt-BR"
                  className={`dropdown__link${locale === "pt" ? " dropdown__link--active" : ""}`}
                  style={{ background: "none", border: 0, width: "100%", textAlign: "left", cursor: "pointer", font: "inherit" }}
                  onClick={() => setLocale("pt")}
                >
                  PT-BR
                </button>
              </li>
            </ul>
          </div>
          <ThemeToggle />
        </div>
      </div>

      <div role="presentation" className="navbar-sidebar__backdrop" onClick={() => setMobileOpen(false)} />

      <div className="navbar-sidebar">
        <div className="navbar-sidebar__brand">
          <a className="navbar__brand nexttech-brand" href="/" onClick={() => setMobileOpen(false)}>
            <b className="navbar__title text--truncate">How to Dev</b>
          </a>
          <button
            type="button"
            aria-label="Close navigation bar"
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
            {NAV_ITEMS.map((item) => {
              const active = activeHref === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`nexttech-mobile-link${active ? " nexttech-mobile-link--active" : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.15}
                    width={20}
                    height={20}
                  >
                    {item.icon}
                  </svg>
                  <span>{"area" in item ? t.nav.areas[item.area] : t.nav[item.labelKey]}</span>
                </a>
              );
            })}

            <div className="nexttech-mobile-divider" />

            <div className="nexttech-mobile-row">
              <span className="nexttech-mobile-row-label">Theme</span>
              <ThemeToggle />
            </div>

            <div className="nexttech-mobile-row">
              <span className="nexttech-mobile-row-label">Language</span>
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
  );
}
