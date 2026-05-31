import { format as sqlFormat, type SqlLanguage } from "sql-formatter";
import { toFormatterLanguage } from "./dialects.js";
import { parse } from "./parse.js";
import type { Dialect, FormatOptions } from "./types.js";

function tabWidthForIndent(indentStyle?: FormatOptions["indentStyle"]): number {
  if (indentStyle === "tabularLeft" || indentStyle === "tabularRight") return 4;
  return 2;
}

export function format(sql: string, dialect: Dialect, options: FormatOptions = {}): string {
  const trimmed = sql.trim();
  if (!trimmed) return "";

  const keywordCase = options.keywordCase ?? "upper";
  const language = toFormatterLanguage(dialect) as SqlLanguage;

  try {
    return sqlFormat(trimmed, {
      language,
      keywordCase,
      tabWidth: tabWidthForIndent(options.indentStyle),
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
