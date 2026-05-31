import { describe, expect, it } from "vitest";
import { format, formatRoundTripStable } from "./format.js";

describe("format", () => {
  it("preserves line comments", () => {
    const sql = "SELECT id FROM users -- active only\nWHERE active = true;";
    const out = format(sql, "postgresql");
    expect(out).toContain("-- active only");
  });

  it("uppercases keywords by default", () => {
    const out = format("select id from users", "postgresql");
    expect(out).toMatch(/SELECT/);
    expect(out).toMatch(/FROM/);
  });

  it("round-trip stable for simple query", () => {
    const sql = "SELECT id FROM users WHERE id = 1;";
    expect(formatRoundTripStable(sql, "postgresql")).toBe(true);
  });
});
