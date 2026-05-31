import { describe, expect, it } from "vitest";
import { parseDdl, preflight } from "./preflight.js";

const DDL = `
CREATE TABLE public.users (
  id INT,
  name VARCHAR(100),
  active BOOLEAN
);
`;

describe("preflight", () => {
  it("parses DDL into schema", () => {
    const schema = parseDdl(DDL);
    expect(schema.users?.id?.type).toMatch(/int/i);
    expect(schema["public.users"]?.name).toBeDefined();
  });

  it("flags unknown column on qualified ref", () => {
    const issues = preflight("SELECT u.nope FROM users u;", DDL, "postgresql");
    expect(issues.some((i) => i.rule === "preflight-unknown-column")).toBe(true);
  });

  it("passes valid column ref", () => {
    const issues = preflight("SELECT u.id FROM users u;", DDL, "postgresql");
    expect(issues.filter((i) => i.rule === "preflight-unknown-column")).toHaveLength(0);
  });
});
