import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { NetworkDiagram } from "@/components/aprenda/network-diagram";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "06-proxy-reverso-nginx",
  title: "Proxy reverso — o que é e como funciona (nginx)",
  summary: "O servidor que fica na frente do seu servidor de verdade — e por que quase todo site em produção tem um.",
  estimatedMinutes: 18,
};

export default function Licao06ProxyReversoNginx() {
  return (
    <LessonBody>
      <p>
        Um <strong>proxy reverso</strong> é um servidor que recebe todas as requisições primeiro, e as repassa pro
        servidor de aplicação de verdade — o cliente nunca fala diretamente com o servidor que roda seu Next.js/Rails.
        Isso parece uma etapa extra sem necessidade, mas resolve vários problemas de uma vez.
      </p>

      <NetworkDiagram
        height={230}
        nodes={[
          { id: "client", label: "Navegador", kind: "client", x: 12, y: 50 },
          { id: "proxy", label: "Nginx (proxy)", kind: "proxy", x: 50, y: 50 },
          { id: "app", label: "App (Next.js/Rails)", kind: "server", x: 88, y: 50 },
        ]}
        hops={[
          { from: "client", to: "proxy", caption: "1. O navegador só conhece o nginx — nunca fala direto com a aplicação." },
          { from: "proxy", to: "app", caption: "2. Nginx repassa a requisição pro processo da aplicação, rodando internamente." },
          { from: "app", to: "proxy", caption: "3. A aplicação responde pro nginx." },
          { from: "proxy", to: "client", caption: "4. Nginx devolve a resposta pro navegador — ele nunca soube que a app existe." },
        ]}
      />

      <h2>O que um proxy reverso resolve</h2>
      <CodeExample
        language="plaintext"
        code={`TLS/HTTPS num lugar só      → nginx cuida do certificado; a app roda HTTP simples internamente
Servir arquivo estático      → nginx entrega imagem/CSS direto, sem acionar a app pra isso
Compressão (gzip)             → reduz o tamanho da resposta antes de sair pro cliente
Esconder a estrutura interna  → o cliente nunca sabe em qual porta/IP a app real está rodando
Roteamento por caminho        → /api/* vai pra um serviço, /* vai pro app`}
      />

      <h2>Um nginx.conf básico</h2>
      <CodeExample
        label="nginx.conf"
        language="plaintext"
        code={`server {
  listen 443 ssl;
  server_name howtodev.site;

  ssl_certificate     /etc/ssl/certs/howtodev.crt;
  ssl_certificate_key /etc/ssl/private/howtodev.key;

  location / {
    proxy_pass http://127.0.0.1:3000;       # repassa pro Next.js rodando localmente
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /api/ {
    proxy_pass http://127.0.0.1:3001;       # /api vai pra um serviço diferente
  }
}`}
      />
      <p>
        <code>proxy_set_header X-Real-IP</code> importa porque, sem isso, a aplicação veria toda requisição vindo do
        próprio nginx (localhost) — esse header preserva o IP real de quem fez a requisição original, útil pra rate
        limiting e logs de auditoria.
      </p>

      <Exercise
        prompt={
          <p>
            Por que faz sentido o nginx cuidar do certificado TLS, em vez de configurar HTTPS diretamente dentro do
            processo Next.js/Rails?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`Centraliza a gestão de certificado num lugar só — mesmo que existam
vários serviços internos (app, API, admin), só o nginx precisa lidar
com renovação de certificado e configuração TLS. Os serviços internos
ficam mais simples (HTTP puro), e trocar de tecnologia de app não
exige reconfigurar TLS de novo.`}
      />

      <Callout href="/padrao-infraestrutura/tecnologias/nginx">
        A configuração real de nginx usada em produção pelo padrão — incluindo cache e rate limit — está documentada
        no Padrão Infraestrutura.
      </Callout>

      <Quiz
        track="networking"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "No modelo de proxy reverso, com quem o navegador do cliente realmente conversa?",
            options: [
              "Diretamente com o processo da aplicação (Next.js/Rails)",
              "Só com o proxy reverso (nginx) — ele que repassa internamente pra aplicação",
              "Com os dois ao mesmo tempo, sempre",
              "Isso depende do navegador usado",
            ],
            correctIndex: 1,
          },
          {
            question: "Pra que serve o header X-Real-IP configurado no proxy_pass?",
            options: [
              "Não serve pra nada, é opcional",
              "Preserva o IP real de quem fez a requisição original, já que sem ele a aplicação veria tudo vindo do próprio nginx",
              "Criptografa a requisição",
              "Define a porta da aplicação",
            ],
            correctIndex: 1,
          },
        ]}
      />
    </LessonBody>
  );
}
