import { describe, expect, it } from "vitest";
import { parseDdl } from "./preflight.js";
import { rewrite } from "./rewrite.js";

describe("rewrite", () => {
  it("expands SELECT * with schema", () => {
    const ddl = `CREATE TABLE users (id INT, name VARCHAR(100));`;
    const schema = parseDdl(ddl);
    const sql = "SELECT * FROM users;";
    const out = rewrite(sql, "expand-select-star", {
      dialect: "postgresql",
      schema,
      defaultSchema: "public",
    });
    expect(out).toContain("users.id");
    expect(out).toContain("users.name");
  });

  it("converts implicit join to explicit", () => {
    const sql = "SELECT o.id FROM orders o, customers c WHERE o.customer_id = c.id;";
    const out = rewrite(sql, "implicit-to-explicit-join", { dialect: "postgresql" });
    expect(out.toUpperCase()).toContain("INNER JOIN");
  });

  it("qualifies FROM and JOIN tables", () => {
    const sql = "SELECT * FROM users JOIN orders ON users.id = orders.user_id;";
    const out = rewrite(sql, "qualify-tables", { dialect: "postgresql", defaultSchema: "app" });
    expect(out).toContain("app.users");
    expect(out).toContain("app.orders");
  });

  it("extracts subquery to CTE", () => {
    const sql = "SELECT * FROM (SELECT id FROM users) sub;";
    const out = rewrite(sql, "extract-cte", { dialect: "postgresql" });
    expect(out).toContain("WITH");
    expect(out).toContain("extracted_subquery");
  });
});
