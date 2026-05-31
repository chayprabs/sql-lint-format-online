import { format as sqlFormat } from "sql-formatter";
import { toFormatterLanguage } from "./dialects.js";
import { parse } from "./parse.js";
import type { Dialect, FormatOptions } from "./types.js";

export function format(sql: string, dialect: Dialect, options: FormatOptions = {}): string {
  const trimmed = sql.trim();
  if (!trimmed) return "";

  const keywordCase = options.keywordCase ?? "upper";
  const language = toFormatterLanguage(dialect);

  try {
    return sqlFormat(trimmed, {
      language,
      keywordCase,
      tabWidth: 2,
      linesBetweenQueries: options.linesBetweenQueries ?? 1,
      paramTypes: { named: [":", "@", "$"] },
    });
  } catch {
    return trimmed;
  }
}

export function formatRoundTripStable(sql: string, dialect: Dialect): boolean {
  const once = format(sql, dialect);
  const twice = format(once, dialect);
  return once === twice;
}

export function validateFormatParse(sql: string, dialect: Dialect): boolean {
  const formatted = format(sql, dialect);
  return parse(formatted, dialect).valid;
}
