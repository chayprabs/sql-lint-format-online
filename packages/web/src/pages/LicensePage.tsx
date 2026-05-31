import { Link } from "react-router-dom";
import {
  LEGAL_LAST_UPDATED,
  LEGAL_OPERATOR_NAME,
  LEGAL_PRODUCT_NAME,
  LEGAL_REPO_URL,
} from "../legal/constants";

export function LicensePage() {
  return (
    <article className="prose prose-sm max-w-none text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold">License</h1>
      <p className="text-sm text-[var(--color-text-muted)]">Last updated: {LEGAL_LAST_UPDATED}</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <h2 className="text-lg font-medium">MIT License (software)</h2>
        <p>
          Copyright (c) 2026 {LEGAL_OPERATOR_NAME}
        </p>
        <pre className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-gray-50 p-4 text-xs leading-relaxed whitespace-pre-wrap">
          {`Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`}
        </pre>
        <p>
          The canonical license text is in the{" "}
          <a href={`${LEGAL_REPO_URL}/blob/main/LICENSE`} className="text-[var(--color-accent)]">
            LICENSE
          </a>{" "}
          file. Third-party components are subject to their own licenses; see{" "}
          <a href={`${LEGAL_REPO_URL}/blob/main/NOTICE`} className="text-[var(--color-accent)]">
            NOTICE
          </a>
          .
        </p>

        <h2 className="text-lg font-medium">Hosted website</h2>
        <p>
          Use of the public {LEGAL_PRODUCT_NAME} website is also governed by our{" "}
          <Link to="/terms" className="text-[var(--color-accent)]">
            Terms &amp; Conditions
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-[var(--color-accent)]">
            Privacy Policy
          </Link>
          , which include additional disclaimers and limitations of liability for the hosted Service.
        </p>

        <h2 className="text-lg font-medium">Trademarks</h2>
        <p>
          &quot;{LEGAL_PRODUCT_NAME}&quot; and related branding are used to identify the project. This
          license does not grant rights to use the operator&apos;s name or branding except as required
          for reasonable attribution under the MIT License.
        </p>

        <h2 className="text-lg font-medium">Contributions</h2>
        <p>
          By contributing to the repository, you agree that your contributions are licensed under the
          MIT License, as described in CONTRIBUTING.md.
        </p>
      </section>
    </article>
  );
}
