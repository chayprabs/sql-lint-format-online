import { createBrowserRouter } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SeoRoutePage } from "./pages/SeoRoutePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { TermsPage } from "./pages/TermsPage";

export const router = createBrowserRouter(
  [
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "sql-format-online",
        element: <SeoRoutePage focus="format" />,
        handle: {
          seoSubtitle:
            "SQL format online — pretty-print PostgreSQL, MySQL, Snowflake and BigQuery",
        },
      },
      {
        path: "sql-lint-online",
        element: <SeoRoutePage focus="lint" />,
        handle: { seoSubtitle: "SQL lint online — risky-query warnings and rule bundles" },
      },
      {
        path: "sql-pretty-print",
        element: <SeoRoutePage focus="format" />,
        handle: { seoSubtitle: "SQL pretty print — format with preserved comments" },
      },
      {
        path: "bigquery-formatter",
        element: <SeoRoutePage focus="format" defaultDialect="bigquery" />,
        handle: { seoSubtitle: "BigQuery formatter — lint and format BigQuery SQL" },
      },
      {
        path: "snowflake-formatter",
        element: <SeoRoutePage focus="format" defaultDialect="snowflake" />,
        handle: { seoSubtitle: "Snowflake formatter — lint and format Snowflake SQL" },
      },
      { path: "privacy", element: <PrivacyPage /> },
      { path: "terms", element: <TermsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  ],
  { basename: import.meta.env.BASE_URL },
);
