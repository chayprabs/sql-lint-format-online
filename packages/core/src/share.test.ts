import { describe, expect, it } from "vitest";
import { buildShareUrl, decodeShareState, encodeShareState } from "./share.js";

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

  it("decodes full share URLs from buildShareUrl", () => {
    const state = {
      sql: "SELECT 2;",
      dialect: "mysql" as const,
      bundle: "strict" as const,
    };
    const url = buildShareUrl("https://example.com/app/", state);
    const decoded = decodeShareState(url);
    expect(decoded?.sql).toBe(state.sql);
    expect(decoded?.dialect).toBe("mysql");
  });
});
