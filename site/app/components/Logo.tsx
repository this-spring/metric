export default function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      fill="none"
      width={size}
      height={size}
      style={{ flexShrink: 0 }}
      aria-label="Market Indicators Logo"
    >
      <rect width="40" height="40" rx="8" fill="#12121a" />
      <line x1="7" y1="31" x2="33" y2="31" stroke="#1e1e2e" strokeWidth="1" />
      <line x1="7" y1="24" x2="33" y2="24" stroke="#1e1e2e" strokeWidth="0.5" />
      <line x1="7" y1="17" x2="33" y2="17" stroke="#1e1e2e" strokeWidth="0.5" />
      <polyline
        points="7,29 12,25 18,27 24,17 30,13 33,10"
        fill="none"
        stroke="#6c8cff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="10" r="3" fill="#6c8cff" />
    </svg>
  );
}
