import localforage from "localforage";
import type { Dialect, FormatOptions, RuleBundle } from "@sqlguard/core";

export interface PersistedPlayground {
  sql: string;
  dialect: Dialect;
  bundle: RuleBundle;
  ddl: string;
  formatOptions: FormatOptions;
}

const STORE = localforage.createInstance({ name: "sqlguard", storeName: "playground" });
const KEY = "session";

export const DEFAULT_FORMAT_OPTIONS: FormatOptions = {
  keywordCase: "upper",
  indentStyle: "standard",
  linesBetweenQueries: 1,
};

export async function loadPlayground(): Promise<PersistedPlayground | null> {
  return (await STORE.getItem<PersistedPlayground>(KEY)) ?? null;
}

export async function savePlayground(data: PersistedPlayground): Promise<void> {
  await STORE.setItem(KEY, data);
}

export async function clearPlayground(): Promise<void> {
  await STORE.removeItem(KEY);
}
