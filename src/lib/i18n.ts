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
  source: string;
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
    controlTableSource: string;
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
        "Use these entry points like the OWASP indexes: choose a subject, open the reference page, then jump into the implementation notes and checklist.",
      controlsHeading: "Security control mapping",
      controlsBody:
        "The security section is mapped to practical implementation areas so the reader can move from risk category to the HTD page that explains the control.",
      controlTableRisk: "Risk or control",
      controlTableHtd: "HTD reference",
      controlTableSource: "Reference model",
      controlRows: [
        {
          risk: "Access control and IDOR",
          htd: "IDOR and authorization",
          href: "/padrao-frontend/seguranca/idor-e-autorizacao",
          source: "OWASP Top 10 A01",
        },
        {
          risk: "XSS and unsafe input",
          htd: "XSS and input sanitization",
          href: "/padrao-frontend/seguranca/xss",
          source: "OWASP injection guidance",
        },
        {
          risk: "Authentication and token lifecycle",
          htd: "Authentication and JWT",
          href: "/padrao-frontend/seguranca/jwt",
          source: "OWASP authentication/JWT cheat sheets",
        },
        {
          risk: "Browser hardening",
          htd: "HTTP headers and CSP",
          href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http",
          source: "OWASP proactive controls",
        },
        {
          risk: "Export and generated file abuse",
          htd: "PDF and export security",
          href: "/padrao-frontend/seguranca/seguranca-exportacao",
          source: "HTD implementation checklist",
        },
        {
          risk: "Monitoring and audit trail",
          htd: "Audit logs",
          href: "/padrao-frontend/seguranca/logs-de-auditoria",
          source: "OWASP logging guidance",
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
        "The roadmap follows the same useful pattern as the OWASP Cheat Sheet Series: searchable subjects, direct links, and practical checks grouped by risk and implementation area.",
      roadmapSourceHeading: "OWASP reference model",
      roadmapSourceBody:
        "Inspired by the Cheat Sheet index, Top 10 mapping, and Proactive Controls model: learn the topic, see the risk, apply the checklist.",
      roadmapSourceLinks: [
        {
          label: "Cheat Sheet Series ↗",
          href: "https://cheatsheetseries.owasp.org/",
        },
        {
          label: "Top 10 index ↗",
          href: "https://cheatsheetseries.owasp.org/IndexTopTen.html",
        },
        {
          label: "Proactive Controls ↗",
          href: "https://cheatsheetseries.owasp.org/IndexProactiveControls.html",
        },
      ],
      roadmapTracks: [
        {
          step: "01",
          title: "Project foundation",
          status: "Available",
          href: "/padrao-frontend",
          description:
            "Start with the application shape before adding features: routes, folders, boundaries, and conventions.",
          items: [
            "App Router and route ownership",
            "Folder structure and shared UI",
            "Layout, components, files, and reports",
          ],
        },
        {
          step: "02",
          title: "Application workflow",
          status: "Available",
          href: "/padrao-frontend/formularios",
          description:
            "Move through the daily building blocks that turn the standard into an actual system screen.",
          items: [
            "Forms with validation",
            "Tables, filters, and data loading",
            "Exports and user-facing flows",
          ],
        },
        {
          step: "03",
          title: "Security checklist",
          status: "Available",
          href: "/padrao-frontend/seguranca",
          description:
            "Treat security as implementation work, not a final review: authorization, headers, session behavior, and abuse cases.",
          items: [
            "XSS, CSRF, JWT, and IDOR controls",
            "RBAC, password policy, and session rules",
            "HTTP headers and frontend exposure limits",
          ],
        },
        {
          step: "04",
          title: "API, infra, examples",
          status: "In progress",
          href: "/examples",
          description:
            "Expand the same standard into the backend contract, runtime environment, and complete reference flows.",
          items: [
            "HTTP contract and pagination",
            "Deploy, variables, logs, and monitoring",
            "Complete CRUD and report examples",
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
        "Use estes pontos de entrada como os índices da OWASP: escolha o assunto, abra a página de referência e avance para as notas de implementação e checklist.",
      controlsHeading: "Mapeamento de controles de segurança",
      controlsBody:
        "A seção de segurança fica ligada a áreas práticas de implementação para o leitor sair da categoria de risco e cair direto na página HTD que explica o controle.",
      controlTableRisk: "Risco ou controle",
      controlTableHtd: "Referência HTD",
      controlTableSource: "Modelo de referência",
      controlRows: [
        {
          risk: "Controle de acesso e IDOR",
          htd: "IDOR e autorização",
          href: "/padrao-frontend/seguranca/idor-e-autorizacao",
          source: "OWASP Top 10 A01",
        },
        {
          risk: "XSS e input inseguro",
          htd: "XSS e sanitização de inputs",
          href: "/padrao-frontend/seguranca/xss",
          source: "Guia OWASP de injection",
        },
        {
          risk: "Autenticação e ciclo de vida do token",
          htd: "Autenticação e JWT",
          href: "/padrao-frontend/seguranca/jwt",
          source: "Cheat sheets OWASP de autenticação/JWT",
        },
        {
          risk: "Hardening do navegador",
          htd: "Headers HTTP e CSP",
          href: "/padrao-frontend/seguranca/cabecalhos-de-seguranca-http",
          source: "OWASP Proactive Controls",
        },
        {
          risk: "Abuso em exportação e arquivo gerado",
          htd: "Segurança em PDF e exportação",
          href: "/padrao-frontend/seguranca/seguranca-exportacao",
          source: "Checklist de implementação HTD",
        },
        {
          risk: "Monitoramento e trilha de auditoria",
          htd: "Logs de auditoria",
          href: "/padrao-frontend/seguranca/logs-de-auditoria",
          source: "Guia OWASP de logging",
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
        "O roadmap segue a lógica útil da OWASP Cheat Sheet Series: assuntos pesquisáveis, links diretos e checks práticos organizados por risco e área de implementação.",
      roadmapSourceHeading: "Modelo de referência OWASP",
      roadmapSourceBody:
        "Inspirado no índice das Cheat Sheets, no mapeamento do Top 10 e no modelo de Proactive Controls: entender o tema, enxergar o risco e aplicar o checklist.",
      roadmapSourceLinks: [
        {
          label: "Cheat Sheet Series ↗",
          href: "https://cheatsheetseries.owasp.org/",
        },
        {
          label: "Índice Top 10 ↗",
          href: "https://cheatsheetseries.owasp.org/IndexTopTen.html",
        },
        {
          label: "Proactive Controls ↗",
          href: "https://cheatsheetseries.owasp.org/IndexProactiveControls.html",
        },
      ],
      roadmapTracks: [
        {
          step: "01",
          title: "Base do projeto",
          status: "Disponível",
          href: "/padrao-frontend",
          description:
            "Começa pela forma da aplicação antes das features: rotas, pastas, limites e convenções.",
          items: [
            "App Router e dono das rotas",
            "Estrutura de pastas e UI compartilhada",
            "Layout, componentes, arquivos e relatórios",
          ],
        },
        {
          step: "02",
          title: "Fluxo da aplicação",
          status: "Disponível",
          href: "/padrao-frontend/formularios",
          description:
            "Passa pelos blocos diários que transformam o padrão em tela real de sistema.",
          items: [
            "Formulários com validação",
            "Tabelas, filtros e carregamento de dados",
            "Exportações e fluxos para o usuário",
          ],
        },
        {
          step: "03",
          title: "Checklist de segurança",
          status: "Disponível",
          href: "/padrao-frontend/seguranca",
          description:
            "Trata segurança como implementação, não como revisão final: autorização, headers, sessão e casos de abuso.",
          items: [
            "Controles de XSS, CSRF, JWT e IDOR",
            "RBAC, política de senha e regras de sessão",
            "Headers HTTP e limites de exposição no frontend",
          ],
        },
        {
          step: "04",
          title: "API, infra e exemplos",
          status: "Em construção",
          href: "/examples",
          description:
            "Expande o mesmo padrão para contrato de backend, ambiente de execução e fluxos completos de referência.",
          items: [
            "Contrato HTTP e paginação",
            "Deploy, variáveis, logs e monitoramento",
            "CRUD completo e exemplos de relatório",
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
