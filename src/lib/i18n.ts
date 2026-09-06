export type Locale = "en" | "pt";

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "htd-locale";

export type AreaKey =
  | "padrao-frontend"
  | "padrao-api"
  | "padrao-banco-de-dados"
  | "padrao-infraestrutura"
  | "examples";

type HomeSourceLink = {
  label: string;
  href: string;
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
    docsMenu: string;
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
  search: {
    buttonLabel: string;
    placeholder: string;
    noResults: (query: string) => string;
    shortcutHint: string;
  };
  ptOnlyNotice: string;
  home: {
    eyebrow: string;
    title: string;
    tagline: string;
    bannerText: string;
    primaryCta: string;
    secondaryCta: string;
    purposeHeading: string;
    purposeBody: string;
    whyHeading: string;
    whyBodyBefore: string;
    whySecurityLink: string;
    whyBodyAfter: string;
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
    projectLinksHeading: string;
    projectLinks: HomeSourceLink[];
    aboutHeading: string;
    aboutBody: string;
    aboutImageAlt: string;
    aboutGithubLabel: string;
  };
};

export const dictionaries: Record<Locale, Dictionary> = {
  en: {
    nav: {
      areas: {
        "padrao-frontend": "Frontend Standard",
        "padrao-api": "API Standard",
        "padrao-banco-de-dados": "Database Standard",
        "padrao-infraestrutura": "Infrastructure Standard",
        examples: "Examples",
      },
      credits: "Credits",
      languageName: "EN",
      docsMenu: "Documentation",
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
        "padrao-banco-de-dados": "Database content",
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
    search: {
      buttonLabel: "Search...",
      placeholder: "Search pages and sections...",
      noResults: (query) => `No results for "${query}".`,
      shortcutHint: "⌘K",
    },
    ptOnlyNotice:
      "This page hasn't been translated to English yet — showing the original Portuguese content.",
    home: {
      eyebrow: "v1.0 · Frontend Standard available",
      title: "How to Dev",
      tagline:
        "A personal, security-first reference for structuring Next.js and Rails applications — documented with real code, real trade-offs, and nothing hidden. Current release: How to Dev v1.0.",
      bannerText: "Frontend Standard available",
      primaryCta: "Start learning free",
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
          description: "HTTP contract, authentication, pagination, error envelope, and versioning — based on a real Rails API.",
        },
        "padrao-banco-de-dados": {
          title: "Database Standard",
          status: "In progress",
          description: "Schema conventions, migrations, multi-tenancy, soft delete, and audit trail.",
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
        "Goes from the basics to the more advanced parts of the standard, in the order I'd actually recommend reading them — each step links straight into a real, hands-on lesson.",
      projectLinksHeading: "Project links",
      projectLinks: [
        { label: "Credits", href: "/creditos" },
        { label: "Frontend Standard", href: "/padrao-frontend" },
        { label: "Security checklist", href: "/padrao-frontend/seguranca" },
        { label: "OWASP Cheat Sheet Series ↗", href: "https://cheatsheetseries.owasp.org/" },
        { label: "MDN Web Docs ↗", href: "https://developer.mozilla.org/" },
        { label: "Red Hat Developer ↗", href: "https://developers.redhat.com/" },
        { label: "Stripe — Idempotent Requests ↗", href: "https://stripe.com/docs/api/idempotent_requests" },
      ],
      aboutHeading: "About me",
      aboutBody:
        "I'm Juan Kalleo, a Staff Fullstack Software Engineer on NextTech's frontend team, based in Porto Velho, Brazil. Secure software development is the focus that runs through most of what I build — HTD is where that focus turns into documentation, written the way I wish more of it was.",
      aboutImageAlt: "Photo of Juan Kalleo",
      aboutGithubLabel: "GitHub ↗",
    },
  },
  pt: {
    nav: {
      areas: {
        "padrao-frontend": "Padrão Frontend",
        "padrao-api": "Padrão API",
        "padrao-banco-de-dados": "Padrão Banco de Dados",
        "padrao-infraestrutura": "Padrão Infraestrutura",
        examples: "Exemplos",
      },
      credits: "Créditos",
      languageName: "PT-BR",
      docsMenu: "Documentação",
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
        "padrao-banco-de-dados": "Conteúdo de banco de dados",
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
    search: {
      buttonLabel: "Buscar...",
      placeholder: "Buscar páginas e seções...",
      noResults: (query) => `Nenhum resultado para "${query}".`,
      shortcutHint: "⌘K",
    },
    ptOnlyNotice: "",
    home: {
      eyebrow: "v1.0 · Padrão Frontend disponível",
      title: "How to Dev",
      tagline:
        "Referência pessoal e security-first para estruturar aplicações Next.js e Rails — documentada com código real, decisões reais e nada escondido. Versão atual: How to Dev v1.0.",
      bannerText: "Padrão Frontend disponível",
      primaryCta: "Comece a aprender grátis",
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
          description: "Contrato HTTP, autenticação, paginação, envelope de erro e versionamento — baseado numa API Rails real.",
        },
        "padrao-banco-de-dados": {
          title: "Padrão Banco de Dados",
          status: "Em construção",
          description: "Convenção de schema, migrations, multi-tenancy, soft delete e trilha de auditoria.",
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
        "Vai do básico até as partes mais avançadas, na ordem que eu de fato recomendaria estudar — cada etapa linka direto pra uma lição prática, de verdade, não só um texto.",
      projectLinksHeading: "Links do projeto",
      projectLinks: [
        { label: "Créditos", href: "/creditos" },
        { label: "Padrão Frontend", href: "/padrao-frontend" },
        { label: "Checklist de segurança", href: "/padrao-frontend/seguranca" },
        { label: "OWASP Cheat Sheet Series ↗", href: "https://cheatsheetseries.owasp.org/" },
        { label: "MDN Web Docs ↗", href: "https://developer.mozilla.org/" },
        { label: "Red Hat Developer ↗", href: "https://developers.redhat.com/" },
        { label: "Stripe — Idempotent Requests ↗", href: "https://stripe.com/docs/api/idempotent_requests" },
      ],
      aboutHeading: "Sobre mim",
      aboutBody:
        "Sou o Juan Kalleo, Staff Fullstack Software Engineer no time de frontend da NextTech, baseado em Porto Velho, Brasil. Desenvolvimento seguro de software é o foco que atravessa a maior parte do que eu construo — o HTD é onde esse foco vira documentação, escrita do jeito que eu gostaria que mais gente escrevesse.",
      aboutImageAlt: "Foto de Juan Kalleo",
      aboutGithubLabel: "GitHub ↗",
    },
  },
};
