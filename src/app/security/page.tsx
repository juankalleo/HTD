import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/security",
  eyebrow: "Hub de desenvolvimento",
  title: "Segurança de Software",
  description:
    "Aprenda segurança de software com guias práticos sobre autenticação, JWT, sessões, CSRF, XSS, CSP, RBAC, IDOR, segurança de API e logs de auditoria.",
  primaryLink: { label: "Abrir guia de segurança", href: "/padrao-frontend/seguranca" },
  secondaryLink: { label: "Revisar autenticação JWT", href: "/padrao-frontend/seguranca/jwt" },
  sections: [
    {
      title: "Autenticação e tokens",
      body: "Autenticação define quem é o usuário, como credenciais são verificadas e como tokens de acesso e refresh devem ser emitidos, armazenados e revogados.",
      links: [
        { label: "Autenticação", href: "/padrao-frontend/seguranca/autenticacao" },
        { label: "Autenticação JWT", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Segurança de API", href: "/padrao-api/seguranca" },
      ],
    },
    {
      title: "Riscos no navegador e frontend",
      body: "Segurança frontend inclui o modelo de ameaça do navegador: XSS, CSRF, CSP, headers seguros, arquivos e dados sensíveis no cliente.",
      links: [
        { label: "XSS", href: "/padrao-frontend/seguranca/xss" },
        { label: "CSRF", href: "/padrao-frontend/seguranca/csrf" },
        { label: "Headers HTTP de segurança", href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http" },
      ],
    },
    {
      title: "Autorização e auditabilidade",
      body: "Autorização, RBAC, prevenção de IDOR, logs e controles de exportação tornam decisões de acesso visíveis e testáveis em sistemas de produção.",
      links: [
        { label: "RBAC", href: "/padrao-frontend/seguranca/administracao-rbac" },
        { label: "IDOR e autorização", href: "/padrao-frontend/seguranca/idor-e-autorizacao" },
        { label: "Logs de auditoria", href: "/padrao-frontend/seguranca/logs-de-auditoria" },
      ],
    },
  ],
  references: [
    { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/" },
    { label: "OWASP Top 10", href: "https://owasp.org/www-project-top-ten/" },
  ],
};

export const metadata: Metadata = {
  title: "Segurança de Software",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function SecurityPage() {
  return <TopicHubPage data={data} />;
}
