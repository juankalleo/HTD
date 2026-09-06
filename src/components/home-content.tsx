"use client";

import { useLocale } from "./locale-provider";
import { PtOnlyNotice } from "./pt-only-notice";
import { StudyTree } from "./aprenda/study-tree";
import { LearningTree } from "./aprenda/learning-tree";
import { TRACKS } from "@/content/aprenda/tracks";
import { getTrackLessons } from "@/content/aprenda/registry";

const TRACKS_WITH_LESSONS = TRACKS.map((track) => ({
  track,
  lessons: getTrackLessons(track.slug).map((lessonModule) => lessonModule.meta),
}));

export function HomeContent() {
  const { t } = useLocale();
  const home = t.home;

  return (
    <main className="home-main">
      <div className="home-doc-layout">
        <article className="home-doc-page">
          <section className="home-doc-intro" id="introduction">
            <span className="home-hero-eyebrow">{home.bannerText}</span>
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
          </section>

          <section className="home-doc-section home-doc-section--roadmap" id="roadmap">
            <h2>{home.roadmapHeading}</h2>
            <p>{home.roadmapIntro}</p>
            <PtOnlyNotice translated={false} />
            <div className="nexttech-learning-tree-wrap">
              <LearningTree />
            </div>
            <StudyTree tracksWithLessons={TRACKS_WITH_LESSONS} />
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

          <section className="home-doc-section home-about" id="about">
            <h2>{home.aboutHeading}</h2>
            <div className="home-about-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="home-about-photo" src="/img/icon/avatar_kalleo.png" alt={home.aboutImageAlt} />
              <div className="home-about-text">
                <p>{home.aboutBody}</p>
                <p>
                  {home.whyBodyBefore}{" "}
                  <a href="/padrao-frontend/seguranca">{home.whySecurityLink}</a> {home.whyBodyAfter}
                </p>
                <a className="home-about-github" href="https://github.com/juankalleo" rel="noreferrer" target="_blank">
                  {home.aboutGithubLabel}
                </a>
              </div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}
