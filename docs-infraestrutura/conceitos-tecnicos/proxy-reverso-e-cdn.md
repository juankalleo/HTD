---
sidebar_label: Proxy reverso e CDN
---

# Proxy reverso e CDN

## Por que não expor a aplicação direto

A forma mais simples de servir uma aplicação seria abrir a porta dela direto pra internet. Na
prática, quase nenhuma aplicação de produção séria faz isso — coloca algo **na frente** dela. Esse
algo cumpre várias funções ao mesmo tempo, e vale entender cada uma separadamente.

## Proxy reverso

Um **proxy reverso** é um servidor que recebe a requisição do cliente e a repassa pra aplicação
real por trás, devolvendo a resposta como se fosse dele mesmo — o cliente nunca fala diretamente
com a aplicação. Funções que ficam naturalmente concentradas nele:

- **Terminação TLS**: o certificado HTTPS fica configurado num lugar só (o proxy), não em cada
  aplicação individualmente — a comunicação proxy → aplicação pode ser HTTP simples numa rede
  interna já isolada.
- **Roteamento por domínio**: um único proxy, numa única porta 443, consegue rotear requisições
  pra aplicações diferentes dependendo do domínio pedido — usando exatamente o SNI (ver
  [HTTP, HTTPS e TLS](/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls)) pra saber, antes
  de decifrar qualquer coisa, pra onde mandar.
- **Um ponto central de política**: rate limiting, headers de segurança, redirecionamento
  HTTP→HTTPS — configurados uma vez no proxy em vez de replicados em cada aplicação.

## CDN — cache e filtragem geograficamente distribuídos

Um **CDN** (*Content Delivery Network*) estende a ideia de proxy reverso, mas distribuído em
servidores ao redor do mundo, fisicamente mais perto de cada usuário. Duas funções centrais:

- **Cache de conteúdo estático** (imagem, CSS, JS, e opcionalmente resposta de API com cache
  configurado): a resposta é servida do ponto mais próximo do usuário, sem precisar ida-e-volta até
  o servidor de origem toda vez — mais rápido e reduz carga na origem.
- **Filtragem de tráfego antes da origem**: como todo tráfego passa primeiro pelo CDN, ele consegue
  bloquear tráfego malicioso (um ataque de negação de serviço, por exemplo) **antes** de chegar
  perto do servidor real — a origem nunca vê o tráfego ruim.

## O ponto cego: a origem por trás do CDN precisa ficar escondida

A filtragem do CDN só funciona enquanto **todo** o tráfego é obrigado a passar por ele. Se o IP
real do servidor de origem for descoberto — por vazar num header de e-mail enviado pela própria
aplicação, num registro DNS histórico ainda resolvendo, ou por engano numa configuração — um
atacante pode ignorar o CDN completamente e mandar tráfego **direto** pra origem, usando o SNI
correto pra passar pela verificação de certificado (ver a seção de SNI em
[HTTP, HTTPS e TLS](/padrao-infraestrutura/conceitos-tecnicos/http-https-e-tls)). Nesse cenário,
toda proteção que o CDN oferece deixa de valer — ele continua filtrando o tráfego que passa por
ele, mas o atacante simplesmente parou de usá-lo.

A prática correta pra fechar esse ponto cego é configurar o firewall da própria origem (ver
[Kernel, netfilter e firewall](/padrao-infraestrutura/conceitos-tecnicos/kernel-netfilter-e-firewall))
pra só aceitar conexão nas portas web vindas dos **IPs conhecidos do provedor de CDN** — não do
mundo inteiro. Um servidor de origem com a porta 443 aberta pra qualquer IP, mesmo estando "atrás"
de um CDN, ainda está, na prática, exposto direto — o CDN vira só um atalho mais rápido pra quem o
usa, não uma barreira real pra quem não usa.

## Leitura de apoio

- [Cloudflare — What is a reverse proxy?](https://www.cloudflare.com/learning/cdn/glossary/reverse-proxy/) — a explicação de proxy reverso do ponto de vista de um provedor de CDN.
- [MDN — Reverse proxy](https://developer.mozilla.org/en-US/docs/Glossary/Reverse_proxy) — definição curta e direta.
