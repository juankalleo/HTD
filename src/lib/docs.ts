import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import type { SidebarItem } from "@/components/sidebar";
import type { Locale } from "@/lib/i18n";

/**
 * Carregador de conteúdo em markdown do How to Dev. Cada área (padrão frontend,
 * api, infraestrutura, exemplos) tem sua própria pasta de `.md` na raiz do
 * projeto, mais uma pasta irmã `-en` com a tradução real (mesma sub-rota,
 * mesmo nome de arquivo) pra quem já foi traduzido. Os arquivos são lidos em
 * runtime — jogar um `.md` na pasta da área já cria a rota, sem build.
 *
 * Mapeamento (case-insensitive):
 *   docs-frontend/AUTENTICACAO.md        -> /padrao-frontend/autenticacao (pt-BR)
 *   docs-frontend-en/AUTENTICACAO.md     -> mesma rota, servida quando locale=en
 *   docs-frontend/tecnologias/nextjs.md  -> /padrao-frontend/tecnologias/nextjs
 *   docs-api/README.md                   -> /padrao-api
 *
 * Locale nunca é adivinhado no client: vem do cookie `htd-locale` (ver
 * `locale-provider.tsx`), lido aqui via `next/headers` — por isso todo doc
 * de conteúdo é `force-dynamic`. Se o arquivo `-en` não existir ainda pra
 * aquela página, cai pro `.md` em português (`translated: false` no
 * retorno) — nunca 404 só porque a tradução não chegou lá ainda.
 */

type AreaConfig = {
  folder: string;
  title: string;
  cargo: string;
  area: string;
};

const AREAS: Record<string, AreaConfig> = {
  "padrao-frontend": {
    folder: "docs-frontend",
    title: "Padrão Frontend",
    cargo: "Senior Fullstack",
    area: "Padrão Frontend",
  },
  "padrao-api": {
    folder: "docs-api",
    title: "Padrão API",
    cargo: "Backend/API",
    area: "Padrão API",
  },
  "padrao-infraestrutura": {
    folder: "docs-infraestrutura",
    title: "Padrão Infraestrutura",
    cargo: "Infraestrutura",
    area: "Padrão Infraestrutura",
  },
  examples: {
    folder: "docs-examples",
    title: "Exemplos",
    cargo: "Senior Fullstack",
    area: "Exemplos",
  },
};

const INDEXES = ["index.md", "README.md"];
const WORKSPACE_ROOT = process.cwd();
const AREA_ROOTS: Record<string, string> = {
  "padrao-frontend": path.join(WORKSPACE_ROOT, "docs-frontend"),
  "padrao-api": path.join(WORKSPACE_ROOT, "docs-api"),
  "padrao-infraestrutura": path.join(WORKSPACE_ROOT, "docs-infraestrutura"),
  examples: path.join(WORKSPACE_ROOT, "docs-examples"),
};
const AREA_ROOTS_EN: Record<string, string> = {
  "padrao-frontend": path.join(WORKSPACE_ROOT, "docs-frontend-en"),
  "padrao-api": path.join(WORKSPACE_ROOT, "docs-api-en"),
  "padrao-infraestrutura": path.join(WORKSPACE_ROOT, "docs-infraestrutura-en"),
  examples: path.join(WORKSPACE_ROOT, "docs-examples-en"),
};

export function getAreaConfig(area: string): AreaConfig {
  return (
    AREAS[area] ?? {
      folder: area,
      title: area,
      cargo: "Frontend",
      area,
    }
  );
}

export type DocContent = {
  title: string;
  description?: string;
  content: string;
  slug: string[];
  baseSlug: string[];
  video?: string;
  videoEn?: string;
  date: string;
  translated: boolean;
};

/**
 * Data de exibição do artigo — usa `date`/`data` do frontmatter se o
 * arquivo declarar um, senão cai pra data de modificação real do arquivo
 * no disco. `locale` decide o formato (pt-BR vs en-US).
 */
function dataDoArquivo(file: string, frontmatterData: unknown, locale: Locale): string {
  if (typeof frontmatterData === "string" && frontmatterData.trim()) return frontmatterData.trim();
  const mtime = fs.statSync(file).mtime;
  return locale === "en"
    ? mtime.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })
    : mtime.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" });
}

