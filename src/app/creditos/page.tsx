import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCreditsData } from "@/lib/credits";
import { getGlobalSearchIndex } from "@/lib/search-index";
import { getServerLocale } from "@/lib/locale-server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créditos | How to Dev",
  description: "Canais, livros, documentações e empresas citadas nos materiais do How to Dev.",
};

function isExternalUrl(url: string) {
  return url.startsWith("http://") || url.startsWith("https://");
}

function formatUrl(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

function CreditLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      rel={isExternalUrl(href) ? "noopener noreferrer" : undefined}
      target={isExternalUrl(href) ? "_blank" : undefined}
    >
      {formatUrl(href)}
    </a>
  );
}

export default async function CreditsPage() {
  const { videoChannels, books, externalSources } = getCreditsData();
  const locale = await getServerLocale();
  const searchEntries = getGlobalSearchIndex(locale);

  return (
    <>
      <Navbar activeHref="/creditos" searchEntries={searchEntries} />
      <main className="credits-main markdown credits-markdown">
        <section className="credits-hero">
          <h1>Fontes usadas no How to Dev</h1>
          <p>
            Relação dos canais de vídeo, livros, documentações, empresas e artigos citados nas páginas do projeto.
          </p>
        </section>

        <section className="credits-section">
          <h2>Canais de vídeo</h2>
          <p>{videoChannels.length} canais citados nos vídeos explicativos e páginas de apoio.</p>
          <div className="credits-table-wrap">
            <table className="credits-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {videoChannels.map((channel) => (
                  <tr key={channel.url}>
                    <td>{channel.name}</td>
                    <td>
                      <CreditLink href={channel.url} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="credits-section">
          <h2>Livros</h2>
          <p>{books.length} livros usados como referência conceitual.</p>
          <div className="credits-table-wrap">
            <table className="credits-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Autores</th>
                  <th>Editora / ano</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.name}>
                    <td>{book.name}</td>
                    <td>{book.authors}</td>
                    <td>
                      {book.publisher} · {book.year}
                    </td>
                    <td>
                      <CreditLink href={book.url} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="credits-section credits-section--last">
          <h2>Documentações, empresas e artigos</h2>
          <p>{externalSources.length} fontes externas encontradas nas páginas Markdown do projeto.</p>
          <div className="credits-table-wrap">
            <table className="credits-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Domínio</th>
                  <th>Citações</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {externalSources.map((source) => (
                  <tr key={source.domain}>
                    <td>{source.name}</td>
                    <td>{source.domain}</td>
                    <td>{source.references}</td>
                    <td>
                      <CreditLink href={source.url} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
