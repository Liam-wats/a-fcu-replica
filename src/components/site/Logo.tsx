import { Link } from "@tanstack/react-router";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" aria-label="A+ Federal Credit Union home" className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 64 64" className="w-12 h-12 text-brand-green" aria-hidden="true">
        <path
          fill="currentColor"
          d="M32 4 L60 60 L48 60 L42 46 L22 46 L16 60 L4 60 Z M26 38 L38 38 L32 22 Z"
        />
        <path fill="currentColor" d="M50 6 h6 v6 h6 v6 h-6 v6 h-6 v-6 h-6 v-6 h6 z" />
      </svg>
      <span className="leading-tight">
        <span className="block text-[11px] font-semibold text-brand-green tracking-wide uppercase">Federal</span>
        <span className="block text-[11px] font-semibold text-brand-green tracking-wide uppercase">Credit</span>
        <span className="block text-[11px] font-semibold text-brand-green tracking-wide uppercase">Union</span>
      </span>
    </Link>
  );
}