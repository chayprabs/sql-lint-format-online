import type { Dialect, RuleBundle, ShareState } from "./types.js";

function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decodeBase64Url(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = padded.length % 4 === 0 ? padded : padded + "=".repeat(4 - (padded.length % 4));
  const binary = atob(pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

function extractHashPayload(input: string): string {
  let raw = input.trim();
  if (!raw) return "";
  if (raw.includes("#")) {
    raw = raw.slice(raw.lastIndexOf("#") + 1);
  } else if (raw.startsWith("#")) {
    raw = raw.slice(1);
  }
  return raw;
}

export function encodeShareState(state: ShareState): string {
  return encodeBase64Url(JSON.stringify(state));
}

export function decodeShareState(hash: string): ShareState | null {
  try {
    const raw = extractHashPayload(hash);
    if (!raw) return null;
    const json = decodeBase64Url(raw);
    return JSON.parse(json) as ShareState;
  } catch {
    return null;
  }
}

export function buildShareUrl(baseUrl: string, state: ShareState): string {
  const encoded = encodeShareState(state);
  return `${baseUrl.replace(/#.*$/, "")}#${encoded}`;
}

export function parseHashFromLocation(locationHash: string): ShareState | null {
  return decodeShareState(locationHash);
}

export const DEFAULT_SHARE: ShareState = {
  sql: "SELECT *\nFROM users\nWHERE id = 1;",
  dialect: "postgresql" as Dialect,
  bundle: "review" as RuleBundle,
};
