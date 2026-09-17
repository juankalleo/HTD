import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/infrastructure",
  eyebrow: "Hub de desenvolvimento",
  title: "Infraestrutura e Deploy",
  description:
    "Aprenda infraestrutura e deploy por Linux, redes, HTTP, Docker, Nginx, proxies reversos, CDNs, CI/CD, logs e segurança operacional.",
  primaryLink: { label: "Abrir padrão infraestrutura", href: "/padrao-infraestrutura" },
  secondaryLink: { label: "Estudar Docker", href: "/aprenda/docker" },
  sections: [
    {
      title: "Redes e HTTP",
      body: "Infraestrutura começa com DNS, endereços IP, portas, HTTP, HTTPS, TLS e proxies reversos que conectam usuários às aplicações.",
      links: [
        { label: "Trilha de redes", href: "/aprenda/networking" },
        { label: "HTTP and HTTPS", href: "/aprenda/networking/04-http-e-https" },
        { label: "Proxy reverso e Nginx", href: "/aprenda/networking/06-proxy-reverso-nginx" },
      ],
    },
    {
      title: "Runtime de deploy",
      body: "Docker, Compose, Nginx, processos Linux e limites de recurso definem como aplicações são empacotadas e mantidas online.",
      links: [
        { label: "Trilha de Docker", href: "/aprenda/docker" },
        { label: "Padrão Infraestrutura", href: "/padrao-infraestrutura" },
        { label: "Docker Compose", href: "/padrao-infraestrutura/tecnologias/docker-compose" },
      ],
    },
    {
      title: "Operação e confiabilidade",
      body: "Um sistema em produção precisa de logs, CI/CD, controles de deploy, balanceamento, monitoramento e limites de falha que desenvolvedores consigam entender.",
      links: [
        { label: "CI/CD", href: "/padrao-infraestrutura/conceitos-tecnicos/ci-cd" },
        { label: "Load balancer", href: "/padrao-infraestrutura/conceitos-tecnicos/load-balancer" },
        { label: "Hub de segurança", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "Docker Docs", href: "https://docs.docker.com/" },
    { label: "Documentação do Nginx", href: "https://nginx.org/en/docs/" },
  ],
};

export const metadata: Metadata = {
  title: "Infraestrutura e Deploy",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function InfrastructurePage() {
  return <TopicHubPage data={data} />;
}
