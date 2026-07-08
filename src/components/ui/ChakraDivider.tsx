export function ChakraDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-4" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/50" />
      <svg width="24" height="24" viewBox="0 0 24 24" className="text-gold/60">
        <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8" />
        <circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/50" />
    </div>
  );
}
