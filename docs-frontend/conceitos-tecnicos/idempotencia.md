---
sidebar_label: Idempotência
---

# Idempotência

Uma operação é idempotente quando repeti-la produz o mesmo resultado que
executá-la uma vez — `PUT`/`DELETE` são idempotentes por definição HTTP,
`POST` normalmente não é. O caso prático que mais importa pra frontend:
clique duplo, ou um retry automático depois de timeout, disparando a
**mesma** criação duas vezes — sem proteção, isso cria dois registros
onde deveria criar um.

## No padrão frontend

**Parcialmente coberto — proteção na UI, sem garantia de rede.** Todo
formulário do padrão desabilita o botão de submit enquanto a mutation
está pendente (confirmado: 11 arquivos usam `disabled={isPending}`/
`disabled={isSubmitting}`, ver [Formulários](/padrao-frontend/formularios)):

```tsx
<button type="submit" disabled={isPending}>
  {isPending ? "Salvando..." : "Salvar"}
</button>
```

Isso barra o caso mais comum (clique duplo/impaciência do usuário) — o
segundo clique não dispara nada porque o botão já está desabilitado antes
do primeiro `fetch` sair. **Não cobre**, porque não é o mesmo problema:

- **Retry de rede** — se o `fetch` do primeiro clique falhar por timeout
  mas a requisição já tiver chegado no servidor (a resposta que se perdeu,
  não o pedido), um retry automático criaria um segundo registro. O
  padrão de mutation deste projeto (`useAdminCreate`, ver
  [Dados e API](/padrao-frontend/tratamento-de-dados/dados-e-api)) não
  faz retry automático em `POST` hoje — então esse cenário específico não
  acontece no código atual, mas também não tem proteção estrutural contra
  ele se um retry for adicionado no futuro.
- **Chave de idempotência real** — verificado na API: nenhum endpoint
  aceita um header tipo `Idempotency-Key` (o padrão usado por APIs de
  pagamento — Stripe é o exemplo mais citado — pra garantir que reenviar
  a mesma requisição, com a mesma chave, nunca duplica o efeito, mesmo se
  o cliente não souber se a primeira tentativa chegou a processar).

**O que precisaria mudar, se um fluxo realmente sensível a duplicata
aparecer** (hoje nenhum recurso deste projeto tem essa criticidade — é
CRUD administrativo, uma criação duplicada é inconveniente, não
catastrófica): a API precisaria aceitar uma chave de idempotência por
requisição de criação (gerada no front, um UUID por tentativa de submit,
reenviado igual em caso de retry) e devolver o mesmo resultado da
primeira vez que visse a mesma chave de novo — sem isso do lado da API,
nenhuma mudança só no front resolve o problema de verdade (o front pode
evitar mandar duas vezes por engano, mas não pode garantir que a API
trate um reenvio genuíno como repetição, não como criação nova).

## Leitura de apoio

- [Designing Data-Intensive Applications — cap. 9 (Consistency and Consensus)](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) — idempotência como ferramenta central pra lidar com incerteza de rede.
- [Stripe — Idempotent Requests (docs)](https://stripe.com/docs/api/idempotent_requests) — a referência de mercado mais citada pro padrão de `Idempotency-Key`.
