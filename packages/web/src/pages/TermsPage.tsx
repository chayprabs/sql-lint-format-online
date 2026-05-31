import { Link } from "react-router-dom";
import {
  LEGAL_GOVERNING_LAW,
  LEGAL_LAST_UPDATED,
  LEGAL_LIABILITY_CAP_USD,
  LEGAL_OPERATOR_NAME,
  LEGAL_OPERATOR_URL,
  LEGAL_PRODUCT_NAME,
  LEGAL_REPO_URL,
  LEGAL_SITE_URL,
  LEGAL_VENUE,
} from "../legal/constants";

export function TermsPage() {
  return (
    <article className="prose prose-sm max-w-none text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-sm text-[var(--color-text-muted)]">Last updated: {LEGAL_LAST_UPDATED}</p>

      <section className="mt-6 space-y-4 text-sm leading-relaxed">
        <p>
          These Terms &amp; Conditions (&quot;Terms&quot;) are a binding agreement between you
          (&quot;you&quot;, &quot;your&quot;) and {LEGAL_OPERATOR_NAME} (&quot;{LEGAL_OPERATOR_NAME}
          &quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) governing access to and use of{" "}
          {LEGAL_PRODUCT_NAME} software, the public website at{" "}
          <a href={LEGAL_SITE_URL} className="text-[var(--color-accent)]">
            {LEGAL_SITE_URL}
          </a>
          , and related materials (collectively, the &quot;Service&quot;). If you do not agree to
          these Terms, do not access or use the Service.
        </p>

        <h2 className="text-lg font-medium">1. Eligibility</h2>
        <p>
          You represent that you are at least 18 years old (or the age of majority in your
          jurisdiction) and have the legal capacity to enter into these Terms. If you use the Service
          on behalf of an organization, you represent that you have authority to bind that
          organization, and &quot;you&quot; includes that organization.
        </p>

        <h2 className="text-lg font-medium">2. The Service</h2>
        <p>
          {LEGAL_PRODUCT_NAME} provides client-side SQL linting, formatting, dialect detection,
          optional schema preflight, and rewrite suggestions. The Service is an assistive developer
          tool only. It is <strong>not</strong> legal, compliance, database administration, or
          professional advice. Outputs may be incorrect, incomplete, or unsafe for your environment.
        </p>

        <h2 className="text-lg font-medium">3. Open-source license</h2>
        <p>
          Source code in the repository is licensed under the MIT License unless otherwise noted in
          the file header. Your use of the source code is governed by the MIT License in addition to
          these Terms when you use the hosted Service. See the{" "}
          <Link to="/license" className="text-[var(--color-accent)]">
            License
          </Link>{" "}
          page and{" "}
          <a href={`${LEGAL_REPO_URL}/blob/main/LICENSE`} className="text-[var(--color-accent)]">
            LICENSE
          </a>{" "}
          file. In case of conflict between the MIT License and these Terms regarding the hosted
          Service, these Terms control your use of the hosted Service only.
        </p>

        <h2 className="text-lg font-medium">4. Your content and responsibilities</h2>
        <p>
          You retain ownership of SQL and other content you enter. You grant us a non-exclusive,
          worldwide, royalty-free license to host, transmit (as static assets), and display your
          content only as necessary to provide the Service — which, for the public instance, means
          processing occurs locally in your browser and we do not intentionally store your SQL on our
          servers.
        </p>
        <p>You agree that you will:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Only submit content you have the right to use;</li>
          <li>Not paste passwords, API keys, tokens, or highly sensitive personal data;</li>
          <li>Independently review and test all output in non-production before production use;</li>
          <li>Comply with all applicable laws, database policies, and third-party terms;</li>
          <li>Not rely on the Service as the sole check for security, correctness, or regulatory compliance.</li>
        </ul>

        <h2 className="text-lg font-medium">5. Prohibited uses</h2>
        <p>You must not:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>Use the Service in violation of any law or third-party rights;</li>
          <li>Probe, scan, or test vulnerabilities except as permitted by our security policy;</li>
          <li>Interfere with or disrupt the Service, impose unreasonable load, or circumvent security;</li>
          <li>Reverse engineer the Service except where applicable law expressly permits;</li>
          <li>Use the Service to develop competing products by systematic scraping of the hosted UI;</li>
          <li>Represent outputs as guaranteed correct, certified, or endorsed by us.</li>
        </ul>

        <h2 className="text-lg font-medium">6. Privacy</h2>
        <p>
          Our{" "}
          <Link to="/privacy" className="text-[var(--color-accent)]">
            Privacy Policy
          </Link>{" "}
          explains how we handle information. It is incorporated into these Terms by reference.
        </p>

        <h2 className="text-lg font-medium">7. Disclaimer of warranties</h2>
        <p className="uppercase">
          THE SERVICE, SOFTWARE, DOCUMENTATION, AND ALL OUTPUTS (INCLUDING LINT MESSAGES, FORMATTED
          SQL, REWRITES, PREFLIGHT RESULTS, AND SHARE LINKS) ARE PROVIDED &quot;AS IS&quot; AND &quot;AS
          AVAILABLE&quot; WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR
          OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, QUIET ENJOYMENT, AND ANY WARRANTIES
          ARISING FROM COURSE OF DEALING OR USAGE OF TRADE. WE DO NOT WARRANT THAT THE SERVICE WILL BE
          UNINTERRUPTED, ERROR-FREE, SECURE, FREE OF HARMFUL COMPONENTS, OR THAT OUTPUTS WILL BE
          CORRECT, COMPLETE, OR SAFE FOR PRODUCTION OR REGULATED DATA.
        </p>
        <p>
          Some jurisdictions do not allow exclusion of implied warranties; in those jurisdictions,
          the above exclusions apply to the fullest extent permitted by law.
        </p>

        <h2 className="text-lg font-medium">8. Limitation of liability</h2>
        <p className="uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {LEGAL_OPERATOR_NAME},
          CONTRIBUTORS, LICENSORS, OR SUPPLIERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
          CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA,
          GOODWILL, BUSINESS INTERRUPTION, OR DATABASE DOWNTIME, ARISING OUT OF OR RELATED TO THE
          SERVICE OR THESE TERMS, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE),
          STRICT LIABILITY, OR ANY OTHER THEORY, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF
          SUCH DAMAGES.
        </p>
        <p className="uppercase">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, OUR TOTAL AGGREGATE LIABILITY FOR ALL
          CLAIMS ARISING OUT OF OR RELATED TO THE SERVICE OR THESE TERMS SHALL NOT EXCEED THE GREATER
          OF (A) USD {LEGAL_LIABILITY_CAP_USD} OR (B) THE AMOUNT YOU PAID US FOR THE SERVICE IN THE
          TWELVE (12) MONTHS BEFORE THE EVENT GIVING RISE TO LIABILITY (TYPICALLY ZERO FOR THE FREE
          PUBLIC SERVICE).
        </p>
        <p>
          The limitations above do not apply to liability that cannot be excluded or limited under
          applicable law (for example certain consumer rights, death or personal injury caused by
          negligence where not waivable, or fraud).
        </p>

        <h2 className="text-lg font-medium">9. Indemnification</h2>
        <p>
          You will defend, indemnify, and hold harmless {LEGAL_OPERATOR_NAME}, contributors, and
          service providers from and against any claims, damages, losses, liabilities, costs, and
          expenses (including reasonable attorneys&apos; fees) arising out of or related to: (a) your
          content or use of the Service; (b) your violation of these Terms or applicable law; (c) your
          execution of SQL or database changes based on Service output; or (d) any dispute between
          you and a third party in connection with your use of the Service. We may assume exclusive
          defense and control of any matter subject to indemnification, and you will cooperate with
          our defense.
        </p>

        <h2 className="text-lg font-medium">10. Release</h2>
        <p>
          To the fullest extent permitted by law, you release {LEGAL_OPERATOR_NAME} and contributors
          from claims and damages arising from your use of the Service, including reliance on outputs.
          If you are a California resident, you waive California Civil Code § 1542 to the extent
          permitted by law (and otherwise only to the extent permitted in your jurisdiction):
          &quot;A general release does not extend to claims that the creditor or releasing party does
          not know or suspect to exist in his or her favor at the time of executing the release…&quot;
        </p>

        <h2 className="text-lg font-medium">11. Export and sanctions</h2>
        <p>
          You may not use or export the Service except as authorized by applicable export control and
          sanctions laws. You represent that you are not located in, under the control of, or a
          national or resident of any country or person subject to comprehensive embargoes or denied-party
          lists.
        </p>

        <h2 className="text-lg font-medium">12. Government users</h2>
        <p>
          If you are a U.S. Government end user, the Service is a &quot;commercial computer
          software&quot; and &quot;commercial computer software documentation&quot; with only those
          rights set forth in these Terms and the MIT License, per FAR 12.212 and DFARS 227.7202, as
          applicable.
        </p>

        <h2 className="text-lg font-medium">13. Third-party services and links</h2>
        <p>
          The Service may link to or depend on third-party sites and open-source libraries. We are not
          responsible for third-party content, terms, or practices. Your use of third-party services is
          at your own risk.
        </p>

        <h2 className="text-lg font-medium">14. Termination</h2>
        <p>
          We may suspend or discontinue the Service or your access at any time, with or without notice,
          for any reason including violation of these Terms. Upon termination, sections that by their
          nature should survive will survive (including disclaimers, limitation of liability,
          indemnification, governing law, and dispute resolution).
        </p>

        <h2 className="text-lg font-medium">15. Changes</h2>
        <p>
          We may modify these Terms at any time. The updated &quot;Last updated&quot; date reflects
          the current version. Material changes may be noted in the repository. Your continued use
          after changes become effective constitutes acceptance where permitted by law. If you do not
          agree, stop using the Service.
        </p>

        <h2 className="text-lg font-medium">16. Governing law</h2>
        <p>
          These Terms are governed by {LEGAL_GOVERNING_LAW}, without regard to conflict-of-law rules
          that would apply another jurisdiction&apos;s laws.
        </p>

        <h2 className="text-lg font-medium">17. Dispute resolution</h2>
        <p>
          <strong>Informal resolution.</strong> Before filing a claim, you agree to contact us at{" "}
          <a href={LEGAL_OPERATOR_URL} className="text-[var(--color-accent)]">
            {LEGAL_OPERATOR_URL}
          </a>{" "}
          and attempt to resolve the dispute informally for at least 30 days.
        </p>
        <p>
          <strong>Jurisdiction.</strong> Except where prohibited by mandatory law, you agree that
          exclusive jurisdiction and venue for disputes arising out of these Terms or the Service lie
          in {LEGAL_VENUE}.
        </p>
        <p>
          <strong>Consumers.</strong> If you are a consumer in the European Union, United Kingdom, or
          another jurisdiction with mandatory consumer protections, you may have the right to bring
          proceedings in your country of residence, and nothing in these Terms limits non-waivable
          statutory rights.
        </p>
        <p>
          <strong>Class actions.</strong> To the extent permitted by law, disputes will be conducted
          only on an individual basis and not as a class, consolidated, or representative action. If
          this class-action waiver is unenforceable, the remainder of this section may not apply to
          you.
        </p>

        <h2 className="text-lg font-medium">18. Miscellaneous</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <strong>Entire agreement:</strong> These Terms, the Privacy Policy, and the MIT License
            (for software) constitute the entire agreement regarding the hosted Service.
          </li>
          <li>
            <strong>Severability:</strong> If any provision is invalid, the remainder remains in effect.
          </li>
          <li>
            <strong>No waiver:</strong> Failure to enforce a provision is not a waiver.
          </li>
          <li>
            <strong>Assignment:</strong> You may not assign these Terms without our consent. We may
            assign them in connection with a reorganization or sale.
          </li>
          <li>
            <strong>Force majeure:</strong> We are not liable for delays or failures due to events
            beyond our reasonable control.
          </li>
          <li>
            <strong>Language:</strong> These Terms are in English. Translations are for convenience only.
          </li>
        </ul>

        <h2 className="text-lg font-medium">19. Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a href={LEGAL_OPERATOR_URL} className="text-[var(--color-accent)]">
            {LEGAL_OPERATOR_URL}
          </a>
          . Source code and issues:{" "}
          <a href={LEGAL_REPO_URL} className="text-[var(--color-accent)]">
            {LEGAL_REPO_URL}
          </a>
          .
        </p>

        <p className="border-t border-[var(--color-border)] pt-4 text-[var(--color-text-muted)]">
          These Terms are provided for operational clarity and risk allocation. They are not legal
          advice. No contractual language can guarantee immunity from lawsuits worldwide; mandatory
          laws in your location may grant rights that cannot be waived.
        </p>
      </section>
    </article>
  );
}
