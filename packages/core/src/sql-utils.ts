/** Strip line and block comments for safer regex linting. */
export function stripSqlComments(sql: string): string {
  return sql
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\n]*/g, " ");
}

/** Split on semicolons outside quotes (simple heuristic). */
export function splitStatements(sql: string): string[] {
  const stripped = stripSqlComments(sql);
  return stripped
    .split(";")
    .map((s) => s.trim())
    .filter(Boolean);
}
