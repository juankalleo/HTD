import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/database",
  eyebrow: "Hub de desenvolvimento",
  title: "Banco de Dados",
  description:
    "Aprenda banco de dados com material prático sobre SQL, modelagem relacional, migrations, índices, multi-tenancy, auditoria e limites de transação.",
  primaryLink: { label: "Abrir padrão banco de dados", href: "/padrao-banco-de-dados" },
  secondaryLink: { label: "Estudar SQL", href: "/aprenda/sql" },
  sections: [
    {
      title: "SQL e modelagem relacional",
      body: "Entenda tabelas, chaves primárias, chaves estrangeiras, joins, filtros e constraints antes de adicionar abstrações da aplicação.",
      links: [
        { label: "Trilha de SQL", href: "/aprenda/sql" },
        { label: "Padrão Banco de Dados", href: "/padrao-banco-de-dados" },
        { label: "Modelagem base", href: "/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base" },
      ],
    },
    {
      title: "Evolução do schema",
      body: "Migrations, nomenclatura, índices, enums, tabelas de referência e limites de tenant definem quão seguro é evoluir o produto ao longo do tempo.",
      links: [
        { label: "Migrations", href: "/padrao-banco-de-dados/conceitos-tecnicos/migrations" },
        { label: "Tabela de referência vs enum", href: "/padrao-banco-de-dados/conceitos-tecnicos/tabela-de-referencia-vs-enum" },
        { label: "Multi-tenancy", href: "/padrao-banco-de-dados/conceitos-tecnicos/multi-tenancy" },
      ],
    },
    {
      title: "Integridade de dados e APIs",
      body: "O desenho do banco se conecta diretamente a contratos de API, autorização e riscos de concorrência como lost update.",
      links: [
        { label: "Desenvolvimento de API", href: "/api" },
        { label: "Lost update", href: "/padrao-frontend/conceitos-tecnicos/lost-update" },
        { label: "Hub de segurança", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "Documentação do PostgreSQL", href: "https://www.postgresql.org/docs/" },
    { label: "Rails Active Record", href: "https://guides.rubyonrails.org/active_record_basics.html" },
  ],
};

export const metadata: Metadata = {
  title: "Banco de Dados",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function DatabasePage() {
  return <TopicHubPage data={data} />;
}
