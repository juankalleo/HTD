"use client";

import { useLocale } from "./locale-provider";
import type { AreaKey } from "@/lib/i18n";

const AREA_ORDER: AreaKey[] = ["padrao-frontend", "padrao-api", "padrao-infraestrutura", "examples"];

const AREA_HREF: Record<AreaKey, string> = {
  "padrao-frontend": "/padrao-frontend",
  "padrao-api": "/padrao-api",
  "padrao-infraestrutura": "/padrao-infraestrutura",
  examples: "/examples",
};

export function HomeContent() {
  const { t } = useLocale();
  const home = t.home;

  return (
    <main className="home-main">
      <div className="home-doc-layout">
        <aside className="home-doc-nav" aria-label={home.sidebarTitle}>
          <h2>{home.sidebarTitle}</h2>
          <nav className="home-doc-nav-group" aria-label={home.indexHeading}>
            <a href="#introduction">{home.navIntroduction}</a>
            <a href="#indexes">{home.navIndexes}</a>
            <a href="#controls">{home.navSecurityControls}</a>
            <a href="#roadmap">{home.navRoadmap}</a>
            <a href="#project-links">{home.navProjectLinks}</a>
          </nav>
          <h3>{home.cheatsheetsHeading}</h3>
          <nav className="home-cheatsheet-list" aria-label={home.cheatsheetsHeading}>
            {home.cheatsheetLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </aside>

        <article className="home-doc-page">
          <section className="home-doc-intro" id="introduction">
            <div className="home-flagship-banner">
              <strong>{home.bannerLabel}</strong>
              <span>{home.bannerStatus}</span>
              <small>{home.bannerText}</small>
            </div>
            <img className="home-doc-logo" src="/img/blog/htd-dice.png" alt={home.imageAlt} />
            <h1>{home.title}</h1>
            <p>{home.purposeBody}</p>
            <p>
              {home.whyBodyBefore}{" "}
              <a href="/padrao-frontend/seguranca">{home.whySecurityLink}</a>{" "}
              {home.whyBodyAfter}
            </p>
          </section>

          <section className="home-doc-section" id="indexes">
            <h2>{home.indexHeading}</h2>
            <p>{home.indexBody}</p>
            <div className="home-index-links">
              <a href="/padrao-frontend">{home.cards["padrao-frontend"].title}</a>
              <a href="/padrao-api">{home.cards["padrao-api"].title}</a>
              <a href="/padrao-infraestrutura">{home.cards["padrao-infraestrutura"].title}</a>
              <a href="/examples">{home.cards.examples.title}</a>
              <a href="/creditos">{home.secondaryCta}</a>
            </div>
          </section>

          <section className="home-doc-section" id="controls">
            <h2>{home.controlsHeading}</h2>
            <p>{home.controlsBody}</p>
            <div className="home-table-wrap">
              <table className="home-reference-table">
                <thead>
                  <tr>
                    <th>{home.controlTableRisk}</th>
                    <th>{home.controlTableHtd}</th>
                  </tr>
                </thead>
                <tbody>
                  {home.controlRows.map((row) => (
                    <tr key={row.href}>
                      <td>{row.risk}</td>
                      <td>
                        <a href={row.href}>{row.htd}</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="home-doc-section" id="roadmap">
            <h2>{home.roadmapHeading}</h2>
            <p>{home.roadmapIntro}</p>
            <ol className="home-roadmap-list">
              {home.roadmapTracks.map((track) => (
                <li key={track.step}>
                  <span className="home-roadmap-step">{track.step}</span>
                  <div>
                    <h3>
                      <a href={track.href}>{track.title}</a>
                      <span>{track.status}</span>
                    </h3>
                    <p>{track.description}</p>
                    <ul>
                      {track.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
            <div className="home-format-note">
              <h3>{home.roadmapSourceHeading}</h3>
              <p>{home.roadmapSourceBody}</p>
              <div className="home-format-links">
                {home.roadmapSourceLinks.map((source) => (
                  <a href={source.href} key={source.href} rel="noreferrer" target="_blank">
                    {source.label}
                  </a>
                ))}
              </div>
            </div>
          </section>

          <section className="home-doc-section" id="project-links">
            <h2>{home.projectLinksHeading}</h2>
            <ul className="home-project-links">
              {home.projectLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </article>

        <aside className="home-page-toc" aria-label={home.onThisPageHeading}>
          <h2>{home.onThisPageHeading}</h2>
          <a href="#introduction">{home.navIntroduction}</a>
          <a href="#indexes">{home.navIndexes}</a>
          <a href="#controls">{home.navSecurityControls}</a>
          <a href="#roadmap">{home.navRoadmap}</a>
          <a href="#project-links">{home.navProjectLinks}</a>
          <h3>{home.areasHeading}</h3>
          <ul>
            {AREA_ORDER.map((area) => {
              const card = home.cards[area];
              return (
                <li key={area}>
                  <a href={AREA_HREF[area]}>{card.title}</a>
                  <span>{card.status}</span>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </main>
  );
}
