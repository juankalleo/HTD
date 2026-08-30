export type Locale = "en" | "pt";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "htd-locale";

export type AreaKey = "padrao-frontend" | "padrao-api" | "padrao-infraestrutura" | "examples";

type HomeSourceLink = {
  label: string;
  href: string;
};

type HomeRoadmapTrack = {
  step: string;
  title: string;
  status: string;
  href: string;
  description: string;
  items: string[];
};

type HomeControlRow = {
  risk: string;
  htd: string;
  href: string;
};

type Dictionary = {
  nav: {
    areas: Record<AreaKey, string>;
    credits: string;
    languageName: string;
  };
  sidebar: {
    ariaNav: string;
    contentLabel: string;
    moreOptions: string;
    searchPlaceholder: string;
    collapse: string;
    expand: string;
    clearSearch: string;
    noResults: (query: string) => string;
    areaTitle: Record<AreaKey, string>;
  };
  toc: {
    glossary: string;
    videoLabel: string;
    watchOnYoutube: string;
    videoThumbAlt: string;
  };
  code: {
    copy: string;
    copied: string;
  };
  theme: {
    toggleTitle: string;
    toggleAria: string;
  };
  ptOnlyNotice: string;
  home: {
    eyebrow: string;
    title: string;
    tagline: string;
    imageAlt: string;
    sidebarTitle: string;
    navIntroduction: string;
    navIndexes: string;
    navSecurityControls: string;
    navRoadmap: string;
    navProjectLinks: string;
    bannerLabel: string;
    bannerStatus: string;
    bannerText: string;
    primaryCta: string;
    secondaryCta: string;
    purposeHeading: string;
    purposeBody: string;
    whyHeading: string;
    whyBodyBefore: string;
    whySecurityLink: string;
    whyBodyAfter: string;
    areasHeading: string;
    areasBody: string;
    cheatsheetsHeading: string;
    cheatsheetLinks: HomeSourceLink[];
    indexHeading: string;
    indexBody: string;
    controlsHeading: string;
    controlsBody: string;
    controlTableRisk: string;
    controlTableHtd: string;
    controlRows: HomeControlRow[];
    cards: Record<AreaKey, { title: string; status: string; description: string }>;
    statusReady: string;
    statusWip: string;
    roadmapEyebrow: string;
    roadmapHeading: string;
    roadmapIntro: string;
    roadmapSourceHeading: string;
    roadmapSourceBody: string;
    roadmapSourceLinks: HomeSourceLink[];
    roadmapTracks: HomeRoadmapTrack[];
    projectLinksHeading: string;
    projectLinks: HomeSourceLink[];
    onThisPageHeading: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      areas: {
        "padrao-frontend": "Frontend Standard",
        "padrao-api": "API Standard",
        "padrao-infraestrutura": "Infrastructure Standard",
        examples: "Examples",
      },
      credits: "Credits",
      languageName: "EN",
    },
    sidebar: {
      ariaNav: "Content navigation",
      contentLabel: "Content",
      moreOptions: "More options",
      searchPlaceholder: "Search by title",
      collapse: "Collapse",
      expand: "Expand",
      clearSearch: "Clear search",
      noResults: (query) => `No results for "${query}".`,
      areaTitle: {
        "padrao-frontend": "Developer content",
        "padrao-api": "API content",
        "padrao-infraestrutura": "Infrastructure content",
        examples: "Examples catalog",
      },
    },
    toc: {
      glossary: "Glossary",
      videoLabel: "Video walkthrough",
      watchOnYoutube: "Watch on YouTube ↗",
      videoThumbAlt: "Video walkthrough thumbnail",
    },
    code: {
      copy: "Copy",
      copied: "Copied!",
    },
    theme: {
      toggleTitle: "Toggle theme",
      toggleAria: "Toggle between light and dark mode",
    },
    ptOnlyNotice:
      "This page hasn't been translated to English yet — showing the original Portuguese content.",
    home: {
      eyebrow: "v1.0 · Frontend Standard available",
      title: "How to Dev",
      tagline:
        "A personal, security-first reference for structuring Next.js and Rails applications — documented with real code, real trade-offs, and nothing hidden. Current release: How to Dev v1.0.",
      imageAlt: "How to Dev dice logo",
      sidebarTitle: "How to Dev",
      navIntroduction: "Introduction",
      navIndexes: "Index HTD",
      navSecurityControls: "Security controls",
      navRoadmap: "Study roadmap",
      navProjectLinks: "Project links",
      bannerLabel: "HTD",
      bannerStatus: "v1.0 reference",
      bannerText: "frontend standard available",
      primaryCta: "Open Frontend Standard",
      secondaryCta: "See credits",
      purposeHeading: "Purpose",
      purposeBody:
        "This site documents, for real, the standards I use day to day to structure a project from scratch: folder organization, authentication, forms, tables, report exports, and — above all — security, always with the reasoning behind the decision, not just the \"how\". It isn't a product and there's no team behind it: it's a personal technical reference, published because documenting is the most honest way to check, later, whether a pattern still holds up.",
      whyHeading: "Why this exists",
      whyBodyBefore:
        "It started from a simple question: if a malicious actor got access to this documentation, would it help them attack a real system — or would it show them the system is already protected enough that it isn't worth trying? The",
      whySecurityLink: "Security",
      whyBodyAfter:
        "section, inside the Frontend Standard, was written with that exact bar: complete documentation, hiding no threshold, header, or authorization behavior. The only acceptable \"flaw\" is the system being too well protected.",
      areasHeading: "System areas",
      areasBody:
        "The content is organized as a reference index: start with the available Frontend Standard, then expand into API, infrastructure, and complete examples.",
      cheatsheetsHeading: "Cheatsheets",
      cheatsheetLinks: [
        { label: "Frontend overview", href: "/padrao-frontend" },
        { label: "Routing", href: "/padrao-frontend/roteamento" },
        { label: "Cache", href: "/padrao-frontend/cache" },
        { label: "Tables", href: "/padrao-frontend/tabelas" },
        { label: "Forms", href: "/padrao-frontend/formularios" },
        { label: "Files", href: "/padrao-frontend/arquivos" },
        { label: "Reports", href: "/padrao-frontend/relatorios" },
        { label: "Authentication", href: "/padrao-frontend/seguranca/autenticacao" },
        { label: "Authorization and IDOR", href: "/padrao-frontend/seguranca/idor-e-autorizacao" },
        { label: "HTTP Security Headers", href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http" },
        { label: "Cross Site Scripting", href: "/padrao-frontend/seguranca/xss" },
        { label: "Cross-Site Request Forgery", href: "/padrao-frontend/seguranca/csrf" },
        { label: "Content Security Policy", href: "/padrao-frontend/seguranca/csp" },
        { label: "JSON Web Token", href: "/padrao-frontend/seguranca/jwt" },
        { label: "PDF Security", href: "/padrao-frontend/seguranca/seguranca-pdf" },
        { label: "Audit Logs", href: "/padrao-frontend/seguranca/logs-de-auditoria" },
        { label: "Next.js", href: "/padrao-frontend/tecnologias/nextjs" },
        { label: "Zod", href: "/padrao-frontend/tecnologias/zod" },
        { label: "TanStack Query", href: "/padrao-frontend/tecnologias/react-query" },
        { label: "Tailwind", href: "/padrao-frontend/tecnologias/tailwind" },
      ],
      indexHeading: "HTD indexes",
      indexBody:
        "Use these entry points to jump straight to a subject: pick a topic, open the reference page, then read the implementation notes and checklist.",
      controlsHeading: "Security coverage map",
      controlsBody:
        "A quick way to go from a risk category to the HTD page that actually implements the control — this table reflects HTD's own content, not an external checklist.",
      controlTableRisk: "Risk or control",
      controlTableHtd: "HTD reference",
      controlRows: [
        {
          risk: "Access control and IDOR",
          htd: "IDOR and authorization",
          href: "/padrao-frontend/seguranca/idor-e-autorizacao",
        },
        {
          risk: "XSS and unsafe input",
          htd: "XSS and input sanitization",
          href: "/padrao-frontend/seguranca/xss",
        },
        {
          risk: "Authentication and token lifecycle",
          htd: "Authentication and JWT",
          href: "/padrao-frontend/seguranca/jwt",
        },
        {
          risk: "Browser hardening",
          htd: "HTTP headers and CSP",
          href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http",
        },
        {
          risk: "Export and generated file abuse",
          htd: "PDF and export security",
          href: "/padrao-frontend/seguranca/seguranca-exportacao",
        },
        {
          risk: "Monitoring and audit trail",
          htd: "Audit logs",
          href: "/padrao-frontend/seguranca/logs-de-auditoria",
        },
      ],
      cards: {
        "padrao-frontend": {
          title: "Frontend Standard",
          status: "Available",
          description:
            "Folder structure, authentication, forms, tables, reports, and a full security section — every technology with its reasoning, version, and code example.",
        },
        "padrao-api": {
          title: "API Standard",
          status: "In progress",
          description: "HTTP contract, authentication, pagination, error envelope, and versioning.",
        },
        "padrao-infraestrutura": {
          title: "Infrastructure Standard",
          status: "In progress",
          description: "Environments, deployment, variables, logs, and monitoring.",
        },
        examples: {
          title: "Examples",
          status: "In progress",
          description: "Complete flow catalog: authenticated CRUD, filterable table, form with validation.",
        },
      },
      statusReady: "Available",
      statusWip: "In progress",
      roadmapEyebrow: "Learning map",
      roadmapHeading: "Study roadmap",
      roadmapIntro:
        "Goes from the basics to the more advanced parts of the standard, in the order I'd actually recommend reading them — each step links straight into the real Frontend Standard content that exists today.",
      roadmapSourceHeading: "About the format",
      roadmapSourceBody:
        "The searchable index and cheat-sheet-style layout are a UX pattern borrowed from the OWASP Cheat Sheet Series — not a content source. Every page on HTD is original, written from my own experience; OWASP is linked below only for readers who want the real thing.",
      roadmapSourceLinks: [
        {
          label: "OWASP Cheat Sheet Series ↗",
          href: "https://cheatsheetseries.owasp.org/",
        },
      ],
      roadmapTracks: [
        {
          step: "01",
          title: "Foundation",
          status: "Available",
          href: "/padrao-frontend",
          description: "Start here: what the standard is for, and how the App Router shapes routes and folders.",
          items: [
            "Overview and project structure",
            "Routing — App Router, folders, private/public routes",
          ],
        },
        {
          step: "02",
          title: "Core web concepts",
          status: "Available",
          href: "/padrao-frontend/conceitos-tecnicos",
          description: "The fundamentals every other page assumes: how rendering, caching, and the browser actually behave.",
          items: [
            "SSR, hydration, and code-splitting",
            "CORS, BFF, and state management",
            "Accessibility and progressive enhancement",
          ],
        },
        {
          step: "03",
          title: "Building the UI",
          status: "Available",
          href: "/padrao-frontend/componentes",
          description: "Turn concepts into screen: reusable components and the styling decisions behind them.",
          items: [
            "Buttons, search, filters, and typed props",
            "Modals, select, pagination, and typography",
          ],
        },
        {
          step: "04",
          title: "Data and forms",
          status: "Available",
          href: "/padrao-frontend/formularios",
          description: "How data actually moves: forms, validation, caching, and the request/response lifecycle.",
          items: [
            "Forms with React Hook Form + Zod",
            "Cache, mutations, and query responses (TanStack Query)",
            "File uploads/downloads and PDF/Excel reports",
          ],
        },
        {
          step: "05",
          title: "Security checklist",
          status: "Available",
          href: "/padrao-frontend/seguranca",
          description: "Security as implementation work, not a final review — the most detailed section on HTD.",
          items: [
            "XSS, CSRF, JWT, IDOR, and RBAC",
            "HTTP headers, CSP, and cookie handling",
            "Password policy, brute force, and audit logs",
          ],
        },
        {
          step: "06",
          title: "API, infrastructure, examples",
          status: "In progress",
          href: "/examples",
          description: "The parts that expand the same standard beyond the frontend — not written yet.",
          items: [
            "API Standard — HTTP contract, pagination, versioning",
            "Infrastructure Standard — environments, deploy, observability",
            "Examples — complete reference flows",
          ],
        },
      ],
      projectLinksHeading: "Project links",
      projectLinks: [
        { label: "Credits", href: "/creditos" },
        { label: "Frontend Standard", href: "/padrao-frontend" },
        { label: "Security checklist", href: "/padrao-frontend/seguranca" },
        { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/" },
        { label: "OWASP Top 10 index", href: "https://cheatsheetseries.owasp.org/IndexTopTen.html" },
      ],
      onThisPageHeading: "On this page",
    },
  },
  pt: {
    nav: {
      areas: {
        "padrao-frontend": "Padrão Frontend",
        "padrao-api": "Padrão API",
        "padrao-infraestrutura": "Padrão Infraestrutura",
        examples: "Exemplos",
      },
      credits: "Créditos",
      languageName: "PT-BR",
    },
    sidebar: {
      ariaNav: "Navegação de conteúdo",
      contentLabel: "Conteúdo",
      moreOptions: "Mais opções",
      searchPlaceholder: "Pesquisar por título",
      collapse: "Recolher",
      expand: "Expandir",
      clearSearch: "Limpar busca",
      noResults: (query) => `Nenhum resultado para "${query}".`,
      areaTitle: {
        "padrao-frontend": "Conteúdo do desenvolvedor",
        "padrao-api": "Conteúdo da API",
        "padrao-infraestrutura": "Conteúdo da Infraestrutura",
        examples: "Catálogo de exemplos",
      },
    },
    toc: {
      glossary: "Glossário",
      videoLabel: "Vídeo explicativo",
      watchOnYoutube: "Assista no YouTube ↗",
      videoThumbAlt: "Miniatura do vídeo explicativo",
    },
    code: {
      copy: "Copiar",
      copied: "Copiado!",
    },
    theme: {
      toggleTitle: "Alternar tema",
      toggleAria: "Alternar entre modo claro e escuro",
    },
    ptOnlyNotice: "",
    home: {
      eyebrow: "v1.0 · Padrão Frontend disponível",
      title: "How to Dev",
      tagline:
        "Referência pessoal e security-first para estruturar aplicações Next.js e Rails — documentada com código real, decisões reais e nada escondido. Versão atual: How to Dev v1.0.",
      imageAlt: "Logo How to Dev com dados",
      sidebarTitle: "How to Dev",
      navIntroduction: "Introdução",
      navIndexes: "Índice HTD",
      navSecurityControls: "Controles de segurança",
      navRoadmap: "Roadmap de estudo",
      navProjectLinks: "Links do projeto",
      bannerLabel: "HTD",
      bannerStatus: "referência v1.0",
      bannerText: "padrão frontend disponível",
      primaryCta: "Abrir Padrão Frontend",
      secondaryCta: "Ver créditos",
      purposeHeading: "Propósito",
      purposeBody:
        "Este site documenta, de verdade, os padrões de estruturação que uso no dia a dia: organização de pastas, autenticação, formulário, tabela, exportação de relatório e, principalmente, segurança — sempre com o porquê da decisão, não só o \"como fazer\". Não é um produto nem tem equipe por trás: é referência técnica pessoal, publicada porque documentar é a forma mais honesta de revisar, depois, se um padrão ainda faz sentido.",
      whyHeading: "Por que existe",
      whyBodyBefore:
        "Nasceu de uma pergunta simples: se alguém mal-intencionado tivesse acesso a essa documentação, ela ajudaria a atacar um sistema real — ou mostraria que o sistema já é protegido o bastante pra não valer a pena tentar? A seção de",
      whySecurityLink: "Segurança",
      whyBodyAfter:
        ", dentro do Padrão Frontend, foi escrita com essa régua: documentação completa, sem esconder threshold, header ou comportamento de autorização. A única \"falha\" aceitável é o sistema estar protegido demais.",
      areasHeading: "Áreas do sistema",
      areasBody:
        "O conteúdo fica organizado como um índice de referência: começa pelo Padrão Frontend disponível e evolui para API, infraestrutura e exemplos completos.",
      cheatsheetsHeading: "Cheatsheets",
      cheatsheetLinks: [
        { label: "Visão geral do frontend", href: "/padrao-frontend" },
        { label: "Roteamento", href: "/padrao-frontend/roteamento" },
        { label: "Cache", href: "/padrao-frontend/cache" },
        { label: "Tabelas", href: "/padrao-frontend/tabelas" },
        { label: "Formulários", href: "/padrao-frontend/formularios" },
        { label: "Arquivos", href: "/padrao-frontend/arquivos" },
        { label: "Relatórios", href: "/padrao-frontend/relatorios" },
        { label: "Autenticação", href: "/padrao-frontend/seguranca/autenticacao" },
        { label: "Autorização e IDOR", href: "/padrao-frontend/seguranca/idor-e-autorizacao" },
        { label: "Headers de segurança HTTP", href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http" },
        { label: "Cross Site Scripting", href: "/padrao-frontend/seguranca/xss" },
        { label: "Cross-Site Request Forgery", href: "/padrao-frontend/seguranca/csrf" },
        { label: "Content Security Policy", href: "/padrao-frontend/seguranca/csp" },
        { label: "JSON Web Token", href: "/padrao-frontend/seguranca/jwt" },
        { label: "Segurança em PDF", href: "/padrao-frontend/seguranca/seguranca-pdf" },
        { label: "Logs de auditoria", href: "/padrao-frontend/seguranca/logs-de-auditoria" },
        { label: "Next.js", href: "/padrao-frontend/tecnologias/nextjs" },
        { label: "Zod", href: "/padrao-frontend/tecnologias/zod" },
        { label: "TanStack Query", href: "/padrao-frontend/tecnologias/react-query" },
        { label: "Tailwind", href: "/padrao-frontend/tecnologias/tailwind" },
      ],
      indexHeading: "Índices HTD",
      indexBody:
        "Use estes pontos de entrada pra ir direto ao assunto: escolha o tema, abra a página de referência e leia as notas de implementação e o checklist.",
      controlsHeading: "Mapa de cobertura de segurança",
      controlsBody:
        "Um jeito rápido de sair da categoria de risco e cair direto na página HTD que implementa o controle — esta tabela reflete o conteúdo do próprio HTD, não um checklist externo.",
      controlTableRisk: "Risco ou controle",
      controlTableHtd: "Referência HTD",
      controlRows: [
        {
          risk: "Controle de acesso e IDOR",
          htd: "IDOR e autorização",
          href: "/padrao-frontend/seguranca/idor-e-autorizacao",
        },
        {
          risk: "XSS e input inseguro",
          htd: "XSS e sanitização de inputs",
          href: "/padrao-frontend/seguranca/xss",
        },
        {
          risk: "Autenticação e ciclo de vida do token",
          htd: "Autenticação e JWT",
          href: "/padrao-frontend/seguranca/jwt",
        },
        {
          risk: "Hardening do navegador",
          htd: "Headers HTTP e CSP",
          href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http",
        },
        {
          risk: "Abuso em exportação e arquivo gerado",
          htd: "Segurança em PDF e exportação",
          href: "/padrao-frontend/seguranca/seguranca-exportacao",
        },
        {
          risk: "Monitoramento e trilha de auditoria",
          htd: "Logs de auditoria",
          href: "/padrao-frontend/seguranca/logs-de-auditoria",
        },
      ],
      cards: {
        "padrao-frontend": {
          title: "Padrão Frontend",
          status: "Disponível",
          description:
            "Estrutura de pastas, autenticação, formulários, tabelas, relatórios e uma seção inteira de segurança — cada tecnologia com motivo da escolha, versão e exemplo de código.",
        },
        "padrao-api": {
          title: "Padrão API",
          status: "Em construção",
          description: "Contrato HTTP, autenticação, paginação, envelope de erro e versionamento.",
        },
        "padrao-infraestrutura": {
          title: "Padrão Infraestrutura",
          status: "Em construção",
          description: "Ambientes, deploy, variáveis, logs e monitoramento.",
        },
        examples: {
          title: "Exemplos",
          status: "Em construção",
          description: "Catálogo de fluxos completos: CRUD autenticado, tabela com filtro, formulário com validação.",
        },
      },
      statusReady: "Disponível",
      statusWip: "Em construção",
      roadmapEyebrow: "Mapa de aprendizado",
      roadmapHeading: "Roadmap de estudo",
      roadmapIntro:
        "Vai do básico até as partes mais avançadas do padrão, na ordem que eu de fato recomendaria ler — cada etapa linka direto pro conteúdo real do Padrão Frontend que já existe hoje.",
      roadmapSourceHeading: "Sobre o formato",
      roadmapSourceBody:
        "O índice pesquisável e o layout estilo cheat sheet são um padrão de UX emprestado da OWASP Cheat Sheet Series — não uma fonte de conteúdo. Toda página do HTD é original, escrita a partir da minha própria experiência; a OWASP fica linkada abaixo só pra quem quiser ler a fonte de verdade.",
      roadmapSourceLinks: [
        {
          label: "OWASP Cheat Sheet Series ↗",
          href: "https://cheatsheetseries.owasp.org/",
        },
      ],
      roadmapTracks: [
        {
          step: "01",
          title: "Fundação",
          status: "Disponível",
          href: "/padrao-frontend",
          description: "Comece por aqui: pra que serve o padrão e como o App Router organiza rotas e pastas.",
          items: [
            "Visão geral e estrutura do projeto",
            "Roteamento — App Router, pastas, rotas privadas/públicas",
          ],
        },
        {
          step: "02",
          title: "Conceitos técnicos essenciais",
          status: "Disponível",
          href: "/padrao-frontend/conceitos-tecnicos",
          description: "Os fundamentos que toda outra página assume: como renderização, cache e o navegador se comportam de verdade.",
          items: [
            "SSR, hidratação e code-splitting",
            "CORS, BFF e gerenciamento de estado",
            "Acessibilidade e progressive enhancement",
          ],
        },
        {
          step: "03",
          title: "Construindo a UI",
          status: "Disponível",
          href: "/padrao-frontend/componentes",
          description: "Transforma conceito em tela: componentes reutilizáveis e as decisões de estilo por trás deles.",
          items: [
            "Botões, busca, filtros e props tipadas",
            "Modal, select, paginação e tipografia",
          ],
        },
        {
          step: "04",
          title: "Dados e formulários",
          status: "Disponível",
          href: "/padrao-frontend/formularios",
          description: "Como o dado se move de verdade: formulário, validação, cache e o ciclo de requisição/resposta.",
          items: [
            "Formulários com React Hook Form + Zod",
            "Cache, mutações e resposta de consulta (TanStack Query)",
            "Upload/download de arquivo e relatórios em PDF/Excel",
          ],
        },
        {
          step: "05",
          title: "Checklist de segurança",
          status: "Disponível",
          href: "/padrao-frontend/seguranca",
          description: "Segurança como trabalho de implementação, não como revisão final — a seção mais detalhada do HTD.",
          items: [
            "XSS, CSRF, JWT, IDOR e RBAC",
            "Headers HTTP, CSP e tratamento de cookie",
            "Política de senha, força bruta e logs de auditoria",
          ],
        },
        {
          step: "06",
          title: "API, infraestrutura, exemplos",
          status: "Em construção",
          href: "/examples",
          description: "As partes que expandem o mesmo padrão pra além do frontend — ainda não escritas.",
          items: [
            "Padrão API — contrato HTTP, paginação, versionamento",
            "Padrão Infraestrutura — ambientes, deploy, observabilidade",
            "Exemplos — fluxos completos de referência",
          ],
        },
      ],
      projectLinksHeading: "Links do projeto",
      projectLinks: [
        { label: "Créditos", href: "/creditos" },
        { label: "Padrão Frontend", href: "/padrao-frontend" },
        { label: "Checklist de segurança", href: "/padrao-frontend/seguranca" },
        { label: "OWASP Cheat Sheet Series", href: "https://cheatsheetseries.owasp.org/" },
        { label: "Índice OWASP Top 10", href: "https://cheatsheetseries.owasp.org/IndexTopTen.html" },
      ],
      onThisPageHeading: "Nesta página",
    },
  },
};
