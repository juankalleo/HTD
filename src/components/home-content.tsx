"use client";

import { useLocale } from "./locale-provider";
import { HomeConceptRoadmap } from "./home-concept-roadmap";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

const TOTAL_TRACKS = TRACKS.length;
const TOTAL_LESSONS = TRACKS.reduce((total, track) => total + getTrackLessons(track.slug).length, 0);

export function HomeContent() {
  const { locale, t } = useLocale();
  const home = t.home;

  return (
    <main className="home-main">
      <div className="home-doc-layout">
        <article className="home-doc-page">
          <section className="home-doc-intro" id="introduction">
            <div className="home-hero-copy">
              <h1>{home.title}</h1>
              <p className="home-hero-lede">{home.purposeBody}</p>
              <div className="home-hero-actions">
                <a className="home-hero-cta home-hero-cta--primary" href="/aprenda">
                  {home.primaryCta}
                </a>
                <a className="home-hero-cta home-hero-cta--secondary" href="/padrao-frontend">
                  {home.cards["padrao-frontend"].title}
                </a>
              </div>
            </div>
            <aside className="home-hero-data" aria-label={home.statsLabel}>
              <div className="home-hero-data__item home-hero-data__item--strong">
                <strong>{TOTAL_LESSONS}</strong>
                <span>{home.statLessons}</span>
              </div>
              <div className="home-hero-data__item">
                <strong>{TOTAL_TRACKS}</strong>
                <span>{home.statTracks}</span>
              </div>
              <div className="home-hero-data__item">
                <strong>{home.statUpdatedValue}</strong>
                <span>{home.statUpdated}</span>
              </div>
            </aside>
          </section>

          <section className="home-doc-section home-doc-section--roadmap" id="roadmap">
            <h2>{home.roadmapHeading}</h2>
            <p>{home.roadmapIntro}</p>
            <HomeConceptRoadmap locale={locale} />
          </section>

          <section className="home-doc-section home-reason" id="motivo">
            <div className="home-section-heading">
              <h2>{home.reasonHeading}</h2>
              <p>{home.reasonIntro}</p>
            </div>
            <div className="home-reason-grid">
              {home.reasonItems.map((item) => (
                <section className="home-reason-item" key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </section>
              ))}
            </div>
          </section>

          <section className="home-doc-section home-creator" id="criador">
            <h2>{home.creatorHeading}</h2>
            <div className="home-creator-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="home-creator-photo" src="/img/icon/avatar_kalleo.png" alt={home.aboutImageAlt} />
              <div className="home-creator-main">
                <strong>{home.creatorName}</strong>
                <span>{home.creatorRole}</span>
                <p>{home.aboutBody}</p>
                <a className="home-about-github" href="https://github.com/juankalleo" rel="noreferrer" target="_blank">
                  {home.aboutGithubLabel}
                </a>
              </div>
            </div>
          </section>

          <section className="home-doc-section" id="indexes">
            <h2>{home.indexHeading}</h2>
            <p>{home.indexBody}</p>
            <div className="home-index-links">
              <a href="/padrao-frontend">{home.cards["padrao-frontend"].title}</a>
              <a href="/padrao-api">{home.cards["padrao-api"].title}</a>
              <a href="/padrao-banco-de-dados">{home.cards["padrao-banco-de-dados"].title}</a>
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
      </div>
    </main>
  );
}
