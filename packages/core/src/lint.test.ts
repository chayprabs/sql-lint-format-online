import { describe, expect, it } from "vitest";
import { lint } from "./lint.js";
import { SAMPLE_RISKY_UPDATE, SAMPLE_MESSY_SELECT } from "./samples.js";

describe("lint", () => {
  it("flags UPDATE without WHERE", () => {
    const issues = lint(SAMPLE_RISKY_UPDATE, { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "missing-where-update-delete")).toBe(true);
  });

  it("flags comma joins", () => {
    const issues = lint(SAMPLE_MESSY_SELECT, { dialect: "postgresql", bundle: "review" });
    expect(issues.some((i) => i.rule === "cartesian-join" || i.rule === "select-star")).toBe(true);
  });
});
