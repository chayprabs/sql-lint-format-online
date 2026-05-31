import { describe, expect, it } from "vitest";
import { DIALECTS } from "./dialects.js";
import { parse } from "./parse.js";

const FIXTURES: Record<string, string> = {
  postgresql: "SELECT id FROM users WHERE active = true;",
  mysql: "SELECT id FROM users WHERE active = 1 LIMIT 10;",
  sqlite: "SELECT id FROM users WHERE active = 1;",
  mssql: "SELECT TOP 10 id FROM users WHERE active = 1;",
  snowflake: "SELECT id FROM users WHERE active = TRUE;",
  bigquery: "SELECT id FROM `dataset.table` WHERE active = TRUE;",
  redshift: "SELECT id FROM users WHERE active = true;",
  duckdb: "SELECT id FROM users WHERE active = true;",
  oracle: "SELECT id FROM users WHERE active = 1;",
};

describe("parse per dialect", () => {
  for (const dialect of DIALECTS) {
    it(`parses ${dialect}`, () => {
      const sql = FIXTURES[dialect] ?? FIXTURES.postgresql;
      const result = parse(sql, dialect);
      expect(result.valid).toBe(true);
    });
  }
});
