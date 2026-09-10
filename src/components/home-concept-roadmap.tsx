import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { TechIcon, type TechIconName } from "./aprenda/track-icon";

type LocalizedText = Record<Locale, string>;

type ConceptNode = {
  detail: LocalizedText;
  href?: string;
  icon: TechIconName;
  label: LocalizedText;
};

type ConceptLevel = {
  label: LocalizedText;
  nodes: ConceptNode[];
  stage: LocalizedText;
};

const CONCEPT_LEVELS: ConceptLevel[] = [
  {
    stage: { en: "Base", pt: "Base" },
    label: { en: "The floor every stack stands on", pt: "O chão onde qualquer stack se apoia" },
    nodes: [
      {
        icon: "bash",
        label: { en: "Terminal", pt: "Terminal" },
        detail: { en: "commands, folders, local workflow", pt: "comandos, pastas, fluxo local" },
      },
      {
        icon: "git",
        label: { en: "Git", pt: "Git" },
        detail: { en: "history, branches and collaboration", pt: "histórico, branches e colaboração" },
        href: "/aprenda/git",
      },
      {
        icon: "javascript",
        label: { en: "Logic", pt: "Lógica" },
        detail: { en: "variables, functions, loops", pt: "variáveis, funções, loops" },
        href: "/aprenda/javascript",
      },
      {
        icon: "html5",
        label: { en: "HTML", pt: "HTML" },
        detail: { en: "structure and semantics", pt: "estrutura e semântica" },
      },
      {
        icon: "css3",
        label: { en: "CSS", pt: "CSS" },
        detail: { en: "layout, cascade and responsive rules", pt: "layout, cascata e responsivo" },
      },
    ],
  },
  {
    stage: { en: "Web", pt: "Web" },
    label: { en: "How the browser talks to the world", pt: "Como o navegador conversa com o mundo" },
    nodes: [
      {
        icon: "cloudflare",
        label: { en: "DNS", pt: "DNS" },
        detail: { en: "name resolution before the request", pt: "resolução de nome antes da requisição" },
        href: "/aprenda/networking/03-dns",
      },
      {
        icon: "cloudflare",
        label: { en: "HTTP/HTTPS", pt: "HTTP/HTTPS" },
        detail: { en: "methods, status and TLS", pt: "métodos, status e TLS" },
        href: "/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls",
      },
      {
        icon: "swagger",
        label: { en: "REST API", pt: "API REST" },
        detail: { en: "routes, payloads and contracts", pt: "rotas, payloads e contratos" },
        href: "/padrao-api/roteamento-e-versionamento",
      },
      {
        icon: "cloudflare",
        label: { en: "CDN", pt: "CDN" },
        detail: { en: "static delivery and cache edge", pt: "entrega estática e cache na borda" },
        href: "/aprenda/networking/07-cdn",
      },
    ],
  },
  {
    stage: { en: "Interface", pt: "Interface" },
    label: { en: "From static page to production UI", pt: "Da página estática para UI de produção" },
    nodes: [
      {
        icon: "react",
        label: { en: "Components", pt: "Componentes" },
        detail: { en: "composition, props and reuse", pt: "composição, props e reuso" },
        href: "/padrao-frontend/componentes",
      },
      {
        icon: "tailwindcss",
        label: { en: "Tailwind", pt: "Tailwind" },
        detail: { en: "utility-first styling", pt: "estilo utility-first" },
        href: "/padrao-frontend/tecnologias/tailwind",
      },
      {
        icon: "nextjs",
        label: { en: "Next.js", pt: "Next.js" },
        detail: { en: "routing, layouts and rendering", pt: "rotas, layouts e renderização" },
        href: "/padrao-frontend/tecnologias/nextjs",
      },
      {
        icon: "vitejs",
        label: { en: "Vite", pt: "Vite" },
        detail: { en: "fast dev server and bundling", pt: "dev server rápido e bundle" },
      },
      {
        icon: "typescript",
        label: { en: "TypeScript", pt: "TypeScript" },
        detail: { en: "contracts inside the codebase", pt: "contratos dentro do código" },
        href: "/aprenda/typescript",
      },
      {
        icon: "forms",
        label: { en: "Forms", pt: "Formulários" },
        detail: { en: "validation and safe submit", pt: "validação e envio seguro" },
        href: "/padrao-frontend/formularios",
      },
      {
        icon: "table",
        label: { en: "Tables", pt: "Tabelas" },
        detail: { en: "filters, columns and data density", pt: "filtros, colunas e densidade" },
        href: "/padrao-frontend/tabelas",
      },
    ],
  },
  {
    stage: { en: "Application", pt: "Aplicação" },
    label: { en: "State, data and backend shape", pt: "Estado, dados e formato do backend" },
    nodes: [
      {
        icon: "postgresql",
        label: { en: "SQL", pt: "SQL" },
        detail: { en: "modeling, joins and indexes", pt: "modelagem, joins e índices" },
        href: "/aprenda/sql",
      },
      {
        icon: "ruby",
        label: { en: "Ruby", pt: "Ruby" },
        detail: { en: "language base for Rails", pt: "base da linguagem do Rails" },
        href: "/aprenda/rails/01-ruby-essencial",
      },
      {
        icon: "rails",
        label: { en: "Rails", pt: "Rails" },
        detail: { en: "controllers, models and services", pt: "controllers, models e serviços" },
        href: "/aprenda/rails",
      },
      {
        icon: "nodejs",
        label: { en: "Node.js", pt: "Node.js" },
        detail: { en: "runtime for tooling and SSR", pt: "runtime de tooling e SSR" },
      },
      {
        icon: "api",
        label: { en: "Response envelope", pt: "Envelope de resposta" },
        detail: { en: "predictable API output", pt: "saída previsível de API" },
        href: "/padrao-api/conceitos-tecnicos/envelope-de-resposta",
      },
      {
        icon: "redis",
        label: { en: "Cache", pt: "Cache" },
        detail: { en: "freshness, invalidation and reuse", pt: "validade, invalidação e reuso" },
        href: "/padrao-frontend/cache",
      },
    ],
  },
  {
    stage: { en: "Quality", pt: "Qualidade" },
    label: { en: "Feedback before code reaches production", pt: "Feedback antes do código chegar em produção" },
    nodes: [
      {
        icon: "eslint",
        label: { en: "ESLint", pt: "ESLint" },
        detail: { en: "static rules and consistency", pt: "regras estáticas e consistência" },
      },
      {
        icon: "vitest",
        label: { en: "Vitest", pt: "Vitest" },
        detail: { en: "unit tests close to the code", pt: "testes unitários perto do código" },
      },
      {
        icon: "testing",
        label: { en: "E2E tests", pt: "Testes E2E" },
        detail: { en: "browser flows and regressions", pt: "fluxos de navegador e regressões" },
      },
      {
        icon: "githubactions",
        label: { en: "Automated checks", pt: "Checks automáticos" },
        detail: { en: "repeatable verification in CI", pt: "verificação repetível no CI" },
      },
    ],
  },
  {
    stage: { en: "Infrastructure", pt: "Infraestrutura" },
    label: { en: "Where the system runs and survives", pt: "Onde o sistema roda e se mantém vivo" },
    nodes: [
      {
        icon: "linux",
        label: { en: "Linux", pt: "Linux" },
        detail: { en: "processes, kernel and resources", pt: "processos, kernel e recursos" },
        href: "/padrao-infraestrutura/conceitos-tecnicos/hardware-kernel-e-processos",
      },
      {
        icon: "docker",
        label: { en: "Docker", pt: "Docker" },
        detail: { en: "images, containers and compose", pt: "imagens, containers e compose" },
        href: "/aprenda/docker",
      },
      {
        icon: "nginx",
        label: { en: "Nginx", pt: "Nginx" },
        detail: { en: "reverse proxy and delivery", pt: "proxy reverso e entrega" },
        href: "/padrao-infraestrutura/tecnologias/nginx",
      },
      {
        icon: "githubactions",
        label: { en: "CI/CD", pt: "CI/CD" },
        detail: { en: "checks, deploy and release flow", pt: "checks, deploy e fluxo de release" },
        href: "/padrao-infraestrutura/conceitos-tecnicos/ci-cd",
      },
    ],
  },
  {
    stage: { en: "Protection", pt: "Proteção" },
    label: { en: "Controls that keep the app from becoming fragile", pt: "Controles para a aplicação não virar ponto fraco" },
    nodes: [
      {
        icon: "auth",
        label: { en: "Authentication", pt: "Autenticação" },
        detail: { en: "identity, session and tokens", pt: "identidade, sessão e tokens" },
        href: "/padrao-frontend/seguranca/autenticacao",
      },
      {
        icon: "rbac",
        label: { en: "RBAC", pt: "RBAC" },
        detail: { en: "role and permission boundaries", pt: "papéis e limites de permissão" },
        href: "/padrao-frontend/seguranca/administracao-rbac",
      },
      {
        icon: "security",
        label: { en: "XSS/CSRF", pt: "XSS/CSRF" },
        detail: { en: "browser attack surface", pt: "superfície de ataque no navegador" },
        href: "/padrao-frontend/seguranca/xss",
      },
      {
        icon: "security",
        label: { en: "Headers", pt: "Headers" },
        detail: { en: "CSP, clickjacking and SRI", pt: "CSP, clickjacking e SRI" },
        href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http",
      },
      {
        icon: "testing",
        label: { en: "Auditing", pt: "Auditoria" },
        detail: { en: "logs, evidence and traceability", pt: "logs, evidência e rastreio" },
        href: "/padrao-frontend/seguranca/logs-de-auditoria",
      },
    ],
  },
];

export function HomeConceptRoadmap({ locale }: { locale: Locale }) {
  return (
    <div className="home-concept-roadmap">
      {CONCEPT_LEVELS.map((level) => (
        <section className="home-concept-roadmap__level" key={level.stage.pt}>
          <div className="home-concept-roadmap__stage">
            <span>{level.stage[locale]}</span>
            <strong>{level.label[locale]}</strong>
          </div>
          <div className="home-concept-roadmap__nodes">
            {level.nodes.map((node) => {
              const body = (
                <>
                  <TechIcon name={node.icon} label={node.label[locale]} />
                  <span className="home-concept-card__copy">
                    <strong>{node.label[locale]}</strong>
                    <small>{node.detail[locale]}</small>
                  </span>
                </>
              );

              return node.href ? (
                <Link className="home-concept-card home-concept-card--link" href={node.href} key={`${level.stage.pt}-${node.label.pt}`}>
                  {body}
                </Link>
              ) : (
                <div className="home-concept-card" key={`${level.stage.pt}-${node.label.pt}`}>
                  {body}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
