---
sidebar_label: Visão geral
---

# Padrão Infraestrutura

> **Tecnologia principal: Docker + Docker Compose**, atrás de proxy reverso. Fundamentos escritos pra quem nunca mexeu com infra — sem pular etapa.

## Como usar esta área

Escrito pra ser lido do começo, por quem nunca trabalhou com infraestrutura antes — cada página
constrói sobre a anterior, sem assumir conhecimento prévio de rede, Linux ou containers. Se você
já sabe o que é TCP/IP, kernel e Docker, pode pular direto pra
[Docker Compose](/padrao-infraestrutura/tecnologias/docker-compose). Se não sabe, comece pelos
[fundamentos de rede](/padrao-infraestrutura/conceitos-tecnicos/rede-e-protocolos) — vale o
investimento, porque toda decisão de infra depende desses conceitos.

## Fundamentos (do zero)

- [Hardware, kernel e processos](/padrao-infraestrutura/conceitos-tecnicos/hardware-kernel-e-processos) — bit, byte, CPU, RAM, disco, o kernel como único ponto de contato com hardware, processo vs. thread.
- [Rede e protocolos](/padrao-infraestrutura/conceitos-tecnicos/rede-e-protocolos) — IP, porta, pacote, TCP vs. UDP, DNS.
- [HTTP, HTTPS e TLS](/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls) — o protocolo da web e como a criptografia entra nele, incluindo SNI.
- [VPS e containers](/padrao-infraestrutura/conceitos-tecnicos/vps-e-containers) — o que é uma VPS, o que é um container, a diferença real pra uma VM.

## Rede e segurança de borda

- [Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall) — do pacote chegando na placa de rede até a decisão `ACCEPT`/`DROP`, passando por `iptables` e `ufw`.
- [Proxy reverso e CDN](/padrao-infraestrutura/conceitos-tecnicos/proxy-reverso-e-cdn) — por que colocar algo na frente da aplicação, e o que um CDN resolve além de cache.

## Operação

- [Limites de recursos e OOM Killer](/padrao-infraestrutura/conceitos-tecnicos/limites-de-recursos-e-oom) — por que todo container precisa de teto de CPU/memória definido, e o que acontece quando a memória do host acaba.
- [Cultura DevOps](/padrao-infraestrutura/conceitos-tecnicos/devops-e-cultura) — de onde o termo vem, e por que não é sinônimo de "ferramenta de deploy".

## Tecnologias

- [Docker Compose](/padrao-infraestrutura/tecnologias/docker-compose) — o formato real de um `docker-compose.yml` de app + banco, com build-time vs. runtime bem separados.
