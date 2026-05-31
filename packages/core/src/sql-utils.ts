/** Strip line and block comments for safer regex linting. */
export function stripSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ");
}

/** Mask comments in place so indices stay aligned with the original SQL. */
export function maskSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, (m) => " ".repeat(m.length))
    .replace(/--[^\n]*/g, (m) => " ".repeat(m.length));
}

/** Mask string literals so regex rules do not match inside quotes. */
export function maskStringLiterals(line: string): string {
  return line
    .replace(/'([^'\\]|\\.|'')*'/g, "''")
    .replace(/"([^"\\]|\\.|"")*"/g, '""');
}

/** Split on semicolons outside quotes (simple heuristic). */
export function splitStatements(sql: string): string[] {
  const stripped = stripSqlComments(sql);
  return stripped
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Split comma-separated list respecting parentheses (e.g. DDL columns). */
export function splitCommaRespectingParens(body: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of body) {
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    if (ch === "," && depth === 0) {
      if (current.trim()) parts.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

/** True if WHERE appears at parenthesis depth 0 in the statement. */
export function hasTopLevelWhere(stmt: string): boolean {
  let depth = 0;
  const lower = stmt.toLowerCase();
  for (let i = 0; i <= lower.length - 5; i++) {
    const ch = stmt[i];
    if (ch === "(") depth++;
    else if (ch === ")") depth = Math.max(0, depth - 1);
    else if (depth === 0 && lower.startsWith("where", i)) {
      const before = i > 0 ? stmt[i - 1]! : " ";
      const after = stmt[i + 5] ?? " ";
      if (!/\w/.test(before) && !/\w/.test(after)) return true;
    }
  }
  return false;
}
