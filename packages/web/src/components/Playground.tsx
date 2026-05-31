import {
  DIALECT_LABELS,
  DIALECTS,
  getRuleBundles,
  SAMPLE_BIGQUERY,
  SAMPLE_MESSY_SELECT,
  SAMPLE_RISKY_UPDATE,
  SAMPLE_SNOWFLAKE,
  type RewriteKind,
  type RuleBundle,
} from "@sqlguard/core";
import { usePlayground } from "../hooks/usePlayground";
import { SqlEditor } from "./SqlEditor";
import { Toast } from "./Toast";

type Dialect = (typeof DIALECTS)[number];

const REWRITES: { kind: RewriteKind; label: string }[] = [
  { kind: "expand-select-star", label: "Expand SELECT *" },
  { kind: "qualify-tables", label: "Qualify tables" },
  { kind: "extract-cte", label: "Extract CTE" },
  { kind: "anti-join-to-not-exists", label: "Anti-join → NOT EXISTS" },
  { kind: "implicit-to-explicit-join", label: "Implicit → explicit JOIN" },
];

interface PlaygroundProps {
  focus?: "lint" | "format";
  defaultDialect?: Dialect;
}

export function Playground({ focus, defaultDialect }: PlaygroundProps) {
  const pg = usePlayground(focus, defaultDialect);
  const bundles = getRuleBundles();

  const onDdlFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => pg.setDdl(String(reader.result ?? ""));
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <Toast message={pg.toast} />

      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-muted)]">Dialect</span>
          <select
            value={pg.dialect}
            onChange={(e) => pg.setDialect(e.target.value as Dialect)}
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
            onChange={(e) => pg.setBundle(e.target.value as RuleBundle)}
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm capitalize"
          >
            {bundles.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-muted)]">Keyword case</span>
          <select
            value={pg.formatOptions.keywordCase ?? "upper"}
            onChange={(e) =>
              pg.setFormatOptions({
                ...pg.formatOptions,
                keywordCase: e.target.value as "upper" | "lower" | "preserve",
              })
            }
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm"
          >
            <option value="upper">UPPER</option>
            <option value="lower">lower</option>
            <option value="preserve">preserve</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-[var(--color-text-muted)]">Indent</span>
          <select
            value={pg.formatOptions.indentStyle ?? "standard"}
            onChange={(e) =>
              pg.setFormatOptions({
                ...pg.formatOptions,
                indentStyle: e.target.value as "standard" | "tabularLeft" | "tabularRight",
              })
            }
            className="rounded-md border border-[var(--color-border)] bg-white px-3 py-2 text-sm"
          >
            <option value="standard">Standard</option>
            <option value="tabularLeft">Tabular left</option>
            <option value="tabularRight">Tabular right</option>
          </select>
        </label>
        <button
          type="button"
          onClick={pg.runDetect}
          className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm hover:bg-gray-50"
        >
          Auto-detect dialect
        </button>
        <button
          type="button"
          onClick={pg.clearHistory}
          className="rounded-md border border-[var(--color-border)] bg-white px-4 py-2 text-sm text-[var(--color-text-muted)] hover:bg-gray-50"
        >
          Clear local history
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="sql-editor">
            SQL input
          </label>
          <SqlEditor
            value={pg.sql}
            onChange={pg.setSql}
            height="14rem"
            placeholder="Paste your SQL here…"
          />
          <div className="flex flex-wrap items-center justify-between gap-2">
            <label className="text-sm font-medium">Schema DDL (preflight &amp; SELECT *)</label>
            <label className="cursor-pointer text-xs text-[var(--color-accent)] hover:underline">
              Upload .sql
              <input
                type="file"
                accept=".sql,.txt,text/plain"
                className="hidden"
                onChange={(e) => onDdlFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          <SqlEditor value={pg.ddl} onChange={pg.setDdl} height="6rem" placeholder="CREATE TABLE …" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Issues</label>
          <div
            className="h-[21rem] overflow-y-auto rounded-lg border border-[var(--color-border)] bg-white p-2 shadow-sm"
            aria-live="polite"
            aria-relevant="additions"
          >
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
        {(
          [
            ["Risky UPDATE", SAMPLE_RISKY_UPDATE, undefined],
            ["Messy SELECT", SAMPLE_MESSY_SELECT, undefined],
            ["BigQuery", SAMPLE_BIGQUERY, "bigquery" as Dialect],
            ["Snowflake", SAMPLE_SNOWFLAKE, "snowflake" as Dialect],
          ] as const
        ).map(([label, sample, d]) => (
          <button
            key={label}
            type="button"
            className="underline hover:text-[var(--color-accent)]"
            onClick={() => pg.loadSample(sample, d)}
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
                    onClick={() =>
                      void navigator.clipboard.writeText(pg.output).then(() => {})
                    }
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
