import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { SeoRoutePage } from "./pages/SeoRoutePage";
import { TermsPage } from "./pages/TermsPage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route
          path="sql-format-online"
          element={<SeoRoutePage focus="format" />}
          handle={{
            seoSubtitle:
              "SQL format online — pretty-print PostgreSQL, MySQL, Snowflake and BigQuery",
          }}
        />
        <Route
          path="sql-lint-online"
          element={<SeoRoutePage focus="lint" />}
          handle={{
            seoSubtitle: "SQL lint online — risky-query warnings and rule bundles",
          }}
        />
        <Route
          path="sql-pretty-print"
          element={<SeoRoutePage focus="format" />}
          handle={{ seoSubtitle: "SQL pretty print — format with preserved comments" }}
        />
        <Route
          path="bigquery-formatter"
          element={<SeoRoutePage focus="format" defaultDialect="bigquery" />}
          handle={{ seoSubtitle: "BigQuery formatter — lint and format BigQuery SQL" }}
        />
        <Route
          path="snowflake-formatter"
          element={<SeoRoutePage focus="format" defaultDialect="snowflake" />}
          handle={{ seoSubtitle: "Snowflake formatter — lint and format Snowflake SQL" }}
        />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
    </Routes>
  );
}
