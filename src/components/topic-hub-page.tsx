import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getServerLocale } from "@/lib/locale-server";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { siteUrl } from "@/lib/seo";

export type TopicHubSection = {
  title: string;
  body: string;
  links: { label: string; href: string }[];
};

export type TopicHubData = {
  path: string;
  eyebrow: string;
  title: string;
  description: string;
  primaryLink: { label: string; href: string };
  secondaryLink: { label: string; href: string };
  sections: TopicHubSection[];
  references?: { label: string; href: string }[];
};

export async function TopicHubPage({ data }: { data: TopicHubData }) {
  const locale = await getServerLocale();
  const searchEntries = getGlobalSearchIndex(locale);
  const canonical = siteUrl(data.path);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${canonical}#webpage`,
        name: data.title,
        description: data.description,
        url: canonical,
        isPartOf: { "@id": siteUrl("/#website") },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonical}#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "How to Dev",
            item: siteUrl("/"),
          },
          {
            "@type": "ListItem",
            position: 2,
            name: data.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar activeHref={data.path} searchEntries={searchEntries} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <main className="developer-roadmap-main">
        <section className="developer-roadmap-hero">
          <p className="developer-roadmap-eyebrow">{data.eyebrow}</p>
          <h1>{data.title}</h1>
          <p>{data.description}</p>
          <div className="developer-roadmap-actions">
            <a href={data.primaryLink.href}>{data.primaryLink.label}</a>
            <a href={data.secondaryLink.href}>{data.secondaryLink.label}</a>
          </div>
        </section>

        <section className="developer-roadmap-section" id="guides">
          <div className="developer-roadmap-section__heading">
            <h2>{data.title} guides</h2>
            <p>Use this hub to move from the topic overview into the strongest How to Dev pages for that subject.</p>
          </div>
          <div className="developer-roadmap-grid">
            {data.sections.map((section, index) => (
              <article className="developer-roadmap-step" key={section.title}>
                <div className="developer-roadmap-step__marker">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="developer-roadmap-step__body">
                  <h2>{section.title}</h2>
                  <p>{section.body}</p>
                  <ul>
                    {section.links.map((link) => (
                      <li key={link.href}>
                        <a href={link.href}>{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {data.references?.length ? (
          <section className="developer-roadmap-section developer-roadmap-section--compact">
            <div className="developer-roadmap-section__heading">
              <h2>References</h2>
              <p>Official material and durable references connected to this topic.</p>
            </div>
            <div className="developer-roadmap-reference-list">
              {data.references.map((reference) => (
                <a href={reference.href} key={reference.href} rel="noreferrer" target="_blank">
                  {reference.label}
                </a>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
