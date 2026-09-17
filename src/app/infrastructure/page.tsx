import type { Metadata } from "next";
import { TopicHubPage, type TopicHubData } from "@/components/topic-hub-page";
import { siteUrl } from "@/lib/seo";

const data: TopicHubData = {
  path: "/infrastructure",
  eyebrow: "Software development hub",
  title: "Infrastructure and Deployment",
  description:
    "Learn infrastructure and deployment through Linux, networking, HTTP, Docker, Nginx, reverse proxies, CDNs, CI/CD, logs and operational security.",
  primaryLink: { label: "Open the infrastructure standard", href: "/padrao-infraestrutura" },
  secondaryLink: { label: "Study Docker", href: "/aprenda/docker" },
  sections: [
    {
      title: "Networking and HTTP",
      body: "Infrastructure starts with DNS, IP addresses, ports, HTTP, HTTPS, TLS and reverse proxies that connect users to applications.",
      links: [
        { label: "Networking track", href: "/aprenda/networking" },
        { label: "HTTP and HTTPS", href: "/aprenda/networking/04-http-e-https" },
        { label: "Reverse proxy and Nginx", href: "/aprenda/networking/06-proxy-reverso-nginx" },
      ],
    },
    {
      title: "Deployment runtime",
      body: "Docker, Compose, Nginx, Linux processes and resource limits define how applications are packaged and kept online.",
      links: [
        { label: "Docker track", href: "/aprenda/docker" },
        { label: "Infrastructure Standard", href: "/padrao-infraestrutura" },
        { label: "Docker Compose", href: "/padrao-infraestrutura/tecnologias/docker-compose" },
      ],
    },
    {
      title: "Operations and reliability",
      body: "A production system needs logs, CI/CD, deployment controls, load balancing, monitoring and failure boundaries that developers can reason about.",
      links: [
        { label: "CI/CD", href: "/padrao-infraestrutura/conceitos-tecnicos/ci-cd" },
        { label: "Load balancer", href: "/padrao-infraestrutura/conceitos-tecnicos/load-balancer" },
        { label: "Security hub", href: "/security" },
      ],
    },
  ],
  references: [
    { label: "Docker Docs", href: "https://docs.docker.com/" },
    { label: "Nginx Documentation", href: "https://nginx.org/en/docs/" },
  ],
};

export const metadata: Metadata = {
  title: "Infrastructure and Deployment",
  description: data.description,
  alternates: { canonical: siteUrl(data.path) },
  openGraph: { title: data.title, description: data.description, url: siteUrl(data.path) },
};

export default function InfrastructurePage() {
  return <TopicHubPage data={data} />;
}
