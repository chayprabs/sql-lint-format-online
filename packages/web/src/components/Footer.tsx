import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] bg-[var(--color-surface-elevated)] py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-center gap-x-8 gap-y-2 px-4 text-sm text-[var(--color-text-muted)]">
        <Link to="/privacy" className="hover:text-[var(--color-accent)] hover:underline">
          Privacy Policy
        </Link>
        <Link to="/terms" className="hover:text-[var(--color-accent)] hover:underline">
          Terms &amp; Conditions
        </Link>
        <Link to="/license" className="hover:text-[var(--color-accent)] hover:underline">
          License
        </Link>
      </div>
    </footer>
  );
}
