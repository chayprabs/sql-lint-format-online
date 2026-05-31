import { describe, expect, it } from "vitest";
import { applyFix, lint } from "./lint.js";
import { parse } from "./parse.js";
import { parseDdl } from "./preflight.js";
import { rewrite } from "./rewrite.js";

describe("regression bugs", () => {
  it("fixes != NULL correctly", () => {
    const sql = "SELECT id FROM t WHERE col != NULL;";
    const issues = lint(sql, { dialect: "postgresql", bundle: "review" });
    const issue = issues.find((i) => i.rule === "null-equality");
    expect(issue).toBeDefined();
    expect(applyFix(sql, issue!)).toBe("SELECT id FROM t WHERE col IS NOT NULL;");
  });

  it("ignores = NULL inside string literals", () => {
    const issues = lint("SELECT 'col = NULL' AS hint FROM users;", {
      dialect: "postgresql",
      bundle: "review",
    });
    expect(issues.filter((i) => i.rule === "null-equality")).toHaveLength(0);
  });

  it("rejects SELECT FROM WHERE", () => {
    expect(parse("SELECT FROM WHERE;", "postgresql").valid).toBe(false);
  });

  it("flags UPDATE without top-level WHERE when subquery has WHERE", () => {
    const sql = "UPDATE users SET x = (SELECT 1 FROM t WHERE id = 1);";
    const issues = lint(sql, { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "missing-where-update-delete")).toBe(true);
  });

  it("parses DDL with VARCHAR(100)", () => {
    const schema = parseDdl("CREATE TABLE users (id INT, name VARCHAR(100), active BOOLEAN);");
    expect(schema.users?.active?.type).toMatch(/boolean/i);
    const out = rewrite("SELECT * FROM users;", "expand-select-star", {
      dialect: "postgresql",
      schema,
    });
    expect(out).toContain("active");
  });

  it("extract-cte handles nested parens", () => {
    const sql = "SELECT * FROM (SELECT id, (SELECT 1) AS x FROM users) sub;";
    const out = rewrite(sql, "extract-cte", { dialect: "postgresql" });
    expect(out).toContain("SELECT 1) AS x");
    expect(out).not.toContain("SELECT id, (SELECT 1\n)");
  });

  it("anti-join skips wrong-side NULL", () => {
    const sql = "SELECT o.id FROM orders o LEFT JOIN users u ON o.uid = u.id WHERE o.id IS NULL";
    expect(rewrite(sql, "anti-join-to-not-exists", { dialect: "postgresql" })).toBe(sql);
  });

  it("implicit join without aliases", () => {
    const sql = "SELECT * FROM orders, customers WHERE orders.id = customers.id;";
    const out = rewrite(sql, "implicit-to-explicit-join", { dialect: "postgresql" });
    expect(out.toUpperCase()).toContain("INNER JOIN");
  });

  it("trailing-semicolon fix on multiline SQL", () => {
    const sql = "SELECT id\nFROM users";
    const issues = lint(sql, { dialect: "postgresql", bundle: "strict" });
    const issue = issues.find((i) => i.rule === "trailing-semicolon");
    expect(applyFix(sql, issue!)).toBe("SELECT id\nFROM users;");
  });
});
