import { useCallback, useEffect, useMemo, useState } from "react";
import {
  applyFix,
  buildShareUrl,
  detectDialect,
  diffLines,
  format,
  lint,
  mergePreflightWithLint,
  parseDdl,
  preflight,
  rewrite,
  toUnifiedPatch,
  type Dialect,
  type LintIssue,
  type RewriteKind,
  type RuleBundle,
  parseHashFromLocation,
  DEFAULT_SHARE,
} from "@sqlguard/core";
import { DIALECTS, DIALECT_LABELS } from "@sqlguard/core";

export { DIALECTS, DIALECT_LABELS };

export function usePlayground(initialMode?: "lint" | "format", initialDialect?: Dialect) {
  const [sql, setSql] = useState(DEFAULT_SHARE.sql);
  const [dialect, setDialect] = useState<Dialect>(initialDialect ?? DEFAULT_SHARE.dialect);
  const [bundle, setBundle] = useState<RuleBundle>(DEFAULT_SHARE.bundle);
  const [ddl, setDdl] = useState("");
  const [output, setOutput] = useState("");
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");

  const schema = useMemo(() => parseDdl(ddl), [ddl]);

  useEffect(() => {
    const state = parseHashFromLocation(window.location.hash);
    if (state) {
      setSql(state.sql);
      setDialect(state.dialect);
      setBundle(state.bundle);
      if (state.ddl) setDdl(state.ddl);
    }
  }, []);

  useEffect(() => {
    if (initialMode === "format" && !output) {
      setOutput(format(sql, dialect));
    }
  }, [initialMode, sql, dialect, output]);

  const runLint = useCallback(() => {
    const lintIssues = lint(sql, { dialect, bundle });
    const preIssues = ddl.trim() ? preflight(sql, ddl, dialect) : [];
    const merged = mergePreflightWithLint(lintIssues, preIssues);
    setIssues(merged);
    setOutput("");
    setShowDiff(false);
    setLastAction("lint");
  }, [sql, dialect, bundle, ddl]);

  const runFormat = useCallback(() => {
    const formatted = format(sql, dialect);
    setOutput(formatted);
    setIssues([]);
    setShowDiff(false);
    setLastAction("format");
  }, [sql, dialect]);

  const runRewrite = useCallback(
    (kind: RewriteKind) => {
      const result = rewrite(sql, kind, { dialect, schema, defaultSchema: "public" });
      setOutput(result);
      setShowDiff(true);
      setLastAction(`rewrite:${kind}`);
    },
    [sql, dialect, schema],
  );

  const runDetect = useCallback(() => {
    const detected = detectDialect(sql);
    setDialect(detected);
    setLastAction("detect");
  }, [sql]);

  const applyIssueFix = useCallback(
    (issue: LintIssue) => {
      if (issue.fix) {
        setSql(applyFix(sql, issue));
        runLint();
      }
    },
    [sql, runLint],
  );

  const share = useCallback(() => {
    const url = buildShareUrl(window.location.origin + window.location.pathname, {
      sql,
      dialect,
      bundle,
      ddl: ddl || undefined,
    });
    void navigator.clipboard.writeText(url);
  }, [sql, dialect, bundle, ddl]);

  const copyPatch = useCallback(() => {
    if (!output) return;
    const patch = toUnifiedPatch(sql, output);
    void navigator.clipboard.writeText(patch);
  }, [sql, output]);

  const diff = useMemo(() => {
    if (!showDiff || !output) return [];
    return diffLines(sql, output);
  }, [sql, output, showDiff]);

  return {
    sql,
    setSql,
    dialect,
    setDialect,
    bundle,
    setBundle,
    ddl,
    setDdl,
    output,
    issues,
    showDiff,
    setShowDiff,
    lastAction,
    runLint,
    runFormat,
    runRewrite,
    runDetect,
    applyIssueFix,
    share,
    copyPatch,
    diff,
  };
}
