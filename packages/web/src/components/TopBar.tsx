import { Github, Globe } from "lucide-react";
import { GITHUB_REPO, PRODUCT_NAME, TWITTER_URL, WEBSITE_URL } from "../config";

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <a href="/" className="text-lg font-semibold tracking-tight text-[var(--color-accent)]">
          {PRODUCT_NAME}
        </a>
        <nav className="flex items-center gap-4" aria-label="External links">
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            title="GitHub repository"
          >
            <Github size={18} />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <a
            href={TWITTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            title="Twitter / X"
          >
            <XIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={WEBSITE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--color-text-muted)] transition hover:text-[var(--color-text)]"
            title="Personal website"
          >
            <Globe size={18} />
          </a>
        </nav>
      </div>
    </header>
  );
}
