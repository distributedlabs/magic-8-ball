export const EIGHT_BALL_CRITERIA = {
  it_is_certain:
    "Use for the strongest possible affirmative: the outcome feels virtually assured.",
  it_is_decidedly_so:
    "Use for a confident, decisive affirmative where hesitation would feel misplaced.",
  without_a_doubt:
    "Use for an emphatic affirmative when the question implies a clear or undeniable yes.",
  yes_definitely:
    "Use for a direct, enthusiastic affirmative with very strong positive support.",
  you_may_rely_on_it:
    "Use for a dependable affirmative when the asker is seeking reassurance or trust.",
  as_i_see_it_yes:
    "Use for a positive judgment that is clear but framed as the oracle's perspective.",
  most_likely:
    "Use for a probable affirmative when success is favored but not guaranteed.",
  outlook_good:
    "Use when future prospects look favorable or circumstances are trending positively.",
  yes:
    "Use for a plain, unembellished affirmative when no stronger nuance is needed.",
  signs_point_to_yes:
    "Use when clues, momentum, or available evidence lean toward an affirmative.",
  reply_hazy_try_again:
    "Use when the question is ambiguous, underspecified, or gives conflicting signals.",
  ask_again_later:
    "Use when the timing is premature and circumstances may soon provide a clearer answer.",
  better_not_tell_you_now:
    "Use as a playful refusal when revealing an answer now would spoil something or feel unwise.",
  cannot_predict_now:
    "Use when the outcome is currently too volatile or inherently uncertain to judge.",
  concentrate_and_ask_again:
    "Use when the question is unfocused, contains several questions, or needs clearer intent.",
  dont_count_on_it:
    "Use for a cautious negative: possible, but the asker should not depend on it.",
  my_reply_is_no:
    "Use for a plain, direct negative when no additional nuance is needed.",
  my_sources_say_no:
    "Use when the facts, clues, or circumstances described lean toward a negative.",
  outlook_not_so_good:
    "Use when future prospects appear unfavorable, though not absolutely impossible.",
  very_doubtful:
    "Use for the strongest skepticism when the proposed outcome seems highly unlikely.",
} as const;

export type EightBallResponseId = keyof typeof EIGHT_BALL_CRITERIA;

export const EIGHT_BALL_RESPONSES: Record<EightBallResponseId, string> = {
  it_is_certain: "It is certain",
  it_is_decidedly_so: "It is decidedly so",
  without_a_doubt: "Without a doubt",
  yes_definitely: "Yes definitely",
  you_may_rely_on_it: "You may rely on it",
  as_i_see_it_yes: "As I see it, yes",
  most_likely: "Most likely",
  outlook_good: "Outlook good",
  yes: "Yes",
  signs_point_to_yes: "Signs point to yes",
  reply_hazy_try_again: "Reply hazy, try again",
  ask_again_later: "Ask again later",
  better_not_tell_you_now: "Better not tell you now",
  cannot_predict_now: "Cannot predict now",
  concentrate_and_ask_again: "Concentrate and ask again",
  dont_count_on_it: "Don’t count on it",
  my_reply_is_no: "My reply is no",
  my_sources_say_no: "My sources say no",
  outlook_not_so_good: "Outlook not so good",
  very_doubtful: "Very doubtful",
};

export function getHighestScoringResponse(
  probabilities: Readonly<Record<string, number>>,
) {
  const entries = Object.entries(probabilities).filter(
    (entry): entry is [EightBallResponseId, number] =>
      entry[0] in EIGHT_BALL_RESPONSES && Number.isFinite(entry[1]),
  );

  if (entries.length === 0) {
    throw new Error("TypeSafe returned no recognized Magic 8 Ball choices.");
  }

  const [id, probability] = entries.reduce((best, current) =>
    current[1] > best[1] ? current : best,
  );

  return {
    id,
    text: EIGHT_BALL_RESPONSES[id],
    probability,
  };
}
