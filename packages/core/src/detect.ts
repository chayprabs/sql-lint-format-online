import { parse } from "./parse.js";
import { DIALECTS } from "./dialects.js";
import type { Dialect } from "./types.js";

const DIALECT_HINTS: { dialect: Dialect; patterns: RegExp[] }[] = [
  {
    dialect: "bigquery",
    patterns: [/\bSAFE\./i, /\bSTRUCT</i, /\bUNNEST\s*\(/i, /`[^`]+`/],
  },
  {
    dialect: "snowflake",
    patterns: [/\bQUALIFY\b/i, /\bFLATTEN\s*\(/i, /\bILIKE\b/i, /\$\d+/],
  },
  {
    dialect: "mssql",
    patterns: [/\bTOP\s+\d+/i, /\bNVARCHAR\b/i, /\bGO\b/i, /\[dbo\]/i],
  },
  {
    dialect: "mysql",
    patterns: [/\bLIMIT\s+\d+/i, /\bAUTO_INCREMENT\b/i, /`[^`]+`/],
  },
  {
    dialect: "postgresql",
    patterns: [/\bILIKE\b/i, /\bRETURNING\b/i, /::\w+/],
  },
  {
    dialect: "oracle",
    patterns: [/\bDUAL\b/i, /\bROWNUM\b/i, /\bNVL\s*\(/i],
  },
  {
    dialect: "redshift",
    patterns: [/\bDISTKEY\b/i, /\bSORTKEY\b/i, /\bENCODE\b/i],
  },
  {
    dialect: "duckdb",
    patterns: [/\bLIST\s*\(/i, /\bSTRUCT_PACK\s*\(/i],
  },
  {
    dialect: "sqlite",
    patterns: [/\bAUTOINCREMENT\b/i, /\bGLOB\b/i],
  },
];

export function detectDialect(sql: string): Dialect {
  let best: Dialect = "postgresql";
  let bestScore = 0;

  for (const hint of DIALECT_HINTS) {
    let score = 0;
    for (const pattern of hint.patterns) {
      if (pattern.test(sql)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = hint.dialect;
    }
  }

  if (bestScore > 0) return best;

  for (const dialect of DIALECTS) {
    const result = parse(sql, dialect);
    if (result.valid) return dialect;
  }

  return "postgresql";
}

export function scoreDialectParse(sql: string, dialect: Dialect): boolean {
  return parse(sql, dialect).valid;
}
