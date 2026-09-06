"use client";

import { useState } from "react";
import { markLessonComplete, saveQuizScore } from "@/lib/aprenda-progress";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
};

/**
 * Quiz de múltipla escolha no final da lição — corrige na hora no client
 * (sem backend), salva a nota em localStorage. Acertar tudo marca a lição
 * como concluída automaticamente.
 */
export function Quiz({ track, lessonSlug, questions }: { track: string; lessonSlug: string; questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);

  const correctCount = questions.reduce((acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0), 0);
  const allAnswered = answers.every((a) => a !== null);

  function handleSubmit() {
    setSubmitted(true);
    saveQuizScore(track, lessonSlug, correctCount, questions.length);
    if (correctCount === questions.length) markLessonComplete(track, lessonSlug);
  }

  return (
    <div className="nexttech-quiz">
      <h3 className="nexttech-quiz__title">Quiz rápido</h3>
      {questions.map((q, qi) => (
        <fieldset key={qi} className="nexttech-quiz__question" disabled={submitted}>
          <legend>{q.question}</legend>
          {q.options.map((option, oi) => {
            const isCorrectOption = submitted && oi === q.correctIndex;
            const isWrongSelected = submitted && answers[qi] === oi && oi !== q.correctIndex;
            return (
              <label
                key={oi}
                className={`nexttech-quiz__option${isCorrectOption ? " is-correct" : ""}${isWrongSelected ? " is-wrong" : ""}`}
              >
                <input
                  type="radio"
                  name={`quiz-${lessonSlug}-${qi}`}
                  checked={answers[qi] === oi}
                  onChange={() =>
                    setAnswers((prev) => {
                      const next = [...prev];
                      next[qi] = oi;
                      return next;
                    })
                  }
                />
                <span>{option}</span>
              </label>
            );
          })}
        </fieldset>
      ))}
      {!submitted ? (
        <button type="button" className="nexttech-quiz__submit" disabled={!allAnswered} onClick={handleSubmit}>
          Verificar respostas
        </button>
      ) : (
        <p className="nexttech-quiz__result">
          Você acertou {correctCount} de {questions.length}
          {correctCount === questions.length ? " — lição concluída." : "."}
        </p>
      )}
    </div>
  );
}
