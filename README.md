# Welcome to How to Dev

[![Personal Project](https://img.shields.io/badge/project-personal-48A646.svg)](https://github.com/juankalleo)
[![Next.js 16](https://img.shields.io/badge/next.js-16-black.svg)](https://nextjs.org)

Welcome to the repository for **How to Dev**, a personal documentation project maintained by **Juan Kalleo**. It focuses on writing down, in real detail, the structuring standards used as a reference when building a frontend/API/infrastructure project from scratch — not a company project, not a team effort, just one engineer's working reference kept honest enough to publish.

To read the content, use the site itself once deployed. This repository is the source: markdown files under `docs-<area>/` are the working source and are rendered live by the Next.js app in `src/`.

:triangular_flag_on_post: Every page documents the real thing — real thresholds, real code, real trade-offs — not a sanitized summary. See [Why this exists](#why-this-exists) below for the reasoning.

## Structure

| Area | Route | Status |
| --- | --- | --- |
| Frontend Standard | `/padrao-frontend` | Available |
| API Standard | `/padrao-api` | In progress |
| Infrastructure Standard | `/padrao-infraestrutura` | In progress |
| Examples | `/examples` | In progress |

Each area is a `docs-<area>/` folder of `.md` files at the project root, read at runtime (see `src/lib/docs.ts`) — dropping a new `.md` file in the folder creates the route, no build or per-article `page.tsx` required.

The site interface (navbar, sidebar, homepage) is in English by default, with a working PT-BR switcher in the top navbar. The ~90 real content pages under the Frontend Standard are currently written in Portuguese only; English translation of content is a separate, ongoing effort.

## Why this exists

It started from a simple question: if a malicious actor got access to this documentation, would it help them attack a real system — or would it show them the system is already protected enough that it isn't worth trying? The [Security section](docs-frontend/seguranca/index.md), inside the Frontend Standard, was written with that exact bar: complete documentation, hiding no threshold, header, or authorization behavior. The only acceptable "flaw" is the system being too well protected. See [`docs-frontend/seguranca/PROTECAO-DA-WIKI.md`](docs-frontend/seguranca/PROTECAO-DA-WIKI.md) for how that principle applies to this site itself.

## About

Maintained by [Juan Kalleo](https://github.com/juankalleo). No team, no roadmap owned by anyone else — decisions here are personal calls, documented with the reasoning behind them so they can be revisited later.

## Running Locally

```sh
corepack pnpm install
corepack pnpm run dev
```

```sh
corepack pnpm run build
corepack pnpm run start
```

## SEO

The site is public and indexable on purpose — it doubles as a portfolio piece, so being findable on Google matters. `sitemap.xml` is generated from the real content tree (`src/app/sitemap.ts`), `robots.txt` allows crawling, and every page ships Open Graph/Twitter metadata plus a generated social preview image (`src/app/opengraph-image.tsx`).

## Security

This site used to sit behind HTTP Basic Auth; that was removed on purpose once the goal became a public, indexable portfolio — see [`docs-frontend/seguranca/PROTECAO-DA-WIKI.md`](docs-frontend/seguranca/PROTECAO-DA-WIKI.md) for the reasoning. Baseline HTTP headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`) still apply to every route regardless.

## Contributions

This is a personal reference, not an actively maintained open project — there's no issue tracker or contribution guide to follow. That said, the repository is public and the reasoning behind every decision is written down on purpose, so feel free to read, fork, or adapt anything here.

## License

Personal content, no reuse license set.
