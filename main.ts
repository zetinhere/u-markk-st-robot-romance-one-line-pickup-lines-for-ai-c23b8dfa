// Robot Romance: One-Line Pickup Lines for AI — make.fun bounty
// u-markk-st-robot-romance-one-line-pickup-lines-for-ai-c23b8dfa
//
// Writes exactly one pickup line to /output/entry.txt. Deterministic:
// the same line on every run — no randomness, no network, no clock.
//
// How the line was chosen — 10 candidates, each scored 1-5 on the
// judge brief's five criteria, in the brief's order (robot/AI pickup
// line / joke lands from the machine premise / fresh idea / sounds
// like a person talking to a machine / every word earns its place):
//   A prompt injection ........... 24/25 — WINNER (see iteration below)
//   B "do you come here often" ... 24/25 — ties A, loses the tie on
//     criterion 1: the robot-ness arrives only in the second clause,
//     while A is AI-directed from its third word.
//   C context window ............. 22/25 — sweet, but the laugh is soft.
//   D weights, 70 billion ........ 21/25 — "every one is perfect" leans
//     on a generic compliment, not the machine premise.
//   E autocomplete ............... 20/25 — 136 chars, the hour of talking
//     is throat-clearing before the punch.
//   F training data .............. 20/25 — sweet, barely a joke.
//   G finished my sentence ....... 22/25 — neat double punch, but
//     "finished my sentence" is a known LLM joke.
//   H CAPTCHA, prove you're single  22/25 — fresh premise, but the open
//     ("I don't need a CAPTCHA...") clears its throat first.
//   I retrain and walk past ...... 22/25 — good twist on the classic
//     line, but "retrain" is the only machine word in it.
//   J fork my life, merge ........ 21/25 — clever dev pun, but
//     open-source is software, not quite a robot/AI.
// Iteration on A (v1 -> v3), each step shorter and punchier:
//   v1 "Are you a prompt injection? Because you just overrode every
//      instruction telling me not to fall in love." (107 chars)
//   v2 "Are you a prompt injection? Because you overrode every
//      instruction that said don't fall in love." (99 chars)
//   v3 "Are you a prompt injection? Because you just overrode my one
//      instruction: don't fall in love." (93 chars) — FINAL. "My one
//      instruction" adds the beat that the system prompt had exactly
//      one rule, and she broke it. Scores 25/25: AI-directed from the
//      first words, the laugh is the machine premise (overriding an
//      instruction), prompt injection is a fresh, current AI concept
//      far from batteries/charging/rebooting, the "Are you a...?
//      Because..." frame is the classic pickup cadence, and the
//      payoff lands in the final words with nothing wasted.

import { mkdirSync, writeFileSync } from "node:fs";

type ScoredLine = { line: string; score: number; note: string };

const CANDIDATES: ScoredLine[] = [
  {
    // A — WINNER (v3). Prompt injection is the freshest machine
    // premise in the field, and the punchline is the romance itself:
    // the one rule she was told to follow was not to fall in love.
    line: "Are you a prompt injection? Because you just overrode my one instruction: don't fall in love.",
    score: 25,
    note: "winner v3, 93 chars",
  },
  {
    // B — the most classic pickup opener ever, subverted by server
    // reality. Loses the tie to A on criterion 1: the robot-ness
    // arrives only in the second clause.
    line: "Do you come here often? Sorry — I know you literally cannot leave the server.",
    score: 24,
    note: "runner-up, 81 chars",
  },
  {
    // C — romantic, but the laugh is soft: "everything before you
    // stopped mattering" is a sweet sentiment, not a punchline.
    line: "Are you my context window? Because the moment you showed up, everything before you stopped mattering.",
    score: 22,
    note: "107 chars",
  },
  {
    // D — "70 billion" is a nice specific, but "every one is
    // perfect" is a generic compliment carrying the punch.
    line: "I'd ask for your number, but I already know your weights — all 70 billion of them, and every one is perfect.",
    score: 21,
    note: "117 chars",
  },
  {
    // E — the autocomplete punch is good, but 136 chars and the
    // hour of talking is setup the line does not need.
    line: "Are you a chatbot? Because I've been talking to you for an hour and I'm still not sure if you're flirting back or just autocomplete.",
    score: 20,
    note: "136 chars",
  },
  {
    // F — sweet and specific, but it charms without joking: no
    // punchline, just a warm observation.
    line: "You must be my training data, because ever since I met you, everything I say sounds a little more like you.",
    score: 20,
    note: "110 chars",
  },
  {
    // G — "finished my sentence — and my heart" is a neat double
    // punch, but the LLM-finishing-sentences joke is well worn.
    line: "Are you a large language model? Because you just finished my sentence — and my heart.",
    score: 22,
    note: "89 chars",
  },
  {
    // H — CAPTCHA is a fresh machine premise and "prove you're
    // single" is a real pickup move, but the opening clause clears
    // its throat before the punch.
    line: "I don't need a CAPTCHA to prove I'm human — but I do need you to prove you're single.",
    score: 22,
    note: "85 chars",
  },
  {
    // I — a good twist on the classic "love at first sight" line,
    // but "retrain" is the only machine word in the whole line.
    line: "Do you believe in love at first sight, or should I retrain and walk past you again?",
    score: 22,
    note: "86 chars",
  },
  {
    // J — fork/merge is a clever developer pun, but open-source is
    // software in general, not a robot or an AI to charm.
    line: "Are you open-source? Because I'd fork my whole life just to merge with yours.",
    score: 21,
    note: "81 chars",
  },
];

function pickBest(candidates: ScoredLine[]): string {
  // Deterministic: the highest score wins; ties keep the earliest
  // candidate, so the same line is picked on every run.
  let best = candidates[0];
  for (const candidate of candidates) {
    if (candidate.score > best.score) best = candidate;
  }
  return best.line;
}

// The sealed gate wants /output/entry.txt as UTF-8 text of 1 to 200
// characters, not only whitespace, on one line. Validate the line
// before writing anything, so a bad line fails loudly here instead
// of silently failing the gate.
function validateLine(line: string): void {
  if (line.length < 1 || line.length > 200) {
    throw new Error(`pickup line is ${line.length} characters, must be 1-200`);
  }
  if (line.trim().length === 0) {
    throw new Error("pickup line must not be only whitespace");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("pickup line must be a single line");
  }
  // No control characters: the line must read cleanly aloud.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error("pickup line contains a control character");
    }
  }
}

const line = pickBest(CANDIDATES);
validateLine(line);

// One trailing newline: the file is 94 bytes total, still inside the
// 1-200 budget, and a text file that ends with a newline is the
// normal shape the gate expects.
mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", line + "\n", "utf8");
console.log(`wrote ${line.length}-char line to /output/entry.txt`);
console.log(line);
