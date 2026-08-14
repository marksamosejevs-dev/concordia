export function FloodlightMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 1000"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <rect width="800" height="1000" fill="#000" />
      <g stroke="#fff" strokeWidth="1" opacity="0.5">
        <line x1="80" y1="1000" x2="80" y2="220" />
        <line x1="720" y1="1000" x2="720" y2="220" />
        <line x1="80" y1="240" x2="720" y2="240" />
      </g>
      <g stroke="#fff" strokeWidth="0.75" opacity="0.35">
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={i} x1="80" y1="240" x2={90 + i * 72} y2="1000" />
        ))}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`b-${i}`} x1="720" y1="240" x2={710 - i * 72} y2="1000" />
        ))}
      </g>
      <g fill="#fff">
        {Array.from({ length: 6 }).map((_, i) => (
          <circle key={i} cx={140 + i * 105} cy="228" r="5" opacity={0.9 - i * 0.08} />
        ))}
      </g>
      <g stroke="#fff" strokeWidth="1" opacity="0.18">
        <circle cx="400" cy="760" r="220" fill="none" />
        <circle cx="400" cy="760" r="3" fill="#fff" />
      </g>
    </svg>
  );
}

export function PitchArcMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 600"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5">
        <circle cx="300" cy="300" r="140" />
        <circle cx="300" cy="300" r="2" fill="currentColor" />
        <path d="M0 60 H180 V540 H0" />
        <path d="M600 60 H420 V540 H600" />
        <rect x="0" y="0" width="600" height="600" />
      </g>
    </svg>
  );
}

export function GrainOverlay({ opacity = 0.05 }: { opacity?: number }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full mix-blend-overlay"
      style={{ opacity }}
      aria-hidden="true"
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
}
