import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "18-seguranca-de-api",
  title: "Segurança de API: CORS, força bruta e Brakeman",
  summary:
    "Autenticação e autorização resolvem quem é o usuário e o que ele pode fazer — mas não impedem um atacante de tentar mil senhas por minuto, nem avisam sobre um SQL cru esquecido no código.",
  estimatedMinutes: 17,
  level: "intermediario",
};

export default function Licao18SegurancaDeApi() {
  return (
    <LessonBody>
      <p>
        As lições de Devise e CanCanCan resolveram duas perguntas: quem é o usuário, e o que ele pode fazer depois
        de identificado. Isso não cobre tudo. Faltam três bases que qualquer API de produção precisa: quem além do
        seu front pode chamar essa API pelo navegador, o que impede alguém de tentar mil senhas seguidas contra o
        login, e como pegar um erro de segurança <strong>antes</strong> dele chegar em produção.
      </p>

      <h2>CORS — quem o navegador deixa chamar sua API</h2>
      <p>
        Por padrão, um navegador bloqueia JavaScript rodando num domínio de <strong>ler</strong> a resposta de uma
        API rodando em outro domínio, a menos que a API diga explicitamente, via header, que aquele domínio é
        permitido. Essa restrição é chamada <strong>CORS</strong> (Cross-Origin Resource Sharing), e — ponto
        importante — ela é aplicada pelo <strong>navegador</strong>, não pelo servidor Rails: um cliente que não é
        navegador (um <code>curl</code>, um app mobile, outro serviço backend) simplesmente ignora CORS.
      </p>
      <CodeExample
        label="config/initializers/cors.rb"
        language="ruby"
        code={`Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://app.exemplo.com"
    resource "*", headers: :any, methods: [:get, :post, :patch, :delete]
  end
end`}
      />
      <p>
        Sem essa configuração, um front-end legítimo rodando em outro domínio também seria bloqueado pelo próprio
        navegador do usuário — CORS não é sobre esconder a API de atacante nenhum, é sobre declarar explicitamente
        quem tem permissão de consumir ela a partir de um navegador.
      </p>

      <h2>Bloqueio de força bruta — limitando tentativa de login</h2>
      <p>
        Sem limite nenhum, um atacante pode automatizar milhares de tentativas de senha por minuto contra{" "}
        <code>/usuarios/sign_in</code>. A defesa mais direta é limitar quantas tentativas o mesmo IP (ou o mesmo
        e-mail) pode fazer num intervalo de tempo.
      </p>
      <CodeExample
        label="config/initializers/rack_attack.rb"
        language="ruby"
        code={`class Rack::Attack
  throttle("login/ip", limit: 5, period: 60) do |req|
    req.ip if req.path == "/usuarios/sign_in" && req.post?
  end
end`}
      />
      <p>
        Depois de 5 tentativas do mesmo IP em 60 segundos, novas tentativas passam a ser bloqueadas até a janela
        reiniciar. Isso não impede um ataque distribuído entre muitos IPs diferentes, mas elimina de longe a forma
        mais comum de força bruta contra login.
      </p>

      <h2>Brakeman — encontrando a vulnerabilidade antes do merge</h2>
      <CodeExample label="terminal" language="bash" code={`brakeman --no-pager`} />
      <p>
        <code>Brakeman</code> é uma ferramenta de análise estática: ela lê o código Rails sem rodar a aplicação,
        procurando padrões conhecidos de vulnerabilidade — SQL interpolado direto numa query (a mesma falha da lição
        de paginação e filtros), mass assignment sem strong parameters, redirecionamento não validado. O uso comum é
        como etapa de CI: um pull request que introduz um desses padrões falha a build antes de chegar em produção.
      </p>

      <Exercise
        prompt={
          <p>
            O <code>rack-attack</code> do exemplo limita tentativa de login só por IP. Um atacante usando muitos IPs
            diferentes contra o <strong>mesmo</strong> e-mail passaria batido. Adicione um segundo throttle
            limitando tentativas por e-mail, além do que já existe por IP.
          </p>
        }
        solutionLanguage="ruby"
        solutionCode={`class Rack::Attack
  throttle("login/ip", limit: 5, period: 60) do |req|
    req.ip if req.path == "/usuarios/sign_in" && req.post?
  end

  throttle("login/email", limit: 5, period: 60) do |req|
    if req.path == "/usuarios/sign_in" && req.post?
      req.params.dig("usuario", "email")&.downcase
    end
  end
end`}
      />

      <Callout href="/padrao-api/seguranca/cors">
        A configuração completa de CORS do padrão — múltiplas origens, métodos permitidos por ambiente — está
        documentada no Padrão API.
      </Callout>
      <Callout href="/padrao-api/seguranca/forca-bruta-e-bloqueio">
        A estratégia completa de bloqueio de força bruta do padrão — throttle por IP e por conta, resposta ao
        cliente bloqueado — está documentada no Padrão API.
      </Callout>
      <Callout href="/padrao-api/tecnologias/brakeman">
        Como o Brakeman é configurado e integrado ao pipeline de CI do padrão está documentado nas Tecnologias do
        Padrão API.
      </Callout>

      <Quiz
        track="rails"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Quem realmente aplica a restrição de CORS quando ela bloqueia uma requisição?",
            options: [
              "O servidor Rails, que recusa processar a requisição antes mesmo dela chegar no controller",
              "O navegador do cliente, que bloqueia a leitura da resposta quando o header de origem permitida não bate — um cliente como curl não é afetado",
              "O banco de dados, que rejeita a query se ela vier de uma origem não autorizada",
              "O Devise, que verifica a origem da requisição junto com o token JWT",
            ],
            correctIndex: 1,
          },
          {
            question: "O que o throttle do rack-attack no exemplo (limit: 5, period: 60) faz na prática?",
            options: [
              "Impede para sempre que aquele IP faça login de novo, mesmo depois de 60 segundos",
              "Bloqueia qualquer requisição para a API inteira, não só pra rota de login",
              "Substitui a necessidade de hash de senha, porque o IP já identifica o usuário",
              "Depois de 5 tentativas de um mesmo IP em 60 segundos, passa a bloquear novas tentativas até a janela de tempo reiniciar",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
