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
          element={
            <SeoRoutePage
              subtitle="SQL format online — pretty-print PostgreSQL, MySQL, Snowflake and BigQuery"
              focus="format"
            />
          }
        />
        <Route
          path="sql-lint-online"
          element={
            <SeoRoutePage
              subtitle="SQL lint online — risky-query warnings and rule bundles"
              focus="lint"
            />
          }
        />
        <Route
          path="sql-pretty-print"
          element={
            <SeoRoutePage subtitle="SQL pretty print — format with preserved comments" focus="format" />
          }
        />
        <Route
          path="bigquery-formatter"
          element={
            <SeoRoutePage
              subtitle="BigQuery formatter — lint and format BigQuery SQL"
              focus="format"
              defaultDialect="bigquery"
            />
          }
        />
        <Route
          path="snowflake-formatter"
          element={
            <SeoRoutePage
              subtitle="Snowflake formatter — lint and format Snowflake SQL"
              focus="format"
              defaultDialect="snowflake"
            />
          }
        />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="terms" element={<TermsPage />} />
      </Route>
    </Routes>
  );
}
