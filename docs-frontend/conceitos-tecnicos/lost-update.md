---
sidebar_label: Lost Update
date: "29 de agosto de 2026"
---

# Lost Update

Problema clássico de concorrência em dado compartilhado: dois usuários
abrem o mesmo registro pra editar, ambos veem a versão antiga, o primeiro
salva, e o segundo salva por cima — sobrescrevendo a mudança do primeiro
sem nunca saber que ela existiu. Nenhum dos dois recebeu erro, o sistema
não percebeu conflito nenhum, e uma edição real simplesmente desaparece.
É um dos casos centrais do capítulo de controle de concorrência de
*Designing Data-Intensive Applications* (ver
[Leitura recomendada](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications)).

## Como tratar no frontend

A defesa de verdade é *optimistic locking*: comparar a versão do registro
que o usuário está editando com a versão atual no servidor, no momento de
salvar — não travar o registro (isso mata colaboração real), só detectar
quando alguém mais mexeu nele primeiro.

1. **Carregar com um carimbo de versão.** O fetch inicial do registro
   traz junto um `updated_at` ou uma coluna de versão dedicada
   (`lock_version`, incrementada a cada update — é o mecanismo nativo do
   ActiveRecord no Rails). O formulário guarda esse valor, além dos campos
   editáveis.
2. **Mandar esse valor junto ao salvar.** O `PATCH`/`PUT` inclui a versão
   que o front tinha quando carregou o registro, não só os campos
   alterados.
3. **A API compara antes de gravar.** Se a versão recebida bater com a
   atual, salva normal. Se não bater, alguém salvou por cima entre o
   fetch e o submit — a API rejeita com `409 Conflict` em vez de
   sobrescrever silenciosamente.
4. **O front trata o 409 como um caso real, não um toast genérico.** A
   resposta de conflito devolve a versão atual do servidor; a tela de
   conflito mostra lado a lado o que o usuário editou e o que já foi
   salvo por outra pessoa, e deixa escolher: manter a própria versão,
   descartar e recarregar, ou mesclar campo a campo.

Sem as quatro etapas, um "salvar" que parece ter funcionado pode estar
apagando silenciosamente o trabalho de outra pessoa — o sistema nunca
avisa, porque tecnicamente nenhuma das duas operações falhou.

## Leitura de apoio

- [Leitura recomendada — Designing Data-Intensive Applications](/padrao-frontend/leitura-recomendada/designing-data-intensive-applications) — capítulo 7 (Transactions) cobre lost update e as estratégias reais de prevenção (locking, CAS, detecção automática).
- [Rails — Optimistic Locking (docs)](https://api.rubyonrails.org/classes/ActiveRecord/Locking/Optimistic.html) — o mecanismo `lock_version` nativo do ActiveRecord, a forma mais direta de implementar o passo 1-3 num backend Rails.
