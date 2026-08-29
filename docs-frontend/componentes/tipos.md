---
video: zu-EgnbmcLY
sidebar_label: Tipos (TypeScript)
---

# Tipos (TypeScript)

De onde vêm os tipos compartilhados e de domínio do frontend. A regra é:
**o tipo de domínio nasce do Zod (schema) ou do contrato da API**, e é
re-exportado de um ponto único por feature.

## 1. Tipos da API (`services/*`)

Contratos brutos do backend ficam em `services/`. Exemplo em
`services/api-admin.ts`:

```ts
export type PagyInfo = { current_page: number; total_pages: number; total_count: number; per_page: number };
export type PagedResult<T> = { items: T[]; pagy: PagyInfo };
```

Erros de admin também são tipados (`AdminApiError` com `status`).

## 2. Schemas Zod por feature (`features/<x>/schemas`)

Cada feature define seus próprios schemas em `features/<feature>/schemas/*.schema.ts`,
espelhando as validações reais do backend (nunca mais fortes que o Rails).
O tipo do formulário vem de `z.infer`:

```ts
// features/admin/usuarios/schemas/usuario.schema.ts
import { z } from "zod";

export const usuarioFormSchema = z.object({
  nome: z.string().min(1, "Informe o nome"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  aTipoUsuarioId: z.string().min(1, "Selecione um tipo de usuário"),
  password: z.string().min(6, "Mínimo de 6 caracteres").or(z.literal("")),
});

export type UsuarioFormValues = z.infer<typeof usuarioFormSchema>;
```

O schema é a fonte da verdade para validação (React Hook Form + Zod) **e**
para o tipo usado no formulário.

## Por que Zod (e não outra forma)

O ponto não é "validar" — é ter **uma única fonte de verdade** pro formato
do dado. TypeScript some em runtime (`interface`/`type` viram nada após o
`tsc`), então qualquer dado que entra de fora (formulário, resposta de API,
env) é `unknown` não confiável. Zod valida em runtime **e** infere o tipo
estático a partir do schema (`z.infer`), então schema e tipo nunca
divergem — ao contrário de manter uma `interface` e uma função de validação
separadas (Joi, Yup, `class-validator`, `io-ts`, ou validação manual) que
acabam dessincronizadas. Por isso o projeto padroniza Zod em toda fronteira
de confiança (schemas de feature, resolver do React Hook Form, checagem de
payload em `services/`).

Leitura de apoio:
[When should you use Zod? (Matt Pocock)](https://www.totaltypescript.com/when-should-you-use-zod)
e
[TypeScript vs Zod: clearing up validation confusion (LogRocket)](https://blog.logrocket.com/when-use-zod-typescript-both-developers-guide/)
— por que validar na fronteira e por que o Zod venceu o ecossistema
(TypeScript-nativo, inferência a partir do schema, integração com React Hook
Form/Next.js) em vez de libs alternativas.

## 3. Re-export em `features/<x>/types/index.ts`

Os tipos de domínio são expostos num barrel por feature, para o resto do
app importar de um caminho estável:

```ts
// features/admin/config-institucional/types/index.ts
export type { ConfiguracaoInstitucional } from "@/services/api-institucional";
```

## Convenções

- **Não** duplique tipos: importe de `services/*` ou do `types/index.ts` da
  feature — não redeclare `interface` solta num componente.
- Schemas Zod vivem em `schemas/`, tipos derivados em `types/`.
- O `useAdminResource` (`shared/hooks/use-admin-resource.ts`) é genérico em
  `T` e consome `PagedResult<T>` — o `T` vem desses tipos de feature.
- Ver também: [Formulários](/padrao-frontend/formularios) (RHF + Zod) e
  [Tratamento de dados](/padrao-frontend/tratamento-de-dados).
