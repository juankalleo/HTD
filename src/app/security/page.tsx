import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/security",
  eyebrow: "Software development hub",
  title: "Software Security",
  description:
    "Learn software security through practical guides on authentication, JWT, sessions, CSRF, XSS, CSP, RBAC, IDOR, API security and audit logs.",
  primaryLink: { label: "Open the security guide", href: "/padrao-frontend/seguranca" },
  secondaryLink: { label: "Review JWT authentication", href: "/padrao-frontend/seguranca/jwt" },
  sections: [
    {
      title: "Authentication and tokens",
      body: "Authentication decides who the user is, how credentials are verified and how access and refresh tokens should be issued, stored and revoked.",
      links: [
        { label: "Authentication", href: "/padrao-frontend/seguranca/autenticacao" },
        { label: "JWT Authentication", href: "/padrao-frontend/seguranca/jwt" },
        { label: "API security", href: "/padrao-api/seguranca" },
      ],
    },
    {
      title: "Browser and frontend risks",
      body: "Frontend security includes the browser threat model: XSS, CSRF, CSP, secure headers, file handling and sensitive data in the client.",
      links: [
        { label: "XSS", href: "/padrao-frontend/seguranca/xss" },
        { label: "CSRF", href: "/padrao-frontend/seguranca/csrf" },
        { label: "HTTP security headers", href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http" },
      ],
    },
    {
      title: "Authorization and auditability",
      body: "Authorization, RBAC, IDOR prevention, logs and export controls make access decisions visible and testable in production systems.",
      links: [
        { label: "RBAC", href: "/padrao-frontend/seguranca/administracao-rbac" },
        { label: "IDOR and authorization", href: "/padrao-frontend/seguranca/idor-e-autorizacao" },
        { label: "Audit logs", href: "/padrao-frontend/seguranca/logs-de-auditoria" },
      ],
    },
  ],
  references: [
    { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/" },
    { label: "OWASP Top 10", href: "https://owasp.org/www-project-top-ten/" },
  ],
};

export const metadata: Metadata = {
  title: "Software Security",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function SecurityPage() {
  return <TopicHubPage data={data} />;
}
