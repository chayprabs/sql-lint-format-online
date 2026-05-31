export function PrivacyPage() {
  return (
    <article className="prose prose-sm max-w-none text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 31, 2026</p>

      <section className="mt-6 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-medium">Summary</h2>
        <p>
          SQLGuard (&quot;we&quot;, &quot;the tool&quot;) is a browser-only SQL linting, formatting,
          and rewrite playground. We do not operate user accounts, and we do not intentionally
          collect, store, or sell your SQL on our servers.
        </p>

        <h2 className="text-lg font-medium">Local processing</h2>
        <p>
          SQL you paste is processed entirely in your web browser using client-side libraries. It is
          not transmitted to our servers for analysis unless you explicitly use a third-party link
          or feature that does so (this product does not include such features by default).
        </p>

        <h2 className="text-lg font-medium">Data stored on your device</h2>
        <p>
          Your browser may store preferences or share URLs in the address bar. You can clear
          browser storage at any time. Shared links encode SQL in the URL fragment; anyone with the
          link can read that content — treat share links like sensitive data.
        </p>

        <h2 className="text-lg font-medium">Hosting &amp; logs</h2>
        <p>
          Static hosting providers may log standard request metadata (IP address, user agent, page
          URL path) for security and operations. We do not use third-party advertising trackers or
          analytics that ingest SQL content.
        </p>

        <h2 className="text-lg font-medium">No warranty</h2>
        <p>
          Outputs are suggestions only. You are responsible for reviewing SQL before running it
          against production systems.
        </p>

        <h2 className="text-lg font-medium">Contact</h2>
        <p>
          Questions:{" "}
          <a href="https://www.chaitanyaprabuddha.com" className="text-[var(--color-accent)]">
            chaitanyaprabuddha.com
          </a>
        </p>
      </section>
    </article>
  );
}
