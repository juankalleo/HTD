---
sidebar_label: IDOR e autorização
---

# IDOR e autorização

IDOR (*Insecure Direct Object Reference*) é o que acontece quando uma
rota confia no `id` que o cliente manda pra decidir qual registro
devolver, sem checar se aquele usuário tem permissão **pra aquele
registro específico** — trocar `/usuarios/42` por `/usuarios/43` na URL e
ver dado de outra pessoa/tenant. O
[OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)
cobre isso e mais: negar por padrão, checar permissão em toda requisição,
nunca confiar em checagem feita só no cliente, e logar/testar decisão de
autorização.

## No padrão frontend: nunca confia em checagem do cliente

**Já correto, e documentado antes mesmo desta revisão.** O front não
esconde menu nem rota por papel/permissão — todo item de navegação
aparece pra qualquer usuário autenticado, sem condicional de
`role`/`papel` em lugar nenhum (confirmado por grep). Isso parece, à
primeira vista, o oposto do que o OWASP pede — mas é exatamente o
comportamento **seguro**: o item 8 do cheat sheet diz pra nunca tratar
checagem client-side como decisiva. Como o front não tenta essa checagem
de jeito nenhum, não existe o risco de alguém confiar numa tela que
"parece" proteger mas não protege — a única fonte de verdade é a resposta
real da API. `CurrentUserSerializer` nem manda lista de papel/permissão
pro front (só `id, nome, email, a_tenant, a_tipo_usuario`) — não tem nem
como montar uma checagem de UI com esse dado, de propósito. O gap real
aqui é de UX (item de menu que vai dar erro ao clicar, em vez de já
aparecer escondido), não de segurança — já registrado como limite
conhecido em
[Medidas de segurança](/padrao-frontend/seguranca/medidas-de-seguranca).

## Na API: fetch-then-authorize, não IDOR clássico

Todo controller de admin segue o mesmo padrão —
`api/app/controllers/api/v1/admin/a_unidades_controller.rb`:

```ruby
def show
  authorize! :CONSULTAR, @a_unidade
  render_success(data: @a_unidade, message: "Unidade encontrado com sucesso")
end

def set_a_unidade
  @a_unidade = AUnidade.find(params[:id])
end
```

`AUnidade.find(params[:id])` sozinho, sem escopo, pareceria um IDOR
clássico — mas `authorize!` roda **depois** do fetch e reavalia a
instância carregada contra condições reais de escopo de tenant, definidas
em `api/app/models/ability.rb`:

```ruby
AUnidade => lambda { |escopo|
  case escopo
  when ATenant then { a_orgao: { a_tenant_id: escopo.id } }
  when AOrgao  then { a_orgao_id: escopo.id }
  when AUnidade then { id: escopo.id }
  end
},
```

O CanCanCan resolve essas condições recursivamente contra as associações
reais do registro carregado — um admin escopado num tenant que tenta
`show` numa `AUnidade` de outro tenant recebe `CanCan::AccessDenied` → 403
(`error_handler.rb`), mesmo o `find` tendo carregado o registro sem
filtro nenhum. É o idioma documentado do próprio CanCanCan (buscar, depois
autorizar), aplicado de forma consistente em todo controller
verificado.

**Nuance real, não um IDOR completo:** como o `find` roda antes do
`authorize!`, um admin restrito que adivinha o `id` de outro tenant recebe
**403** (prova que o registro existe) em vez de **404** (esconderia a
existência). Nenhum dado do registro de outro tenant é devolvido — só a
mensagem genérica de "Acesso não permitido" — então é um oráculo de
existência de baixa severidade, não vazamento de dado.

`index` (listagem) usa um caminho mais estrito — `AOrgao.accessible_by
(@ability).ransack(...)`, que já filtra no SQL, então um admin restrito
nem consegue *enumerar* registro de outro tenant via listagem, só
via `id` adivinhado num `show`/`update`/`destroy` direto.

## O que falta: log e teste da decisão de negar

**Log de autorização negada: não existe.** `render_forbidden`
(`error_handler.rb`) não chama `Rails.logger` — diferente dos outros
handlers de erro do mesmo arquivo (`render_foreign_key_error`,
`render_internal_error` etc., que chamam `log_controlado`). Uma tentativa
de acesso negado por `CanCan::AccessDenied` vira 403 sem deixar rastro
server-side de quem tentou, o quê, quando.

**Teste de autorização: só no nível de model, não no de rota.**
`api/test/models/ability_test.rb` testa negação de verdade — não só
sucesso:

```ruby
test "usuário cujo papel só tem permissão que não resolve pra uma classe real não ganha acesso nenhum" do
  ability = Ability.new(users(:two))
  assert ability.cannot?(:manage, APapel)
  assert ability.cannot?(:read, AUnidade)
end
```

Mas nenhum teste de controller (os 16 arquivos em `api/test/controllers/
api/v1/admin/`) usa outra fixture além de `users(:one)` — o admin
wildcard "Plataforma", que pode tudo. `users(:two)` (escopado, o único
fixture não-wildcard) nunca aparece em teste de controller — só no teste
de model acima. Ou seja: não existe hoje uma prova automatizada,
rodando contra uma rota HTTP real, de que um usuário restrito realmente
recebe 403 ao tentar acessar registro de outro escopo — a garantia atual
vem só da leitura do código (`ability.rb` + CanCanCan), não de um teste
que rode isso de ponta a ponta. Ver
[Autorização automatizada](/padrao-frontend/seguranca/autorizacao-automatizada)
pra o que o OWASP recomenda especificamente pra fechar esse tipo de gap.
