---
sidebar_label: Sanitização de Inputs
date: "29 de agosto de 2026"
---

# Sanitização de Inputs

Processo de limpar e filtrar dados inseridos pelo usuário antes de
renderizá-los na tela para impedir a execução forçada de HTML ou scripts.
Cobre dois momentos diferentes: **validar** o que entra (o dado tem o
formato esperado?) e **escapar** o que sai (o dado, ao virar HTML, não vira
código executável?).

## No padrão frontend

**Na entrada**, todo formulário valida via schema Zod antes de qualquer
`fetch`, espelhando exatamente a regra do backend Rails (nunca mais forte
que ele) — ver [Formulários](/padrao-frontend/formularios). Isso barra
formato errado, mas não é a defesa principal contra HTML/script — Zod
valida *shape*, não teor malicioso de uma string de texto livre.

**Na saída**, a defesa real contra HTML/script "escapando" do dado é
estrutural: o React escapa automaticamente todo valor interpolado em JSX
— cobre 100% das telas do padrão, sem precisar de uma função de
sanitização manual espalhada pelo código. Detalhe completo em [XSS](xss.md).

A única superfície onde o padrão monta HTML a partir de string concatenada
(não JSX) é a exportação de PDF — ali existe uma função dedicada de
escape (`escapeHtml`/`valorHtml`), testada com payload de ataque real. A
exportação de Excel tem sua própria ameaça específica (fórmula que executa
sozinha ao abrir a planilha), neutralizada por `valorCelulaSegura`. As
duas em [Segurança de exportação](seguranca-exportacao.md).
