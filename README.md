# How to Dev

Documentação pessoal de **Juan Kalleo** sobre os padrões de estruturação de
projeto que uso como referência — frontend, API e infraestrutura. Cada
página traz a tecnologia, o motivo real da escolha, a versão e um exemplo
de código copiável. Não é um produto e não tem equipe por trás: é uma base
de conhecimento pessoal, publicada porque documentar é a forma mais
honesta de revisar, depois, se um padrão ainda faz sentido.

A página inicial (`/`) explica o propósito completo e traz o roadmap de
estudo atual — o que já está documentado e o que ainda está planejado.

## Estrutura

| Área | Rota | Situação |
| --- | --- | --- |
| Padrão Frontend | `/padrao-frontend` | Disponível |
| Padrão API | `/padrao-api` | Em construção |
| Padrão Infraestrutura | `/padrao-infraestrutura` | Em construção |
| Exemplos | `/examples` | Em construção |

Cada área é uma pasta `docs-<area>/` de arquivos `.md` na raiz do projeto —
o conteúdo é lido em runtime (ver `src/lib/docs.ts`): jogar um `.md` novo
na pasta já cria a rota, sem precisar de build ou de um `page.tsx` por
artigo.

## Rodando localmente

```bash
corepack pnpm install
corepack pnpm run dev
```

Em desenvolvimento o site abre sem senha. Em produção (deploy na Vercel),
o site inteiro fica atrás de HTTP Basic Auth — ver a seção abaixo.

## Segurança

Este site não tem base de usuário: é conteúdo estático renderizado a
partir de markdown. A proteção é HTTP Basic Auth em `proxy.ts`, aplicada
a toda rota, com credenciais vindas de variável de ambiente
(`WIKI_BASIC_AUTH_USER`/`WIKI_BASIC_AUTH_PASS`, nunca commitadas — ver
`.env.example`) e fechamento por padrão em produção: sem as duas
variáveis configuradas, o site retorna 401 pra todo mundo, inclusive o
dono, em vez de abrir por omissão de configuração.

O motivo de documentar segurança em tanto detalhe — e por que isso não é
um risco — está explicado em
[`docs-frontend/seguranca/PROTECAO-DA-WIKI.md`](docs-frontend/seguranca/PROTECAO-DA-WIKI.md).

## Licença

Conteúdo pessoal, sem licença de uso definida.
