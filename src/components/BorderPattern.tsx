/** Geometric strip in the Urban Receipt colours. Decorative only. */
export function BorderPattern({ className = "h-7 w-full" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <defs>
        <pattern id="rr-border" width="56" height="28" patternUnits="userSpaceOnUse">
          <rect width="56" height="28" fill="#6b2326" />
          <polygon points="0,28 28,0 56,28" fill="#fbf5ea" />
          <polygon points="12,28 28,12 44,28" fill="#2f6b4f" />
          <polygon points="22,28 28,22 34,28" fill="#c9672a" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#rr-border)" />
    </svg>
  );
}

/** Diagonal corner motif for the top-right of a screen. Decorative only. */
export function CornerPattern({ className = "h-28 w-28" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <polygon points="0,0 120,0 120,120" fill="#fbf5ea" />
      <polygon points="30,0 120,0 120,90" fill="#6b2326" />
      <polygon points="52,0 120,0 120,68" fill="#c9672a" />
      <polygon points="72,0 120,0 120,48" fill="#2f6b4f" />
      <polygon points="94,0 120,0 120,26" fill="#e6d6bf" />
    </svg>
  );
}
