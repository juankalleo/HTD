import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { TechIcon, type TechIconName } from "@/components/aprenda/track-icon";
import { getServerLocale } from "@/lib/locale-server";
import { getGlobalSearchIndex } from "@/lib/search-index";

export const metadata: Metadata = {
  title: "How to Develop Software - Developer Roadmap",
  description:
    "A practical roadmap for learning modern software development: web fundamentals, frontend, APIs, backend, databases, authentication, security, infrastructure, deployment and architecture.",
};

type RoadmapStep = {
  title: string;
  summary: string;
  icon: TechIconName;
  links: { label: string; href: string }[];
};

const ROADMAP_STEPS: RoadmapStep[] = [
  {
    title: "Web fundamentals",
    summary: "Understand how browsers, clients, servers, DNS, IP, ports, HTTP and HTTPS fit together before choosing a framework.",
    icon: "cloudflare",
    links: [
      { label: "How the internet works", href: "/aprenda/networking/01-como-a-internet-funciona" },
      { label: "DNS", href: "/aprenda/networking/03-dns" },
      { label: "HTTP and HTTPS", href: "/aprenda/networking/04-http-e-https" },
    ],
  },
  {
    title: "HTML and CSS",
    summary: "Learn semantic structure, layout, responsive rules and the visual system that makes an interface readable.",
    icon: "html5",
    links: [
      { label: "Accessibility", href: "/padrao-frontend/conceitos-tecnicos/acessibilidade" },
      { label: "Typography", href: "/padrao-frontend/estilos/tipografia" },
      { label: "Tailwind fundamentals", href: "/aprenda/frontend/01-por-que-tailwind" },
    ],
  },
  {
    title: "JavaScript",
    summary: "Build the mental model for variables, functions, arrays, objects, the DOM and async code.",
    icon: "javascript",
    links: [
      { label: "JavaScript from zero", href: "/aprenda/javascript" },
      { label: "DOM and events", href: "/aprenda/javascript/06-dom-e-eventos" },
      { label: "Async JavaScript", href: "/aprenda/javascript/07-assincrono-promises-async-await" },
    ],
  },
  {
    title: "TypeScript",
    summary: "Use types to describe contracts inside the codebase, especially API payloads, forms and component props.",
    icon: "typescript",
    links: [
      { label: "TypeScript from zero", href: "/aprenda/typescript" },
      { label: "Interfaces and type aliases", href: "/aprenda/typescript/03-interfaces-e-type-aliases" },
      { label: "Typed API project", href: "/aprenda/typescript/07-projeto-guiado-tipando-uma-api" },
    ],
  },
  {
    title: "Frontend",
    summary: "Move from pages to product UI: components, routing, server/client rendering, data fetching, forms and cache.",
    icon: "nextjs",
    links: [
      { label: "Frontend track", href: "/aprenda/frontend" },
      { label: "Next.js App Router", href: "/aprenda/frontend/05-nextjs-app-router" },
      { label: "Frontend Standard", href: "/padrao-frontend" },
    ],
  },
  {
    title: "APIs",
    summary: "Design predictable HTTP contracts: routing, versioning, response envelopes, pagination, errors and documentation.",
    icon: "api",
    links: [
      { label: "API Standard", href: "/padrao-api" },
      { label: "Routing and versioning", href: "/padrao-api/roteamento-e-versionamento" },
      { label: "Response envelope", href: "/padrao-api/conceitos-tecnicos/envelope-de-resposta" },
    ],
  },
  {
    title: "Backend",
    summary: "Learn how requests become behavior through controllers, models, services, serializers and background work.",
    icon: "rails",
    links: [
      { label: "Ruby on Rails track", href: "/aprenda/rails" },
      { label: "Controllers and REST routes", href: "/aprenda/rails/05-controllers-e-rotas-rest" },
      { label: "Service objects", href: "/aprenda/rails/07-service-objects" },
    ],
  },
  {
    title: "Databases",
    summary: "Understand relational modeling, SQL, keys, joins, indexes, migrations, multi-tenancy and transaction boundaries.",
    icon: "postgresql",
    links: [
      { label: "SQL track", href: "/aprenda/sql" },
      { label: "Database Standard", href: "/padrao-banco-de-dados" },
      { label: "Modeling base", href: "/padrao-banco-de-dados/conceitos-tecnicos/modelagem-base" },
    ],
  },
  {
    title: "Authentication",
    summary: "Separate identity from permissions: login, JWT, sessions, password reset, token storage and revocation.",
    icon: "auth",
    links: [
      { label: "Authentication in the frontend", href: "/padrao-frontend/seguranca/autenticacao" },
      { label: "JWT Authentication", href: "/padrao-frontend/seguranca/jwt" },
      { label: "Devise authentication", href: "/aprenda/rails/08-autenticacao-com-devise" },
    ],
  },
  {
    title: "Security",
    summary: "Learn the controls that keep software from becoming fragile: RBAC, CSRF, XSS, CSP, IDOR, rate limiting and audit logs.",
    icon: "security",
    links: [
      { label: "Frontend security", href: "/padrao-frontend/seguranca" },
      { label: "API security", href: "/padrao-api/seguranca" },
      { label: "RBAC", href: "/padrao-frontend/seguranca/administracao-rbac" },
    ],
  },
  {
    title: "Testing and quality",
    summary: "Use fast feedback loops: static analysis, unit tests, browser tests, reviews and repeatable checks in CI.",
    icon: "testing",
    links: [
      { label: "Vitest", href: "/padrao-frontend/tecnologias/vitest" },
      { label: "ESLint", href: "/padrao-frontend/tecnologias/eslint" },
      { label: "CI/CD", href: "/padrao-infraestrutura/conceitos-tecnicos/ci-cd" },
    ],
  },
  {
    title: "Infrastructure and deployment",
    summary: "Package and operate applications with Docker, Linux, Nginx, reverse proxies, CDNs, resource limits and deploy pipelines.",
    icon: "docker",
    links: [
      { label: "Docker track", href: "/aprenda/docker" },
      { label: "Infrastructure Standard", href: "/padrao-infraestrutura" },
      { label: "Docker Compose", href: "/padrao-infraestrutura/tecnologias/docker-compose" },
    ],
  },
  {
    title: "Software architecture",
    summary: "Connect the pieces: boundaries, modules, data flow, consistency, caching, scaling and long-term maintainability.",
    icon: "cache",
    links: [
      { label: "Cache", href: "/padrao-frontend/cache" },
      { label: "Lost update", href: "/padrao-frontend/conceitos-tecnicos/lost-update" },
      { label: "Recommended reading", href: "/padrao-frontend/leitura-recomendada" },
    ],
  },
];

