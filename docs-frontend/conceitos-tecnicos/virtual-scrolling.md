---
video: lC0cr-fdZ2s
sidebar_label: Virtual Scrolling
---

# Virtual Scrolling

Renderização dinâmica de listas longas na tela, desenhando apenas os itens
visíveis no momento para economizar memória do navegador. Uma lista de
10.000 linhas, sem essa técnica, criaria 10.000 nós de DOM de uma vez; com
virtualização, só os ~20 que cabem na tela existem no DOM a cada momento —
o resto é calculado sob demanda conforme o usuário rola.

## No padrão frontend

Não é usado — porque o problema que essa técnica resolve não existe no
nosso padrão de listagem. Toda tela de listagem admin usa **paginação real
no servidor** (Pagy, na API Rails): o client nunca recebe mais que uma
página de linhas por vez, então não existe lista longa carregada de uma
vez pra virtualizar. Nenhuma lib de virtualização (`react-window`,
`@tanstack/react-virtual`) faz parte do padrão hoje.

A exportação de relatório (PDF/Excel, ver
[Segurança de exportação](/padrao-frontend/seguranca/seguranca-exportacao))
é a única tela que busca o conjunto filtrado inteiro, sem paginar — mas
esse dado nunca vira lista renderizada na tela, só é serializado direto
pro arquivo de saída (PDF ou planilha). Não sendo uma lista visível, essa
técnica não se aplica nem aí.

**Quando usaríamos:** se aparecer uma lista genuinamente longa fora do
padrão de paginação (por exemplo, um seletor com milhares de opções
carregadas de uma vez), `@tanstack/react-virtual` é a escolha natural —
mas só nesse cenário específico, não como padrão geral de listagem.
