"use client";

import { FormEvent, useState } from "react";

type OracleResponse = {
  answer: string;
  probability: number;
  confidence: number;
  model: string;
};

const EXAMPLE_QUESTIONS = [
  "Will my idea work?",
  "Should I take the leap?",
  "Is today the day?",
];

function wait(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export function MagicEightBall() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<OracleResponse | null>(null);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);

  async function askOracle(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isShaking) return;

    setError("");
    setResult(null);
    setIsShaking(true);

    try {
      const [response] = await Promise.all([
        fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: trimmedQuestion }),
        }),
        wait(850),
      ]);

      const data = (await response.json()) as OracleResponse & { error?: string };

      if (!response.ok) {
        throw new Error(data.error ?? "The oracle could not answer.");
      }

      setResult(data);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "The oracle could not answer.",
      );
    } finally {
      setIsShaking(false);
    }
  }

  const signal = result ? Math.round(result.probability * 100) : null;

  return (
    <section className="oracle-layout" aria-label="Magic 8 Ball oracle">
      <div className="ball-stage">
        <div
          className={`eight-ball${isShaking ? " is-shaking" : ""}${error ? " has-error" : ""}`}
          aria-label={
            error
              ? "The oracle could not answer"
              : result
                ? `The oracle says: ${result.answer}`
                : "Magic 8 Ball"
          }
        >
          <div className="ball-highlight" aria-hidden="true" />
          <div className="answer-window">
            {error ? (
              <span className="error-mark" aria-hidden="true">
                !
              </span>
            ) : result || isShaking ? (
              <div className="answer-triangle">
                <span className="answer-copy" aria-live="polite">
                  {isShaking ? "Consulting the signs…" : result?.answer}
                </span>
              </div>
            ) : (
              <span className="eight-mark" aria-hidden="true">
                8
              </span>
            )}
          </div>
        </div>
        <div className="ball-shadow" aria-hidden="true" />
        <p className="signal" aria-live="polite">
          {error
            ? "Connection interrupted · see details"
            : result
            ? `Jev signal strength · ${signal}%`
            : "Twenty signs. One answer."}
        </p>
      </div>

      <div className="question-panel">
        <div className="panel-number" aria-hidden="true">
          08
        </div>
        <p className="panel-kicker">Ask carefully</p>
        <h2>What would you like to know?</h2>
        {result ? (
          <div className="result-card" role="status" aria-live="polite">
            <div className="result-card-label">
              <span aria-hidden="true" />
              Valid oracle response
            </div>
            <strong>{result.answer}</strong>
            <p>
              Jev selected this from the 20 classic responses with a {signal}%
              top probability. It is an answer, not an error message.
            </p>
          </div>
        ) : null}
        {error ? (
          <div className="error-card" role="alert">
            <div className="error-card-label">Technical problem</div>
            <strong>The oracle could not answer</strong>
            <p>{error}</p>
          </div>
        ) : null}
        <form onSubmit={askOracle}>
          <label htmlFor="question">Your question</label>
          <textarea
            id="question"
            name="question"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Will I find what I’m looking for?"
            maxLength={280}
            rows={4}
            disabled={isShaking}
            required
          />
          <div className="form-meta">
            <span>Best with a yes-or-no question</span>
            <span>{question.length}/280</span>
          </div>
          <button type="submit" disabled={!question.trim() || isShaking}>
            <span aria-hidden="true">✦</span>
            {isShaking ? "Shaking…" : error ? "Try again" : "Shake the ball"}
          </button>
        </form>

        <div className="examples" aria-label="Example questions">
          <span>Try asking</span>
          <div>
            {EXAMPLE_QUESTIONS.map((example) => (
              <button
                type="button"
                key={example}
                onClick={() => setQuestion(example)}
                disabled={isShaking}
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
