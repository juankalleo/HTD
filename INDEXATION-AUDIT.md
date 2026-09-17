# How to Dev Indexation Audit

Data da auditoria: 2026-09-10

Dominio oficial: `https://howtodev.site`

## Status

**Resultado no codigo/local:** aprovado para indexacao apos os ajustes desta auditoria.

**Resultado no dominio publicado agora:** ainda nao esta aprovado como auditoria final de producao. O dominio ao vivo responde e e rastreavel, mas a versao publicada ainda esta servindo canonicals herdados da home em paginas internas e ainda nao contem os novos hubs `/frontend`, `/api`, `/database`, `/security`, `/infrastructure` e `/about`.

Conclusao operacional: publicar este source no dominio oficial e repetir o crawl de producao. Nao considerar a indexacao de producao concluida antes desse deploy.

## Checks ao vivo em `https://howtodev.site`

| Check | Resultado |
| --- | --- |
| Home `https://howtodev.site/` | HTTP 200 |
| `robots.txt` | HTTP 200, publico, `User-agent: *` com `Allow: /`, sem bloqueio a Googlebot |
| `sitemap.xml` | HTTP 200, 240 URLs, todas em `https://howtodev.site` |
| `X-Robots-Tag` | Nao encontrado nos checks ao vivo |
| `howtodev.vercel.app` | HTTP 404 `DEPLOYMENT_NOT_FOUND`, sem copia publica indexavel neste momento |
| Favicon | `https://howtodev.site/icon.png` HTTP 200, `image/png` |

Problemas vistos na producao atual antes do deploy deste source:

| URL | Problema atual ao vivo |
| --- | --- |
| `https://howtodev.site/developer-roadmap` | HTTP 200, mas canonical e `og:url` apontam para `https://howtodev.site` |
| `https://howtodev.site/padrao-frontend/seguranca/jwt` | HTTP 200, mas canonical e `og:url` apontam para `https://howtodev.site` |
| `https://howtodev.site/frontend` | HTTP 404 na producao atual |
| `https://howtodev.site/about` | HTTP 404 na producao atual |
| Sitemap publicado | Ainda nao contem `/frontend`, `/api`, `/database`, `/security`, `/infrastructure`, `/about` |

## Ajustes feitos no source

- `metadataBase` centralizado em `https://howtodev.site`.
- Canonical e `og:url` por pagina em home, roadmap, Aprenda, creditos, docs dinamicos e aulas.
- JSON-LD de artigos com `Article.mainEntityOfPage` absoluto em `https://howtodev.site`.
- JSON-LD `BreadcrumbList` absoluto em `https://howtodev.site`.
- Redirect permanente configurado para host `howtodev.vercel.app` quando esse host servir o app.
- Hubs indexaveis criados: `/frontend`, `/api`, `/database`, `/security`, `/infrastructure`, `/about`.
- Sitemap atualizado para incluir hubs importantes e remover categorias sem pagina real.
- Sidebar/search deixam de transformar pasta sem `index.md` em URL indexavel.
- Links internos reais `<a href="">` adicionados na home, roadmap e footer.

## Validacao local pos-correcao

Ambiente validado:

- `pnpm build`: passou.
- `pnpm start`: validacao em `http://localhost:3000` usando o build de producao.
- Sitemap local: HTTP 200, 242 URLs, todas com host canonico `https://howtodev.site`.
- Todas as 242 URLs do sitemap local: HTTP 200, sem redirect, sem `noindex`, sem `X-Robots-Tag: noindex`, com canonical proprio e sem `howtodev.vercel.app` no HTML.
- Home no HTML inicial contem: `How to Dev`, `Learn Software Development`, `frontend`, `backend`, `API`, `database`, `security`, `infrastructure`, `software architecture`.
- Hreflang: nenhum `hreflang` e renderizado atualmente; portanto nao ha `hreflang` apontando para host incorreto.

## Varredura do projeto

