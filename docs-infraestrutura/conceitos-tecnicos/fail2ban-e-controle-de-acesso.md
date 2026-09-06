---
sidebar_label: Fail2ban e controle de acesso
date: "30 de agosto de 2026"
---

# Fail2ban e outras camadas de controle de acesso

O firewall (ver
[Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall))
resolve "quem pode tentar falar com essa porta" de forma **estática** — a regra não muda sozinha
com base em comportamento. Duas camadas complementares cobrem o que o firewall estático não cobre.

## Fail2ban — banimento dinâmico por comportamento

**Fail2ban** monitora arquivo de log (SSH, servidor web, qualquer serviço que loga tentativa de
acesso) procurando um padrão configurável — "muitas tentativas de senha errada vindas do mesmo
IP", por exemplo. Quando o padrão bate, ele **insere uma regra de firewall na hora** (via
`iptables`/`nftables`) banindo aquele IP por um tempo determinado — depois disso, remove a regra
sozinho.

A diferença central pro rate limiting de aplicação (ver
[Força bruta e bloqueio](/padrao-api/seguranca/forca-bruta-e-bloqueio) no Padrão API, que já cobre
o mesmo problema na camada HTTP): fail2ban opera na camada de **rede/sistema operacional**, não
dentro da aplicação — cobre qualquer serviço que gere log (SSH incluído, que nenhum rate limit de
aplicação alcança), e a punição é bloquear o IP **antes** do pacote chegar em qualquer processo,
não só recusar uma requisição HTTP específica.

Estrutura básica: cada serviço monitorado é uma "jail" (`jail.local`), com um filtro (o padrão de
log que conta como tentativa falha), um `maxretry` (quantas falhas até banir) e um `bantime`
(por quanto tempo) — configuração comparável ao `Rack::Attack` do lado da aplicação, só que
operando uma camada abaixo.

## Lista de acesso por IP (allowlist)

Em vez de abrir uma rota administrativa pro mundo inteiro e confiar só em autenticação, uma
**lista de acesso** restringe por IP de origem **antes** de a autenticação sequer rodar — só
tráfego vindo de um IP/faixa conhecida (a rede da empresa, uma VPN) chega perto do endpoint. No
Nginx (ver [Nginx](/padrao-infraestrutura/tecnologias/nginx)), isso é `allow`/`deny` num bloco
`location`. É uma camada de defesa em profundidade: mesmo que uma credencial vaze, quem a tem
ainda precisa estar numa rede permitida pra usá-la contra aquele endpoint específico.

## HTTP Basic Auth como camada de borda

Basic Auth (usuário/senha enviados em todo request, via header `Authorization: Basic ...`) é
simples, sem estado, suportado nativamente por todo servidor web — mas a credencial vai em toda
requisição, então **exige HTTPS sempre** (sem TLS, a credencial trafega em texto legível, só
codificada em base64, não criptografada). Usado tipicamente pra proteger uma ferramenta interna
inteira (um painel de métrica, um dashboard de fila) atrás de uma segunda camada de autenticação,
antes mesmo da aplicação processar a requisição — não como substituto de autenticação de
aplicação de verdade (que sabe diferenciar usuário, permissão, sessão), só como uma barreira a
mais na borda.

## As camadas juntas

Nenhuma sozinha é suficiente — a defesa em profundidade vem de combinar todas: firewall (só as
portas necessárias abertas), fail2ban (bane comportamento agressivo automaticamente), allowlist
de IP (restringe origem de rota sensível) e autenticação de aplicação (sabe quem é o usuário e o
que ele pode fazer). Cada camada cobre um tipo de ataque que as outras não cobrem sozinhas.

## Leitura de apoio

- [Fail2ban — documentação oficial](https://github.com/fail2ban/fail2ban) — jails, filtros e ações disponíveis.
- [OWASP — Credential Stuffing Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Credential_Stuffing_Prevention_Cheat_Sheet.html) — o mesmo ataque que fail2ban e rate limit de aplicação mitigam, de ângulos diferentes.
