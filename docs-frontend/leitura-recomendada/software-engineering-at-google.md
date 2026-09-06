---
sidebar_label: Software Engineering at Google
date: "30 de agosto de 2026"
---

# Software Engineering at Google

![Capa de Software Engineering at Google](https://covers.openlibrary.org/b/id/10450993-M.jpg)

**Titus Winters, Tom Manshreck, Hyrum Wright** · O'Reilly Media, 2020 ·
ISBN 978-1492082798

Não é um livro sobre como programar — é sobre o que muda quando um
código precisa sobreviver anos, com centenas de pessoas mexendo nele.
"Software engineering" (diferente de "programming") é definido logo no
início como "programação integrada ao tempo" — cada decisão de
engenharia é uma troca entre custo agora e custo daqui a 5 anos.

## Assuntos principais

- **Sustentabilidade de código** — por que "funciona" não é a mesma coisa
  que "é sustentável", e como medir a diferença.
- **Cultura de engenharia** — revisão de código, propriedade de código,
  documentação como parte do trabalho, não um extra.
- **Testes em escala** — a pirâmide de testes do Google (unitário,
  integração, e2e), *test flakiness*, e por que teste que falha
  aleatoriamente é pior que não ter teste.
- **Ferramentas e automação** — build system, CI/CD, análise estática —
  como a ferramenta certa reduz o custo de manter disciplina.
- **A "Lei de Hyrum"** — se uma API tem observadores suficientes, todo
  comportamento observável dela (documentado ou não) vira dependência de
  alguém — um dos conceitos mais citados do livro fora do Google.

## Onde aparece no padrão frontend

Base do princípio que atravessa toda esta documentação: cada
decisão registrada com o **porquê**, não só o **o quê** — inclusive
quando a decisão é "avaliado, não adotado" (ver
[Atomic Design](/padrao-frontend/conceitos-tecnicos/atomic-design),
[tecnologias avaliadas](/padrao-frontend/tecnologias)) em vez de silenciar
a alternativa descartada.

## Leitura de apoio

- [abseil.io/resources/swe-book](https://abseil.io/resources/swe-book) — o livro inteiro, disponível gratuitamente online.
