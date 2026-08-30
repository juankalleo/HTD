---
sidebar_label: Cultura DevOps
---

# Cultura DevOps

## De onde vem o termo

**DevOps** foi cunhado por Patrick Debois em 2009, na primeira "DevOpsDays" — uma resposta direta
a um problema cultural, não técnico: times de **Dev**elopment (que querem lançar mudança rápido) e
**Op**erations (que querem estabilidade e evitam mudança) historicamente jogados um contra o
outro, cada um otimizando pra um objetivo que parece competir com o do outro. DevOps propõe que os
dois objetivos — velocidade e estabilidade — não são opostos quando o processo é bom: mudança
frequente e pequena, bem testada e automatizada, é **mais** estável que mudança rara e grande.

## Não é sinônimo de "ferramenta de deploy"

Um erro comum é tratar "DevOps" como o nome de uma ferramenta ou de um cargo que aperta o botão de
deploy. DevOps é uma cultura e um conjunto de práticas — automação de build/teste/deploy (CI/CD),
infraestrutura como código, monitoramento compartilhado entre quem escreve e quem opera o
código — não um produto que se compra nem um cargo isolado que assume toda a responsabilidade de
infra sozinho enquanto o resto do time ignora.

## As Três Vias (Gene Kim, *The Phoenix Project*)

O livro *The Phoenix Project* (Gene Kim) populariza DevOps através de uma narrativa, e resume a
prática em três princípios:

1. **Fluxo (The First Way)**: trabalho flui numa direção só, de Dev até o cliente, o mais rápido e
   visível possível — identificar e eliminar gargalo no caminho todo, não otimizar uma etapa
   isolada às custas das outras.
2. **Feedback (The Second Way)**: um loop de retorno rápido e constante na direção oposta — erro
   de produção volta pra quem escreveu o código o mais rápido possível, não semanas depois num
   relatório.
3. **Aprendizagem contínua (The Third Way)**: cultura de experimentação e repetição — errar rápido,
   aprender com o erro, e transformar esse aprendizado em prática/automação, não em culpa
   individual.

## CALMS (Jez Humble)

Um acrônimo usado pra avaliar se uma organização pratica DevOps de verdade, não só de nome:

- **Culture** — colaboração entre Dev e Ops, responsabilidade compartilhada.
- **Automation** — build, teste e deploy automatizados, não manuais.
- **Lean** — entregar em lotes pequenos, reduzir trabalho em progresso.
- **Measurement** — medir o que importa (tempo de deploy, taxa de falha, tempo de recuperação),
  não vaidade.
- **Sharing** — conhecimento e ferramenta compartilhados entre times, não guardados como poder.

## Por que isso importa pra além do "time de infra"

A ideia central sobrevive mesmo em times pequenos ou sem um "time de DevOps" dedicado: quem
escreve o código carrega parte da responsabilidade por ele rodar bem em produção — não é um
problema que desaparece ao ser "jogado por cima do muro" pra outra equipe. Ferramenta (Docker,
CI/CD, monitoramento) é o que viabiliza essa prática na escala de um time real — não é a prática em
si.

## Leitura de apoio

- [The Phoenix Project — Gene Kim, Kevin Behr, George Spafford](https://itrevolution.com/product/the-phoenix-project/) — o livro que popularizou as Três Vias.
- [Continuous Delivery — Jez Humble, David Farley](https://continuousdelivery.com/) — o livro por trás do acrônimo CALMS.