| Busca | Resultado |
| --- | --- |
| `howtodev.vercel.app` | Apenas em `next.config.ts` como regra de redirect permanente |
| `<meta name="robots" content="noindex">` em source publico | Nao encontrado em paginas renderizadas |
| `X-Robots-Tag: noindex` | Nao configurado |
| `noindex` em `public/assets/js` | Existem strings herdadas de bundle Docusaurus estatico antigo, mas nao aparecem no HTML renderizado das URLs do sitemap |

## Tabela de URLs importantes validada localmente

Observacao: `Internal links received` e a contagem encontrada pelo crawler local ao percorrer todas as URLs do sitemap. Links duplicados em paginas diferentes contam como multiplos sinais internos.

| URL | Status HTTP | Indexable? | Canonical | Robots | Title | Description | H1 | In sitemap? | Internal links received | Problema encontrado |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| `https://howtodev.site/` | 200 | Sim | `https://howtodev.site` | Sem meta robots, sem X-Robots-Tag | How to Dev - Learn Software Development | How to Dev is a practical software development knowledge base covering frontend, backend, APIs, databases, security, infrastructure and architecture. | How to Dev | Sim | 482 | Nenhum |
| `https://howtodev.site/developer-roadmap` | 200 | Sim | `https://howtodev.site/developer-roadmap` | Sem meta robots, sem X-Robots-Tag | How to Develop Software - Developer Roadmap \| How to Dev | A practical roadmap for learning modern software development: web fundamentals, frontend, APIs, backend, databases, authentication, security, infrastructure, deployment and architecture. | How to Develop Software | Sim | 729 | Nenhum |
| `https://howtodev.site/frontend` | 200 | Sim | `https://howtodev.site/frontend` | Sem meta robots, sem X-Robots-Tag | Frontend Development \| How to Dev | Learn frontend development with practical guides on HTML, CSS, JavaScript, TypeScript, Next.js, forms, authentication, security and UI architecture. | Frontend Development | Sim | 245 | Nenhum |
| `https://howtodev.site/api` | 200 | Sim | `https://howtodev.site/api` | Sem meta robots, sem X-Robots-Tag | API Development \| How to Dev | Learn API development through HTTP contracts, backend routing, authentication, authorization, pagination, errors, serializers and practical Rails examples. | API Development | Sim | 246 | Nenhum |
| `https://howtodev.site/database` | 200 | Sim | `https://howtodev.site/database` | Sem meta robots, sem X-Robots-Tag | Database Development \| How to Dev | Learn database development with practical material on SQL, relational modeling, migrations, indexes, multi-tenancy, audit trails and transaction boundaries. | Database Development | Sim | 245 | Nenhum |
| `https://howtodev.site/security` | 200 | Sim | `https://howtodev.site/security` | Sem meta robots, sem X-Robots-Tag | Software Security \| How to Dev | Learn software security through practical guides on authentication, JWT, sessions, CSRF, XSS, CSP, RBAC, IDOR, API security and audit logs. | Software Security | Sim | 248 | Nenhum |
| `https://howtodev.site/infrastructure` | 200 | Sim | `https://howtodev.site/infrastructure` | Sem meta robots, sem X-Robots-Tag | Infrastructure and Deployment \| How to Dev | Learn infrastructure and deployment through Linux, networking, HTTP, Docker, Nginx, reverse proxies, CDNs, CI/CD, logs and operational security. | Infrastructure and Deployment | Sim | 245 | Nenhum |
| `https://howtodev.site/about` | 200 | Sim | `https://howtodev.site/about` | Sem meta robots, sem X-Robots-Tag | About How to Dev \| How to Dev | How to Dev is a practical software development knowledge base for learning frontend, backend, APIs, databases, security, infrastructure and architecture. | About How to Dev | Sim | 243 | Nenhum |
| `https://howtodev.site/aprenda` | 200 | Sim | `https://howtodev.site/aprenda` | Sem meta robots, sem X-Robots-Tag | Learn Software Development \| How to Dev | Learn software development from the fundamentals through Git, JavaScript, TypeScript, networking, frontend, SQL, Ruby on Rails and Docker with practical lessons. | From web fundamentals to production software | Sim | 636 | Nenhum |
| `https://howtodev.site/padrao-frontend` | 200 | Sim | `https://howtodev.site/padrao-frontend` | Sem meta robots, sem X-Robots-Tag | Frontend Standard \| How to Dev | How to Dev's frontend development guide for structuring Next.js applications with routing, components, data, forms, files, cache and security. | Frontend Standard | Sim | 598 | Nenhum |
| `https://howtodev.site/padrao-api` | 200 | Sim | `https://howtodev.site/padrao-api` | Sem meta robots, sem X-Robots-Tag | Padrao API \| How to Dev | Guia de backend e API do How to Dev para aprender roteamento, autenticacao, autorizacao, paginacao, erros, serializers e contratos HTTP em Rails. | Padrao API | Sim | 510 | Nenhum |
| `https://howtodev.site/padrao-banco-de-dados` | 200 | Sim | `https://howtodev.site/padrao-banco-de-dados` | Sem meta robots, sem X-Robots-Tag | Padrao Banco de Dados \| How to Dev | Guia de banco de dados do How to Dev para aprender modelagem relacional, SQL, migrations, multi-tenancy, auditoria e padroes ActiveRecord. | Padrao Banco de Dados | Sim | 495 | Nenhum |
| `https://howtodev.site/padrao-infraestrutura` | 200 | Sim | `https://howtodev.site/padrao-infraestrutura` | Sem meta robots, sem X-Robots-Tag | Padrao Infraestrutura \| How to Dev | Guia de infraestrutura do How to Dev para aprender Linux, rede, HTTP, Docker, Nginx, proxy reverso, CDN, CI/CD, deploy e operacao. | Padrao Infraestrutura | Sim | 500 | Nenhum |
| `https://howtodev.site/padrao-frontend/seguranca` | 200 | Sim | `https://howtodev.site/padrao-frontend/seguranca` | Sem meta robots, sem X-Robots-Tag | Seguranca no frontend \| Padrao Frontend \| How to Dev | Guia de seguranca frontend do How to Dev cobrindo autenticacao, JWT, RBAC, CSRF, XSS, CSP, IDOR, headers HTTP, auditoria e exportacoes. | Seguranca no frontend | Sim | 115 | Nenhum |
| `https://howtodev.site/padrao-frontend/seguranca/jwt` | 200 | Sim | `https://howtodev.site/padrao-frontend/seguranca/jwt` | Sem meta robots, sem X-Robots-Tag | JWT Authentication \| Padrao Frontend \| How to Dev | JWT authentication explained through access tokens, token storage, revocation, security risks and the trade-offs against session authentication. | JWT Authentication | Sim | 118 | Nenhum |
| `https://howtodev.site/creditos` | 200 | Sim | `https://howtodev.site/creditos` | Sem meta robots, sem X-Robots-Tag | Creditos \| How to Dev | Canais, livros, documentacoes e empresas citadas nos materiais do How to Dev. | Fontes usadas no How to Dev | Sim | 485 | Nenhum |

## Condicao para fechar em producao

Depois do deploy, repetir o crawler contra `https://howtodev.site` e exigir:

- sitemap publicado com 242 URLs ou contagem equivalente sem URLs 404;
- `/frontend`, `/api`, `/database`, `/security`, `/infrastructure`, `/about` retornando HTTP 200;
- paginas internas com canonical proprio, por exemplo `/developer-roadmap` canonical `https://howtodev.site/developer-roadmap`;
- nenhum `noindex` em meta robots ou `X-Robots-Tag`;
- nenhum HTML publicado contendo `howtodev.vercel.app`.
