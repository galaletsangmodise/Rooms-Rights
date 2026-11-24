export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-lg font-extrabold tracking-tight text-forest ${className}`}>
      ROOMS<span className="text-maroon">&amp;</span>RIGHTS
    </span>
  );
}