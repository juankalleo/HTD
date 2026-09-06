---
video: yMif1McmBls
videoEn: ir9klkHKCmE
date: "29 de agosto de 2026"
---

# SweetAlert2

## O que é

Biblioteca de alertas/toasts. Aqui é usada em dois wrappers:
`Toast` para feedback sem bloqueio e `confirmDialog` para confirmação
destrutiva.

## Por que essa

O feedback de formulário é sempre via toast, nunca banner
fixo dentro do formulário. Os formulários de autenticação usavam banner
inline e foram convertidos pra toast + `form.setError()` no campo relevante
quando faz sentido (login marca "senha" como inválido sem repetir a
mensagem, que já foi pro toast). Leitura de apoio:
[documentação oficial do SweetAlert2](https://sweetalert2.github.io/) — por
que centralizar feedback em toast/confirmação em vez de banner inline.

## Versão

`^11.26.25` (`package.json`).

## Como importar

```bash
pnpm add sweetalert2
```

Não se importa `sweetalert2` direto nos componentes — sempre pelos wrappers
do projeto, que já fixam posição, estilo, duração e botões:

```ts
import { confirmDialog, Toast } from "@/shared/ui";
```

## Exemplo real — Toast

`shared/ui/sistema/toast.tsx`:

```tsx
export const Toast = {
  success: (input: ToastInput) => Toast.fire({ ...normalize(input), icon: "success" }),
  error: (input: ToastInput) => Toast.fire({ ...normalize(input), icon: "error" }),
  warning: (input: ToastInput) => Toast.fire({ ...normalize(input), icon: "warning" }),
  info: (input: ToastInput) => Toast.fire({ ...normalize(input), icon: "info" }),
};
```

Uso real (`features/autenticacao/login/hooks/use-login-form.ts`):

```ts
if (!resultado.ok) {
  void Toast.error({ title: "Não foi possível entrar", description: resultado.message });
  form.setError("password", { message: " " });
  return;
}

void Toast.success({ title: "Sessão iniciada", description: nome ? `Bem-vindo, ${nome}` : undefined });
```

`void` na frente porque `Toast.success`/`.error` devolvem uma Promise do
SweetAlert2 que ninguém precisa aguardar (o toast já fecha sozinho).

## Exemplo real — Confirmação destrutiva

`shared/ui/sistema/confirm-dialog.ts`:

```tsx
const confirmado = await confirmDialog({
  title: "Excluir usuário",
  text: "Essa ação não pode ser desfeita.",
  icon: "warning",
  confirmButtonText: "Excluir",
  confirmVariant: "destructive",
});

if (confirmado) excluir(usuario.id);
```

Regra: exclusão e ação irreversível não usam `window.confirm`; usam
`confirmDialog`.
