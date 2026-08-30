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

const AREA_ICON: Record<AreaKey, React.ReactNode> = {
  "padrao-frontend": (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8.5 19.5v-5M15.5 19.5v-5" />
    </>
  ),
  "padrao-api": <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />,
  "padrao-infraestrutura": (
    <>
      <rect x="4" y="4" width="16" height="6" rx="2" />
      <rect x="4" y="14" width="16" height="6" rx="2" />
      <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
    </>
  ),
  examples: (
    <>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
      <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
    </>
  ),
};

export function HomeContent() {
  const { t } = useLocale();
  const home = t.home;

  return (
    <main className="home-main">
      <section className="home-hero">
        <div className="home-hero-copy">
          <p className="home-hero-eyebrow">{home.eyebrow}</p>
          <h1 className="home-hero-title">{home.title}</h1>
          <p className="home-hero-tagline">{home.tagline}</p>
          <div className="home-hero-actions">
            <a className="home-action home-action-primary" href="/padrao-frontend">
              {home.primaryCta}
            </a>
            <a className="home-action" href="/creditos">
              {home.secondaryCta}
            </a>
          </div>
        </div>
      </section>

      <div className="home-inner">
        <section className="home-section home-orientation">
          <article>
            <h2>{home.purposeHeading}</h2>
            <p>{home.purposeBody}</p>
          </article>
          <article>
            <h2>{home.whyHeading}</h2>
            <p>
              {home.whyBodyBefore}{" "}
              <a href="/padrao-frontend/seguranca">{home.whySecurityLink}</a>{" "}
              {home.whyBodyAfter}
            </p>
          </article>
        </section>

        <section className="home-areas">
          <div className="home-section-heading">
            <h2>{home.areasHeading}</h2>
            <p>{home.areasBody}</p>
          </div>
          <div className="home-cards">
            {AREA_ORDER.map((area) => {
              const card = home.cards[area];
              return (
                <a key={area} href={AREA_HREF[area]} className="home-card">
                  <div className="home-card-top">
                    <svg
                      className="home-card-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.15}
                    >
                      {AREA_ICON[area]}
                    </svg>
                    <span
                      className={`home-card-status home-card-status--${
                        card.status === home.statusReady ? "ready" : "wip"
                      }`}
                    >
                      {card.status}
                    </span>
                  </div>
                  <h3 className="home-card-title">{card.title}</h3>
                  <p className="home-card-description">{card.description}</p>
                </a>
              );
            })}
          </div>
        </section>

        <section className="home-roadmap">
          <div className="home-roadmap-intro">
            <p className="home-hero-eyebrow">{home.roadmapEyebrow}</p>
            <h2>{home.roadmapHeading}</h2>
            <p>{home.roadmapIntro}</p>
            <div className="home-roadmap-source">
              <h3>{home.roadmapSourceHeading}</h3>
              <p>{home.roadmapSourceBody}</p>
              <div className="home-source-links">
                {home.roadmapSourceLinks.map((source) => (
                  <a
                    href={source.href}
                    key={source.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {source.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="home-roadmap-grid">
            {home.roadmapTracks.map((track) => (
              <a className="home-roadmap-card" href={track.href} key={track.step}>
                <div className="home-roadmap-card-top">
                  <span className="home-roadmap-step">{track.step}</span>
                  <span className="home-roadmap-status">{track.status}</span>
                </div>
                <h3>{track.title}</h3>
                <p>{track.description}</p>
                <ul>
                  {track.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </a>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
