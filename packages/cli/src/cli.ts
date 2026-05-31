#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { lint, format, type Dialect } from "@sqlguard/core";

const args = process.argv.slice(2);
const command = args[0];
const file = args[1];
const dialect = (args.find((a: string) => a.startsWith("--dialect="))?.split("=")[1] ??
  "postgresql") as Dialect;

if (!command || !file) {
  console.error("Usage: sqlguard <lint|format> <file.sql> [--dialect=postgresql]");
  process.exit(1);
}

const sql = readFileSync(file, "utf8");

if (command === "lint") {
  const issues = lint(sql, { dialect, bundle: "review" });
  for (const issue of issues) {
    console.log(`${issue.severity} [${issue.rule}] L${issue.line}: ${issue.message}`);
  }
  process.exit(issues.some((i) => i.severity === "error") ? 1 : 0);
}

if (command === "format") {
  console.log(format(sql, dialect));
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
process.exit(1);
