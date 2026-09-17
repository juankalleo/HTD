import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/api",
  eyebrow: "Software development hub",
  title: "API Development",
  description:
    "Learn API development through HTTP contracts, backend routing, authentication, authorization, pagination, errors, serializers and practical Rails examples.",
  primaryLink: { label: "Open the API standard", href: "/padrao-api" },
  secondaryLink: { label: "Study backend with Rails", href: "/aprenda/rails" },
  sections: [
    {
      title: "HTTP and API contracts",
      body: "A good API makes requests, responses, status codes, versioning and errors predictable for frontend, backend and external clients.",
      links: [
        { label: "API Standard", href: "/padrao-api" },
        { label: "Routing and versioning", href: "/padrao-api/roteamento-e-versionamento" },
        { label: "Response envelope", href: "/padrao-api/conceitos-tecnicos/envelope-de-resposta" },
      ],
    },
    {
      title: "Backend implementation",
      body: "Learn how controllers, routes, models, serializers and service objects turn API contracts into reliable backend behavior.",
      links: [
        { label: "Ruby on Rails track", href: "/aprenda/rails" },
        { label: "Controllers and REST routes", href: "/aprenda/rails/05-controllers-e-rotas-rest" },
        { label: "Service objects", href: "/aprenda/rails/07-service-objects" },
      ],
    },
    {
      title: "API security",
      body: "Authentication, authorization, rate limiting, CORS, audit logs and secure error handling shape whether an API can safely serve real users.",
      links: [
        { label: "API security", href: "/padrao-api/seguranca" },
        { label: "Authentication and JWT", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Security hub", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "RFC 9110 - HTTP Semantics", href: "https://www.rfc-editor.org/rfc/rfc9110" },
    { label: "OWASP API Security", href: "https://owasp.org/www-project-api-security/" },
  ],
};

export const metadata: Metadata = {
  title: "API Development",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function ApiPage() {
  return <TopicHubPage data={data} />;
}
