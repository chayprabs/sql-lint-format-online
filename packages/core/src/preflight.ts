import type { ColumnDef, Dialect, LintIssue, SchemaMap } from "./types.js";
import { parse } from "./parse.js";

const CREATE_TABLE =
  /CREATE\s+TABLE\s+(?:(\w+)\.)?(\w+)\s*\(([\s\S]*?)\)\s*;?/gi;

function parseColumnDef(fragment: string): ColumnDef | null {
  const m = fragment.trim().match(/^(\w+)\s+([\w()]+)/i);
  if (!m) return null;
  return { name: m[1]!.toLowerCase(), type: m[2]!.toLowerCase() };
}

export function parseDdl(ddl: string): SchemaMap {
  const schema: SchemaMap = {};
  let match: RegExpExecArray | null;
  const text = ddl.replace(/--[^\n]*/g, "");

  while ((match = CREATE_TABLE.exec(text)) !== null) {
    const tableSchema = (match[1] ?? "public").toLowerCase();
    const tableName = match[2]!.toLowerCase();
    const body = match[3] ?? "";
    const key = `${tableSchema}.${tableName}`;
    schema[key] = {};
    schema[tableName] = schema[tableName] ?? {};

    const parts = body.split(",");
    for (const part of parts) {
      const col = parseColumnDef(part);
      if (col && !/^(primary|foreign|unique|constraint|check)\b/i.test(part.trim())) {
        schema[key]![col.name] = col;
        schema[tableName]![col.name] = col;
      }
    }
  }

  return schema;
}

function extractTableColumnRefs(sql: string): { table?: string; column: string }[] {
  const refs: { table?: string; column: string }[] = [];
  const qualified = /\b(\w+)\.(\w+)\b/g;
  let m: RegExpExecArray | null;
  while ((m = qualified.exec(sql)) !== null) {
    const kw = ["select", "from", "where", "join", "on", "and", "or", "as", "by", "set"];
    if (!kw.includes(m[1]!.toLowerCase())) {
      refs.push({ table: m[1]!.toLowerCase(), column: m[2]!.toLowerCase() });
    }
  }
  return refs;
}

export function preflight(sql: string, ddl: string, dialect: Dialect): LintIssue[] {
  const issues: LintIssue[] = [];
  const schema = parseDdl(ddl);
  if (!ddl.trim()) return issues;

  const parseResult = parse(sql, dialect);
  if (!parseResult.valid) {
    issues.push({
      rule: "preflight-parse",
      severity: "error",
      line: 1,
      column: 1,
      message: parseResult.error ?? "Query parse failed during preflight",
    });
    return issues;
  }

  const refs = extractTableColumnRefs(sql);
  for (const ref of refs) {
    const tableKey = ref.table ?? "";
    const tableSchema = schema[tableKey] ?? schema[`public.${tableKey}`];
    if (!tableSchema) {
      issues.push({
        rule: "preflight-unknown-table",
        severity: "warn",
        line: 1,
        column: 1,
        message: `Table "${ref.table}" not found in provided DDL`,
      });
      continue;
    }
    const col = tableSchema[ref.column];
    if (!col) {
      issues.push({
        rule: "preflight-unknown-column",
        severity: "error",
        line: 1,
        column: 1,
        message: `Column "${ref.column}" not found on table "${ref.table}"`,
      });
    }
  }

  const typeMismatches = sql.match(/(\w+)\s*=\s*'[^']*'/g);
  if (typeMismatches) {
    for (const expr of typeMismatches) {
      const colMatch = expr.match(/^(\w+)\s*=/);
      if (!colMatch) continue;
      const colName = colMatch[1]!.toLowerCase();
      for (const table of Object.values(schema)) {
        const def = table[colName];
        if (def && /int|numeric|decimal|float|double|bigint/.test(def.type) && /'/.test(expr)) {
          issues.push({
            rule: "preflight-type-mismatch",
            severity: "warn",
            line: 1,
            column: 1,
            message: `Column "${colName}" is ${def.type} but compared to a string literal`,
          });
        }
      }
    }
  }

  return issues;
}

export function mergePreflightWithLint(lintIssues: LintIssue[], preflightIssues: LintIssue[]): LintIssue[] {
  return [...lintIssues, ...preflightIssues];
}
