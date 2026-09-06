import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "08-autenticacao-com-devise",
  title: "Autenticação com Devise",
  summary: "Devise resolve senha/sessão/token — entender o que ele gera é melhor do que tratá-lo como caixa-preta.",
  estimatedMinutes: 18,
};

export default function Licao08AutenticacaoComDevise() {
  return (
    <LessonBody>
      <p>
        Autenticação — cadastro, login, hash de senha, reset de senha, confirmação de e-mail — é o tipo de coisa que
        ninguém deveria reimplementar do zero (é fácil errar de um jeito que vira vulnerabilidade). Devise é a gem
        padrão do ecossistema Rails pra isso; numa API, ela é combinada com <code>devise-jwt</code> pra emitir token
        em vez de sessão baseada em cookie.
      </p>

      <h2>O que instalar o Devise realmente gera</h2>
      <CodeExample
        label="app/models/usuario.rb"
        language="ruby"
        code={`class Usuario < ApplicationRecord
  devise :database_authenticatable, :registerable,
         :recoverable, :validatable,
         :jwt_authenticatable, jwt_revocation_strategy: self
end`}
      />
      <p>
        Cada símbolo é um <strong>módulo</strong> que o Devise adiciona: <code>database_authenticatable</code> guarda
        a senha com hash (nunca em texto puro) e sabe comparar na hora do login;{" "}
        <code>validatable</code> valida formato de e-mail e tamanho mínimo de senha automaticamente;{" "}
        <code>jwt_authenticatable</code> é o que faz a API emitir/validar token JWT em vez de sessão de cookie.
      </p>

      <CodeExample
        label="migration gerada — colunas que o Devise precisa"
        language="ruby"
        code={`create_table :usuarios do |t|
  t.string :email, null: false, default: ""
  t.string :encrypted_password, null: false, default: ""   # hash da senha, nunca a senha em si
  t.string :reset_password_token
  t.datetime :reset_password_sent_at
  t.timestamps
  t.index :email, unique: true
  t.index :reset_password_token, unique: true
end`}
      />
      <p>
        <code>encrypted_password</code> nunca guarda a senha original — guarda o resultado de um hash (bcrypt, por
        padrão). Nem um vazamento do banco de dados expõe a senha em texto puro.
      </p>

      <h2>Login numa API — o fluxo com token</h2>
      <CodeExample
        label="POST /login — Resultado"
        language="json"
        result={`Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIx...`}
        code={`POST /usuarios/sign_in
{ "usuario": { "email": "ana@exemplo.com", "senha": "12345678" } }

# devise-jwt intercepta o login bem-sucedido e devolve o token
# no header Authorization da resposta, não no corpo`}
      />
      <p>
        Toda requisição seguinte manda esse token de volta no header <code>Authorization</code>; o Devise decodifica
        e identifica o usuário sem precisar de sessão de servidor guardada em memória — é isso que torna a API{" "}
        <strong>stateless</strong>, pré-requisito pra escalar horizontalmente sem sticky session.
      </p>

      <Callout href="/padrao-api/tecnologias/devise-jwt">
        A configuração completa do devise-jwt do padrão — revogação de token, expiração, guard clauses — está
        documentada no Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "O que a coluna encrypted_password realmente guarda?",
            options: [
              "A senha em texto puro, criptografada de forma reversível",
              "O resultado de um hash (bcrypt) da senha — nunca a senha original, nem de forma reversível",
              "Um token JWT",
              "Nada — é só um placeholder",
            ],
            correctIndex: 1,
          },
          {
            question: "Por que autenticação via JWT é considerada 'stateless'?",
            options: [
              "Porque não precisa de banco de dados",
              "Porque o servidor não guarda sessão em memória — o próprio token carrega a identidade do usuário",
              "Porque é mais rápido que qualquer outro método",
              "Não é stateless, é só um nome",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
