import {
  DIALECT_LABELS,
  DIALECTS,
  getRuleBundles,
  SAMPLE_BIGQUERY,
  SAMPLE_MESSY_SELECT,
  SAMPLE_RISKY_UPDATE,
  SAMPLE_SNOWFLAKE,
  type RewriteKind,
} from "@sqlguard/core";
import { usePlayground } from "../hooks/usePlayground";

const REWRITES: { kind: RewriteKind; label: string }[] = [
  { kind: "expand-select-star", label: "Expand SELECT *" },
  { kind: "qualify-tables", label: "Qualify tables" },
  { kind: "extract-cte", label: "Extract CTE" },
  { kind: "anti-join-to-not-exists", label: "Anti-join → NOT EXISTS" },
  { kind: "implicit-to-explicit-join", label: "Implicit → explicit JOIN" },
];

interface PlaygroundProps {
  focus?: "lint" | "format";
  defaultDialect?: (typeof DIALECTS)[number];
}

export function Playground({ focus, defaultDialect }: PlaygroundProps) {
  const pg = usePlayground(focus, defaultDialect);
  const bundles = getRuleBundles();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-muted)]">Dialect</span>
          <select
            value={pg.dialect}
            onChange={(e) => pg.setDialect(e.target.value as (typeof DIALECTS)[number])}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm"
          >
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {DIALECT_LABELS[d]}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-muted)]">Rule bundle</span>
          <select
            value={pg.bundle}
            onChange={(e) => pg.setBundle(e.target.value as typeof pg.bundle)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm capitalize"
          >
            {bundles.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={pg.runDetect}
          className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Auto-detect dialect
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">SQL input</label>
          <textarea
            value={pg.sql}
            onChange={(e) => pg.setSql(e.target.value)}
            spellCheck={false}
            className="h-56 w-full resize-y rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-sm leading-relaxed shadow-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)]"
            placeholder="Paste your SQL here…"
          />
          <label className="text-sm font-medium">Schema DDL (optional, for preflight &amp; SELECT *)</label>
          <textarea
            value={pg.ddl}
            onChange={(e) => pg.setDdl(e.target.value)}
            spellCheck={false}
            className="h-24 w-full resize-y rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-xs leading-relaxed"
            placeholder="CREATE TABLE users (id INT, name VARCHAR(100));"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Issues</label>
          <div className="h-56 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white p-2 shadow-sm">
            {pg.issues.length === 0 ? (
              <p className="p-2 text-sm text-[var(--color-text-muted)]">
                Run Lint to see issues, or load a sample below.
              </p>
            ) : (
              <ul className="space-y-2">
                {pg.issues.map((issue, i) => (
                  <li
                    key={`${issue.rule}-${i}`}
                    className="rounded-md border border-[var(--color-border)] p-2 text-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span
                          className={
                            issue.severity === "error"
                              ? "text-[var(--color-danger)]"
                              : issue.severity === "warn"
                                ? "text-[var(--color-warn)]"
                                : "text-[var(--color-text-muted)]"
                          }
                        >
                          [{issue.severity}] {issue.rule}
                        </span>
                        <p className="mt-0.5">{issue.message}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">
                          Line {issue.line}, col {issue.column}
                        </p>
                      </div>
                      {issue.fix && (
                        <button
                          type="button"
                          onClick={() => pg.applyIssueFix(issue)}
                          className="shrink-0 rounded bg-[var(--color-accent)] px-2 py-1 text-xs text-white hover:bg-[var(--color-accent-hover)]"
                        >
                          Fix
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={pg.runLint}
          className="rounded-md bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
        >
          Lint
        </button>
        <button
          type="button"
          onClick={pg.runFormat}
          className="rounded-md bg-[var(--color-accent)] px-5 py-2 text-sm font-medium text-white hover:bg-[var(--color-accent-hover)]"
        >
          Format
        </button>
        {REWRITES.map((r) => (
          <button
            key={r.kind}
            type="button"
            onClick={() => pg.runRewrite(r.kind)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm hover:bg-gray-50"
          >
            {r.label}
          </button>
        ))}
        <button
          type="button"
          onClick={pg.share}
          className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm hover:bg-gray-50"
        >
          Copy share link
        </button>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[var(--color-text-muted)]">
        <span>Samples:</span>
        {[
          ["Risky UPDATE", SAMPLE_RISKY_UPDATE],
          ["Messy SELECT", SAMPLE_MESSY_SELECT],
          ["BigQuery", SAMPLE_BIGQUERY],
          ["Snowflake", SAMPLE_SNOWFLAKE],
        ].map(([label, sample]) => (
          <button
            key={label}
            type="button"
            className="underline hover:text-[var(--color-accent)]"
            onClick={() => pg.setSql(sample as string)}
          >
            {label}
          </button>
        ))}
      </div>

      {(pg.output || pg.showDiff) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Output</label>
            <div className="flex gap-2">
              {pg.output && (
                <>
                  <button
                    type="button"
                    onClick={() => void navigator.clipboard.writeText(pg.output)}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    Copy SQL
                  </button>
                  <button
                    type="button"
                    onClick={pg.copyPatch}
                    className="text-xs text-[var(--color-accent)] hover:underline"
                  >
                    Copy as patch
                  </button>
                </>
              )}
              {pg.output && (
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={pg.showDiff}
                    onChange={(e) => pg.setShowDiff(e.target.checked)}
                  />
                  Show diff
                </label>
              )}
            </div>
          </div>
          {pg.showDiff && pg.diff.length > 0 ? (
            <pre className="max-h-64 overflow-auto rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-xs">
              {pg.diff.map((line, i) => (
                <div
                  key={i}
                  className={
                    line.type === "add"
                      ? "bg-green-50 text-green-800"
                      : line.type === "remove"
                        ? "bg-red-50 text-red-800"
                        : ""
                  }
                >
                  {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "} {line.content}
                </div>
              ))}
            </pre>
          ) : (
            <textarea
              readOnly
              value={pg.output}
              className="h-48 w-full rounded-lg border border-[var(--color-border)] bg-white p-3 font-mono text-sm"
            />
          )}
        </div>
      )}
    </div>
  );
}
