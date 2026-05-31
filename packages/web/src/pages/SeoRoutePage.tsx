import { useEffect } from "react";
import { Playground } from "../components/Playground";
import type { Dialect } from "@sqlguard/core";

interface SeoRoutePageProps {
  subtitle: string;
  focus?: "lint" | "format";
  defaultDialect?: Dialect;
}

export function SeoRoutePage({ subtitle, focus, defaultDialect }: SeoRoutePageProps) {
  useEffect(() => {
    document.title = subtitle.split("—")[0]?.trim() ?? "SQLGuard";
  }, [subtitle]);

  return (
    <>
      <p className="sr-only">{subtitle}</p>
      <Playground focus={focus} defaultDialect={defaultDialect} />
    </>
  );
}
