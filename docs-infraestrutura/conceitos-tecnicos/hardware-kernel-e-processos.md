---
sidebar_label: Hardware, kernel e processos
date: "30 de agosto de 2026"
---

# Hardware, kernel e processos

## O hardware por trás de tudo

**Bit**: a menor unidade de informação — um interruptor com dois estados, 0 ou 1. **Byte**: 8
bits agrupados, 256 valores possíveis — um caractere de texto simples ocupa 1 byte; arquivo,
imagem, vídeo são medidos em múltiplos disso (KB, MB, GB).

**CPU**: o "cérebro" que executa instrução. Uma CPU moderna tem múltiplos **núcleos** — cada um
executa uma sequência por vez. Um programa que não sabe dividir trabalho entre núcleos só usa 1,
mesmo numa máquina com 8 disponíveis.

**RAM**: onde um programa guarda dado **enquanto está rodando** — rápida, mas perde tudo quando o
processo termina ou a máquina desliga.

**Disco**: armazenamento permanente — mais lento que RAM, não perde dado ao desligar. É onde o
banco de dados vive fisicamente, junto com logs e arquivo do sistema.

## Time-slicing: por que "rodando" não significa "usando a CPU o tempo todo"

Um núcleo processa **uma instrução de cada vez** — não tem como duas coisas acontecerem no mesmo
instante dentro do mesmo núcleo. Mesmo assim, qualquer máquina roda centenas de processos "ao
mesmo tempo". A resposta é **time-slicing**: o sistema operacional dá a cada processo uma fatia
de tempo curtíssima, troca pro próximo, e assim por diante, centenas de vezes por segundo — rápido
o bastante pra parecer simultâneo pra qualquer observador humano.

A peça que costuma confundir: a maioria dos processos, na maior parte do tempo, **não está
processando nada** — está esperando alguma coisa (resposta de rede, disco, ação do usuário).
Enquanto espera, um processo não consome CPU nenhuma, só memória guardando seu estado. Uma
aplicação web processando uma requisição passa a maior parte do tempo esperando o banco
responder — o cálculo em si é rápido, a espera domina o tempo total.

**Por que isso importa pra limite de recursos**: um teto de CPU num container não reserva núcleo
exclusivo o tempo todo — é um limite máximo, aplicado só quando o container realmente precisa. É
por isso que dá pra dar tetos generosos pra vários containers numa máquina de poucos núcleos,
somando mais que o total físico, sem contradição — eles raramente usam o teto inteiro ao mesmo
tempo. Detalhe completo em
[Limites de recursos e OOM Killer](/padrao-infraestrutura/conceitos-tecnicos/limites-de-recursos-e-oom).

## O kernel — o único programa que fala direto com o hardware

Nenhum programa comum (um servidor web, um banco de dados) fala diretamente com o hardware. Existe
um programa especial, rodando desde o instante em que a máquina liga, que é o **único**
intermediário entre todo hardware e todo o resto — o **kernel**. Quando um programa quer ler um
arquivo ou mandar um pacote de rede, ele pede ao kernel através de uma **chamada de sistema**
(*system call*) — uma interface bem definida pela qual um programa pede ao kernel pra executar
algo privilegiado em seu nome.

O kernel Linux é dividido em **subsistemas** especializados: um gerencia memória, outro
processos, outro sistema de arquivos, e um — o **netfilter** — gerencia rede, examinando
literalmente todo pacote que entra, sai ou atravessa a máquina (ver
[Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall)).

## Processo, thread e programa

**Programa**: o código escrito, parado no disco — não está fazendo nada sozinho.

**Processo**: um programa **em execução**. Cada processo tem sua própria fatia isolada de memória
— não pode, por padrão, ler a memória de outro. Rodar 2 processos do mesmo programa custa o dobro
de memória, porque cada um carrega sua própria cópia.

**Thread**: uma linha de execução **dentro** de um processo. Múltiplas threads do mesmo processo
**compartilham a mesma memória** — mais barato que criar um processo novo, mas exige cuidado (duas
threads mexendo no mesmo dado ao mesmo tempo pode corromper o dado).

Um servidor de aplicação típico sobe múltiplos **processos** (chamados de *workers*) e, dentro de
cada um, múltiplas **threads** — o motivo de configurações de concorrência de servidor de
aplicação normalmente aparecerem como duas variáveis separadas: número de processos × threads por
processo.

## Leitura de apoio

- [Distributed Systems — Tanenbaum & Van Steen](/padrao-frontend/leitura-recomendada/distributed-systems) — os mesmos fundamentos de processo, concorrência e comunicação, num nível mais avançado.
- [Operating Systems: Three Easy Pieces (livro gratuito online)](https://pages.cs.wisc.edu/~remzi/OSTEP/) — referência completa sobre processo, memória e concorrência no nível de sistema operacional.
