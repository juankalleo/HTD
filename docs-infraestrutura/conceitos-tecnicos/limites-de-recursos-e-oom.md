---
sidebar_label: Limites de recursos e OOM Killer
---

# Limites de recursos e OOM Killer

## Por que todo container precisa de teto

Sem limite explícito, um container pode consumir toda a CPU ou memória disponível na máquina —
inclusive por acidente (um vazamento de memória, uma query pesada demais, um loop infinito), não
só por um ataque deliberado. Numa máquina com vários containers, um único sem teto pode sufocar
todos os outros, mesmo que o problema esteja isolado nele. Definir teto de CPU e memória por
container (no `docker-compose.yml`, `deploy.resources.limits`) é a diferença entre "esse serviço
com problema" e "a máquina inteira ficou lenta".

## Por que os tetos de CPU não precisam somar o total de núcleos

Como visto em
[Hardware, kernel e processos](/padrao-infraestrutura/conceitos-tecnicos/hardware-kernel-e-processos),
um teto de CPU é um **limite máximo**, não uma reserva exclusiva — a maior parte do tempo, a
maioria dos processos está esperando I/O, não computando. Isso permite dar tetos generosos pra
vários containers numa máquina de poucos núcleos, mesmo que a soma dos tetos ultrapasse o total
físico — eles raramente batem no teto ao mesmo tempo. Memória é diferente: RAM não é
"time-shared" da mesma forma — o que um processo aloca fica alocado até ser liberado. Somar limite
de memória além do total físico disponível é sempre arriscado.

## O que acontece quando a memória acaba: o OOM Killer

Diferente de CPU (que só fica mais lenta sob disputa), memória é um recurso rígido — quando um
processo pede mais RAM do que existe disponível, o kernel Linux não pode simplesmente "esperar".
Ele aciona o **OOM Killer** (*Out-Of-Memory Killer*): um mecanismo que escolhe um processo — pelo
score interno do kernel, geralmente o de maior consumo — e o mata à força, sem aviso prévio, pra
liberar memória e manter o sistema no ar.

Alguns efeitos práticos disso:

- Um container morto pelo OOM Killer não gera um erro de aplicação normal — o processo
  simplesmente desaparece (`docker inspect` mostra `OOMKilled: true` no container parado). Sem
  monitorar isso explicitamente, o sintoma visível é só "o serviço caiu do nada".
- Sem limite de memória definido por container, um único container com vazamento de memória pode
  consumir RAM até acionar o OOM Killer — que pode escolher matar **qualquer** processo da
  máquina, inclusive um completamente saudável, não necessariamente o culpado.
- Com limite de memória definido por container, o Docker aplica esse teto via **cgroups** (o
  mecanismo do kernel Linux que Docker usa por baixo pra isolar recursos) — o container que
  estourar o próprio limite é reiniciado ou morto isoladamente, sem arriscar o resto da máquina.

## A prática certa

Todo container de produção deveria ter `limits.cpus` e `limits.memory` definidos explicitamente —
nunca deixar no padrão "sem teto". O valor certo vem de observar o consumo real do serviço sob
carga (não de um chute), com alguma margem — teto baixo demais mata o próprio processo sem
necessidade, teto alto demais não protege a máquina de nada.

## Leitura de apoio

- [Docker docs — Resource constraints](https://docs.docker.com/config/containers/resource_constraints/) — como `cpus`/`memory` são aplicados via cgroups.
- [The Linux OOM Killer explained (kernel.org / LWN)](https://lwn.net/Articles/317814/) — como o kernel decide qual processo matar.
