import { SEO_DESCRIPTION } from "../config";

interface SeoBarProps {
  subtitle?: string;
}

export function SeoBar({ subtitle }: SeoBarProps) {
  return (
    <div
      className="w-full border-b border-[var(--color-border)] bg-[#f5f5f5] px-4 py-3"
      role="region"
      aria-label="Product description"
    >
      <div className="mx-auto max-w-6xl text-center text-sm leading-relaxed text-[var(--color-text-muted)]">
        <p>{subtitle ?? SEO_DESCRIPTION}</p>
        <p className="mt-1">
          Browser-only — your SQL never leaves this page. Pick a dialect, lint, format, apply safe
          rewrites, and check schema preflight.
        </p>
      </div>
    </div>
  );
}
