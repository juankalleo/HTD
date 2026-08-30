---
sidebar_label: Kernel, netfilter e firewall
---

# Kernel, netfilter e firewall

Firewall não é um programa separado rodando ao lado do sistema — é uma configuração aplicada
direto dentro do **kernel**, no subsistema de rede. Vale entender a cadeia completa, do pacote
chegando na placa de rede até a decisão de deixar passar ou derrubar.

## netfilter — o subsistema por dentro do kernel

**netfilter** é o subsistema do kernel Linux responsável por examinar **todo pacote** que entra,
sai ou atravessa a máquina, em pontos bem definidos do caminho que o pacote percorre dentro do
kernel (os chamados *hooks*). Ele não decide sozinho o que fazer com cada pacote — expõe pontos de
extensão onde regras podem ser plugadas. `iptables` (e seu sucessor mais novo, `nftables`) são as
ferramentas que **escrevem** essas regras; netfilter é quem as **executa**.

## iptables — regras organizadas em cadeias

Uma regra de `iptables` é, no fundo, um "se o pacote bater nesse critério, faça essa ação"
(`ACCEPT`, `DROP`, `REJECT`...). Regras são organizadas em **cadeias** (*chains*), cada uma
correspondendo a um ponto do caminho do pacote — as três mais relevantes pra um servidor comum:

- **INPUT**: pacotes chegando **pra essa máquina**.
- **OUTPUT**: pacotes **saindo** dessa máquina.
- **FORWARD**: pacotes que essa máquina só está **repassando** adiante (relevante quando a máquina
  roteia tráfego pra outra, por exemplo containers atrás de NAT).

Cada cadeia processa suas regras **em ordem**, de cima pra baixo — a primeira regra que casar com
o pacote decide o destino dele, e o processamento pra por ali (as regras abaixo dessa nem são
avaliadas). Isso é uma fonte comum de bug de configuração: uma regra permissiva colocada acima de
uma restritiva por engano faz a restritiva nunca ser alcançada.

## O princípio central: negar por padrão

A postura correta de qualquer firewall de produção é **default deny**: a política padrão da cadeia
é `DROP` — bloqueia tudo — e só então regras específicas **liberam exatamente** o que precisa
passar (geralmente: a porta do serviço web, a porta de SSH, e pouco mais). É o oposto de "bloquear
o que é claramente malicioso" — que é impossível de manter completo — e sim "permitir só o que é
claramente necessário", que é uma lista pequena e auditável.

Uma pegadinha real e comum: mudar a política padrão pra `DROP` **antes** de garantir que a regra
que libera SSH já está em vigor derruba a própria conexão que está configurando o firewall — o
que, numa VPS remota sem acesso físico, significa perder acesso à máquina até alguém reiniciá-la
por fora (console do provedor). A ordem de aplicar as regras importa tanto quanto o conteúdo delas.

## ufw — a camada de conveniência sobre o iptables

`iptables` puro é poderoso mas verboso e fácil de errar. `ufw` (*Uncomplicated Firewall*) é uma
camada mais simples por cima dele — comandos como `ufw allow 443/tcp` ou `ufw default deny
incoming` geram, por trás, as regras de `iptables` equivalentes. Não é um mecanismo diferente, é
uma forma mais legível de configurar o mesmo netfilter.

## conntrack — por que uma resposta consegue voltar

Se a política padrão é bloquear tudo que entra, como a *resposta* de uma conexão que a própria
máquina iniciou consegue voltar? A resposta é **conntrack** (*connection tracking*): o kernel
mantém uma tabela de conexões já estabelecidas, e uma regra típica de firewall libera
explicitamente pacotes que pertencem a uma conexão **já em andamento ou relacionada**
(`ESTABLISHED,RELATED`), sem precisar abrir a porta de origem manualmente pra cada resposta
possível. É o que permite, por exemplo, que uma requisição HTTP de saída (a máquina consultando um
serviço externo) receba resposta, mesmo com a cadeia INPUT em `DROP` por padrão — a resposta é
reconhecida como parte de uma conexão que a própria máquina abriu.

## Leitura de apoio

- [DigitalOcean — How the Iptables Firewall Works](https://www.digitalocean.com/community/tutorials/iptables-essentials-common-firewall-rules-and-commands) — regras, cadeias e comandos comuns, explicado de forma prática.
- [Ubuntu — UFW documentation](https://help.ubuntu.com/community/UFW) — documentação oficial do ufw.
