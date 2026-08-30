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
    },
  },
};
