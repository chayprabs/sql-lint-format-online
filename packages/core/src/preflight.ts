import type { ColumnDef, Dialect, LintIssue, SchemaMap } from "./types.js";
import { parse } from "./parse.js";
import { stripSqlComments } from "./sql-utils.js";

const CREATE_TABLE =
  /CREATE\s+TABLE\s+(?:(\w+)\.)?(\w+)\s*\(([\s\S]*?)\)\s*;?/gi;

function parseColumnDef(fragment: string): ColumnDef | null {
  const m = fragment.trim().match(/^"?(\w+)"?\s+([\w()]+)/i);
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

function extractFromTables(sql: string): string[] {
  const tables: string[] = [];
  const fromJoin = /\b(?:FROM|JOIN)\s+(?:(\w+)\.)?(\w+)/gi;
  let m: RegExpExecArray | null;
  while ((m = fromJoin.exec(sql)) !== null) {
    tables.push((m[2] ?? m[1])!.toLowerCase());
  }
  return [...new Set(tables)];
}

function extractTableAliases(sql: string): Record<string, string> {
  const aliases: Record<string, string> = {};
  const pattern = /\b(?:FROM|JOIN)\s+(?:(\w+)\.)?(\w+)(?:\s+(?:AS\s+)?(\w+))?/gi;
  let m: RegExpExecArray | null;
  while ((m = pattern.exec(sql)) !== null) {
    const table = (m[2] ?? m[1])!.toLowerCase();
    const alias = m[3]?.toLowerCase();
    if (alias && alias !== table) aliases[alias] = table;
    aliases[table] = table;
  }
  return aliases;
}

function lineColumnAt(sql: string, index: number): { line: number; column: number } {
  const before = sql.slice(0, index);
  const lines = before.split("\n");
  return { line: lines.length, column: (lines[lines.length - 1]?.length ?? 0) + 1 };
}

function extractTableColumnRefs(sql: string): { table?: string; column: string; index: number }[] {
  const refs: { table?: string; column: string; index: number }[] = [];
  const qualified = /\b(\w+)\.(\w+)\b/g;
  const kw = new Set([
    "select", "from", "where", "join", "on", "and", "or", "as", "by", "set", "inner", "left", "right",
  ]);
  let m: RegExpExecArray | null;
  while ((m = qualified.exec(sql)) !== null) {
    if (!kw.has(m[1]!.toLowerCase())) {
      refs.push({
        table: m[1]!.toLowerCase(),
        column: m[2]!.toLowerCase(),
        index: m.index ?? 0,
      });
    }
  }
  return refs;
}

function extractUnqualifiedSelectColumns(sql: string): { column: string; index: number }[] {
  const cols: { column: string; index: number }[] = [];
  const selectMatch = sql.match(/\bSELECT\b([\s\S]*?)\bFROM\b/i);
  if (!selectMatch) return cols;
  const list = selectMatch[1] ?? "";
  const parts = list.split(",");
  const skip = new Set(["distinct", "all", "as"]);
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed || trimmed.includes(".")) continue;
    const m = trimmed.match(/^(\w+)$/);
    if (m && !skip.has(m[1]!.toLowerCase())) {
      cols.push({
        column: m[1]!.toLowerCase(),
        index: (selectMatch.index ?? 0) + list.indexOf(trimmed),
      });
    }
  }
  return cols;
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

  const body = stripSqlComments(sql);
  const aliases = extractTableAliases(body);
  const refs = extractTableColumnRefs(body);
  for (const ref of refs) {
    const pos = lineColumnAt(sql, ref.index);
    const aliasKey = ref.table ?? "";
    const resolvedTable = aliases[aliasKey] ?? aliasKey;
    const tableSchema =
      schema[resolvedTable] ??
      schema[`public.${resolvedTable}`] ??
      schema[resolvedTable.split(".").pop() ?? ""];
    if (!tableSchema) {
      issues.push({
        rule: "preflight-unknown-table",
        severity: "warn",
        line: pos.line,
        column: pos.column,
        message: `Table "${resolvedTable}" not found in provided DDL`,
      });
      continue;
    }
    const col = tableSchema[ref.column];
    if (!col) {
      issues.push({
        rule: "preflight-unknown-column",
        severity: "error",
        line: pos.line,
        column: pos.column,
        message: `Column "${ref.column}" not found on table "${resolvedTable}"`,
      });
    }
  }

  const fromTables = extractFromTables(body);
  for (const { column, index } of extractUnqualifiedSelectColumns(body)) {
    if (fromTables.length !== 1) continue;
    const table = fromTables[0]!;
    const tableSchema = schema[table] ?? schema[`public.${table}`];
    if (tableSchema && !tableSchema[column]) {
      const pos = lineColumnAt(sql, index);
      issues.push({
        rule: "preflight-unknown-column",
        severity: "error",
        line: pos.line,
        column: pos.column,
        message: `Column "${column}" not found on table "${table}" in DDL`,
      });
    }
  }

  const typeMismatches = body.matchAll(/(\w+)\s*(?:=|<>|!=)\s*'[^']*'/g);
  for (const expr of typeMismatches) {
    const colName = expr[1]!.toLowerCase();
    const idx = expr.index ?? 0;
    const pos = lineColumnAt(sql, idx);
    for (const table of Object.values(schema)) {
      const def = table[colName];
      if (def && /int|numeric|decimal|float|double|bigint|serial/.test(def.type)) {
        issues.push({
          rule: "preflight-type-mismatch",
          severity: "warn",
          line: pos.line,
          column: pos.column,
          message: `Column "${colName}" is ${def.type} but compared to a string literal`,
        });
      }
    }
  }

  return issues;
}

export function mergePreflightWithLint(lintIssues: LintIssue[], preflightIssues: LintIssue[]): LintIssue[] {
  return [...lintIssues, ...preflightIssues];
}
