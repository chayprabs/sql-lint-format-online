import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  applyFix,
  buildShareUrl,
  detectDialect,
  diffLines,
  encodeShareState,
  format,
  lint,
  mergePreflightWithLint,
  parseDdl,
  parseHashFromLocation,
  preflight,
  rewrite,
  toUnifiedPatch,
  DEFAULT_SHARE,
  type Dialect,
  type FormatOptions,
  type LintIssue,
  type RewriteKind,
  type RuleBundle,
  type ShareState,
} from "@sqlguard/core";
import { DIALECTS, DIALECT_LABELS } from "@sqlguard/core";
import {
  clearPlayground,
  DEFAULT_FORMAT_OPTIONS,
  loadPlayground,
  savePlayground,
} from "../lib/storage";

export { DIALECTS, DIALECT_LABELS };

function syncUrlHash(state: ShareState) {
  const encoded = encodeShareState(state);
  const next = `#${encoded}`;
  if (window.location.hash !== next) {
    window.history.replaceState(null, "", next);
  }
}

export function usePlayground(initialMode?: "lint" | "format", initialDialect?: Dialect) {
  const [sql, setSql] = useState(DEFAULT_SHARE.sql);
  const [dialect, setDialect] = useState<Dialect>(initialDialect ?? DEFAULT_SHARE.dialect);
  const [bundle, setBundle] = useState<RuleBundle>(DEFAULT_SHARE.bundle);
  const [ddl, setDdl] = useState("");
  const [formatOptions, setFormatOptions] = useState<FormatOptions>(DEFAULT_FORMAT_OPTIONS);
  const [output, setOutput] = useState("");
  const [issues, setIssues] = useState<LintIssue[]>([]);
  const [showDiff, setShowDiff] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const hydrated = useRef(false);
  const skipHashSync = useRef(false);
  const issuesRef = useRef<LintIssue[]>([]);
  issuesRef.current = issues;

  const schema = useMemo(() => parseDdl(ddl), [ddl]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const refreshLint = useCallback(
    (text: string, d: Dialect, b: RuleBundle, ddlText: string) => {
      if (!text.trim()) {
        setIssues([]);
        return;
      }
      const lintIssues = lint(text, { dialect: d, bundle: b });
      const preIssues = ddlText.trim() ? preflight(text, ddlText, d) : [];
      setIssues(mergePreflightWithLint(lintIssues, preIssues));
    },
    [],
  );

  const applyShareState = useCallback(
    (state: ShareState) => {
      const fmt = { ...DEFAULT_FORMAT_OPTIONS, ...state.formatOptions };
      setSql(state.sql);
      setDialect(state.dialect);
      setBundle(state.bundle);
      setDdl(state.ddl ?? "");
      setFormatOptions(fmt);
      if (initialMode === "format") {
        const formatted = format(state.sql, state.dialect, fmt);
        setOutput(formatted);
        setShowDiff(!!formatted.trim());
        setIssues([]);
      } else if (initialMode === "lint") {
        refreshLint(state.sql, state.dialect, state.bundle, state.ddl ?? "");
        setOutput("");
        setShowDiff(false);
      } else {
        setIssues([]);
        setOutput("");
        setShowDiff(false);
      }
    },
    [initialMode, refreshLint],
  );

  useEffect(() => {
    void (async () => {
      let loadedSql = DEFAULT_SHARE.sql;
      let loadedDialect = initialDialect ?? DEFAULT_SHARE.dialect;
      let loadedBundle = DEFAULT_SHARE.bundle;
      let loadedDdl = "";
      let loadedFormat = DEFAULT_FORMAT_OPTIONS;

      const fromHash = parseHashFromLocation(window.location.hash);
      if (fromHash) {
        loadedSql = fromHash.sql;
        loadedDialect = fromHash.dialect;
        loadedBundle = fromHash.bundle;
        loadedDdl = fromHash.ddl ?? "";
        loadedFormat = { ...DEFAULT_FORMAT_OPTIONS, ...fromHash.formatOptions };
      } else {
        const saved = await loadPlayground();
        if (saved) {
          loadedSql = saved.sql;
          loadedDialect = initialDialect ?? saved.dialect;
          loadedBundle = saved.bundle;
          loadedDdl = saved.ddl;
          loadedFormat = saved.formatOptions;
        }
      }

      setSql(loadedSql);
      setDialect(loadedDialect);
      setBundle(loadedBundle);
      setDdl(loadedDdl);
      setFormatOptions(loadedFormat);
      hydrated.current = true;

      if (initialMode === "format") {
        setOutput(format(loadedSql, loadedDialect, loadedFormat));
        setShowDiff(true);
      }
      if (initialMode === "lint") {
        const lintIssues = lint(loadedSql, { dialect: loadedDialect, bundle: loadedBundle });
        const preIssues = loadedDdl.trim()
          ? preflight(loadedSql, loadedDdl, loadedDialect)
          : [];
        setIssues(mergePreflightWithLint(lintIssues, preIssues));
      }
    })();
  }, [applyShareState, initialDialect, initialMode]);

  useEffect(() => {
    const onHashChange = () => {
      const state = parseHashFromLocation(window.location.hash);
      if (state) {
        applyShareState(state);
        return;
      }
      void (async () => {
        const saved = await loadPlayground();
        if (saved) {
          applyShareState({
            sql: saved.sql,
            dialect: initialDialect ?? saved.dialect,
            bundle: saved.bundle,
            ddl: saved.ddl,
            formatOptions: saved.formatOptions,
          });
        } else {
          applyShareState({
            ...DEFAULT_SHARE,
            dialect: initialDialect ?? DEFAULT_SHARE.dialect,
          });
        }
      })();
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [applyShareState, initialDialect]);

  useEffect(() => {
    if (!hydrated.current) return;
    void savePlayground({ sql, dialect, bundle, ddl, formatOptions });
    if (skipHashSync.current) {
      skipHashSync.current = false;
      return;
    }
    syncUrlHash({ sql, dialect, bundle, ddl: ddl || undefined, formatOptions });
  }, [sql, dialect, bundle, ddl, formatOptions]);

  useEffect(() => {
    if (!hydrated.current || issuesRef.current.length === 0) return;
    refreshLint(sql, dialect, bundle, ddl);
  }, [dialect, bundle, sql, ddl, refreshLint]);

  const setSqlEditor = useCallback((value: string) => {
    setSql(value);
    if (!value.trim()) {
      setIssues([]);
      setOutput("");
      setShowDiff(false);
      return;
    }
    setIssues([]);
    setOutput("");
    setShowDiff(false);
  }, []);

  const setFormatOptionsSafe = useCallback((value: FormatOptions) => {
    setFormatOptions(value);
    setOutput("");
    setShowDiff(false);
  }, []);

  const runLint = useCallback(() => {
    const lintIssues = lint(sql, { dialect, bundle });
    const preIssues = ddl.trim() ? preflight(sql, ddl, dialect) : [];
    setIssues(mergePreflightWithLint(lintIssues, preIssues));
    setOutput("");
    setShowDiff(false);
  }, [sql, dialect, bundle, ddl]);

  const runFormat = useCallback(() => {
    const formatted = format(sql, dialect, formatOptions);
    setOutput(formatted);
    setIssues([]);
    setShowDiff(!!formatted.trim());
  }, [sql, dialect, formatOptions]);

  const runRewrite = useCallback(
    (kind: RewriteKind) => {
      if (kind === "expand-select-star" && Object.keys(schema).length === 0) {
        showToast("Paste schema DDL to expand SELECT *");
        return;
      }
      const result = rewrite(sql, kind, { dialect, schema, defaultSchema: "public" });
      if (result === sql) {
        showToast("Rewrite had no effect for this query");
        return;
      }
      setSql(result);
      const lintIssues = lint(result, { dialect, bundle });
      const preIssues = ddl.trim() ? preflight(result, ddl, dialect) : [];
      setIssues(mergePreflightWithLint(lintIssues, preIssues));
      setOutput(result);
      setShowDiff(true);
    },
    [sql, dialect, bundle, ddl, schema, showToast],
  );

  const runDetect = useCallback(() => {
    const detected = detectDialect(sql);
    setDialect(detected);
    refreshLint(sql, detected, bundle, ddl);
    showToast(`Dialect set to ${DIALECT_LABELS[detected]}`);
  }, [sql, bundle, ddl, refreshLint, showToast]);

  const applyIssueFix = useCallback(
    (issue: LintIssue) => {
      if (!issue.fix) return;
      const next = applyFix(sql, issue);
      setSql(next);
      const lintIssues = lint(next, { dialect, bundle });
      const preIssues = ddl.trim() ? preflight(next, ddl, dialect) : [];
      setIssues(mergePreflightWithLint(lintIssues, preIssues));
      setOutput("");
      setShowDiff(false);
      showToast("Fix applied");
    },
    [sql, dialect, bundle, ddl, showToast],
  );

  const share = useCallback(() => {
    const url = buildShareUrl(window.location.origin + window.location.pathname, {
      sql,
      dialect,
      bundle,
      ddl: ddl || undefined,
      formatOptions,
    });
    syncUrlHash({ sql, dialect, bundle, ddl: ddl || undefined, formatOptions });
    void navigator.clipboard.writeText(url).then(
      () => showToast("Share link copied"),
      () => showToast("Could not copy link"),
    );
  }, [sql, dialect, bundle, ddl, formatOptions, showToast]);

  const setDdlAndRefresh = useCallback(
    (value: string) => {
      setDdl(value);
      if (!sql.trim()) {
        setIssues([]);
        return;
      }
      refreshLint(sql, dialect, bundle, value);
    },
    [sql, dialect, bundle, refreshLint],
  );

  const copyPatch = useCallback(() => {
    if (!output) return;
    const patch = toUnifiedPatch(sql, output);
    void navigator.clipboard.writeText(patch).then(() => showToast("Patch copied"));
  }, [sql, output, showToast]);

  const clearHistory = useCallback(() => {
    skipHashSync.current = true;
    void clearPlayground();
    setSql(DEFAULT_SHARE.sql);
    setDialect(DEFAULT_SHARE.dialect);
    setBundle(DEFAULT_SHARE.bundle);
    setDdl("");
    setFormatOptions(DEFAULT_FORMAT_OPTIONS);
    setOutput("");
    setIssues([]);
    setShowDiff(false);
    window.history.replaceState(null, "", window.location.pathname);
    showToast("Local history cleared");
  }, [showToast]);

  const loadSample = useCallback(
    (sample: string, sampleDialect?: Dialect, sampleBundle?: RuleBundle) => {
      const d = sampleDialect ?? dialect;
      const b = sampleBundle ?? bundle;
      setSql(sample);
      if (sampleDialect) setDialect(sampleDialect);
      if (sampleBundle) setBundle(sampleBundle);
      refreshLint(sample, d, b, ddl);
      setOutput("");
      setShowDiff(false);
      showToast("Sample loaded — lint results updated");
    },
    [dialect, bundle, ddl, refreshLint, showToast],
  );

  const copySql = useCallback(() => {
    if (!output) return;
    void navigator.clipboard.writeText(output).then(() => showToast("SQL copied"));
  }, [output, showToast]);

  const diff = useMemo(() => {
    if (!showDiff || !output) return [];
    return diffLines(sql, output);
  }, [sql, output, showDiff]);

  return {
    sql,
    setSql: setSqlEditor,
    dialect,
    setDialect,
    bundle,
    setBundle,
    ddl,
    setDdl: setDdlAndRefresh,
    formatOptions,
    setFormatOptions: setFormatOptionsSafe,
    output,
    issues,
    showDiff,
    setShowDiff,
    toast,
    runLint,
    runFormat,
    runRewrite,
    runDetect,
    applyIssueFix,
    share,
    copyPatch,
    copySql,
    clearHistory,
    loadSample,
    diff,
  };
}
