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
  const fromMatch = /\bFROM\s*\(/i.exec(sql);
  if (!fromMatch || fromMatch.index === undefined) return sql;

  const openIdx = sql.indexOf("(", fromMatch.index);
  if (openIdx < 0) return sql;

  let depth = 0;
  let closeIdx = -1;
  for (let i = openIdx; i < sql.length; i++) {
    if (sql[i] === "(") depth++;
    else if (sql[i] === ")") {
      depth--;
      if (depth === 0) {
        closeIdx = i;
        break;
      }
    }
  }
  if (closeIdx < 0) return sql;

  const inner = sql.slice(openIdx + 1, closeIdx).trim();
  if (!/^SELECT\b/i.test(inner)) return sql;

  const afterParen = sql.slice(closeIdx + 1);
  const aliasMatch = afterParen.match(/^\s*(?:AS\s+)?(\w+)/i);
  const alias = aliasMatch?.[1] ?? "subq";
  const replaceEnd = closeIdx + 1 + (aliasMatch?.[0]?.length ?? 0);

  const cteName = "extracted_subquery";
  const before = sql.slice(0, fromMatch.index);
  const after = sql.slice(replaceEnd);
  const fromReplacement = `FROM ${cteName} AS ${alias}`;

  if (/\bWITH\b/i.test(sql)) {
    return `${before}${fromReplacement}${after}`.replace(
      /\bWITH\b/i,
      `WITH ${cteName} AS (\n  ${inner}\n), `,
    );
  }
  return `WITH ${cteName} AS (\n  ${inner}\n)\n${before}${fromReplacement}${after}`;
}

function antiJoinToNotExists(sql: string): string {
  const anti = sql.match(
    /SELECT\s+([\s\S]+?)\s+FROM\s+(\w+)\s+(\w+)\s+LEFT\s+JOIN\s+(\w+)\s+(\w+)\s+ON\s+([\s\S]+?)\s+WHERE\s+(\w+)\.(\w+)\s+IS\s+NULL/i,
  );
  if (!anti) return sql;

  const nullAlias = anti[7]!.toLowerCase();
  const rightAlias = anti[5]!.toLowerCase();
  if (nullAlias !== rightAlias) return sql;

  const [, selectList, leftTable, leftAlias, rightTable, , onClause] = anti;
  return `SELECT ${selectList?.trim()}\nFROM ${leftTable} ${leftAlias}\nWHERE NOT EXISTS (\n  SELECT 1 FROM ${rightTable} ${rightAlias}\n  WHERE ${onClause?.trim()}\n)`;
}

function implicitToExplicitJoin(sql: string): string {
  const withAlias = sql.match(
    /\bFROM\s+(\w+)\s+(\w+)\s*,\s*(\w+)\s+(\w+)\s+WHERE\s+([\s\S]+?)(;|$)/i,
  );
  if (withAlias) {
    const [, t1, a1, t2, a2, condition] = withAlias;
    const kw = /^(where|inner|left|right|cross|join|on)$/i;
    if (kw.test(a1!) || kw.test(a2!)) return sql;
    const before = sql.slice(0, withAlias.index);
    const after = sql.slice((withAlias.index ?? 0) + withAlias[0].length);
    return `${before}FROM ${t1} ${a1}\nINNER JOIN ${t2} ${a2} ON ${condition?.trim()}${after}`;
  }

  const noAlias = sql.match(/\bFROM\s+(\w+)\s*,\s*(\w+)\s+WHERE\s+([\s\S]+?)(;|$)/i);
  if (!noAlias) return sql;
  const [, t1, t2, condition] = noAlias;
  const before = sql.slice(0, noAlias.index);
  const after = sql.slice((noAlias.index ?? 0) + noAlias[0].length);
  return `${before}FROM ${t1}\nINNER JOIN ${t2} ON ${condition?.trim()}${after}`;
}

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

export const rewriteAstEquivalent = rewriteProducesValidChange;
