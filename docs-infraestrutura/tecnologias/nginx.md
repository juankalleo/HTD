---
sidebar_label: Nginx
date: "30 de agosto de 2026"
---

# Nginx

## O que é

Servidor web e proxy reverso — o software mais comum pra implementar na prática os conceitos de
[Proxy reverso e CDN](/padrao-infraestrutura/conceitos-tecnicos/proxy-reverso-e-cdn): terminação
TLS, roteamento por domínio, e ponto único de política (rate limit, header de segurança, controle
de acesso) na frente de uma ou mais aplicações.

## Anatomia de um `server block`

```nginx
server {
    listen 443 ssl;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    location / {
        proxy_pass http://app-front:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

`server_name` é o que decide qual `server` block responde a cada domínio — o mesmo mecanismo de
SNI (ver [HTTP, HTTPS e TLS](/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls)) que
permite um Nginx só, numa porta 443 só, servir vários domínios diferentes com certificado
diferente cada. `proxy_pass` aponta pro **nome do serviço** Docker (`app-front`), não um IP — o
container do Nginx e o container da aplicação precisam estar na mesma rede Docker (ver
[VPS e containers](/padrao-infraestrutura/conceitos-tecnicos/vps-e-containers)) pra essa resolução
por nome funcionar.

## Os headers `X-Forwarded-*` — por que são obrigatórios atrás de um proxy

Sem esses três headers, a aplicação por trás do Nginx enxerga **todo** request como vindo do IP
do próprio Nginx (`127.0.0.1` ou o IP interno do container) — porque, tecnicamente, é dali que a
conexão TCP chega. `X-Forwarded-For` carrega o IP original do cliente; `X-Forwarded-Proto` diz se
a conexão original era HTTP ou HTTPS (importante quando o TLS termina no Nginx e a conexão
Nginx→aplicação é HTTP simples); `Host` preserva o domínio pedido. Qualquer coisa que dependa de
IP de origem — rate limit por IP (ver
[Força bruta e bloqueio](/padrao-api/seguranca/forca-bruta-e-bloqueio)), log de auditoria, geo-
bloqueio — só funciona corretamente se a aplicação ler esses headers em vez do IP da conexão TCP
bruta.

## Controle de acesso na borda

```nginx
location /admin {
    allow 203.0.113.0/24;   # exemplo de faixa de IP permitida
    deny all;

    auth_basic "Acesso restrito";
    auth_basic_user_file /etc/nginx/.htpasswd;

    proxy_pass http://app-front:3000;
}
```

`allow`/`deny` filtram por IP de origem antes de qualquer outra coisa rodar; `auth_basic` exige
usuário/senha (arquivo gerado com `htpasswd`, senha nunca em texto puro no arquivo). As duas
formas de controle de acesso descritas em
[Fail2ban e controle de acesso](/padrao-infraestrutura/conceitos-tecnicos/fail2ban-e-controle-de-acesso),
aplicadas concretamente aqui.

## `upstream` — balanceamento de carga

```nginx
upstream app_backend {
    least_conn;
    server app-api-1:80;
    server app-api-2:80;
}

server {
    location /api/ {
        proxy_pass http://app_backend;
    }
}
```

Um bloco `upstream` agrupa várias instâncias do mesmo serviço, e o Nginx distribui requisição
entre elas — a forma mais simples de balanceamento de carga (ver
[Load balancer](/padrao-infraestrutura/conceitos-tecnicos/load-balancer) pro conceito completo,
independente de tecnologia). `least_conn` manda pra instância com menos conexão ativa no momento;
sem isso, o padrão é round robin (uma de cada vez, em sequência).

## Leitura de apoio

- [Nginx — documentação oficial](https://nginx.org/en/docs/) — referência completa de diretiva.
- [Nginx — reverse proxy guide](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/) — `proxy_pass` e os headers `X-Forwarded-*` em detalhe.
