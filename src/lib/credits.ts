import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

type CreditLink = {
  name: string;
  url: string;
};

type BookCredit = CreditLink & {
  authors: string;
  publisher: string;
  year: string;
};

export type ExternalSourceCredit = CreditLink & {
  domain: string;
  references: number;
};

const DOC_ROOTS = [
  path.join(process.cwd(), "docs-frontend"),
  path.join(process.cwd(), "docs-api"),
  path.join(process.cwd(), "docs-infraestrutura"),
  path.join(process.cwd(), "docs-examples"),
];

const IGNORED_EXTERNAL_HOSTS = new Set([
  "covers.openlibrary.org",
  "img.youtube.com",
  "youtu.be",
  "youtube.com",
  "www.youtube.com",
]);

const SOURCE_NAMES: Record<string, string> = {
  "abseil.io": "Abseil / Google",
  "api.rubyonrails.org": "Ruby on Rails",
  "blog.logrocket.com": "LogRocket",
  "blog.openreplay.com": "OpenReplay",
  "cerbos.dev": "Cerbos",
  "cheatsheetseries.owasp.org": "OWASP Cheat Sheet Series",
  "cwe.mitre.org": "MITRE CWE",
  "cva.style": "Class Variance Authority",
  "daisyui.com": "DaisyUI",
  "dataintensive.net": "Designing Data-Intensive Applications",
  "debugbear.com": "DebugBear",
  "dev.to": "DEV Community",
  "ddnexus.github.io": "Pagy",
  "developer.mozilla.org": "MDN Web Docs",
  "distributed-systems.net": "Distributed Systems",
  "echarts.apache.org": "Apache ECharts",
  "github.com": "GitHub",
  "hpbn.co": "High Performance Browser Networking",
  "ibm.com": "IBM",
  "lucide.dev": "Lucide",
  "mui.com": "MUI",
  "nextjs.org": "Next.js",
  "oreilly.com": "O'Reilly",
  "owasp.org": "OWASP",
  "pptr.dev": "Puppeteer",
  "react-hook-form.com": "React Hook Form",
  "refactoring.com": "Refactoring",
  "stripe.com": "Stripe",
  "sweetalert2.github.io": "SweetAlert2",
  "swyx.io": "swyx",
  "tailwindcss.com": "Tailwind CSS",
  "tanstack.com": "TanStack",
  "tkdodo.eu": "TkDodo",
  "totaltypescript.com": "Total TypeScript",
  "vercel.com": "Vercel",
  "vitest.dev": "Vitest",
  "zod.dev": "Zod",
};

