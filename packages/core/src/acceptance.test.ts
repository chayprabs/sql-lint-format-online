import { describe, expect, it } from "vitest";
import { lint } from "./lint.js";
import { rewrite, rewriteProducesValidChange } from "./rewrite.js";
import { parseDdl } from "./preflight.js";
import {
  SAMPLE_RISKY_UPDATE,
  SAMPLE_MESSY_SELECT,
  SAMPLE_BIGQUERY,
  SAMPLE_SNOWFLAKE,
} from "./samples.js";

describe("acceptance A1", () => {
  it("risky UPDATE lints with missing WHERE", () => {
    const issues = lint(SAMPLE_RISKY_UPDATE, { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "missing-where-update-delete")).toBe(true);
  });

  it("messy SELECT lints", () => {
    const issues = lint(SAMPLE_MESSY_SELECT, { dialect: "postgresql", bundle: "review" });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("BigQuery sample parses", () => {
    const issues = lint(SAMPLE_BIGQUERY, { dialect: "bigquery", bundle: "bigquery" });
    expect(issues.filter((i) => i.rule === "parse-error")).toHaveLength(0);
  });

  it("Snowflake sample parses", () => {
    const issues = lint(SAMPLE_SNOWFLAKE, { dialect: "snowflake", bundle: "review" });
    expect(issues.filter((i) => i.rule === "parse-error")).toHaveLength(0);
  });
});

describe("acceptance A2", () => {
  it("rewrite changes SQL validly", () => {
    const ddl = `CREATE TABLE users (id INT, name VARCHAR(100));`;
    const schema = parseDdl(ddl);
    const out = rewrite("SELECT * FROM users;", "expand-select-star", {
      dialect: "postgresql",
      schema,
    });
    expect(rewriteProducesValidChange("SELECT * FROM users;", out, "postgresql")).toBe(true);
    expect(out).toContain("users.id");
  });
});
