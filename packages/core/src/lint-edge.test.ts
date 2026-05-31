import { describe, expect, it } from "vitest";
import { lint } from "./lint.js";

describe("lint edge cases", () => {
  it("ignores UPDATE in comments", () => {
    const issues = lint("-- UPDATE users SET x=1", { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "missing-where-update-delete")).toBe(false);
  });

  it("flags comma join per statement", () => {
    const sql =
      "SELECT a FROM t1, t2;\nSELECT b FROM t3, t4 WHERE t3.id = t4.id;";
    const issues = lint(sql, { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "cartesian-join")).toBe(true);
  });
});
