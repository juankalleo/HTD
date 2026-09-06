---
sidebar_label: Refactoring
date: "29 de agosto de 2026"
---

# Refactoring

![Capa de Refactoring](https://covers.openlibrary.org/b/id/8507565-M.jpg)

**Martin Fowler**, com Kent Beck · 2ª edição, Addison-Wesley, 2018 ·
ISBN 978-0134757599

O livro que nomeou e catalogou "refatoração": mudar a estrutura interna
de um código sem mudar o comportamento observável dele. A 2ª edição
reescreveu todos os exemplos em JavaScript (a 1ª era em Java) — cada
técnica vem com passo a passo mecânico, não só o conceito solto.

## Assuntos principais

- **"Code smells"** — os sinais de que um código precisa de refatoração
  (duplicação, função longa demais, classe fazendo coisa demais) — um
  vocabulário compartilhado pra apontar problema sem precisar reescrever
  a regra do zero cada vez.
- **Catálogo de refatorações** — dezenas de transformações nomeadas
  (`Extract Function`, `Inline Variable`, `Replace Conditional with
  Polymorphism`), cada uma com o passo a passo seguro de aplicar.
- **Testes como rede de segurança** — por que refatorar sem teste
  automatizado cobrindo o comportamento é, na prática, reescrever às
  cegas.
- **Refatoração em pequenos passos** — a disciplina central do livro:
  cada passo é pequeno o bastante pra ser óbvio que não quebrou nada,
  nunca um "big bang" de mudança estrutural de uma vez.

## Onde aparece no padrão frontend

O princípio "três linhas parecidas é melhor que abstração prematura" (ver
CLAUDE.md deste projeto, e repetido em toda decisão de "avaliado, não
adotado" na wiki) é o mesmo espírito do livro: refatorar quando a
duplicação **dói de verdade**, não antes — extrair abstração cedo demais
é o oposto do que o livro recomenda tanto quanto duplicação
descontrolada.

## Leitura de apoio

- [refactoring.com](https://refactoring.com/) — site oficial, com o catálogo completo de refatorações navegável.
