import type { Dialect } from "./types.js";

export const DIALECTS: Dialect[] = [
  "postgresql",
  "mysql",
  "sqlite",
  "mssql",
  "snowflake",
  "bigquery",
  "redshift",
  "duckdb",
  "oracle",
];

export const DIALECT_LABELS: Record<Dialect, string> = {
  postgresql: "PostgreSQL",
  mysql: "MySQL",
  sqlite: "SQLite",
  mssql: "MS SQL Server",
  snowflake: "Snowflake",
  bigquery: "BigQuery",
  redshift: "Amazon Redshift",
  duckdb: "DuckDB",
  oracle: "Oracle",
};

/** Maps product dialects to sql-formatter language id. */
export function toFormatterLanguage(dialect: Dialect): string {
  const map: Record<Dialect, string> = {
    postgresql: "postgresql",
    mysql: "mysql",
    sqlite: "sqlite",
    mssql: "tsql",
    snowflake: "snowflake",
    bigquery: "bigquery",
    redshift: "redshift",
    duckdb: "duckdb",
    oracle: "plsql",
  };
  return map[dialect];
}
