import { describe, expect, it } from "vitest";
import { lint } from "./lint.js";

const SMALL = "SELECT id, name FROM users WHERE active = true AND id > 0;";

describe("lint performance", () => {
  it("lints small query under 50ms p95 (single run)", () => {
    const runs = 20;
    const times: number[] = [];
    for (let i = 0; i < runs; i++) {
      const t0 = performance.now();
      lint(SMALL, { dialect: "postgresql", bundle: "review" });
      times.push(performance.now() - t0);
    }
    times.sort((a, b) => a - b);
    const p95 = times[Math.floor(runs * 0.95)] ?? times[runs - 1]!;
    expect(p95).toBeLessThan(50);
  });
});
