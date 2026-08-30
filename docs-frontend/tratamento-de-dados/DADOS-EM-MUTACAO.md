---
video: Q-206WRzOHQ
videoEn: 8K1N3fE-cDs
---

# Dados em mutação

**O que é:** qualquer escrita no servidor — login, logout, salvar configuração, alterar senha, primeiro acesso. No `base-front` toda mutação segue a cadeia **React Hook Form (Zod) → `useMutation` → `services/` → Toast**, e o React Query cuida de cachear/atualizar o dado depois.

## O padrão

1. O formulário valida com schema Zod (ver [React Hook Form + Zod](/padrao-frontend/tecnologias/react-hook-form-zod)).
2. O `onSubmit` dispara `mutation.mutate(valores)` — **nunca** `fetch` direto no componente.
3. `mutationFn` chama só `services/` (ver [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api)).
4. `onSuccess` → Toast de sucesso + invalidação/atualização de cache.
5. `onError` → Toast de erro com mensagem da API.

**Exemplo real** — salvar configuração institucional (`features/admin/config-institucional/hooks/use-update-configuracao-institucional.ts`):

```ts
const mutation = useMutation({
  mutationFn: ({ id, formData }) => updateConfiguracaoInstitucionalAdmin(id, formData),
  onSuccess: () => {
    void Toast.success({ title: "Configuração institucional atualizada" });
    qc.invalidateQueries({ queryKey: configInstitucionalKeys.atual });
  },
  onError: (erro) =>
    void Toast.error({
      title: "Não foi possível salvar",
      description: erro instanceof ConfiguracaoInstitucionalApiError ? erro.message : "Tente novamente.",
    }),
});
```

## Estados de carregamento

O componente lê `mutation.isPending` (nome atual do React Query) pra desabilitar botão / mostrar spinner — **não** um `useState` de loading manual. Ex.: `isSubmitting: mutation.isPending` em `use-login-form.ts`.

## Cache após mutação

- **Invalidar** (`invalidateQueries`) quando o dado mudado é lido por outro hook/placeholder — força refetch na próxima leitura.
- **Escrever direto** (`setQueryData`) quando já se tem o valor novo em mãos, pra evitar ida e volta. Ex.: login seta a sessão sem refetch (`features/sistema/config/hooks/use-config-form.ts`):

```ts
queryClient.setQueryData(["auth", "session"], resultado.user);
```

- **Limpar tudo** (`queryClient.clear()`) só no login, pra descartar cache da sessão anterior.

## Upload de arquivo fora do React Hook Form

Arquivo (avatar, logo) vai em `FormData` **fora** do estado do formulário — o React Hook Form não gerencia `File`. O `mutationFn` recebe o `FormData` pronto e o `services/` faz o `fetch` com `multipart/form-data` (ver [Formulários](/padrao-frontend/formularios)).

**Regra do projeto:** componente nunca chama `services/` direto pra mutação, sempre via `useMutation`; o toast de resultado é única responsabilidade do `onSuccess`/`onError` do hook, não espalhado na tela.

## Leitura de apoio

- [TanStack Query — Mutations (docs)](https://tanstack.com/query/latest/docs/framework/react/guides/mutations) — `useMutation`, invalidação e `setQueryData` após escrita.
- [React Hook Form — Docs](https://react-hook-form.com) — formulário que dispara a mutation.
- [Zod — Docs](https://zod.dev) — validação do form antes da mutation.