/**
 * Extrai o id de 11 caracteres de uma URL do YouTube (formato
 * watch?v=, youtu.be/ ou embed/). Retorna `undefined` se não reconhecer.
 */
export function parseYouTubeId(raw: unknown): string | undefined {
  if (typeof raw !== "string" || !raw.trim()) return undefined;
  const url = raw.trim();
  const m =
    url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ??
    url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ??
    url.match(/\/embed\/([a-zA-Z0-9_-]{11})/) ??
    url.match(/^([a-zA-Z0-9_-]{11})$/);
  return m ? m[1] : undefined;
}

type FoundEntry = {
  path: string;
  dirent: fs.Dirent;
};

function areaRootFor(area: string, locale: Locale): string | undefined {
  if (locale === "en") {
    const enRoot = AREA_ROOTS_EN[area];
    if (enRoot && fs.existsSync(/*turbopackIgnore: true*/ enRoot)) return enRoot;
    return undefined;
  }
  return AREA_ROOTS[area] ?? AREA_ROOTS["padrao-frontend"];
}

function ptAreaRoot(area: string): string {
  return AREA_ROOTS[area] ?? AREA_ROOTS["padrao-frontend"];
}

function findEntry(dir: string, name: string): FoundEntry | null {
  if (!fs.existsSync(dir)) return null;
  const lower = name.toLowerCase();
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.toLowerCase() === lower) return { path: path.join(dir, e.name), dirent: e };
  }
  return null;
}

function firstHeading(md: string): string | undefined {
  const m = md.match(/^#\s+(.+)$/m);
  return m ? m[1].replace(/[`*_]/g, "").trim() : undefined;
}

function humanize(name: string): string {
  return name
    .split(/[-_]/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function titleOfFile(file: string, fallback: string): string {
  try {
    const { data, content } = matter(fs.readFileSync(file, "utf8"));
    if (typeof data.sidebar_label === "string" && data.sidebar_label.trim()) return data.sidebar_label.trim();
    if (typeof data.sidebarLabel === "string" && data.sidebarLabel.trim()) return data.sidebarLabel.trim();
    if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
    const h1 = firstHeading(content);
    if (h1) return h1;
  } catch {
    // arquivo ilegível — cai no fallback
  }
  return fallback;
}

function readDoc(file: string, slug: string[], baseSlug: string[], locale: Locale, translated: boolean): DocContent {
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fmTitle = typeof data.title === "string" && data.title.trim() ? data.title.trim() : undefined;
  const h1 = firstHeading(content);
  const title = fmTitle ?? h1 ?? slug[slug.length - 1] ?? "Documentação";
  // O ArticleLayout já renderiza o título, então removemos o H1 do corpo.
  const body = h1 ? content.replace(/^#\s+.*$(\n)?/m, "") : content;
  const description = typeof data.description === "string" ? data.description : undefined;
  const video = parseYouTubeId(data.video);
  const videoEn = parseYouTubeId(data.videoEn);
  const date = dataDoArquivo(file, data.date ?? data.data, locale);
  return { title, description, content: body, slug, baseSlug, video, videoEn, date, translated };
}

/**
 * Anda a árvore de pastas seguindo `slug` a partir de `root`. Retorna o
 * caminho do arquivo final (não lê o conteúdo) ou `null` se não existir —
 * usado tanto pra resolver o doc real quanto pra checar se a versão `-en`
 * de uma página existe antes de decidir servir ela.
 */
function resolveFile(root: string, slug: string[]): string | null {
  let cur = root;
  for (let i = 0; i < slug.length; i++) {
    const seg = slug[i];
    const isLast = i === slug.length - 1;
    const dirMatch = findEntry(cur, seg);
    if (dirMatch?.dirent.isDirectory()) {
      cur = dirMatch.path;
      continue;
    }
    const fileMatch = findEntry(cur, `${seg}.md`);
    if (fileMatch?.dirent.isFile()) {
      return isLast ? fileMatch.path : null;
    }
    return null;
  }
  const idx = findEntry(cur, "index.md") ?? findEntry(cur, "README.md");
  return idx?.dirent.isFile() ? idx.path : null;
}

export function getDoc(area: string, slug: string[], locale: Locale = "pt"): DocContent | null {
  const enRoot = areaRootFor(area, locale);
  if (enRoot) {
    const enFile = resolveFile(enRoot, slug);
    if (enFile) return readDoc(enFile, slug, slug.slice(0, -1), locale, true);
  }
  const ptRoot = ptAreaRoot(area);
  const ptFile = resolveFile(ptRoot, slug);
  if (!ptFile) return null;
  return readDoc(ptFile, slug, slug.slice(0, -1), locale, false);
}

/**
 * Extrai o sumário (TOC) dos headings h2/h3. Os ids são gerados com o mesmo
 * `github-slugger` que o `rehype-slug` usa na renderização, então os links do
 * `Toc` batem com os `id`s dos headings no HTML.
 */
export function getHeadings(md: string): { id: string; label: string }[] {
  const slugger = new GithubSlugger();
  const items: { id: string; label: string }[] = [];
  for (const line of md.split("\n")) {
    const m = line.match(/^(#{2,3})\s+(.+?)\s*#*\s*$/);
    if (!m) continue;
    const label = m[2].replace(/[`*_]/g, "").trim();
    const id = slugger.slug(m[2]);
    items.push({ id, label });
  }
  return items;
}

