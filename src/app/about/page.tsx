import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/about",
  eyebrow: "About",
  title: "About How to Dev",
  description:
    "How to Dev is a practical software development knowledge base for learning frontend, backend, APIs, databases, security, infrastructure and architecture.",
  primaryLink: { label: "Start learning", href: "/aprenda" },
  secondaryLink: { label: "Open frontend standard", href: "/padrao-frontend" },
  sections: [
    {
      title: "What How to Dev is",
      body: "How to Dev connects lessons, production standards and references so developers can learn how modern software is designed, built, secured, deployed and maintained.",
      links: [
        { label: "Learn Software Development", href: "/aprenda" },
        { label: "Frontend development", href: "/frontend" },
      ],
    },
    {
      title: "Main topic hubs",
      body: "The site is organized around durable software development topics instead of isolated pages, helping search engines and readers understand the same structure.",
      links: [
        { label: "API development", href: "/api" },
        { label: "Database development", href: "/database" },
        { label: "Infrastructure and deployment", href: "/infrastructure" },
      ],
    },
    {
      title: "Security-first writing",
      body: "The documentation favors visible explanations, real internal links and official references instead of hidden text, keyword repetition or duplicated indexable domains.",
      links: [
        { label: "Software security", href: "/security" },
        { label: "JWT Authentication", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Credits", href: "/creditos" },
      ],
    },
  ],
  references: [
    { label: "Google Search Central", href: "https://developers.google.com/search/docs" },
    { label: "GitHub - Juan Kalleo", href: "https://github.com/juankalleo" },
  ],
};

export const metadata: Metadata = {
  title: "About How to Dev",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function AboutPage() {
  return <TopicHubPage data={data} />;
}
