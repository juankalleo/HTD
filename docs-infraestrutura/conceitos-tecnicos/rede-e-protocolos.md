---
sidebar_label: Rede e protocolos
date: "30 de agosto de 2026"
---

# Rede e protocolos

Uma rede de computadores é, no fundo, um jeito de duas máquinas trocarem sequências de bytes
entre si. Pra isso funcionar em escala global, existem camadas de protocolo — cada uma resolve um
problema específico.

## Endereço IP e porta

**IP**: identifica uma máquina na rede, como um endereço postal — único, público, qualquer
máquina na internet consegue tentar falar com ele. Existem IPs privados (por exemplo, a faixa
`172.18.0.0/16`, comumente usada por redes internas de Docker) que só funcionam dentro de uma
rede local — a internet não sabe rotear pra eles diretamente.

**Porta**: um número de 0 a 65535 que identifica **qual serviço**, dentro de uma máquina, deve
receber os dados. Uma máquina tem um IP só, mas roda dezenas de serviços diferentes — a porta
diferencia "essa conexão é pro banco" (normalmente 5432, no caso do Postgres) de "essa é pro
servidor web" (normalmente 443). Uma porta "aberta" ou "fechada" é sobre o firewall permitir ou
não tráfego chegando nela — ver
[Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall).

**Pacote**: dado não viaja inteiro de uma vez — é quebrado em pedaços pequenos, cada um com um
cabeçalho dizendo origem, destino e número de sequência, pra poderem ser remontados na ordem
certa do outro lado, mesmo chegando fora de ordem ou parcialmente perdidos.

## TCP vs. UDP

**TCP**: confiável. Antes de mandar dado de verdade, as duas pontas fazem um "aperto de mão"
(*3-way handshake*) confirmando que ambas estão prontas. Cada pacote é confirmado — se um se
perde, é reenviado. Mais lento que UDP, mas garante entrega e ordem. A grande maioria do tráfego
de aplicação web usa TCP: SSH, HTTP/HTTPS, conexão de banco de dados.

**UDP**: "manda e esquece" — não confirma entrega, não garante ordem. Mais rápido, usado onde
perder um pacote ocasional não é grave (streaming, jogo online, DNS).

## DNS — como um nome vira um IP

Ninguém digita um IP no navegador — digita um domínio. O **DNS** traduz nome → IP, como uma agenda
telefônica distribuída globalmente. Um domínio real na prática comum não aponta direto pro IP do
servidor de origem — aponta pros IPs de um provedor de CDN/proxy (ver
[Proxy reverso e CDN](/padrao-infraestrutura/conceitos-tecnicos/proxy-reverso-e-cdn)), que sabe
repassar o tráfego pro servidor real por trás, permitindo filtrar tráfego malicioso antes mesmo de
chegar lá.

## Cliente e servidor

**Cliente**: quem inicia a conexão pedindo algo (um navegador, um app mobile). **Servidor**: quem
espera conexões e responde. Uma mesma máquina pode ser cliente de um serviço e servidor de outro
ao mesmo tempo — um servidor de aplicação é servidor pros usuários finais, mas é cliente quando
faz upload de um arquivo pra um serviço de armazenamento externo, por exemplo.

## Leitura de apoio

- [High Performance Browser Networking — Ilya Grigorik](/padrao-frontend/leitura-recomendada/high-performance-browser-networking) — TCP, TLS e performance de rede no navegador, em profundidade.
- [MDN — An overview of HTTP](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) — onde HTTP se encaixa em cima de tudo isso.
