import { useEffect } from "react";
import { useMatches } from "react-router-dom";
import { Playground } from "../components/Playground";
import type { Dialect } from "@sqlguard/core";

interface SeoRoutePageProps {
  focus?: "lint" | "format";
  defaultDialect?: Dialect;
}

type RouteHandle = { seoSubtitle?: string };

export function SeoRoutePage({ focus, defaultDialect }: SeoRoutePageProps) {
  const matches = useMatches();
  const subtitle = [...matches]
    .reverse()
    .map((m) => (m.handle as RouteHandle | undefined)?.seoSubtitle)
    .find(Boolean);

  useEffect(() => {
    const title = subtitle?.split("—")[0]?.trim() ?? "SQLGuard";
    document.title = `${title} | SQLGuard`;
  }, [subtitle]);

  return <Playground focus={focus} defaultDialect={defaultDialect} />;
}
