const NINE: [string, string][] = [
  ["Level", "Where your current performances actually sit — not where you hope they sit."],
  ["Market", "Which countries and leagues value your profile."],
  ["Passport", "What doors your nationality opens or closes."],
  ["Timing", "The transfer window, your age, your contract."],
  ["Position", "Demand isn’t equal across positions."],
  ["Minutes", "Clubs sign what they can evaluate. No minutes, no evidence."],
  ["Footage", "A full match says what highlights can’t."],
  ["Profile", "How you present yourself, on paper and online."],
  ["Approach", "Who you contact, how, and when."],
];

/** Desktop grid; on mobile a thumb-native swipe deck of nine full-width cards. */
export function NineThings() {
  return (
    <ol className="rail -mx-[var(--gutter)] mt-12 flex snap-x snap-mandatory gap-3 overflow-x-auto px-[var(--gutter)] pb-2 md:mx-0 md:grid md:grid-cols-3 md:gap-px md:overflow-visible md:bg-ink/10 md:px-0">
      {NINE.map(([t, b], i) => (
        <li key={t} className="flex w-[82%] shrink-0 snap-center flex-col justify-between bg-ink p-7 text-white md:w-auto md:bg-paper md:text-ink">
          <span className="mono text-[0.72rem] text-route md:text-route-deep">{String(i + 1).padStart(2, "0")} / 09</span>
          <div className="mt-10"><p className="display text-[2.6rem] leading-none">{t}</p><p className="mt-3 text-[0.98rem] leading-relaxed opacity-80">{b}</p></div>
        </li>
      ))}
    </ol>
  );
}
