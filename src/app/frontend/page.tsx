import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/frontend",
  eyebrow: "Software development hub",
  title: "Frontend Development",
  description:
    "Learn frontend development with practical guides on HTML, CSS, JavaScript, TypeScript, Next.js, forms, authentication, security and UI architecture.",
  primaryLink: { label: "Open the frontend standard", href: "/padrao-frontend" },
  secondaryLink: { label: "Start the frontend track", href: "/aprenda/frontend" },
  sections: [
    {
      title: "Frontend foundations",
      body: "Start with semantic interfaces, responsive CSS, JavaScript behavior and TypeScript contracts before adding framework complexity.",
      links: [
        { label: "Frontend learning track", href: "/aprenda/frontend" },
        { label: "JavaScript from zero", href: "/aprenda/javascript" },
        { label: "TypeScript from zero", href: "/aprenda/typescript" },
      ],
    },
    {
      title: "Production frontend architecture",
      body: "Use the frontend standard to organize routes, components, forms, tables, cache, reports and design decisions in maintainable systems.",
      links: [
        { label: "Frontend Standard", href: "/padrao-frontend" },
        { label: "Accessibility", href: "/padrao-frontend/conceitos-tecnicos/acessibilidade" },
        { label: "Next.js App Router", href: "/aprenda/frontend/05-nextjs-app-router" },
      ],
    },
    {
      title: "Frontend security",
      body: "Treat authentication, token storage, XSS, CSRF, CSP, IDOR and file export as part of the frontend design, not as a later checklist.",
      links: [
        { label: "Frontend security", href: "/padrao-frontend/seguranca" },
        { label: "JWT Authentication", href: "/padrao-frontend/seguranca/jwt" },
        { label: "CSRF protection", href: "/padrao-frontend/seguranca/csrf" },
      ],
    },
  ],
  references: [
    { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
    { label: "web.dev", href: "https://web.dev/" },
  ],
};

export const metadata: Metadata = {
  title: "Frontend Development",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function FrontendPage() {
  return <TopicHubPage data={data} />;
}
