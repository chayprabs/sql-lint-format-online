import { parse } from "./parse.js";
import type { Dialect, RewriteKind, RewriteOptions } from "./types.js";

export function rewrite(
  sql: string,
  kind: RewriteKind,
  opts: RewriteOptions,
): string {
  const trimmed = sql.trim();
  if (!trimmed) return "";

  switch (kind) {
    case "expand-select-star":
      return expandSelectStar(trimmed, opts);
    case "qualify-tables":
      return qualifyTables(trimmed, opts);
    case "extract-cte":
      return extractSubqueryToCte(trimmed);
    case "anti-join-to-not-exists":
      return antiJoinToNotExists(trimmed);
    case "implicit-to-explicit-join":
      return implicitToExplicitJoin(trimmed);
    default:
      return trimmed;
  }
}

function expandSelectStar(sql: string, opts: RewriteOptions): string {
  if (!/\bSELECT\s+(?:\w+\.)?\*/i.test(sql)) return sql;
  const schema = opts.schema;
  if (!schema || Object.keys(schema).length === 0) return sql;

  const fromMatch = sql.match(/\bFROM\s+(?:(\w+)\.)?(\w+)(?:\s+(?:AS\s+)?(\w+))?/i);
  if (!fromMatch) return sql;

  const tableName = (fromMatch[2] ?? fromMatch[1])!.toLowerCase();
  const alias = fromMatch[3]?.toLowerCase();
  const prefix = alias && alias !== tableName ? alias : tableName;
  const tableSchema = schema[tableName] ?? schema[`${opts.defaultSchema ?? "public"}.${tableName}`];
  if (!tableSchema) return sql;

  const columns = Object.keys(tableSchema)
    .map((c) => `${prefix}.${c}`)
    .join(", ");
  return sql.replace(/\bSELECT\s+(?:\w+\.)?\*/i, `SELECT ${columns}`);
}

function qualifyTables(sql: string, opts: RewriteOptions): string {
  const defaultSchema = opts.defaultSchema ?? "public";
  let out = sql.replace(
    /\bFROM\s+(?!(?:\w+\.))(\w+)/gi,
    (_, table: string) => `FROM ${defaultSchema}.${table}`,
  );
  out = out.replace(
    /\bJOIN\s+(?!(?:\w+\.))(\w+)/gi,
    (_, table: string) => `JOIN ${defaultSchema}.${table}`,
  );
  return out;
}

function extractSubqueryToCte(sql: string): string {
  const subqueryMatch = sql.match(
    /\bFROM\s*\(\s*(SELECT[\s\S]+?)\)\s*(?:AS\s+)?(\w+)/i,
  );
  if (!subqueryMatch) return sql;
  const inner = subqueryMatch[1]!.trim();
  const alias = subqueryMatch[2] ?? "subq";
  const cteName = "extracted_subquery";
  const without = sql.replace(subqueryMatch[0], `FROM ${cteName} AS ${alias}`);
  if (/\bWITH\b/i.test(sql)) {
    return without.replace(/\bWITH\b/i, `WITH ${cteName} AS (${inner}), `);
  }
  return `WITH ${cteName} AS (\n  ${inner}\n)\n${without}`;
}

function antiJoinToNotExists(sql: string): string {
  const anti = sql.match(
    /SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)\s+(\w+)\s+LEFT\s+JOIN\s+(\w+)\s+(\w+)\s+ON\s+([\s\S]+?)\s+WHERE\s+(\w+)\.(\w+)\s+IS\s+NULL/i,
  );
  if (!anti) return sql;

  const [, selectList, leftTable, leftAlias, rightTable, rightAlias, onClause] = anti;
  return `SELECT ${selectList?.trim()}\nFROM ${leftTable} ${leftAlias}\nWHERE NOT EXISTS (\n  SELECT 1 FROM ${rightTable} ${rightAlias}\n  WHERE ${onClause?.trim()}\n)`;
}

function implicitToExplicitJoin(sql: string): string {
  const m = sql.match(
    /\bFROM\s+(\w+)\s+(\w+)?\s*,\s*(\w+)\s+(\w+)?\s+WHERE\s+(.+?)(;|$)/is,
  );
  if (!m) return sql;
  const [, t1, a1, t2, a2, condition] = m;
  const alias1 = a1 || t1;
  const alias2 = a2 || t2;
  const before = sql.slice(0, m.index);
  const after = sql.slice((m.index ?? 0) + m[0].length);
  return `${before}FROM ${t1} ${alias1}\nINNER JOIN ${t2} ${alias2} ON ${condition?.trim()}${after}`;
}

/** Returns true when rewrite parses and differs from original (PRD A2 smoke check). */
export function rewriteProducesValidChange(
  original: string,
  rewritten: string,
  dialect: Dialect,
): boolean {
  const a = parse(original, dialect);
  const b = parse(rewritten, dialect);
  if (!a.valid || !b.valid) return false;
  return rewritten.replace(/\s+/g, " ").trim() !== original.replace(/\s+/g, " ").trim();
}

/** @deprecated Use rewriteProducesValidChange */
export const rewriteAstEquivalent = rewriteProducesValidChange;
