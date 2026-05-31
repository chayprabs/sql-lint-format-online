import { Parser } from "node-sql-parser";
import { toParserDialect } from "./dialects.js";
import type { Dialect, ParseResult } from "./types.js";

const parsers = new Map<string, Parser>();

function getParser(dialect: Dialect): Parser {
  const key = toParserDialect(dialect);
  if (!parsers.has(key)) {
    parsers.set(key, new Parser());
  }
  return parsers.get(key)!;
}

export function parse(sql: string, dialect: Dialect): ParseResult {
  const trimmed = sql.trim();
  if (!trimmed) {
    return { ast: null, valid: true };
  }
  try {
    const parser = getParser(dialect);
    const ast = parser.astify(trimmed, { database: toParserDialect(dialect) });
    return { ast, valid: true };
  } catch (err) {
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

export function stringifyAst(ast: unknown, dialect: Dialect): string {
  const parser = getParser(dialect);
  return parser.sqlify(ast as Parameters<Parser["sqlify"]>[0], {
    database: toParserDialect(dialect),
  });
}
