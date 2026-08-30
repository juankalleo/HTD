---
video: 9VQv-H1jvbg
videoEn: cjIswDCKgu0
sidebar_label: Debounce & Throttle
---

# Debounce & Throttle

Técnicas para limitar a frequência de execução de uma função (como
chamadas de API disparadas por eventos de scroll ou digitação). São
parecidas mas resolvem problemas diferentes: **debounce** espera um
período de silêncio antes de executar (útil pra "usuário parou de
digitar"), **throttle** garante um intervalo mínimo entre execuções,
mesmo que o evento continue disparando sem parar (útil pra scroll/resize,
que disparam dezenas de vezes por segundo).

## No padrão frontend

**Debounce** é o padrão de todo campo de busca — o componente de busca
compartilhado (`shared/ui/filtros/search-input.tsx`, ver
[Busca](/padrao-frontend/componentes/busca)) guarda o que o usuário está
digitando num estado local (`rascunho`) e só propaga pro filtro real (e
dispara a query) depois de 350ms sem nova tecla:

```tsx
const [rascunho, setRascunho] = useState(valor);

// sincroniza de volta se o filtro mudar por fora (ex.: botão "limpar filtros")
useEffect(() => {
  const frame = window.requestAnimationFrame(() => setRascunho(valor));
  return () => window.cancelAnimationFrame(frame);
}, [valor]);

// só propaga pro filtro de verdade depois de 350ms sem digitar
useEffect(() => {
  if (rascunho === valor) return;
  const timeout = window.setTimeout(() => onChange(rascunho), 350);
  return () => window.clearTimeout(timeout);
}, [rascunho]);
```

Usamos porque um campo de busca sem debounce dispararia uma requisição por
tecla — 350ms é o equilíbrio entre "sentir responsivo" e "não spammar a
API". Filtro por `<select>` não precisa disso (o disparo já é discreto,
por `onChange`, não por tecla).

**Throttle** não é usado hoje — não existe no padrão nenhum handler de
evento de alta frequência (scroll, resize, mousemove) pra limitar. Se
aparecer um caso (por exemplo, recalcular um layout no resize da janela),
o padrão a seguir é o mesmo do debounce acima: estado local + `setTimeout`
próprio, sem trazer lib nova (`lodash.throttle` etc.) só pra um caso.
