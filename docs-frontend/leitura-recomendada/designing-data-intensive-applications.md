---
sidebar_label: Designing Data-Intensive Applications
---

# Designing Data-Intensive Applications

![Capa de Designing Data-Intensive Applications](https://covers.openlibrary.org/b/id/8434671-M.jpg)

**Martin Kleppmann** · O'Reilly Media, 2017 · ISBN 978-1449373320

O livro de referência sobre como sistemas que guardam e movem dado de
verdade funcionam por baixo — não é sobre um banco específico, é sobre os
problemas que **todo** sistema com dado enfrenta (replicação, partição,
transação, consistência) e como bancos, filas e processadores de stream
resolvem (ou não resolvem) cada um.

## Assuntos principais

- **Confiabilidade, escalabilidade, manutenibilidade** — os três eixos que
  o livro usa pra avaliar qualquer decisão de arquitetura de dado, do
  primeiro capítulo em diante.
- **Modelos de dado e armazenamento** — relacional vs. documento vs.
  grafo, e como cada índice (B-tree, LSM-tree) realmente funciona por
  dentro.
- **Replicação e partição** — como manter cópia do mesmo dado em mais de
  um lugar sem perder consistência, e como dividir dado grande demais pra
  uma máquina só.
- **Transações e controle de concorrência** — isolamento, *lost update*,
  *write skew*, serializabilidade — a base teórica de qualquer discussão
  sobre dois usuários editando o mesmo registro ao mesmo tempo.
- **Sistemas distribuídos e consistência eventual** — por que rede não é
  confiável, relógio não é confiável, e o que dá pra garantir mesmo assim.
- **Processamento em lote e streaming** — a segunda metade do livro, sobre
  mover/transformar dado em escala.

## Onde aparece no padrão frontend

- [Lost Update](/padrao-frontend/conceitos-tecnicos/lost-update) — o
  capítulo de transações é a referência direta pro problema que o front
  ainda não trata.
- [Web Concurrency](/padrao-frontend/conceitos-tecnicos/web-concurrency) —
  o mesmo princípio de "resultado fora de ordem", em escala de sistema.
- [Idempotência](/padrao-frontend/conceitos-tecnicos/idempotencia) —
  idempotência como ferramenta central de consistência sob incerteza de
  rede.

## Leitura de apoio

- [Site oficial do livro (dataintensive.net)](https://dataintensive.net/)
- [O'Reilly — página do livro](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/)
