import { format as sqlFormat, type SqlLanguage } from "sql-formatter";
import { toFormatterLanguage } from "./dialects.js";
import type { Dialect, ParseResult } from "./types.js";

function basicSyntaxValid(sql: string): boolean {
  const trimmed = sql.trim();
  if (!trimmed) return true;
  const statements = /^(SELECT|INSERT|UPDATE|DELETE|WITH|CREATE|ALTER|DROP|MERGE|TRUNCATE|GRANT|REVOKE)\b/i;
  if (!statements.test(trimmed)) return false;
  const open = (trimmed.match(/\(/g) ?? []).length;
  const close = (trimmed.match(/\)/g) ?? []).length;
  return open === close;
}

export function parse(sql: string, dialect: Dialect): ParseResult {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { ast: { type: "empty" }, valid: true };
  }

  if (!basicSyntaxValid(trimmed)) {
    return { ast: null, valid: false, error: "Unrecognized or unbalanced SQL statement" };
  }

  try {
    const language = toFormatterLanguage(dialect) as SqlLanguage;
    sqlFormat(trimmed, { language, keywordCase: "preserve" });
    return { ast: { type: "query", dialect, sql: trimmed }, valid: true };
  } catch (err) {
    if (basicSyntaxValid(trimmed)) {
      return { ast: { type: "query", dialect, sql: trimmed }, valid: true };
    }
    const message = err instanceof Error ? err.message : String(err);
    return { ast: null, valid: false, error: message };
  }
}

export function parseOrThrow(sql: string, dialect: Dialect): unknown {
  const result = parse(sql, dialect);
  if (!result.valid) {
    throw new Error(result.error ?? "Parse failed");
  }
  return result.ast;
}

export function stringifyAst(ast: unknown): string {
  if (ast && typeof ast === "object" && "sql" in (ast as Record<string, unknown>)) {
    return String((ast as { sql: string }).sql);
  }
  return "";
}
