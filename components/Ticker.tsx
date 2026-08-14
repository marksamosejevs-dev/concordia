const ITEMS = [
  "Player Representation",
  "Transfers",
  "Career Management",
  "Legal",
  "FIFA",
  "Commercial",
  "Global Football",
  "Concordia",
];

export default function Ticker() {
  const content = (
    <span className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-4 font-mono text-xs uppercase tracking-[0.25em] text-paper sm:px-6 sm:text-sm">
            {item}
          </span>
          <span className="text-paper/40" aria-hidden="true">
            —
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div className="overflow-hidden border-y border-line-invert bg-ink py-4" aria-hidden="true">
      <div className="ticker-track flex w-max">
        {content}
        {content}
      </div>
    </div>
  );
}
