import { parse } from "./parse.js";
import { splitStatements, stripSqlComments } from "./sql-utils.js";
import type { Dialect, LintIssue, LintOptions, RuleBundle } from "./types.js";

type RuleFn = (sql: string, dialect: Dialect) => LintIssue[];

const RULES: Record<string, { severity: LintIssue["severity"]; run: RuleFn }> = {
  "parse-error": {
    severity: "error",
    run: (sql, dialect) => {
      const result = parse(sql, dialect);
      if (!result.valid) {
        return [
          {
            rule: "parse-error",
            severity: "error",
            line: 1,
            column: 1,
            message: result.error ?? "SQL could not be parsed",
          },
        ];
      }
      return [];
    },
  },
  "missing-where-update-delete": {
    severity: "error",
    run: (sql) => {
      const issues: LintIssue[] = [];
      const body = stripSqlComments(sql);
      for (const stmt of splitStatements(body.length ? body : sql)) {
        if (!/\b(UPDATE|DELETE)\b/i.test(stmt)) continue;
        if (!/\bWHERE\b/i.test(stmt)) {
          const lineNum = sql.slice(0, sql.indexOf(stmt.trim().slice(0, 20))).split("\n").length;
          issues.push({
            rule: "missing-where-update-delete",
            severity: "error",
            line: Math.max(1, lineNum),
            column: 1,
            message: "UPDATE or DELETE without WHERE may affect all rows",
          });
        }
      }
      return issues;
    },
  },
  "cartesian-join": {
    severity: "warn",
    run: (sql) => {
      const issues: LintIssue[] = [];
      const statements = splitStatements(stripSqlComments(sql));
      for (const stmt of statements.length ? statements : [sql]) {
        if (/\bFROM\s+\w+\s*,\s*\w+/i.test(stmt) && !/\bWHERE\b/i.test(stmt)) {
          issues.push({
            rule: "cartesian-join",
            severity: "warn",
            line: 1,
            column: 1,
            message: "Comma join without WHERE may be a cartesian product; prefer explicit JOIN",
          });
        }
      }
      if (/\bCROSS\s+JOIN\b/i.test(sql)) {
        issues.push({
          rule: "cartesian-join",
          severity: "warn",
          line: 1,
          column: 1,
          message: "CROSS JOIN may produce a cartesian product",
        });
      }
      return issues;
    },
  },
  "null-equality": {
    severity: "warn",
    run: (sql) => {
      const issues: LintIssue[] = [];
      const lines = sql.split("\n");
      lines.forEach((line, idx) => {
        let replacement = line;
        if (/=\s*NULL\b/i.test(line) && !/\bIS\s+NULL\b/i.test(line)) {
          replacement = replacement.replace(/=\s*NULL\b/gi, "IS NULL");
        }
        if (/<>?\s*NULL\b/i.test(line) && !/\bIS\s+NOT\s+NULL\b/i.test(line)) {
          replacement = replacement.replace(/<>?\s*NULL\b/gi, "IS NOT NULL");
        }
        if (replacement !== line) {
          issues.push({
            rule: "null-equality",
            severity: "warn",
            line: idx + 1,
            column: 1,
            message: "Use IS NULL / IS NOT NULL instead of = NULL or <> NULL",
            fix: { range: [0, line.length], replacement },
          });
        }
      });
      return issues;
    },
  },
  "trailing-semicolon": {
    severity: "info",
    run: (sql) => {
      if (sql.trim() && !sql.trim().endsWith(";")) {
        return [
          {
            rule: "trailing-semicolon",
            severity: "info",
            line: sql.split("\n").length,
            column: 1,
            message: "Consider terminating the statement with a semicolon",
            fix: { range: [0, sql.length], replacement: `${sql.trimEnd()};` },
          },
        ];
      }
      return [];
    },
  },
  "select-star": {
    severity: "info",
    run: (sql) => {
      if (/\bSELECT\s+(?:\w+\.)?\*/i.test(sql)) {
        return [
          {
            rule: "select-star",
            severity: "info",
            line: 1,
            column: 1,
            message: "SELECT * expands at runtime; list columns explicitly when possible",
          },
        ];
      }
      return [];
    },
  },
  "full-table-scan-hint": {
    severity: "info",
    run: (sql) => {
      if (/\bSELECT\b/i.test(sql) && !/\bWHERE\b/i.test(sql) && !/\bLIMIT\b/i.test(sql)) {
        return [
          {
            rule: "full-table-scan-hint",
            severity: "info",
            line: 1,
            column: 1,
            message: "SELECT without WHERE or LIMIT may scan the full table",
          },
        ];
      }
      return [];
    },
  },
  "keyword-case": {
    severity: "info",
    run: (sql) => {
      const keywords = ["select", "from", "where", "join", "group by", "order by"];
      const lower = sql.toLowerCase();
      for (const kw of keywords) {
        if (lower.includes(kw) && !sql.includes(kw.toUpperCase().split(" ")[0]!)) {
          const mixed = new RegExp(`\\b${kw.split(" ")[0]}\\b`, "i").test(sql);
          if (mixed && sql !== sql.toUpperCase()) {
            return [
              {
                rule: "keyword-case",
                severity: "info",
                line: 1,
                column: 1,
                message: "Consider consistent SQL keyword casing",
              },
            ];
          }
        }
      }
      return [];
    },
  },
  "bigquery-backtick": {
    severity: "info",
    run: (sql, dialect) => {
      if (dialect !== "bigquery") return [];
      if (/\bFROM\s+[a-zA-Z_][\w]*\./.test(sql) && !/`/.test(sql)) {
        return [
          {
            rule: "bigquery-backtick",
            severity: "info",
            line: 1,
            column: 1,
            message: "BigQuery project.dataset.table references often need backticks",
          },
        ];
      }
      return [];
    },
  },
};

const BUNDLES: Record<RuleBundle, string[]> = {
  review: [
    "parse-error",
    "missing-where-update-delete",
    "cartesian-join",
    "null-equality",
    "select-star",
    "full-table-scan-hint",
  ],
  strict: [
    "parse-error",
    "missing-where-update-delete",
    "cartesian-join",
    "null-equality",
    "select-star",
    "full-table-scan-hint",
    "keyword-case",
    "trailing-semicolon",
  ],
  bigquery: [
    "parse-error",
    "missing-where-update-delete",
    "cartesian-join",
    "null-equality",
    "select-star",
    "bigquery-backtick",
  ],
};

export function lint(sql: string, opts: LintOptions): LintIssue[] {
  const bundle = opts.bundle ?? "review";
  const ruleIds = BUNDLES[bundle];
  const seen = new Set<string>();
  const issues: LintIssue[] = [];

  for (const id of ruleIds) {
    const rule = RULES[id];
    if (!rule) continue;
    for (const issue of rule.run(sql, opts.dialect)) {
      const key = `${issue.rule}:${issue.line}:${issue.column}:${issue.message}`;
      if (!seen.has(key)) {
        seen.add(key);
        issues.push(issue);
      }
    }
  }

  return issues.sort((a, b) => a.line - b.line || a.column - b.column);
}

export function applyFix(sql: string, issue: LintIssue): string {
  if (!issue.fix) return sql;
  const lines = sql.split("\n");
  const lineIdx = issue.line - 1;
  if (lineIdx >= 0 && lineIdx < lines.length) {
    lines[lineIdx] = issue.fix.replacement;
    return lines.join("\n");
  }
  return sql;
}

export function getRuleBundles(): RuleBundle[] {
  return ["review", "strict", "bigquery"];
}