const CONTINUE_LINKS = [
  { label: "Start the learning hub", href: "/aprenda" },
  { label: "Frontend development guide", href: "/padrao-frontend" },
  { label: "Backend API guide", href: "/padrao-api" },
  { label: "Database guide", href: "/padrao-banco-de-dados" },
  { label: "Infrastructure guide", href: "/padrao-infraestrutura" },
  { label: "Security guide", href: "/padrao-frontend/seguranca" },
];

const REFERENCES = [
  { label: "MDN Web Docs", href: "https://developer.mozilla.org/" },
  { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/" },
  { label: "RFC 9110 - HTTP Semantics", href: "https://www.rfc-editor.org/rfc/rfc9110" },
  { label: "Google Search Central", href: "https://developers.google.com/search/docs" },
];

function RoadmapStepCard({ step, index }: { step: RoadmapStep; index: number }) {
  return (
    <article className="developer-roadmap-step">
      <div className="developer-roadmap-step__marker">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <TechIcon name={step.icon} label={step.title} className="developer-roadmap-step__icon" />
      </div>
      <div className="developer-roadmap-step__body">
        <h2>{step.title}</h2>
        <p>{step.summary}</p>
        <ul>
          {step.links.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export default async function DeveloperRoadmapPage() {
  const locale = await getServerLocale();
  const searchEntries = getGlobalSearchIndex(locale);

  return (
    <>
      <Navbar activeHref="/developer-roadmap" searchEntries={searchEntries} />
      <main className="developer-roadmap-main">
        <section className="developer-roadmap-hero">
          <p className="developer-roadmap-eyebrow">Developer roadmap</p>
          <h1>How to Develop Software</h1>
          <p>
            A practical roadmap to modern software development. Start with web fundamentals, then connect frontend,
            APIs, backend, databases, authentication, security, infrastructure, deployment and architecture through
            real How to Dev guides.
          </p>
          <div className="developer-roadmap-actions">
            <a href="/aprenda">Start learning</a>
            <a href="#roadmap">Explore the roadmap</a>
          </div>
        </section>

        <section className="developer-roadmap-overview" aria-label="How to Dev topic structure">
          <div>
            <strong>How to Dev</strong>
            <span>learn software development</span>
          </div>
          <ol>
            <li>Web foundations</li>
            <li>Frontend and UI</li>
            <li>APIs and backend</li>
            <li>Data and security</li>
            <li>Infrastructure and architecture</li>
          </ol>
        </section>

        <section className="developer-roadmap-section" id="roadmap">
          <div className="developer-roadmap-section__heading">
            <h2>Software development roadmap</h2>
            <p>
              Follow this order when you are learning from scratch. If you already know a topic, use the links as a
              reference map and move to the next boundary.
            </p>
          </div>
          <div className="developer-roadmap-grid">
            {ROADMAP_STEPS.map((step, index) => (
              <RoadmapStepCard key={step.title} step={step} index={index} />
            ))}
          </div>
        </section>

        <section className="developer-roadmap-section developer-roadmap-section--compact">
          <div className="developer-roadmap-section__heading">
            <h2>Continue learning</h2>
            <p>Use these hubs to move from the roadmap into deeper lessons, standards and security references.</p>
          </div>
          <div className="developer-roadmap-link-grid">
            {CONTINUE_LINKS.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section className="developer-roadmap-section developer-roadmap-section--compact">
          <div className="developer-roadmap-section__heading">
            <h2>References</h2>
            <p>How to Dev favors visible explanations backed by official references, not hidden text or keyword stuffing.</p>
          </div>
          <div className="developer-roadmap-reference-list">
            {REFERENCES.map((reference) => (
              <a href={reference.href} key={reference.href} rel="noreferrer" target="_blank">
                {reference.label}
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
