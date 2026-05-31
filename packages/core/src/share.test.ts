import { describe, expect, it } from "vitest";
import { decodeShareState, encodeShareState } from "./share.js";

describe("share", () => {
  it("round-trips state", () => {
    const state = {
      sql: "SELECT 1;",
      dialect: "postgresql" as const,
      bundle: "review" as const,
      ddl: "CREATE TABLE t (id INT);",
    };
    const hash = encodeShareState(state);
    const decoded = decodeShareState(`#${hash}`);
    expect(decoded?.sql).toBe(state.sql);
    expect(decoded?.dialect).toBe("postgresql");
    expect(decoded?.ddl).toBe(state.ddl);
  });
});
