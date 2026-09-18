import { LessonBody } from "@/components/aprenda/lesson-body";
import { CodeExample } from "@/components/aprenda/code-example";
import { Exercise } from "@/components/aprenda/exercise";
import { Callout } from "@/components/aprenda/callout";
import { Quiz } from "@/components/aprenda/quiz";
import type { LessonMeta } from "@/content/aprenda/types";

export const meta: LessonMeta = {
  slug: "18-upload-de-arquivos-e-imagens",
  title: "Upload de arquivos e imagens",
  summary: "Um <input type=\"file\"> sozinho não diz se o usuário selecionou o arquivo certo — preview e feedback fazem parte do upload.",
  estimatedMinutes: 15,
  level: "intermediario",
};

export default function Licao18UploadDeArquivosEImagens() {
  return (
    <LessonBody>
      <p>
        Um <code>{'<input type="file">'}</code> sozinho não dá feedback nenhum sobre o que foi selecionado — o
        usuário clica, escolhe um arquivo, e não tem confirmação visual de que pegou o certo. Um fluxo de upload de
        verdade mostra uma prévia antes de enviar e comunica erro quando o arquivo não serve.
      </p>

      <h2>Input file — capturando o arquivo selecionado</h2>
      <CodeExample
        label="Lendo o arquivo do evento"
        language="typescript"
        code={`"use client";

function InputComprovante({ onSelecionar }: { onSelecionar: (file: File) => void }) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onSelecionar(file);
  }

  return <input type="file" accept="image/*" onChange={handleChange} />;
}`}
      />

      <h2>Preview antes de enviar</h2>
      <p>
        Pra imagem, <code>URL.createObjectURL(file)</code> gera uma URL temporária, local, que aponta direto pro
        arquivo já selecionado no navegador — sem precisar enviar nada pro servidor só pra mostrar a prévia. O
        cuidado: essa URL precisa ser liberada com <code>URL.revokeObjectURL</code> quando não for mais usada, senão
        ela fica ocupando memória.
      </p>
      <CodeExample
        label="preview-comprovante.tsx"
        language="typescript"
        code={`"use client";

import { useEffect, useState } from "react";

export function PreviewComprovante({ file }: { file: File | null }) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url); // libera a memória ao trocar/desmontar
  }, [file]);

  if (!preview) return null;
  return <img src={preview} alt="Prévia do comprovante" className="w-40 h-40 object-cover rounded-lg" />;
}`}
      />

      <h2>Enviando com FormData</h2>
      <p>
        Arquivos não vão dentro de um <code>JSON.stringify</code> — eles vão num <code>FormData</code>. E não é
        preciso definir o header <code>Content-Type</code> manualmente: o navegador já define{" "}
        <code>multipart/form-data</code> com o boundary correto sozinho quando o corpo é um <code>FormData</code>.
      </p>
      <CodeExample
        label="Enviando o arquivo"
        language="typescript"
        code={`async function enviarComprovante(file: File, pedidoId: string) {
  const formData = new FormData();
  formData.append("arquivo", file);
  formData.append("pedidoId", pedidoId);

  await fetch("/api/comprovantes", {
    method: "POST",
    body: formData, // sem Content-Type manual — o navegador cuida disso
  });
}`}
      />

      <Callout href="/padrao-frontend/arquivos/upload-de-arquivos">
        O padrão completo de upload de arquivos do HTD — limites de tamanho, tipos aceitos, onde o arquivo é
        armazenado — está documentado no Padrão Frontend.
      </Callout>

      <Callout href="/padrao-frontend/arquivos/upload-de-imagem" title="E quando o arquivo é especificamente uma imagem?">
        Upload de imagem tem particularidades próprias (redimensionamento, formatos aceitos) documentadas
        separadamente no Padrão Frontend.
      </Callout>

      <Exercise
        prompt={
          <p>
            Adicione validação em <code>InputComprovante</code>: rejeite arquivos maiores que 5MB ou que não sejam do
            tipo <code>image/*</code>, mostrando uma mensagem de erro em vez de aceitar o arquivo.
          </p>
        }
        solutionLanguage="typescript"
        solutionCode={`function InputComprovante({ onSelecionar }: { onSelecionar: (file: File) => void }) {
  const [erro, setErro] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErro("Envie um arquivo de imagem.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErro("O arquivo precisa ter até 5MB.");
      return;
    }

    setErro(null);
    onSelecionar(file);
  }

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleChange} />
      {erro && <p className="text-sm text-red-600">{erro}</p>}
    </div>
  );
}`}
      />

      <Quiz
        track="frontend"
        lessonSlug={meta.slug}
        questions={[
          {
            question: "Por que usar URL.createObjectURL(file) pra mostrar uma preview antes de enviar a imagem?",
            options: [
              "Porque é a única forma de ler o conteúdo binário de um arquivo em JavaScript",
              "Gera uma URL temporária local que aponta pro arquivo já selecionado, sem precisar enviar nada pro servidor só pra mostrar o preview",
              "Porque comprime a imagem automaticamente antes do preview aparecer",
              "Porque converte a imagem para base64 antes de qualquer outra coisa",
            ],
            correctIndex: 1,
          },
          {
            question: "Ao montar um FormData com um arquivo e enviar via fetch, por que normalmente não se define o header Content-Type manualmente?",
            options: [
              "Porque FormData não aceita nenhum tipo de header customizado, por limitação da API",
              "Porque o servidor ignora completamente o Content-Type quando recebe um upload",
              "Porque toda requisição fetch já usa application/json por padrão, mesmo com FormData",
              "Porque o navegador já define o Content-Type multipart/form-data com o boundary correto automaticamente",
            ],
            correctIndex: 3,
          },
        ]}
      />
    </LessonBody>
  );
}
