import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-[var(--color-text-muted)]">
        This route does not exist. Return to the SQL playground.
      </p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-md bg-[var(--color-accent)] px-5 py-2 text-sm text-white hover:bg-[var(--color-accent-hover)]"
      >
        Open SQLGuard
      </Link>
    </div>
  );
}
