---
sidebar_label: Load balancer
date: "30 de agosto de 2026"
---

# Load balancer

## O problema que resolve

Uma aplicação que roda numa instância só tem um teto de capacidade — e um único ponto de falha
(essa instância cai, a aplicação inteira sai do ar). Um **load balancer** distribui requisição
entre **várias** instâncias idênticas da mesma aplicação, permitindo escalar capacidade
horizontalmente (mais instâncias, não uma instância maior) e sobreviver à queda de uma instância
sem ficar fora do ar.

## Escala horizontal vs. vertical

**Vertical**: aumentar o recurso de uma única instância (mais CPU, mais RAM). Simples, mas tem
teto físico, e não resolve ponto único de falha — a instância maior ainda é uma instância só.
**Horizontal**: adicionar mais instâncias da mesma aplicação, rodando em paralelo. Sem teto
físico óbvio (some mais uma máquina), e uma instância caindo não derruba as outras — mas exige que
a aplicação seja capaz de rodar em múltiplas cópias ao mesmo tempo sem depender de estado local
que só existe numa delas (ver a "escolha de onde fica o estado" nesse tipo de arquitetura — sessão
em cookie/JWT, não em memória do processo, é o que viabiliza isso, ver
[Autenticação](/padrao-api/seguranca/autenticacao) no Padrão API).

## Algoritmos de distribuição

- **Round robin**: uma requisição pra cada instância, em sequência, voltando ao início — simples,
  bom quando toda instância tem capacidade igual e toda requisição custa parecido.
- **Least connections**: manda pra instância com **menos conexão ativa** no momento — melhor
  quando requisições têm duração bem diferente entre si (uma request rápida e outra que demora
  segundos não deveriam contar como "carga igual").
- **IP hash**: sempre manda o mesmo IP de cliente pra mesma instância — usado quando a aplicação
  guarda algum estado local por sessão que não foi movido pra um cache compartilhado (uma solução
  de contorno, não o ideal — o ideal é a aplicação não depender de afinidade de instância).

## Health check — não distribuir pra quem já caiu

Um load balancer só é útil se souber quais instâncias estão de fato saudáveis — sem isso, ele
continuaria mandando requisição pra uma instância travada ou já derrubada. Um **health check** é
uma checagem periódica (geralmente um `GET /health` respondendo `200` rápido, sem tocar banco nem
fazer trabalho pesado) — uma instância que falha o health check algumas vezes seguidas sai da
rotação automaticamente, e volta sozinha quando passa a responder de novo.

## Camada 4 vs. camada 7

Um load balancer de **camada 4** (transporte, TCP/UDP) decide só olhando IP/porta — rápido, mas
não entende HTTP, não pode rotear por path (`/api` vs `/admin`) nem por header. Um load balancer
de **camada 7** (aplicação, o Nginx no papel de `upstream` é um exemplo — ver
[Nginx](/padrao-infraestrutura/tecnologias/nginx)) entende o protocolo HTTP inteiro — pode rotear
por domínio, path, header, cookie — mais flexível, com um pouco mais de custo de processamento por
requisição.

## Leitura de apoio

- [NGINX — Load Balancing (guia oficial)](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/) — os algoritmos disponíveis num load balancer de camada 7 real.
- [AWS — What is Load Balancing?](https://aws.amazon.com/what-is/load-balancing/) — visão geral independente de fornecedor, incluindo camada 4 vs. 7.
