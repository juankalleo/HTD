import type { Metadata } from "next";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "How to Dev",
  description:
    "Documentação pessoal de Juan Kalleo sobre os padrões de frontend, API e infraestrutura usados como referência de projeto.",
};

const AREA_CARDS: {
  title: string;
  href: string;
  status: "Disponível" | "Em construção";
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    title: "Padrão Frontend",
    href: "/padrao-frontend",
    status: "Disponível",
    description:
      "Estrutura de pastas, autenticação, formulários, tabelas, relatórios e uma seção inteira de segurança — cada tecnologia com motivo da escolha, versão e exemplo de código.",
    icon: (
      <>
        <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8.5 19.5v-5M15.5 19.5v-5" />
      </>
    ),
  },
  {
    title: "Padrão API",
    href: "/padrao-api",
    status: "Em construção",
    description: "Contrato HTTP, autenticação, paginação, envelope de erro e versionamento.",
    icon: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M14 4l-4 16" />,
  },
  {
    title: "Padrão Infraestrutura",
    href: "/padrao-infraestrutura",
    status: "Em construção",
    description: "Ambientes, deploy, variáveis, logs e monitoramento.",
    icon: (
      <>
        <rect x="4" y="4" width="16" height="6" rx="2" />
        <rect x="4" y="14" width="16" height="6" rx="2" />
        <path d="M8 7h.01M8 17h.01M12 7h4M12 17h4" />
      </>
    ),
  },
  {
    title: "Exemplos",
    href: "/examples",
    status: "Em construção",
    description: "Catálogo de fluxos completos: CRUD autenticado, tabela com filtro, formulário com validação.",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </>
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar activeHref="/" />
      <main className="home-main">
        <section className="home-hero">
          <p className="home-hero-eyebrow">v1.0 · Padrão Frontend disponível</p>
          <h1 className="home-hero-title">How to Dev</h1>
          <p className="home-hero-tagline">
            Documentação pessoal de Juan Kalleo sobre os padrões que uso pra estruturar um projeto do zero —
            frontend, API e infraestrutura, reescritos de forma genérica, sem nome de cliente ou sistema real.
          </p>
        </section>

        <section className="home-section">
          <h2>Propósito</h2>
          <p>
            Este site documenta, de verdade, os padrões de estruturação que uso no dia a dia: organização de
            pastas, autenticação, formulário, tabela, exportação de relatório e, principalmente, segurança —
            sempre com o porquê da decisão, não só o &quot;como fazer&quot;. Não é um produto nem tem equipe por
            trás: é referência técnica pessoal, publicada porque documentar é a forma mais honesta de revisar,
            depois, se um padrão ainda faz sentido.
          </p>
        </section>

        <section className="home-section">
          <h2>Por que existe</h2>
          <p>
            Nasceu de uma pergunta simples: se alguém mal-intencionado tivesse acesso a essa documentação, ela
            ajudaria a atacar um sistema real — ou mostraria que o sistema já é protegido o bastante pra não valer
            a pena tentar? A seção de{" "}
            <a href="/padrao-frontend/seguranca">Segurança</a>, dentro do Padrão Frontend, foi escrita com essa
            régua: documentação completa, sem esconder threshold, header ou comportamento de autorização. A única
            &quot;falha&quot; aceitável é o sistema estar protegido demais.
          </p>
        </section>

        <section className="home-cards">
          {AREA_CARDS.map((card) => (
            <a key={card.href} href={card.href} className="home-card">
              <div className="home-card-top">
                <svg
                  className="home-card-icon"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.15}
                >
                  {card.icon}
                </svg>
                <span className={`home-card-status home-card-status--${card.status === "Disponível" ? "ready" : "wip"}`}>
                  {card.status}
                </span>
              </div>
              <h3 className="home-card-title">{card.title}</h3>
              <p className="home-card-description">{card.description}</p>
            </a>
          ))}
        </section>

        <section className="home-section home-roadmap">
          <h2>Roadmap de estudo</h2>
          <div className="home-roadmap-grid">
            <div className="home-roadmap-column">
              <h3 className="home-roadmap-heading home-roadmap-heading--done">Concluído</h3>
              <ul>
                <li>Estrutura de pastas e roteamento (App Router)</li>
                <li>Autenticação</li>
                <li>Segurança — XSS, CSRF, JWT, IDOR, política de senha, headers HTTP, RBAC e mais</li>
                <li>Tecnologias — Next.js, Tailwind, TanStack Query, React Hook Form + Zod e outras, cada uma com versão e exemplo</li>
                <li>Conceitos técnicos — SSR, hidratação, code-splitting, WebSocket, WebRTC e mais</li>
                <li>Componentes, formulários, arquivos, layout e relatórios</li>
              </ul>
            </div>
            <div className="home-roadmap-column">
              <h3 className="home-roadmap-heading home-roadmap-heading--wip">Planejado</h3>
              <ul>
                <li>Padrão API — contrato HTTP, autenticação, paginação, versionamento</li>
                <li>Padrão Infraestrutura — ambientes, deploy, observabilidade</li>
                <li>Exemplos — catálogo de fluxos completos extraídos do projeto base</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
