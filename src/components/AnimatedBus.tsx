import { useId } from "react";

export function AnimatedBus({ className }: { className?: string }) {
  const id = useId();

  return (
    <svg
      viewBox="0 0 340 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13614a" />
          <stop offset="1" stopColor="#0a3b2c" />
        </linearGradient>
        <linearGradient id={`${id}-window`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#eef8f3" />
          <stop offset="1" stopColor="#b9e0d1" />
        </linearGradient>
      </defs>

      <ellipse cx="170" cy="143" rx="128" ry="5" fill="#04140d" opacity="0.45" />

      <g className="bus-bob">
        <rect x="46" y="40" width="248" height="74" rx="18" fill={`url(#${id}-body)`} />
        <rect x="46" y="42" width="248" height="6" rx="3" fill="#ffffff" opacity="0.08" />
        <rect x="46" y="96" width="248" height="8" rx="4" fill="#f2a51a" />

        {[58, 96, 134, 172, 210].map((x) => (
          <rect key={x} x={x} y="52" width="30" height="30" rx="8" fill={`url(#${id}-window)`} />
        ))}

        <rect x="250" y="52" width="36" height="30" rx="7" fill="#05261c" />
        <text
          x="268"
          y="73"
          textAnchor="middle"
          fontSize="16"
          fontWeight="700"
          fill="#f2a51a"
          fontFamily="var(--font-display), sans-serif"
        >
          24
        </text>

        <rect x="212" y="56" width="4" height="22" rx="2" fill="#ffffff" opacity="0.12" />
        <text
          x="150"
          y="90"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          letterSpacing="4"
          fill="#f7c86a"
          fontFamily="var(--font-display), sans-serif"
        >
          INZIRA
        </text>

        <circle className="bus-glow" cx="286" cy="86" r="4.5" fill="#ffd166" />
        <circle cx="56" cy="86" r="4" fill="#e5563f" />

        <rect x="78" y="96" width="36" height="18" rx="6" fill="#06271d" />
        <rect x="226" y="96" width="36" height="18" rx="6" fill="#06271d" />

        <circle cx="96" cy="118" r="21" fill="#0d1513" stroke="#050c09" strokeWidth="2" />
        <circle cx="244" cy="118" r="21" fill="#0d1513" stroke="#050c09" strokeWidth="2" />

        <g className="bus-wheel">
          <circle cx="96" cy="118" r="8.5" fill="#f2a51a" />
          <g stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round">
            <line x1="96" y1="118" x2="96" y2="104" />
            <line x1="96" y1="118" x2="96" y2="132" />
            <line x1="96" y1="118" x2="82" y2="118" />
            <line x1="96" y1="118" x2="110" y2="118" />
          </g>
        </g>
        <g className="bus-wheel">
          <circle cx="244" cy="118" r="8.5" fill="#f2a51a" />
          <g stroke="#ffd166" strokeWidth="2.5" strokeLinecap="round">
            <line x1="244" y1="118" x2="244" y2="104" />
            <line x1="244" y1="118" x2="244" y2="132" />
            <line x1="244" y1="118" x2="230" y2="118" />
            <line x1="244" y1="118" x2="258" y2="118" />
          </g>
        </g>
      </g>
    </svg>
  );
}
