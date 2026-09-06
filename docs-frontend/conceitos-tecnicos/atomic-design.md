---
video: x-4li6foEN8
videoEn: Yi-A20x2dcA
sidebar_label: Atomic Design
date: "29 de agosto de 2026"
---

# Atomic Design

Metodologia de criação de interfaces que divide componentes em átomos,
moléculas, organismos, templates e páginas — uma hierarquia de cinco
camadas, classificada pela composição estrutural do componente (quantos
elementos filhos tem, se tem estado próprio), não pelo papel que ele
cumpre no produto.

## No padrão frontend

O padrão de organização de `shared/ui/` (ver
[Componentes](/padrao-frontend/componentes)) usa uma taxonomia
própria, deliberada, organizada por **papel** em vez de camada
estrutural (a classificação do Atomic Design):

```text
shared/ui/
  filtros/    # controles de busca/filtro
  tabelas/    # primitivos de tabela + adapter TanStack Table
  relatorios/ # blocos de composição de relatório (KPI, card de gráfico)
  graficos/   # wrappers de biblioteca de gráfico (ECharts/EvilCharts)
  sistema/    # componentes transversais, feedback, utilitários visuais
```

Essa árvore responde bem a pergunta que importa pro dia a dia: o
componente de busca é "controle de busca/filtro" (diz pra que serve), não
"molécula" (diz só que tem mais de um elemento filho). Reclassificar o
que já funciona pela pergunta estrutural do Atomic Design não seria
ganho.

Mesmo raciocínio usado pra decidir não trazer shadcn/ui nem MUI X Charts
pro padrão (ver [Tecnologias](/padrao-frontend/tecnologias)): trocar uma
convenção interna coerente por uma "padrão de mercado" só pelo nome não é
ganho real se a convenção de dentro já resolve o mesmo problema.

**Quando reavaliar:** se o padrão crescer a ponto de "papel" parar de
bastar como critério — um componente genérico demais pra caber com folga
em qualquer pasta acima — aí sim vale reavaliar. Não antes.
