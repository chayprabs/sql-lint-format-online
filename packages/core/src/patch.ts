export interface DiffLine {
  type: "add" | "remove" | "same";
  content: string;
}

export function diffLines(original: string, modified: string): DiffLine[] {
  const a = original.split("\n");
  const b = modified.split("\n");
  const result: DiffLine[] = [];
  const max = Math.max(a.length, b.length);

  for (let i = 0; i < max; i++) {
    const left = a[i];
    const right = b[i];
    if (left === right) {
      if (left !== undefined) result.push({ type: "same", content: left });
    } else {
      if (left !== undefined) result.push({ type: "remove", content: left });
      if (right !== undefined) result.push({ type: "add", content: right });
    }
  }
  return result;
}

export function toUnifiedPatch(original: string, modified: string, filename = "query.sql"): string {
  const diff = diffLines(original, modified);
  const lines = [
    `--- a/${filename}`,
    `+++ b/${filename}`,
  ];
  for (const d of diff) {
    const prefix = d.type === "add" ? "+" : d.type === "remove" ? "-" : " ";
    lines.push(`${prefix}${d.content}`);
  }
  return lines.join("\n");
}
