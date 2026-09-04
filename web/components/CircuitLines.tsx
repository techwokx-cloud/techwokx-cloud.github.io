export default function CircuitLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 hidden h-full w-full xl:block"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="circuit-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke="url(#circuit-grad)" strokeWidth="0.15" opacity="0.6">
        <path
          className="animate-circuit-flow"
          d="M 14 12 C 22 20, 30 26, 40 34"
        />
        <path
          className="animate-circuit-flow"
          style={{ animationDelay: "0.6s" }}
          d="M 14 24 C 24 28, 32 32, 40 38"
        />
        <path
          className="animate-circuit-flow"
          style={{ animationDelay: "1.2s" }}
          d="M 86 12 C 78 20, 70 26, 60 34"
        />
        <path
          className="animate-circuit-flow"
          style={{ animationDelay: "1.8s" }}
          d="M 86 24 C 76 28, 68 32, 60 38"
        />
      </g>
    </svg>
  );
}
