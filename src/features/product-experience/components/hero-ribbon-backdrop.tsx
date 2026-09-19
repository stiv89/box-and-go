export function HeroRibbonBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <g
          stroke="oklch(0.55 0.04 55)"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path
            d="M-90 210C30 28 250 8 390 128C530 248 470 360 300 410"
            strokeWidth="1.35"
            opacity="0.075"
          />
          <path
            d="M-70 228C50 52 256 34 386 144"
            strokeWidth="0.7"
            opacity="0.045"
          />
          <path
            d="M260 428C500 302 940 298 1180 428"
            strokeWidth="1.1"
            opacity="0.05"
          />
          <path
            d="M1530 690C1360 870 1100 890 960 770C820 650 900 540 1080 520"
            strokeWidth="1.35"
            opacity="0.07"
          />
          <path
            d="M1510 708C1368 872 1130 886 990 780"
            strokeWidth="0.7"
            opacity="0.04"
          />
        </g>
      </svg>
    </div>
  );
}