/**
 * Monta a árvore da sidebar escaneando a pasta de markdown da área (sempre a
 * em português, que é a fonte completa) — cada rótulo tenta a tradução do
 * arquivo `-en` correspondente primeiro (mesmo caminho relativo), caindo pro
 * título em português se aquela página ainda não foi traduzida. Assim a
 * sidebar vai virando inglês progressivamente, sem nunca esconder uma rota
 * que só existe em português ainda.
 */
function buildTree(dir: string, prefix: string, enDir: string | undefined, relDir: string, locale: Locale): SidebarItem[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const dirs = entries
    .filter((e) => e.isDirectory())
    .sort((a, b) => a.name.localeCompare(b.name));
  const files = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md") && !INDEXES.includes(e.name))
    .sort((a, b) => a.name.localeCompare(b.name));

  function labelFor(ptFile: string, relPath: string, fallback: string): string {
    if (locale === "en" && enDir) {
      const enPath = path.join(enDir, relPath);
      if (fs.existsSync(/*turbopackIgnore: true*/ enPath)) return titleOfFile(enPath, fallback);
    }
    return titleOfFile(ptFile, fallback);
  }

  const items: SidebarItem[] = [];
  for (const d of dirs) {
    const childDir = path.join(dir, d.name);
    const childHref = `${prefix}/${d.name.toLowerCase()}`;
    const childRel = path.join(relDir, d.name);
    const indexFile = INDEXES.map((indexName) => findEntry(childDir, indexName)).find(
      (indexPath): indexPath is FoundEntry => !!indexPath,
    );
    const children = buildTree(childDir, childHref, enDir, childRel, locale);
    items.push({
      label: indexFile
        ? labelFor(indexFile.path, path.join(childRel, path.basename(indexFile.path)), humanize(d.name))
        : humanize(d.name),
      href: childHref,
      children: children.length ? children : undefined,
    });
  }
  for (const f of files) {
    const base = f.name.replace(/\.md$/, "");
    const file = path.join(dir, f.name);
    const rel = path.join(relDir, f.name);
    items.push({ label: labelFor(file, rel, humanize(base)), href: `${prefix}/${base.toLowerCase()}` });
  }
  return items;
}

export function getSidebarTree(area: string, locale: Locale = "pt"): SidebarItem[] {
  const root = ptAreaRoot(area);
  const enRoot = locale === "en" ? AREA_ROOTS_EN[area] : undefined;
  const tree = buildTree(root, `/${area}`, enRoot && fs.existsSync(/*turbopackIgnore: true*/ enRoot) ? enRoot : undefined, ".", locale);
  const overviewLabel = locale === "en" ? "Overview" : "Visão geral";
  return [{ label: overviewLabel, href: `/${area}` }, ...tree];
}

function flattenHrefs(items: SidebarItem[]): string[] {
  const hrefs: string[] = [];
  for (const item of items) {
    if (item.href) hrefs.push(item.href);
    if (item.children) hrefs.push(...flattenHrefs(item.children));
  }
  return hrefs;
}

/** Toda URL real de uma área (a própria + cada doc), pro `sitemap.ts`. */
export function listAreaHrefs(area: string): string[] {
  return flattenHrefs(getSidebarTree(area, "pt"));
}
