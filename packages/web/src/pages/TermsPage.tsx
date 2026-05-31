export function TermsPage() {
  return (
    <article className="prose prose-sm max-w-none text-[var(--color-text)]">
      <h1 className="text-2xl font-semibold">Terms &amp; Conditions</h1>
      <p className="text-sm text-[var(--color-text-muted)]">Last updated: May 31, 2026</p>

      <section className="mt-6 space-y-3 text-sm leading-relaxed">
        <h2 className="text-lg font-medium">Agreement</h2>
        <p>
          By using SQLGuard you agree to these terms. If you do not agree, do not use the service.
        </p>

        <h2 className="text-lg font-medium">License</h2>
        <p>
          The open-source software is provided under the MIT License. See the repository LICENSE
          file for details.
        </p>

        <h2 className="text-lg font-medium">Disclaimer of warranties</h2>
        <p>
          THE SOFTWARE AND SERVICE ARE PROVIDED &quot;AS IS&quot;, WITHOUT WARRANTY OF ANY KIND,
          EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
          FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT LINT RESULTS,
          FORMATTING, OR REWRITES ARE CORRECT, COMPLETE, OR SAFE FOR PRODUCTION USE.
        </p>

        <h2 className="text-lg font-medium">Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
          BE LIABLE FOR ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
          TORT, OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
          OTHER DEALINGS IN THE SOFTWARE, INCLUDING WITHOUT LIMITATION DATA LOSS, DOWNTIME,
          INCORRECT QUERY RESULTS, OR DAMAGES FROM SQL EXECUTED BASED ON TOOL OUTPUT.
        </p>

        <h2 className="text-lg font-medium">Your responsibilities</h2>
        <p>
          You are solely responsible for SQL you write, share, or execute. Do not paste secrets
          (passwords, tokens) into the editor. Verify all changes in a non-production environment
          before deployment.
        </p>

        <h2 className="text-lg font-medium">Changes</h2>
        <p>We may update these terms. Continued use after changes constitutes acceptance.</p>

        <h2 className="text-lg font-medium">Governing law</h2>
        <p>
          These terms are governed by applicable law in your jurisdiction of use; where disputes
          arise, you agree to resolve them in good faith before formal proceedings.
        </p>
      </section>
    </article>
  );
}
