export type Dialect =
  | "postgresql"
  | "mysql"
  | "sqlite"
  | "mssql"
  | "snowflake"
  | "bigquery"
  | "redshift"
  | "duckdb"
  | "oracle";

export type RuleBundle = "review" | "strict" | "bigquery";

export type RewriteKind =
  | "expand-select-star"
  | "qualify-tables"
  | "extract-cte"
  | "anti-join-to-not-exists"
  | "implicit-to-explicit-join";

export type Severity = "info" | "warn" | "error";

export interface LintIssue {
  rule: string;
  severity: Severity;
  line: number;
  column: number;
  message: string;
  fix?: { range: [number, number]; replacement: string };
}

export interface FormatOptions {
  keywordCase?: "upper" | "lower" | "preserve";
  indentStyle?: "standard" | "tabularLeft" | "tabularRight";
  linesBetweenQueries?: number;
  maxLineLength?: number;
}

export interface LintOptions {
  dialect: Dialect;
  bundle?: RuleBundle;
}

export interface RewriteOptions {
  dialect: Dialect;
  schema?: SchemaMap;
  defaultSchema?: string;
}

export type SchemaMap = Record<string, Record<string, ColumnDef>>;

export interface ColumnDef {
  name: string;
  type: string;
}

export interface ParseResult {
  ast: unknown;
  valid: boolean;
  error?: string;
}

export interface ShareState {
  sql: string;
  dialect: Dialect;
  bundle: RuleBundle;
  ddl?: string;
}
