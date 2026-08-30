---
sidebar_label: Tratamento de dados
---

# Tratamento de dados

Pasta viva que documenta como o [HTD-Front](https://github.com/juankalleo/HTD-Front) organiza **todo** acesso a dado
remoto — a regra de ouro de que `fetch` só existe em `services/`, e o componente
nunca fala com a API direto. A leitura vive em [Dados e API](dados-e-api.md) e a
escrita em [Dados em mutação](dados-em-mutacao.md).

## Índice

| Tópico | Abrange |
|---|---|
| [Dados e API](dados-e-api.md) | `fetch` só em `services/`, hooks do React Query por feature, onde fica cada `types/` `schemas/` `hooks/` `constants/` `lib/` |
| [Dados em mutação](dados-em-mutacao.md) | Cadeia de escrita: schema Zod → `useMutation` → `services/` → Toast, e a atualização de cache depois de cada mutação |