export const VIDEO_CHANNEL_CREDITS: CreditLink[] = [
  { name: "Alvaro Souza", url: "https://www.youtube.com/@AlvaroSouzadesign" },
  { name: "Andrew Hoffman", url: "https://www.youtube.com/@and1hof" },
  { name: "Angular - DEVs", url: "https://www.youtube.com/@Angular-Devs" },
  { name: "Ariel Weinberger", url: "https://www.youtube.com/@codinglyio" },
  { name: "Artur Ceschin", url: "https://www.youtube.com/@arturceschin3706" },
  { name: "Attekita Dev", url: "https://www.youtube.com/@attekitadev" },
  { name: "Austin Davis", url: "https://www.youtube.com/@AustinDavisTech" },
  { name: "Ben-Hur Ott", url: "https://www.youtube.com/@benhurott" },
  { name: "Bluegrass Digital", url: "https://www.youtube.com/@Bluegrassagency" },
  { name: "BrazilJS", url: "https://www.youtube.com/@BrazilJS" },
  { name: "ByteByteGo", url: "https://www.youtube.com/@ByteByteGo" },
  { name: "ByteGrad", url: "https://www.youtube.com/@ByteGrad" },
  { name: "Caverna do Front", url: "https://www.youtube.com/@CavernadoFront" },
  { name: "CBT Nuggets", url: "https://www.youtube.com/@cbtnuggets" },
  { name: "Clube Full-Stack", url: "https://www.youtube.com/@AlexandreCardoso" },
  { name: "Codante - Evolua no front-end", url: "https://www.youtube.com/@codante-io" },
  { name: "Code Bless You", url: "https://www.youtube.com/@CodeBlessYou" },
  { name: "Code Ryan", url: "https://www.youtube.com/@coderyan" },
  { name: "CodeSnaps", url: "https://www.youtube.com/@CodeSnaps" },
  { name: "Código Fonte TV", url: "https://www.youtube.com/@codigofontetv" },
  { name: "Coding Addict", url: "https://www.youtube.com/@CodingAddict" },
  { name: "Coding in Public", url: "https://www.youtube.com/@CodinginPublic" },
  { name: "Coding With Adam", url: "https://www.youtube.com/@CodingWithAdam" },
  { name: "Coffstack", url: "https://www.youtube.com/@Coffstack" },
  { name: "Cosden Solutions", url: "https://www.youtube.com/@cosdensolutions" },
  { name: "Curso em Vídeo", url: "https://www.youtube.com/@cursoemvideo" },
  { name: "Dan Shykhov", url: "https://www.youtube.com/@dan.shykhov" },
  { name: "Dave Gray", url: "https://www.youtube.com/@DaveGrayTeachesCode" },
  { name: "Decola WP", url: "https://www.youtube.com/@decolawp" },
  { name: "Deeecode", url: "https://www.youtube.com/@deeecode" },
  { name: "Dev Jr", url: "https://www.youtube.com/@devjr6706" },
  { name: "Dev Junior Alves", url: "https://www.youtube.com/@devjunioralves" },
  { name: "Dev Leonardo", url: "https://www.youtube.com/@DevLeonardo" },
  { name: "Dev. Odair Michael", url: "https://www.youtube.com/@devodair" },
  { name: "devbyshat", url: "https://www.youtube.com/@devbyshat" },
  { name: "DevelopSec", url: "https://www.youtube.com/@therealdevelopsec" },
  { name: "DevPleno", url: "https://www.youtube.com/@DevPleno" },
  { name: "Dias de Dev", url: "https://www.youtube.com/@DiasDeDev" },
  { name: "Dicionário de Informática", url: "https://www.youtube.com/@dicionariodeinformatica5370" },
  { name: "Efraim Moreira", url: "https://www.youtube.com/@efraimmoreira-1" },
  { name: "Entre Chaves - Seu podcast de desenvolvimento", url: "https://www.youtube.com/@entrechaves.podcast" },
  { name: "Erik Wilde", url: "https://www.youtube.com/@ErikWilde" },
  { name: "FahadCodeJourney", url: "https://www.youtube.com/@FahadCodeJourney-wu3kj" },
  { name: "Fernando Belotto", url: "https://www.youtube.com/@fernandobelotto" },
  { name: "Gerson Aguiar", url: "https://www.youtube.com/@gerson-aguiar.engineer" },
  { name: "Going Headless with John", url: "https://www.youtube.com/@GoingHeadlesswithJohn" },
  { name: "Guido Cerqueira", url: "https://www.youtube.com/@guidocerqueira" },
  { name: "Hacksplaining", url: "https://www.youtube.com/@hacksplainingHQ" },
  { name: "Hashtag Programação", url: "https://www.youtube.com/@HashtagProgramacao" },
  { name: "I See Sharp", url: "https://www.youtube.com/@iseesharp6646" },
  { name: "IBM Technology", url: "https://www.youtube.com/@IBMTechnology" },
  { name: "Jan Marshal", url: "https://www.youtube.com/@janmarshalcoding" },
  { name: "JavaScript Mastery", url: "https://www.youtube.com/@javascriptmastery" },
  { name: "Josef Bender", url: "https://www.youtube.com/@josefbender" },
  { name: "jQueryScript", url: "https://www.youtube.com/@jQueryScriptCSS" },
  { name: "Kanto Nerd", url: "https://www.youtube.com/@KantoNerdTCG" },
  { name: "Kelvin Mai", url: "https://www.youtube.com/@KelvinMai" },
  { name: "Kevin Powell", url: "https://www.youtube.com/@KevinPowell" },
  { name: "leerob", url: "https://www.youtube.com/@leerob" },
  { name: "Live Blogger", url: "https://www.youtube.com/@LiveBlogger" },
  { name: "Mago Acadêmico", url: "https://www.youtube.com/@MagoAcademico" },
  { name: "Mateus Durães", url: "https://www.youtube.com/@mateus.duraes" },
  { name: "Mateus Silva", url: "https://www.youtube.com/@imateussilva" },
  { name: "Matheus Battisti - Hora de Codar", url: "https://www.youtube.com/@MatheusBattisti" },
  { name: "Mayk Brito", url: "https://www.youtube.com/@maykbrito" },
  { name: "Minuto Seguro", url: "https://www.youtube.com/@MinutoSeguro" },
  { name: "MUI", url: "https://www.youtube.com/@MUI_hq" },
  { name: "NDC Conferences", url: "https://www.youtube.com/@NDC" },
  { name: "Net Ninja", url: "https://www.youtube.com/@NetNinja" },
  { name: "optikalefx", url: "https://www.youtube.com/@optikalefx" },
  { name: "Oscar Junior", url: "https://www.youtube.com/@osnrjr" },
  { name: "Pedro Soares", url: "https://www.youtube.com/@pedrossoares" },
  { name: "PedroTech", url: "https://www.youtube.com/@PedroTechnologies" },
  { name: "Proctor + Stevenson", url: "https://www.youtube.com/@ProctorsBristol" },
  { name: "Programming with Mosh", url: "https://www.youtube.com/@programmingwithmosh" },
  { name: "PwnFunction", url: "https://www.youtube.com/@PwnFunction" },
  { name: "Rafaella Ballerini", url: "https://www.youtube.com/@rafaellaballerini" },
  { name: "Rocketseat", url: "https://www.youtube.com/@rocketseat" },
  { name: "Scrimba", url: "https://www.youtube.com/@Scrimba" },
  { name: "Simplificando TI", url: "https://www.youtube.com/@SimplificandoTI" },
  { name: "Simply Explained", url: "https://www.youtube.com/@simplyexplained" },
  { name: "Smoljames", url: "https://www.youtube.com/@Smoljames" },
  { name: "Sujeito programador", url: "https://www.youtube.com/@Sujeitoprogramador" },
  { name: "Technical Rajni", url: "https://www.youtube.com/@TechnicalRajni" },
  { name: "Tejas Kumar", url: "https://www.youtube.com/@tejask" },
  { name: "Telusko", url: "https://www.youtube.com/@Telusko" },
  { name: "theSeniorDev", url: "https://www.youtube.com/@therealseniordev" },
  { name: "Thiago Sales", url: "https://www.youtube.com/@thiagosalesdev" },
  { name: "Traversy Media", url: "https://www.youtube.com/@TraversyMedia" },
  { name: "Tutorend", url: "https://www.youtube.com/@tutorend" },
  { name: "USENIX", url: "https://www.youtube.com/@UsenixOrg" },
  { name: "Valentin Despa", url: "https://www.youtube.com/@vdespa" },
  { name: "ValleWare", url: "https://www.youtube.com/@valle-ware" },
  { name: "Vercel", url: "https://www.youtube.com/@VercelHQ" },
  { name: "Visual Studio Code", url: "https://www.youtube.com/@code" },
  { name: "Web Dev Simplified", url: "https://www.youtube.com/@WebDevSimplified" },
  { name: "webdecoded", url: "https://www.youtube.com/@webdecoded" },
  { name: "Wes Bos", url: "https://www.youtube.com/@WesBos" },
  { name: "Willian Justen", url: "https://www.youtube.com/@WillianJustenCursos" },
  { name: "WP Rocket", url: "https://www.youtube.com/@WPRocket_Official" },
];

