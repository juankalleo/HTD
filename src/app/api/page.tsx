import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/api",
  eyebrow: "Hub de desenvolvimento",
  title: "Desenvolvimento de API",
  description:
    "Aprenda desenvolvimento de API por contratos HTTP, rotas backend, autenticação, autorização, paginação, erros, serializers e exemplos práticos em Rails.",
  primaryLink: { label: "Abrir padrão API", href: "/padrao-api" },
  secondaryLink: { label: "Estudar backend com Rails", href: "/aprenda/rails" },
  sections: [
    {
      title: "HTTP e contratos de API",
      body: "Uma boa API torna requisições, respostas, códigos de status, versionamento e erros previsíveis para frontend, backend e clientes externos.",
      links: [
        { label: "Padrão API", href: "/padrao-api" },
        { label: "Roteamento e versionamento", href: "/padrao-api/roteamento-e-versionamento" },
        { label: "Envelope de resposta", href: "/padrao-api/conceitos-tecnicos/envelope-de-resposta" },
      ],
    },
    {
      title: "Implementação backend",
      body: "Aprenda como controllers, rotas, models, serializers e service objects transformam contratos de API em comportamento backend confiável.",
      links: [
        { label: "Trilha Ruby on Rails", href: "/aprenda/rails" },
        { label: "Controllers e rotas REST", href: "/aprenda/rails/05-controllers-e-rotas-rest" },
        { label: "Service objects", href: "/aprenda/rails/07-service-objects" },
      ],
    },
    {
      title: "Segurança de API",
      body: "Autenticação, autorização, rate limiting, CORS, logs de auditoria e tratamento seguro de erros definem se uma API pode atender usuários reais com segurança.",
      links: [
        { label: "Segurança de API", href: "/padrao-api/seguranca" },
        { label: "Autenticação e JWT", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Hub de segurança", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "RFC 9110 - HTTP Semantics", href: "https://www.rfc-editor.org/rfc/rfc9110" },
    { label: "OWASP API Security", href: "https://owasp.org/www-project-api-security/" },
  ],
};

export const metadata: Metadata = {
  title: "Desenvolvimento de API",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function ApiPage() {
  return <TopicHubPage data={data} />;
}
