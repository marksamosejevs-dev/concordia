export interface Decision { key: string; label: string; line: string; parent?: string }

export const decisions: Decision[] = [
  { key: "go", label: "Go.", line: "The level, the market and the timing line up." },
  { key: "wait", label: "Wait.", line: "Right idea, wrong moment. Prepare for the next window.", parent: "Waiting a window is often the most professional decision — and the cheapest." },
  { key: "stay", label: "Stay.", line: "Where you are is giving you what you need. Keep it.", parent: "Staying another season can protect minutes, education and development." },
  { key: "move", label: "Move.", line: "You’ve outgrown your environment — or it isn’t giving you minutes." },
  { key: "play-more", label: "Play more.", line: "Minutes first. Nobody signs a player they can’t evaluate." },
  { key: "change-market", label: "Change market.", line: "The right level may be in a different country." },
  { key: "improve-first", label: "Improve first.", line: "Specific gaps stand between you and the level you want." },
  { key: "say-no", label: "Say no.", line: "That opportunity looks good. It isn’t good for you.", parent: "If an opportunity isn’t worth your money, telling you so is part of the job." },
  { key: "read-it-again", label: "Read it again.", line: "Before you sign anything, understand what it commits you to." },
];
