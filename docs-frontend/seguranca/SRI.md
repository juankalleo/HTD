---
sidebar_label: SRI
video: x5wX88YUf68
---

# Subresource Integrity (SRI)

Recurso de segurança que valida se scripts carregados de terceiros (como
CDNs) não foram alterados, usando um hash criptográfico de verificação —
o navegador só executa o arquivo se o hash bater com o declarado no
atributo `integrity` da tag, protegendo contra um CDN comprometido servir
um script trocado.

## No padrão frontend

Não se aplica — o padrão não carrega nenhum script de terceiro via
`<script src="https://...">`. Confirmado no código: a única tag
`<script>` do projeto inteiro é o script de tema, inline e local (ver
[XSS](xss.md)); todo o resto do JavaScript vem dos próprios chunks que o
Next.js gera e serve como `/_next/static/...` — mesma origem, com nome de
arquivo derivado de hash do conteúdo pelo próprio build, o que já garante
integridade sem precisar de SRI.

Fontes também não vêm de CDN em runtime: `next/font/google` baixa e
hospeda os arquivos de fonte no próprio build, servidos por
`/_next/static/media/...` (ver
[Otimização de fontes](/padrao-frontend/estilos/otimizacao-fontes)) — zero
requisição pra `fonts.googleapis.com`/`fonts.gstatic.com` em produção.

**Quando usaríamos:** se um dia entrar um script de terceiro de verdade
(um widget de chat, uma lib de analytics carregada via CDN), a primeira
escolha do padrão seria hospedar o arquivo localmente (mesmo tratamento
que já é dado às fontes) — SRI só se a auto-hospedagem não for possível.
