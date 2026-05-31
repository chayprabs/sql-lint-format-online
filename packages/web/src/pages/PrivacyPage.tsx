import {
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR_NAME,
  LEGAL_OPERATOR_URL,
  LEGAL_PRODUCT_NAME,
  LEGAL_REPO_URL,
  LEGAL_SITE_URL,
} from "../legal/constants";

export function PrivacyPage() {
  return (
    <article className="prose prose-sm max-w-none text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold">Privacy Policy</h1>
      <p className="text-sm text-[var(--color-text-muted)]">Last updated: {LEGAL_LAST_UPDATED}</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          This Privacy Policy describes how {LEGAL_PRODUCT_NAME} (&quot;{LEGAL_PRODUCT_NAME}&quot;,
          &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles information when you use the
          open-source software and the public website at{" "}
          <a href={LEGAL_SITE_URL} className="text-[var(--color-accent)]">
            {LEGAL_SITE_URL}
          </a>{" "}
          (the &quot;Service&quot;). The Service is operated by {LEGAL_OPERATOR_NAME} (&quot;
          {LEGAL_OPERATOR_NAME}&quot;). By using the Service, you acknowledge this Privacy Policy.
          If you do not agree, do not use the Service.
        </p>

        <h2 className="text-lg font-medium">1. Summary</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            {LEGAL_PRODUCT_NAME} is a browser-based SQL linting, formatting, and rewrite playground.
            We do not offer user accounts, logins, or paid subscriptions on the public Service.
          </li>
          <li>
            SQL you enter is processed locally in your browser. We do not intentionally collect,
            store, or sell the content of your SQL on our servers.
          </li>
          <li>
            You may store preferences locally (for example IndexedDB). Share links encode SQL in the
            URL fragment — treat them as sensitive.
          </li>
          <li>
            Static hosting providers may log standard technical metadata (such as IP address and user
            agent) for security and operations.
          </li>
        </ul>

        <h2 className="text-lg font-medium">2. Scope and roles</h2>
        <p>
          This policy applies to visitors and users of the public website and documentation. If you
          self-host the software, you are responsible for privacy compliance for your own deployment.
          {LEGAL_OPERATOR_NAME} is the operator of the official public instance described above. For
          purposes of the EU/UK General Data Protection Regulation (GDPR), where applicable,{" "}
          {LEGAL_OPERATOR_NAME} acts as the controller for personal data processed in connection with
          operating that instance.
        </p>

        <h2 className="text-lg font-medium">3. Information we do not intentionally collect</h2>
        <p>We do not intentionally operate systems that:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Receive your SQL text on our servers for linting, formatting, or rewriting;</li>
          <li>Require registration, passwords, or profile data to use the playground;</li>
          <li>Sell personal information to third parties; or</li>
          <li>Use advertising trackers that ingest SQL content.</li>
        </ul>

        <h2 className="text-lg font-medium">4. Information processed locally on your device</h2>
        <p>
          When you use the Service, SQL and schema DDL you paste are processed in your web browser
          using client-side libraries. Your browser may persist:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Editor content and preferences in local storage or IndexedDB (for example via localforage);</li>
          <li>A shareable state encoded in the URL hash (fragment), which is not sent to the server as part of the HTTP request path but may be visible in browser history, bookmarks, screenshots, or referrer headers on some navigations;</li>
          <li>Progressive Web App (PWA) cache files for offline or faster loading.</li>
        </ul>
        <p>
          You can clear site data through your browser settings or use the in-app control to clear
          local history where provided. Anyone with a share link can read the encoded SQL — do not
          share links containing production secrets, personal data, or credentials.
        </p>

        <h2 className="text-lg font-medium">5. Information hosting providers may process</h2>
        <p>
          The website is distributed as static files (for example via GitHub Pages). Infrastructure
          providers may automatically process limited technical data, which can constitute personal
          data in some jurisdictions, including:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP address, request time, HTTP method, URL path, response status;</li>
          <li>User agent, referrer, and security or anti-abuse signals;</li>
          <li>TLS and CDN or edge logs maintained for reliability and security.</li>
        </ul>
        <p>
          We do not control all retention periods for provider logs. We request that providers process
          such data only as needed to host and secure the Service. We do not use third-party
          analytics on the public instance that are designed to collect SQL content.
        </p>

        <h2 className="text-lg font-medium">6. Legal bases (EEA, UK, and similar laws)</h2>
        <p>Where GDPR or similar laws apply, we rely on:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Legitimate interests</strong> — operating, securing, and improving the Service,
            preventing abuse, and understanding aggregate technical reliability, balanced against your
            rights;
          </li>
          <li>
            <strong>Contract / pre-contractual steps</strong> — providing the Service you request when
            you access the site;
          </li>
          <li>
            <strong>Legal obligation</strong> — where we must comply with law or valid legal process.
          </li>
        </ul>
        <p>
          We do not rely on consent for core hosting logs where another basis applies. Where consent
          is required for optional features in a future version, we will request it separately.
        </p>

        <h2 className="text-lg font-medium">7. How we use information</h2>
        <p>We use the categories of information described above to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Deliver static pages and client-side application assets;</li>
          <li>Maintain security and investigate abuse or technical incidents;</li>
          <li>Comply with legal obligations and enforce our Terms &amp; Conditions;</li>
          <li>Improve the open-source project through aggregated, non-SQL feedback (for example issue reports you choose to file on GitHub).</li>
        </ul>

        <h2 className="text-lg font-medium">8. Sharing and disclosure</h2>
        <p>We may disclose information only:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>To hosting, CDN, or source-control providers that process data on our behalf under their terms;</li>
          <li>To comply with law, regulation, legal process, or governmental request;</li>
          <li>To protect the rights, property, or safety of {LEGAL_OPERATOR_NAME}, users, or the public;</li>
          <li>In connection with a merger, acquisition, or asset sale, with notice where required by law.</li>
        </ul>
        <p>
          We do not sell or share personal information for cross-context behavioral advertising as
          defined under the California Consumer Privacy Act (CCPA), as amended by the CPRA.
        </p>

        <h2 className="text-lg font-medium">9. International transfers</h2>
        <p>
          If you access the Service from outside India, your technical data may be processed in
          countries where our providers operate (including the United States). Where required, we
          rely on appropriate safeguards such as standard contractual clauses or provider compliance
          programs. Contact us if you need more information about transfers relevant to your
          location.
        </p>

        <h2 className="text-lg font-medium">10. Retention</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>On your device:</strong> until you clear browser storage or uninstall the PWA.
          </li>
          <li>
            <strong>Hosting logs:</strong> according to the hosting provider&apos;s default retention,
            typically for a limited operational period.
          </li>
          <li>
            <strong>GitHub issues or correspondence:</strong> for as long as needed for the inquiry
            and project records.
          </li>
        </ul>

        <h2 className="text-lg font-medium">11. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, restrict,
          object to processing, or port personal data, and to withdraw consent where processing is
          consent-based. You may also have the right to lodge a complaint with a supervisory authority
          (for example in the EU/UK).
        </p>
        <p>
          Because we do not operate accounts, we may not be able to identify you from hosting logs
          alone. To exercise rights, contact us with enough detail to locate relevant records (for
          example approximate date, time, and URL accessed). We will respond within timeframes required
          by applicable law (for example 30 days under GDPR, or 45 days under CCPA where applicable).
        </p>
        <p>
          <strong>California residents:</strong> You have the right to know, delete, and correct
          personal information, and to opt out of sale/sharing (we do not sell or share for
          cross-context behavioral advertising). You may designate an authorized agent where permitted
          by law. We do not discriminate against you for exercising privacy rights.
        </p>
        <p>
          <strong>Brazil (LGPD), Canada, Australia, and other regions:</strong> Similar rights may
          apply. Contact us to make a request.
        </p>

        <h2 className="text-lg font-medium">12. Children</h2>
        <p>
          The Service is not directed to children under 16 (or the minimum age required in your
          country). We do not knowingly collect personal information from children. If you believe a
          child has provided personal information, contact us and we will take reasonable steps to
          delete it.
        </p>

        <h2 className="text-lg font-medium">13. Security</h2>
        <p>
          We use reasonable administrative, technical, and organizational measures appropriate for a
          static open-source site. No method of transmission or storage is 100% secure. You are
          responsible for securing your device, browser, and share links. Report security issues via{" "}
          <a href={`${LEGAL_REPO_URL}/security`} className="text-[var(--color-accent)]">
            GitHub Security Advisories
          </a>
          .
        </p>

        <h2 className="text-lg font-medium">14. Third-party links and software</h2>
        <p>
          The Service links to third-party sites (for example GitHub, social media, or personal
          websites). Their privacy practices are governed by their own policies. Open-source
          dependencies are subject to their respective licenses; see the repository NOTICE file.
        </p>

        <h2 className="text-lg font-medium">15. Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. The &quot;Last updated&quot; date will
          change when we do. Material changes may be noted in the repository CHANGELOG. Continued use
          after the effective date constitutes acceptance where permitted by law.
        </p>

        <h2 className="text-lg font-medium">16. Contact</h2>
        <p>
          Privacy questions and requests:{" "}
          <a href={LEGAL_OPERATOR_URL} className="text-[var(--color-accent)]">
            {LEGAL_OPERATOR_URL}
          </a>{" "}
          (contact details on that site). Open-source inquiries:{" "}
          <a href={LEGAL_REPO_URL} className="text-[var(--color-accent)]">
            {LEGAL_REPO_URL}
          </a>
          .
        </p>

        <p className="border-t border-[var(--color-border)] pt-4 text-[var(--color-text-muted)]">
          This Privacy Policy is provided for transparency and compliance efforts. It does not
          constitute legal advice. Mandatory rights under applicable consumer or data protection law
          remain unaffected where they cannot be waived.
        </p>
      </section>
    </article>
  );
}
