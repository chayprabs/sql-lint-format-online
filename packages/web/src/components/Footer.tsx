import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-6">
      <div className="mx-auto flex max-w-6xl justify-center gap-8 px-4 text-sm text-[var(--color-text-muted)]">
        <Link to="/privacy" className="hover:text-[var(--color-accent)] hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-[var(--color-accent)] hover:underline">
          Terms &amp; Conditions
        </Link>
      </div>
    </footer>
  );
}
