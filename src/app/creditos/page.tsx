import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { getCreditsData } from "@/lib/credits";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Créditos | How to Dev",
  description: "Canais, livros, documentações e empresas citadas nos materiais do How to Dev.",
};

export default function CreditsPage() {
  const { videoChannels, books, externalSources } = getCreditsData();

  return (
    <>
      <Navbar activeHref="/creditos" />
      <main className="credits-main">
        <section className="credits-hero">
          <p className="credits-eyebrow">Créditos</p>
          <h1>Fontes usadas no How to Dev</h1>
          <p>
            Relação dos canais de vídeo, livros, documentações, empresas e artigos citados nas páginas do projeto.
          </p>
        </section>

        <section className="credits-section">
          <div className="credits-section-heading">
            <h2>Canais de vídeo</h2>
            <span>{videoChannels.length} canais</span>
          </div>
          <div className="credits-link-grid credits-link-grid--compact">
            {videoChannels.map((channel) => (
              <a key={channel.url} className="credits-link-card" href={channel.url} target="_blank" rel="noopener noreferrer">
                <span>{channel.name}</span>
                <small>YouTube</small>
              </a>
            ))}
          </div>
        </section>

        <section className="credits-section">
          <div className="credits-section-heading">
            <h2>Livros</h2>
            <span>{books.length} referências</span>
          </div>
          <div className="credits-book-grid">
            {books.map((book) => (
              <a key={book.name} className="credits-book-card" href={book.url}>
                <span className="credits-book-title">{book.name}</span>
                <span className="credits-book-meta">{book.authors}</span>
                <small>
                  {book.publisher} · {book.year}
                </small>
              </a>
            ))}
          </div>
        </section>

        <section className="credits-section credits-section--last">
          <div className="credits-section-heading">
            <h2>Documentações, empresas e artigos</h2>
            <span>{externalSources.length} fontes</span>
          </div>
          <div className="credits-link-grid">
            {externalSources.map((source) => (
              <a key={source.domain} className="credits-link-card" href={source.url} target="_blank" rel="noopener noreferrer">
                <span>{source.name}</span>
                <small>
                  {source.domain} · {source.references} {source.references === 1 ? "citação" : "citações"}
                </small>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
