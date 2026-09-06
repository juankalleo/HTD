---
sidebar_label: Docker Compose
date: "30 de agosto de 2026"
---

# Docker Compose

Docker Compose descreve, num arquivo YAML só, todos os serviços que compõem uma aplicação — e
como eles se conectam — em vez de subir cada container manualmente com uma sequência longa de
flags `docker run`. Os exemplos abaixo são ilustrativos, com nomes de serviço, rede, domínio e
porta genéricos — o valor de cada um é ajustado por projeto.

## Compose do front (Next.js)

```yaml
services:
  app-front:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL:-https://api.example.com}
    container_name: app-front
    restart: unless-stopped
    ports:
      - "3000:3000"
    networks:
      - app_net

networks:
  app_net:
    external: true
```

## Compose da API (Rails) + banco

```yaml
services:
  app-api:
    build: .
    container_name: app-api
    restart: unless-stopped
    env_file:
      - .env
    ports:
      - "3001:80"
    depends_on:
      - app-api-db
    networks:
      - app_net
    volumes:
      - app_api_storage:/rails/storage # uploads (ActiveStorage) sobrevivem a rebuilds

  app-api-db:
    image: postgres:15
    container_name: app-api-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: app_api
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?defina POSTGRES_PASSWORD no .env}
      POSTGRES_DB: app_api_production
    volumes:
      - app_api_db_data:/var/lib/postgresql/data
    networks:
      - app_net

volumes:
  app_api_db_data:
  app_api_storage:

networks:
  app_net:
    external: true
```

## Compose só do banco — quando o banco vive isolado, por ambiente

Nem todo banco sobe junto com a aplicação no mesmo `docker-compose.yml`. Um padrão comum quando
existe mais de um ambiente (desenvolvimento, homologação, produção — às vezes até mais de um por
tipo) rodando **no mesmo host**: cada ambiente tem seu próprio `docker-compose.yml` só do banco,
isolado dos outros por nomenclatura, sem que um ambiente arrisque colidir com o volume ou a rede
de outro.

```yaml
services:
  db:
    image: postgres:18-alpine
    container_name: ${ENV}-postgres
    restart: unless-stopped
    env_file: [.env]
    ports:
      - "${DB_BIND_IP:-127.0.0.1}:${DB_PORT}:5432"
    volumes:
      - db_data:/var/lib/postgresql/data
      - ./init:/docker-entrypoint-initdb.d
    networks: [db_net]

volumes:
  db_data:
    name: ${ENV}_db_data

networks:
  db_net:
    name: ${ENV}_db_net
    driver: bridge
```

**`${ENV}`** — um prefixo que identifica o ambiente, definido no `.env` de cada deploy (`DEV`
pra desenvolvimento, `HML` pra homologação, `PROD` pra produção, `RLS` pra um ambiente de release
— a sigla exata varia por projeto, o que importa é ter uma). Aparece em toda parte do arquivo que
precisa de nome único: `container_name`, nome do volume, nome da rede. Sem esse prefixo, dois
`docker-compose.yml` desse mesmo formato — um de homologação, um de produção — rodando na mesma
VPS tentariam usar o **mesmo** nome de volume/rede/container e colidiriam; com o prefixo, os dois
convivem no mesmo host sem se enxergar nem se sobrescrever.

**`image: postgres:18-alpine`** — a tag `alpine` usa uma distribuição base bem menor (Alpine
Linux) que a imagem `postgres` padrão — imagem final menor, menos superfície de pacote instalado
por padrão. A versão major (`18`) travada explicitamente, nunca `latest` — uma imagem que muda de
versão sozinha a cada `docker compose pull` pode trazer uma migração de formato de dado que a
aplicação não esperava.

**`ports: ["${DB_BIND_IP:-127.0.0.1}:${DB_PORT}:5432"]`** — a forma completa de `ports` no Compose
aceita um IP específico antes das duas portas (`IP:portaHost:portaContainer`), não só
`portaHost:portaContainer`. Publicar a porta em `127.0.0.1` (o padrão aqui) significa que o
Postgres só aceita conexão vinda da **própria máquina** — nem a rede local, nem a internet
alcançam a porta 5432 diretamente, só um processo rodando no mesmo host (a aplicação, ou alguém
com acesso SSH abrindo um túnel). Isso é diferente de não publicar porta nenhuma (ver
[Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall)
sobre por que a exposição de porta e o firewall são duas camadas, não uma só) — aqui o banco
**precisa** aceitar conexão de fora do próprio container (de um outro `docker-compose.yml`, o da
aplicação), só que restrita ao próprio host, não ao mundo.

**`./init:/docker-entrypoint-initdb.d`** — a imagem oficial do Postgres executa automaticamente
todo script `.sql`/`.sh` encontrado em `/docker-entrypoint-initdb.d`, mas **só na primeira
inicialização** (quando o diretório de dado ainda está vazio) — nunca de novo depois disso, mesmo
que o container reinicie. Útil pra bootstrap declarativo (criar extensão, schema inicial, role
extra) sem precisar rodar comando manual depois do primeiro `up`; inútil pra migração contínua,
que continua sendo responsabilidade da aplicação (`rails db:migrate` e afins) — esse mecanismo só
roda uma vez, no nascimento do volume.

