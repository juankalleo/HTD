---
video: JXmEZr77voo
sidebar_label: BFF
---

# BFF (Backend For Frontend)

Padrão de arquitetura onde uma API intermediária cria uma camada de dados
otimizada especificamente para a interface — o frontend não fala com o
backend "de verdade" direto, fala com uma camada própria que agrega,
reformata ou simplifica o que a API real expõe.

## No padrão frontend

Não é usado, por decisão explícita: o navegador chama a API Rails
**direto**, sem proxy Next.js no meio, token em `localStorage` (ver
[Autenticação](/padrao-frontend/seguranca/autenticacao)). Um BFF criaria
uma segunda camada de contrato — o Next reformatando/agregando dado do
Rails só pra UI — que o padrão decidiu não ter: mais uma camada pra manter
sincronizada com a API real, sem ganho comprovado pro tamanho típico
desses projetos.

`app/api/relatorios/{pdf,excel}/route.ts` são a única rota de servidor que
existe no Next, e não contam como BFF: existem só porque as libs de
geração de arquivo (Puppeteer, ExcelJS) exigem runtime Node, que não roda
no navegador — nunca reformatam ou agregam dado do Rails, só recebem o
dado que o client **já buscou e já tem** e renderizam num formato de
arquivo. Não viram ponto único de acesso a dado nem escondem o contrato da
API real — é infraestrutura de geração de arquivo, pelo motivo técnico
específico de precisar de Node. Guarda de sessão e validação dessas rotas
em
[Segurança de exportação](/padrao-frontend/seguranca/seguranca-exportacao).

**Quando usaríamos um BFF de verdade:** se um produto precisar agregar
dado de **múltiplos** backends numa única resposta pra UI, ou esconder um
contrato de API legado/inconsistente atrás de um formato estável — nenhum
dos dois é o caso aqui, onde existe uma única API Rails com contrato já
limpo.
