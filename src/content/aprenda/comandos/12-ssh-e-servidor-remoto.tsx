import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";

import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "12-ssh-e-servidor-remoto",
  title: "SSH: conectando num servidor remoto",
  summary: "Tudo que você aprendeu até aqui roda igual num servidor do outro lado do mundo — SSH é a porta de entrada pra isso.",
  estimatedMinutes: 16,
  level: "intermediario",
};

export default function Licao12SshEServidorRemoto() {
  return (
    <LessonBody>
      <p>
        Até agora, todo comando desta trilha rodou na sua própria máquina. Mas o destino final de praticamente
        todo projeto real é um <strong>servidor remoto</strong> — um computador em outro lugar do mundo, sem tela
        nem mouse, que você só acessa via terminal. <code>ssh</code> (<em>Secure Shell</em>) é o comando que abre
        essa conexão.
      </p>

      <h2>Conectando com ssh usuario@host</h2>
      <CodeExample
        label="terminal"
        language="bash"
        code={`ssh joana@203.0.113.42`}
        result={`joana@203.0.113.42's password:
Welcome to Ubuntu 22.04.3 LTS
joana@servidor:~$`}
      />
      <p>
        <code>joana</code> é o usuário que existe <strong>naquele servidor</strong> (não necessariamente igual ao
        seu usuário local), e <code>203.0.113.42</code> é o endereço do servidor — pode ser um IP direto ou um
        domínio. Depois de autenticado, o prompt muda pra indicar que você não está mais na sua máquina: repare que
        virou <code>joana@servidor</code>, não o nome da sua máquina local. Todo comando que você aprendeu nesta
        trilha — <code>ls</code>, <code>cd</code>, <code>nano</code>, <code>ps</code> — funciona exatamente igual
        aqui, só que rodando no servidor remoto.
      </p>

      <h2>Senha vs. chave pública/privada</h2>
      <p>
        O exemplo acima pediu senha, que é o jeito mais simples de autenticar — mas também o menos seguro,
        vulnerável a tentativas repetidas de adivinhação. O jeito recomendado em produção é autenticação por{" "}
        <strong>par de chaves</strong>: uma <strong>chave privada</strong>, que fica só na sua máquina e nunca é
        compartilhada, e uma <strong>chave pública</strong> correspondente, que você registra no servidor.
      </p>
      <CodeExample
        label="terminal (na sua máquina, uma vez só)"
        language="bash"
        code={`ssh-keygen -t ed25519`}
        result={`Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/joana/.ssh/id_ed25519):
Your identification has been saved in /Users/joana/.ssh/id_ed25519
Your public key has been saved in /Users/joana/.ssh/id_ed25519.pub`}
      />
      <p>
        Isso gera dois arquivos: <code>id_ed25519</code> (a chave privada — protege com uma senha se possível, e{" "}
        <strong>nunca</strong> compartilhe esse arquivo) e <code>id_ed25519.pub</code> (a chave pública, segura pra
        compartilhar). Pra autenticar sem senha, a chave pública precisa estar dentro do arquivo{" "}
        <code>~/.ssh/authorized_keys</code> <strong>no servidor</strong> — o servidor usa isso pra conferir que
        quem está tentando entrar realmente possui a chave privada correspondente, sem a chave privada nunca sair
        da sua máquina.
      </p>

      <h2>scp — copiando arquivo entre máquinas</h2>
      <p>
        Com SSH configurado, copiar arquivo entre sua máquina e o servidor usa <code>scp</code> (
        <em>secure copy</em>), com uma sintaxe parecida com <code>cp</code>, mas indicando de qual máquina pra qual:
      </p>
      <CodeExample
        label="terminal (da sua máquina pro servidor)"
        language="bash"
        code={`scp deploy.sh joana@203.0.113.42:/home/joana/`}
      />
      <p>
        O formato <code>usuario@host:/caminho</code> indica o destino remoto. Pra copiar no sentido contrário — do
        servidor pra sua máquina — só inverte a ordem dos dois argumentos:
      </p>
      <CodeExample
        label="terminal (do servidor pra sua máquina)"
        language="bash"
        code={`scp joana@203.0.113.42:/home/joana/log-erro.txt .`}
      />
      <p>
        O <code>.</code> no final significa "salva aqui, na pasta atual da minha máquina" — o mesmo <code>.</code>{" "}
        da lição 2.
      </p>

      <Callout
        title="Onde esse servidor remoto realmente roda"
        href="/padrao-infraestrutura/conceitos-tecnicos/vps-e-containers"
        linkLabel="Ver na documentação →"
      >
        SSH é como você se conecta, mas o que exatamente é essa máquina do outro lado — uma VPS, um container, a
        diferença entre os dois — é explicado na documentação de infraestrutura.
      </Callout>

      <Exercise
        prompt={
          <p>
            Você já gerou seu par de chaves com <code>ssh-keygen</code> e quer conseguir entrar no servidor{" "}
            <code>198.51.100.7</code> como usuário <code>deploy</code> sem digitar senha toda vez. Que arquivo,{" "}
            <strong>no servidor</strong>, precisa conter sua chave pública?
          </p>
        }
        solutionLanguage="plaintext"
        solutionCode={`~/.ssh/authorized_keys  (no servidor, dentro da pasta pessoal do usuário "deploy")

# O conteúdo do arquivo id_ed25519.pub (a chave PÚBLICA, nunca a
# privada) precisa ser adicionado a esse arquivo no servidor. Depois
# disso, "ssh deploy@198.51.100.7" autentica automaticamente pela
# chave, sem pedir senha.`}
      />

      <Quiz
        track="comandos"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que autenticação por par de chaves é considerada mais segura que autenticação por senha no SSH?",
            options: [
              "Porque a chave privada nunca sai da sua máquina, e o servidor só confirma posse dela sem transmitir nenhum segredo pela rede",
              "Porque a autenticação por chave é obrigatória em qualquer servidor Linux desde 2015, e a por senha foi descontinuada",
              "Porque a chave pública funciona como uma senha mais curta e fácil de memorizar do que uma senha comum",
              "Porque autenticação por chave não depende do usuário existir no servidor, apenas da chave estar correta",
            ],
            correctIndex: 0,
          },
          {
            question: "No comando 'scp deploy.sh joana@203.0.113.42:/home/joana/', em que direção o arquivo é copiado?",
            options: [
              "De dentro do servidor remoto para a pasta atual da máquina local, sobrescrevendo 'deploy.sh'",
              "O comando apenas verifica se o arquivo existe nos dois lados, sem copiar nada de fato",
              "Em ambas as direções simultaneamente, sincronizando os dois arquivos como se fossem um só",
              "Da máquina local para a pasta '/home/joana/' dentro do servidor remoto",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
