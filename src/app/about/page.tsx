import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/about",
  eyebrow: "Sobre",
  title: "Sobre o How to Dev",
  description:
    "How to Dev é uma base prática de conhecimento sobre frontend, backend, APIs, bancos de dados, segurança, infraestrutura e arquitetura.",
  primaryLink: { label: "Começar a aprender", href: "/aprenda" },
  secondaryLink: { label: "Abrir padrão frontend", href: "/padrao-frontend" },
  sections: [
    {
      title: "O que é o How to Dev",
      body: "How to Dev conecta aulas, padrões de produção e referências para ajudar desenvolvedores a entender como software moderno é desenhado, construído, protegido, publicado e mantido.",
      links: [
        { label: "Aprenda desenvolvimento de software", href: "/aprenda" },
        { label: "Desenvolvimento frontend", href: "/frontend" },
      ],
    },
    {
      title: "Principais hubs",
      body: "O site é organizado em assuntos duráveis de desenvolvimento de software, não em páginas soltas, para leitores e buscadores entenderem a mesma estrutura.",
      links: [
        { label: "Desenvolvimento de API", href: "/api" },
        { label: "Banco de dados", href: "/database" },
        { label: "Infraestrutura e deploy", href: "/infrastructure" },
      ],
    },
    {
      title: "Escrita com segurança primeiro",
      body: "A documentação prioriza explicações visíveis, links internos reais e referências oficiais em vez de texto escondido, repetição de palavra-chave ou domínios duplicados.",
      links: [
        { label: "Segurança de software", href: "/security" },
        { label: "Autenticação JWT", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Créditos", href: "/creditos" },
      ],
    },
  ],
  references: [
    { label: "Google Search Central", href: "https://developers.google.com/search/docs" },
    { label: "GitHub - Juan Kalleo", href: "https://github.com/juankalleo" },
  ],
};

export const metadata: Metadata = {
  title: "Sobre o How to Dev",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function AboutPage() {
  return <TopicHubPage data={data} />;
}
