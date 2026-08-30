import { NextResponse, type NextRequest } from "next/server";

/**
 * Autenticação HTTP Basic pra toda a wiki — achado real (ver
 * docs-frontend/seguranca/PROTECAO-DA-WIKI.md): este site não tinha
 * nenhum controle de acesso, e documenta em detalhe real (thresholds de
 * rate-limit, gaps de log, comportamento de autorização) o que protege o
 * [HTD-Front](https://github.com/juankalleo/HTD-Front)/API por trás dele. Sem senha, a wiki vira reconhecimento
 * pronto pra quem tiver o link.
 *
 * Basic Auth (não JWT/sessão como o [HTD-Front](https://github.com/juankalleo/HTD-Front)) porque este site não
 * tem base de usuário própria — é conteúdo estático lido de markdown, sem
 * conceito de "conta". Credenciais vêm de variável de ambiente
 * (`WIKI_BASIC_AUTH_USER`/`WIKI_BASIC_AUTH_PASS`), nunca hardcoded aqui.
 *
 * Arquivo `proxy.ts` (não mais `middleware.ts`) — convenção renomeada no
 * Next.js 16, `middleware.ts` gera warning de depreciação no build.
 */

const REALM = "How to Dev";

function comparacaoSeguraContraTempo(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let resultado = 0;
  for (let i = 0; i < a.length; i++) {
    resultado |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return resultado === 0;
}

function naoAutorizado(): NextResponse {
  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

export function proxy(request: NextRequest): NextResponse {
  const usuarioEsperado = process.env.WIKI_BASIC_AUTH_USER;
  const senhaEsperada = process.env.WIKI_BASIC_AUTH_PASS;

  if (!usuarioEsperado || !senhaEsperada) {
    // Produção sem credencial configurada: fecha por padrão — nunca
    // deixa a wiki aberta por omissão de configuração. Em dev local
    // (sem essas env vars setadas), libera, pra não travar quem só quer
    // rodar `next dev`.
    return process.env.NODE_ENV === "production" ? naoAutorizado() : NextResponse.next();
  }

  const header = request.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    const decodificado = Buffer.from(header.slice("Basic ".length), "base64").toString("utf-8");
    const separador = decodificado.indexOf(":");
    if (separador !== -1) {
      const usuario = decodificado.slice(0, separador);
      const senha = decodificado.slice(separador + 1);
      if (comparacaoSeguraContraTempo(usuario, usuarioEsperado) && comparacaoSeguraContraTempo(senha, senhaEsperada)) {
        return NextResponse.next();
      }
    }
  }

  return naoAutorizado();
}

export const config = {
  matcher: [
    // Roda em toda página; pula asset estático/imagem já otimizada (não
    // servem conteúdo, não precisam de credencial).
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