**`name:` explícito em volume e rede** — sem isso, o Compose gera o nome automaticamente a partir
do nome da pasta do projeto + nome do serviço, o que muda dependendo de onde o `docker-compose.yml`
é executado. Declarar `name:` fixa o nome de verdade (aqui, com o prefixo `${ENV}` já embutido) —
previsível, e o que permite outro `docker-compose.yml` (o da aplicação) referenciar essa mesma rede
como `external: true` pelo nome exato.

## Build-time vs. runtime — a distinção que mais gera confusão

`NEXT_PUBLIC_*` do Next.js é **embutido no bundle JavaScript durante o build**, não lido em
runtime — é por isso que ele aparece em `build.args` (que vira `ARG` dentro do `Dockerfile`, só
disponível durante `docker build`), não em `environment`/`env_file` (que só afetam o container já
rodando). Mudar uma variável `NEXT_PUBLIC_*` no `.env` de produção sem **reconstruir a imagem**
não tem efeito nenhum — o valor antigo já está compilado dentro do JavaScript servido. Isso
surpreende quem vem de uma stack onde toda variável de ambiente é lida em runtime (como o Rails
puro): em Next.js, a pergunta "essa env var é lida em build ou em runtime?" muda completamente
onde ela precisa ser declarada no Compose.

## `restart: unless-stopped`

Reinicia o container automaticamente se ele cair (crash, erro não tratado, OOM — ver
[Limites de recursos e OOM Killer](/padrao-infraestrutura/conceitos-tecnicos/limites-de-recursos-e-oom))
ou se o Docker/a VPS reiniciar — mas **não** força restart se alguém parou o container
manualmente (`docker stop`), diferente de `restart: always`. É o padrão sensato pra serviço de
produção: recupera de falha sozinho, sem brigar com uma parada intencional.

## `depends_on` — ordem de start, não prontidão

`depends_on: [app-api-db]` garante que o container do banco **inicia** antes do da API — não
garante que o Postgres já está **pronto pra aceitar conexão** nesse momento (o processo do
Postgres pode levar alguns segundos pra ficar disponível depois de iniciar). Uma aplicação que não
tolera essa corrida (falha na primeira tentativa de conexão em vez de tentar de novo) precisa de
retry próprio na inicialização, ou de uma checagem de saúde (`healthcheck` + `condition:
service_healthy`) explícita no Compose.

## Volume nomeado — o que sobrevive a um rebuild

Por padrão, tudo que um container escreve no próprio sistema de arquivos desaparece quando ele é
recriado (`docker compose up --build`). Um **volume nomeado** (`app_api_storage`,
`app_api_db_data` acima) é montado num caminho específico e persiste independente do ciclo de
vida do container — essencial pra dado do banco e pra upload de usuário (ActiveStorage,
por exemplo), que não podem sumir a cada deploy.

## `env_file` — segredo fora da imagem

`env_file: [.env]` injeta variável de ambiente no container **sem** colocá-la no `Dockerfile` nem
na imagem final — a imagem gerada não carrega segredo nenhum embutido, e o mesmo `.env` (fora do
controle de versão) muda por ambiente sem precisar rebuild.

## Rede externa (`external: true`)

Uma rede Docker `external: true` referencia uma rede já criada fora desse `docker-compose.yml`
(via `docker network create`), em vez de o Compose criar (e destruir) a rede junto com os
serviços. Padrão útil quando múltiplos `docker-compose.yml` — de projetos diferentes, subidos
separadamente — precisam compartilhar a mesma rede pra se enxergarem por nome (ver
[VPS e containers](/padrao-infraestrutura/conceitos-tecnicos/vps-e-containers)); sem isso, cada
`docker compose up` criaria sua própria rede isolada, e serviços de arquivos Compose diferentes
não se comunicariam.

## `${VAR:?mensagem}` — variável obrigatória, com erro explícito

A sintaxe `${POSTGRES_PASSWORD:?defina POSTGRES_PASSWORD no .env}` faz o Compose **recusar subir**
se essa variável não estiver definida, mostrando a mensagem de erro escolhida — em vez de subir
mesmo assim com um valor vazio (o que aconteceria com `${POSTGRES_PASSWORD}` sozinho, criando um
banco com senha vazia silenciosamente). Prefira essa forma pra toda variável sem a qual o serviço
não deveria nem tentar iniciar.

## Leitura de apoio

- [Docker Compose — documentação oficial](https://docs.docker.com/compose/) — referência completa do formato.
- [Docker Compose — variáveis de ambiente](https://docs.docker.com/compose/environment-variables/set-environment-variables/) — as várias formas de passar variável, incluindo `:?`.
