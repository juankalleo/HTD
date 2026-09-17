import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/database",
  eyebrow: "Software development hub",
  title: "Database Development",
  description:
    "Learn database development with practical material on SQL, relational modeling, migrations, indexes, multi-tenancy, audit trails and transaction boundaries.",
  primaryLink: { label: "Open the database standard", href: "/padrao-banco-de-dados" },
  secondaryLink: { label: "Study SQL", href: "/aprenda/sql" },
  sections: [
    {
      title: "SQL and relational modeling",
      body: "Understand tables, primary keys, foreign keys, joins, filters and constraints before adding application-level abstractions.",
      links: [
        { label: "SQL learning track", href: "/aprenda/sql" },
        { label: "Database Standard", href: "/padrao-banco-de-dados" },
        { label: "Base modeling", href: "/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base" },
      ],
    },
    {
      title: "Schema evolution",
      body: "Migrations, naming, indexes, enums, reference tables and tenant boundaries decide how safely the product can change over time.",
      links: [
        { label: "Migrations", href: "/padrao-banco-de-dados/conceitos-tecnicos/migrations" },
        { label: "Reference tables vs enums", href: "/padrao-banco-de-dados/conceitos-tecnicos/tabela-de-referencia-vs-enum" },
        { label: "Multi-tenancy", href: "/padrao-banco-de-dados/conceitos-tecnicos/multi-tenancy" },
      ],
    },
    {
      title: "Data integrity and backend APIs",
      body: "Database design connects directly to API contracts, authorization and concurrency risks such as lost updates.",
      links: [
        { label: "API development", href: "/api" },
        { label: "Lost update", href: "/padrao-frontend/conceitos-tecnicos/lost-update" },
        { label: "Security hub", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "PostgreSQL Documentation", href: "https://www.postgresql.org/docs/" },
    { label: "Rails Active Record", href: "https://guides.rubyonrails.org/active_record_basics.html" },
  ],
};

export const metadata: Metadata = {
  title: "Database Development",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function DatabasePage() {
  return <TopicHubPage data={data} />;
}
