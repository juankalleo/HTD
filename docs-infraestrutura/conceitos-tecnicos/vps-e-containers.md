---
sidebar_label: VPS e containers
---

# VPS e containers

## O que é uma VPS

Um servidor físico real, num datacenter, é dividido por software (um **hypervisor**) em várias
máquinas virtuais independentes — cada uma com sua fatia garantida de CPU, RAM e disco, rodando
seu próprio sistema operacional, isolada das outras VPS no mesmo hardware físico. Mais barato que
alugar um servidor físico inteiro, mais controlável que um serviço 100% gerenciado — acesso root,
mas também a responsabilidade de manter o sistema atualizado, configurar firewall, etc.

## Onde tudo mora — o sistema de arquivos do Linux

Diferente do Windows (`C:\`, `D:\`, cada disco com a própria raiz), o Linux tem **uma única árvore
de diretórios**, começando em `/`. Todo disco ou dispositivo adicional é **montado** em algum
ponto dentro dessa árvore.

A pergunta certa sobre segurança de sistema de arquivos não é "onde ficam os arquivos" — é **onde,
se algo mudar aqui, muda quem tem acesso ou o que o sistema faz**. Um punhado específico de
pastas concentra praticamente todo o risco real:

| Pasta | O que é | Por que importa |
|---|---|---|
| `/etc` | Configuração de todo o sistema | A mais crítica — SSH, usuários, sudo, firewall, tudo mora aqui |
| `/root`, `/home/<usuário>` | Pasta pessoal de cada usuário | `~/.ssh/authorized_keys` — literalmente a lista de quem entra como aquele usuário |
| `/var/log` | Logs do sistema | Onde mora a evidência de tudo que já aconteceu — sem isso, não tem como investigar incidente depois |
| `/usr/bin`, `/usr/sbin` | Binários instalados | Um binário plantado aqui por um atacante roda com cara de programa legítimo |
| `/tmp` | Arquivos temporários | Todo usuário escreve aqui por padrão — lugar clássico de payload temporário |
| `/etc/cron.d/`, crontab | Tarefas agendadas | Mecanismo comum de persistência de um atacante que já entrou uma vez |

Segurança de sistema de arquivos não é um evento único no dia da instalação — é vigilância
contínua num punhado pequeno de lugares específicos dessa árvore, não o disco inteiro.

## O que é um container

Um container empacota uma aplicação + tudo que ela precisa pra rodar (bibliotecas, dependências,
variáveis) num pacote isolado e portátil. A diferença central pra uma **VM**: uma VM virtualiza o
hardware inteiro e roda um sistema operacional completo próprio (pesado, minutos pra ligar); um
container compartilha o **kernel** do hospedeiro e só isola processo/arquivo/rede — leve (inicia
em segundos, ocupa dezenas de MB em vez de gigabytes).

**Imagem**: o molde — um pacote read-only com tudo que o container precisa. **Container**: uma
instância **em execução** dessa imagem — dá pra rodar N containers da mesma imagem
simultaneamente.

**Volume**: uma forma de persistir dado **fora** do container — por padrão, quando um container
morre, tudo que ele escreveu no próprio sistema de arquivos some junto. Volume guarda dado (por
exemplo, os arquivos de um banco) num lugar que sobrevive a recriar o container.

**Rede Docker e descoberta por nome**: containers, por padrão, não se enxergam automaticamente —
precisam estar na mesma rede virtual pra se comunicarem pelo **nome do serviço** (o Docker roda um
DNS interno que resolve isso). É conveniente — nenhuma configuração de conexão precisa de IP
fixo, mesmo que um container recriado ganhe um IP interno novo — mas tem uma implicação de
segurança real: **por padrão, qualquer container na mesma rede consegue tentar falar com qualquer
outro**, e a única barreira que sobra é a autenticação do serviço de destino, não uma barreira de
rede. Um ambiente com múltiplos containers de perfis diferentes (produção, desenvolvimento,
ferramentas internas) numa única rede compartilhada tem, na prática, zero segmentação entre eles —
o princípio correto é o oposto: cada grupo de containers que não precisa conversar entre si deveria
viver em redes Docker separadas, conectando só o que realmente precisa se comunicar entre grupos.

## Leitura de apoio

- [Docker — What is a Container? (docs oficiais)](https://www.docker.com/resources/what-container/) — a explicação oficial, incluindo a comparação com VM.
- [Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html) — a especificação formal por trás da árvore de diretórios do Linux.
