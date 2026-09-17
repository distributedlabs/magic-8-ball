import { describe, expect, it } from "vitest";
import {
  EIGHT_BALL_CRITERIA,
  EIGHT_BALL_RESPONSES,
  getHighestScoringResponse,
} from "./eight-ball";

describe("Magic 8 Ball choices", () => {
  it("contains the twenty classic, uniquely mapped responses", () => {
    expect(Object.keys(EIGHT_BALL_CRITERIA)).toHaveLength(20);
    expect(Object.keys(EIGHT_BALL_RESPONSES)).toEqual(
      Object.keys(EIGHT_BALL_CRITERIA),
    );
    expect(new Set(Object.values(EIGHT_BALL_RESPONSES))).toHaveLength(20);
  });

  it("selects the recognized response with the highest probability", () => {
    expect(
      getHighestScoringResponse({
        yes: 0.12,
        outlook_good: 0.61,
        very_doubtful: 0.27,
      }),
    ).toEqual({
      id: "outlook_good",
      text: "Outlook good",
      probability: 0.61,
    });
  });

  it("ignores unknown labels and invalid scores", () => {
    expect(
      getHighestScoringResponse({
        unknown: 0.99,
        yes: Number.NaN,
        my_reply_is_no: 0.4,
      }).id,
    ).toBe("my_reply_is_no");
  });
});
