import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/frontend",
  eyebrow: "Hub de desenvolvimento",
  title: "Desenvolvimento Frontend",
  description:
    "Aprenda frontend com guias práticos sobre HTML, CSS, JavaScript, TypeScript, Next.js, formulários, autenticação, segurança e arquitetura de UI.",
  primaryLink: { label: "Abrir padrão frontend", href: "/padrao-frontend" },
  secondaryLink: { label: "Começar trilha frontend", href: "/aprenda/frontend" },
  sections: [
    {
      title: "Fundamentos de frontend",
      body: "Comece por interfaces semânticas, CSS responsivo, comportamento em JavaScript e contratos em TypeScript antes de adicionar complexidade de framework.",
      links: [
        { label: "Trilha de frontend", href: "/aprenda/frontend" },
        { label: "JavaScript do zero", href: "/aprenda/javascript" },
        { label: "TypeScript do zero", href: "/aprenda/typescript" },
      ],
    },
    {
      title: "Arquitetura frontend em produção",
      body: "Use o padrão frontend para organizar rotas, componentes, formulários, tabelas, cache, relatórios e decisões de design em sistemas manuteníveis.",
      links: [
        { label: "Padrão Frontend", href: "/padrao-frontend" },
        { label: "Acessibilidade", href: "/padrao-frontend/conceitos-tecnicos/acessibilidade" },
        { label: "Next.js App Router", href: "/aprenda/frontend/05-nextjs-app-router" },
      ],
    },
    {
      title: "Segurança no frontend",
      body: "Trate autenticação, armazenamento de token, XSS, CSRF, CSP, IDOR e exportação de arquivos como parte do desenho do frontend, não como checklist posterior.",
      links: [
        { label: "Segurança frontend", href: "/padrao-frontend/seguranca" },
        { label: "Autenticação JWT", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Proteção contra CSRF", href: "/padrao-frontend/seguranca/csrf" },
      ],
    },
  ],
  references: [
    { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
    { label: "web.dev", href: "https://web.dev/" },
  ],
};

export const metadata: Metadata = {
  title: "Desenvolvimento Frontend",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function FrontendPage() {
  return <TopicHubPage data={data} />;
}
