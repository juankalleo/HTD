---
sidebar_label: Hugeicons
date: "30 de agosto de 2026"
---

# Hugeicons — avaliado, não adotado

## O que é

Biblioteca de ícones SVG como componente React (`@hugeicons/react`), com um catálogo bem maior
que o do Lucide (milhares de ícones, vários estilos — *stroke*, *duotone*, *bulk*) e opção de
licença paga pra parte do catálogo.

## Por que não entrou

Considerado na mesma fase de "Sistema" (design tokens) em que [lucide-react](lucide-react.md) foi
escolhido — ver [lucide-react.md](/padrao-frontend/tecnologias/lucide-react). Lucide venceu por
três motivos concretos: licença 100% permissiva em todo o catálogo (Hugeicons reserva parte do
catálogo pra um plano pago), catálogo mais enxuto e consistente em estilo único (Hugeicons, por
ter mais estilo visual disponível, exige decidir e manter consistência entre eles em todo o
projeto — uma decisão de design a mais pra sustentar), e ser a mesma lib já usada nos projetos de
referência da stack, evitando confusão sobre qual lib de ícone importar em qual contexto.

## Quando faria sentido considerar de novo

Se o catálogo do Lucide não tivesse um ícone necessário pra um domínio específico (algo bem fora
do vocabulário visual comum de UI admin) — aí valeria avaliar complementar com Hugeicons só pra
esse caso específico, não substituir o Lucide como base.

## Leitura de apoio

- [Hugeicons — site oficial](https://hugeicons.com/) — catálogo e licenciamento.
