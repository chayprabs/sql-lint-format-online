import { Outlet, useMatches } from "react-router-dom";
import { Footer } from "./Footer";
import { SeoBar } from "./SeoBar";
import { TopBar } from "./TopBar";

type RouteHandle = { seoSubtitle?: string };

export function Layout() {
  const matches = useMatches();
  const seoSubtitle = [...matches]
    .reverse()
    .map((m) => (m.handle as RouteHandle | undefined)?.seoSubtitle)
    .find(Boolean);

  return (
    <div className="flex min-h-screen flex-col">
      <TopBar />
      <SeoBar subtitle={seoSubtitle} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
