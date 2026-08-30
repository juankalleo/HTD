---
video: jcA_Nn2xPXg
videoEn: WZ--LRRyeTQ
sidebar_label: Tecnologias
---

# Tecnologias do sistema

Mesmo molde do [Padrão Frontend](/padrao-frontend/tecnologias): um
arquivo por lib, com o que é, o motivo real da escolha, a versão travada
no `Gemfile.lock`, como instalar e um exemplo real do projeto — nunca
inventado.

## Índice

| Tecnologia | Usada em |
|---|---|
| [Devise + devise-jwt](devise-jwt.md) | Autenticação — sessão e token JWT |
| [CanCanCan](cancancan.md) | Autorização orientada a dado (papel/permissão) |
| [Pagy](pagy.md) | Paginação de toda listagem admin |
| [Solid Queue](solid-queue.md) | Job assíncrono e agendado, backend do próprio Rails 8 |
| [RuboCop](rubocop.md) | Padrão de estilo de código, análise estática |
| [Brakeman](brakeman.md) | Análise estática de segurança |
| [PaperTrail](/padrao-banco-de-dados/tecnologias/paper-trail) | Auditoria/versionamento — gem de model, documentada no Padrão Banco de Dados |
| [paranoia](/padrao-banco-de-dados/tecnologias/paranoia) | Soft delete — gem de model, documentada no Padrão Banco de Dados |

Ransack (filtro/busca), ActiveModelSerializers (serialização) e
Rack::Attack (rate limiting) já têm o "como funciona" documentado em
[Filtros e busca](/padrao-api/conceitos-tecnicos/filtros-e-busca),
[Envelope de resposta](/padrao-api/conceitos-tecnicos/envelope-de-resposta)
e [Força bruta e bloqueio](/padrao-api/seguranca/forca-bruta-e-bloqueio)
— páginas de tecnologia dedicadas pra essas três (e Rack::Cors) ainda
não foram escritas.