export const BOOK_CREDITS: BookCredit[] = [
  {
    name: "Designing Data-Intensive Applications",
    authors: "Martin Kleppmann",
    publisher: "O'Reilly Media",
    year: "2017",
    url: "/padrao-frontend/leitura-recomendada/designing-data-intensive-applications",
  },
  {
    name: "Software Engineering at Google",
    authors: "Titus Winters, Tom Manshreck, Hyrum Wright",
    publisher: "O'Reilly Media",
    year: "2020",
    url: "/padrao-frontend/leitura-recomendada/software-engineering-at-google",
  },
  {
    name: "Distributed Systems",
    authors: "Andrew S. Tanenbaum, Maarten van Steen",
    publisher: "3rd edition",
    year: "2017",
    url: "/padrao-frontend/leitura-recomendada/distributed-systems",
  },
  {
    name: "High Performance Browser Networking",
    authors: "Ilya Grigorik",
    publisher: "O'Reilly Media",
    year: "2013",
    url: "/padrao-frontend/leitura-recomendada/high-performance-browser-networking",
  },
  {
    name: "Refactoring",
    authors: "Martin Fowler, Kent Beck",
    publisher: "Addison-Wesley",
    year: "2018",
    url: "/padrao-frontend/leitura-recomendada/refactoring",
  },
];

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMarkdownFiles(fullPath);
    return entry.isFile() && entry.name.endsWith(".md") ? [fullPath] : [];
  });
}

function getDomain(url: string): string | null {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

function sourceNameFor(domain: string): string {
  return SOURCE_NAMES[domain] ?? domain;
}

function collectExternalSources(): ExternalSourceCredit[] {
  const linksByDomain = new Map<string, { name: string; url: string; references: number }>();

  for (const root of DOC_ROOTS) {
    for (const file of listMarkdownFiles(root)) {
      const { content } = matter(fs.readFileSync(file, "utf8"));
      const matches = content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)(?:\s+"[^"]*")?\)/g);

      for (const match of matches) {
        if (content[match.index - 1] === "!") continue;
        const url = match[2];
        const domain = getDomain(url);
        if (!domain || IGNORED_EXTERNAL_HOSTS.has(domain)) continue;

        const current = linksByDomain.get(domain);
        if (current) {
          current.references += 1;
          continue;
        }

        linksByDomain.set(domain, {
          name: sourceNameFor(domain),
          url,
          references: 1,
        });
      }
    }
  }

  return [...linksByDomain.entries()]
    .map(([domain, source]) => ({ domain, ...source }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCreditsData() {
  return {
    videoChannels: VIDEO_CHANNEL_CREDITS,
    books: BOOK_CREDITS,
    externalSources: collectExternalSources(),
  };
}
