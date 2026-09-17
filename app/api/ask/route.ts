import {
  APIConnectionError,
  APITimeoutError,
  AuthenticationError,
  choice,
  PermissionDeniedError,
  RateLimitError,
  TypeSafeClient,
} from "@typesafe-ai/sdk";
import { NextResponse } from "next/server";
import {
  EIGHT_BALL_CRITERIA,
  getHighestScoringResponse,
} from "@/lib/eight-ball";

const MAX_QUESTION_LENGTH = 280;

export async function POST(request: Request) {
  if (!process.env.TYPESAFE_API_KEY) {
    return NextResponse.json(
      {
        error:
          "The oracle is not connected yet. Add TYPESAFE_API_KEY to .env.local.",
      },
      { status: 503 },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Send a question as JSON." }, { status: 400 });
  }

  const question =
    typeof body === "object" &&
    body !== null &&
    "question" in body &&
    typeof body.question === "string"
      ? body.question.trim()
      : "";

  if (!question) {
    return NextResponse.json(
      { error: "Ask the oracle a question first." },
      { status: 400 },
    );
  }

  if (question.length > MAX_QUESTION_LENGTH) {
    return NextResponse.json(
      { error: `Keep your question under ${MAX_QUESTION_LENGTH} characters.` },
      { status: 400 },
    );
  }

  try {
    const client = new TypeSafeClient();
    const response = await client.systemOne({
      model: "jev-latest",
      state: {
        question,
        setting:
          "A person is consulting a classic Magic 8 Ball for a playful answer. The answer is entertainment, not factual or professional advice.",
      },
      questions: {
        oracle_response: choice(
          {
            question:
              "Which one classic Magic 8 Ball response best fits the user's question and its implied circumstances?",
            guidance:
              "Select exactly one response. Judge the meaning and tone of `question`; do not invent facts beyond it.",
          },
          EIGHT_BALL_CRITERIA,
        ),
      },
    });

    const answer = response.answers.oracle_response;
    const winner = getHighestScoringResponse(answer.probabilities);

    return NextResponse.json({
      answer: winner.text,
      probability: winner.probability,
      confidence: answer.confidence,
      model: response.model,
    });
  } catch (error) {
    console.error("TypeSafe oracle request failed", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        {
          error:
            "TypeSafe rejected the API key. Check TYPESAFE_API_KEY in .env.local, then restart the server.",
        },
        { status: 401 },
      );
    }

    if (error instanceof PermissionDeniedError) {
      return NextResponse.json(
        { error: "This TypeSafe account does not have access to the Jev model." },
        { status: 403 },
      );
    }

    if (error instanceof RateLimitError) {
      return NextResponse.json(
        { error: "TypeSafe is rate-limiting requests. Wait a moment and try again." },
        { status: 429 },
      );
    }

    if (error instanceof APITimeoutError) {
      return NextResponse.json(
        { error: "TypeSafe took too long to respond. Please try again." },
        { status: 504 },
      );
    }

    if (error instanceof APIConnectionError) {
      return NextResponse.json(
        { error: "The server could not reach TypeSafe. Check your connection and retry." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "An unexpected server error stopped the oracle. Please try again." },
      { status: 502 },
    );
  }
}
