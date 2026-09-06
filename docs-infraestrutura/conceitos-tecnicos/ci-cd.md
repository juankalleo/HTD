---
sidebar_label: CI/CD
date: "30 de agosto de 2026"
---

# CI/CD

## Integração contínua (CI) — a parte de "verificar"

**CI** (*Continuous Integration*) é rodar, automaticamente, a cada mudança de código enviada
(cada push, cada pull request), o conjunto de verificação que garante que aquela mudança não
quebrou nada: instalar dependência, rodar teste automatizado, rodar linter/análise estática (ver
[RuboCop](/padrao-api/tecnologias/rubocop) e [Brakeman](/padrao-api/tecnologias/brakeman) como
exemplo dessas duas categorias), e falhar visivelmente se algo não passar — **antes** de qualquer
mudança chegar num branch principal, não depois.

O ganho central não é só "achar bug automaticamente" — é fazer isso **rápido e consistente**, sem
depender de alguém lembrar de rodar teste manualmente antes de mesclar. Ver
[Cultura DevOps](/padrao-infraestrutura/conceitos-tecnicos/devops-e-cultura): "Fluxo" e "Feedback"
rápido são exatamente o que CI viabiliza em escala de time.

## Entrega/deploy contínuo (CD) — a parte de "publicar"

**CD** cobre o que acontece depois que o código passa na verificação: empacotar a aplicação
(gerar a imagem Docker, por exemplo) e publicá-la em algum ambiente. Duas variações comuns, com
diferença importante:

- **Continuous Delivery**: toda mudança que passa em CI fica **pronta pra** ser publicada em
  produção, com um clique/aprovação manual final.
- **Continuous Deployment**: toda mudança que passa em CI vai **automaticamente** pra produção,
  sem intervenção humana no meio do caminho — exige um nível de confiança alto no conjunto de
  teste, porque não tem humano checando antes do ar.

## Estágios comuns de uma pipeline

Uma pipeline de CI/CD é tipicamente uma sequência de estágios, cada um só rodando se o anterior
passou:

```
build → test → lint/security scan → build da imagem → deploy em staging → (aprovação) → deploy em produção
```

Cada estágio existe pra pegar um tipo de problema o mais cedo possível — achar um erro de lint no
primeiro estágio é muito mais barato (tempo, contexto) que achar o mesmo problema já em produção.

## Artefato — o que efetivamente vai pro próximo estágio

Um **artefato** é o resultado empacotado de um estágio — uma imagem Docker construída, um bundle
de assets compilados — passado adiante pro próximo estágio, em vez de cada estágio reconstruir
tudo do zero. Isso garante que o que foi testado é **exatamente** o que vai pra produção — não uma
rebuild parecida, mas potencialmente diferente (dependência atualizada entre uma rebuild e outra,
por exemplo).

## Promoção entre ambientes

Ambientes (dev → homologação → produção, ver o `${ENV}` em
[Docker Compose](/padrao-infraestrutura/tecnologias/docker-compose)) normalmente formam uma
sequência — mudança passa por homologação antes de chegar em produção, permitindo achar problema
num ambiente onde uma falha não afeta usuário real. "Promover" uma versão é mover o **mesmo
artefato** já testado de um ambiente pro próximo, não gerar um novo build pra cada ambiente — de
novo, pra garantir que o que rodou em homologação é bit-a-bit o que vai rodar em produção.

## Segredo em pipeline — nunca no código, nunca no log

Toda pipeline de CI/CD precisa de credencial pra publicar (acesso ao servidor, token de registry
de imagem Docker). A prática correta é injetar isso via variável de ambiente protegida pela
própria plataforma de CI (secrets/variáveis mascaradas), nunca commitada no repositório — e
configurada pra nunca aparecer em texto puro no log da pipeline, mesmo que algum comando tente
imprimir a variável por engano.

## Leitura de apoio

- [Continuous Delivery — Jez Humble, David Farley](https://continuousdelivery.com/) — o livro que formaliza a diferença entre Continuous Delivery e Continuous Deployment.
- [Martin Fowler — Continuous Integration](https://martinfowler.com/articles/continuousIntegration.html) — o artigo clássico que popularizou a prática de CI.
