---
sidebar_label: pnpm
date: "30 de agosto de 2026"
---

# pnpm

## O que é

Gerenciador de pacote JavaScript/Node — instala dependência, resolve versão, roda script do
`package.json` (`pnpm dev`, `pnpm build`...). Mesma função central de npm e Yarn, com uma forma
diferente de guardar o pacote no disco.

## npm, pnpm e Bun — o que cada um resolve

- **npm** — o gerenciador que já vem instalado junto com o Node, o baseline de fato do
  ecossistema. Cada projeto tem sua própria cópia de cada dependência dentro de `node_modules` —
  simples e universal, mas em várias máquinas/projetos isso significa a mesma versão da mesma
  lib fisicamente duplicada dezenas de vezes no disco.
- **pnpm** — resolve exatamente esse desperdício: guarda cada versão de cada pacote **uma vez só**
  num store global do sistema (`~/.pnpm-store`), e cada projeto só recebe **links simbólicos**
  apontando pra esse store dentro do próprio `node_modules`. Instalação mais rápida (não baixa nem
  copia o que já existe no store) e MUITO menos espaço em disco quando existe mais de um projeto
  Node na mesma máquina — o ganho cresce com o número de projetos.
- **Bun** — vai além de gerenciador de pacote: é um runtime JavaScript completo (alternativa ao
  Node em si, escrito em Zig, focado em velocidade de startup) que também empacota instalador de
  pacote, bundler e test runner num binário só. Instala pacote muito rápido (paralelo, cache
  agressivo), mas troca o runtime inteiro — não é só "trocar o comando de instalar", é adotar um
  ecossistema diferente do Node puro, com suas próprias arestas de compatibilidade.

## Por que essa (não npm/Bun)

pnpm resolve o problema real (duplicação de disco, instalação lenta) sem trocar de runtime — o
projeto continua rodando em Node puro, qualquer ferramenta/CI que espera Node continua funcionando
sem adaptação. Trocar pra Bun traria ganho de velocidade adicional, mas exigiria validar
compatibilidade de todo o stack (Next.js, bibliotecas nativas) contra um runtime ainda em
maturação mais recente que o Node — troca que só compensa se performance de instalação/execução
virar um gargalo real, o que não é o caso aqui.

## Versão

`packageManager: "pnpm@10.17.1"` (`package.json`) — o Corepack do Node lê esse campo e usa
exatamente essa versão, mesmo que a máquina tenha outra instalada globalmente.

## Como importar

```bash
corepack enable
pnpm install
```

## `pnpm-lock.yaml` — por que nunca editar na mão

Assim como `package-lock.json` do npm, o lockfile do pnpm trava a versão exata (e o hash de
integridade) de toda dependência, direta e transitiva — garante que `pnpm install` produz a
**mesma** árvore de dependência em qualquer máquina, hoje ou daqui a um ano. Editar esse arquivo
manualmente ou deixá-lo divergir do `package.json` (commitando um sem o outro) é a causa mais
comum de "funciona na minha máquina" entre dois ambientes.

## Leitura de apoio

- [pnpm — documentação oficial](https://pnpm.io/) — motivação e mecanismo do content-addressable store.
- [pnpm — Motivation](https://pnpm.io/motivation) — a comparação oficial de espaço em disco contra npm/Yarn.
