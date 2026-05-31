import { diffLines as diffLinesLib } from "diff";

export interface DiffLine {
  type: "add" | "remove" | "same";
  content: string;
}

export function diffLines(original: string, modified: string): DiffLine[] {
  const changes = diffLinesLib(original, modified);
  const result: DiffLine[] = [];
  for (const part of changes) {
    const lines = part.value.replace(/\n$/, "").split("\n");
    if (part.value === "" && lines.length === 1 && lines[0] === "") continue;
    for (const line of lines) {
      if (line === "" && part.value.endsWith("\n") && lines.length > 1) continue;
      if (part.added) result.push({ type: "add", content: line });
      else if (part.removed) result.push({ type: "remove", content: line });
      else result.push({ type: "same", content: line });
    }
  }
  return result;
}

export function toUnifiedPatch(original: string, modified: string, filename = "query.sql"): string {
  const diff = diffLines(original, modified);
  const lines = [`--- a/${filename}`, `+++ b/${filename}`];
  for (const d of diff) {
    const prefix = d.type === "add" ? "+" : d.type === "remove" ? "-" : " ";
    lines.push(`${prefix}${d.content}`);
  }
  return lines.join("\n");
}
