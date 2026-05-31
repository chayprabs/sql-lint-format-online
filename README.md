# SQLGuard

**Lint, format and rewrite SQL online** across PostgreSQL, MySQL, Snowflake, BigQuery, and more — with risky-query warnings and safe rewrites. Everything runs in your browser; your SQL never leaves the page.

[![CI](https://github.com/chayprabs/sql-lint-format-online/actions/workflows/ci.yml/badge.svg)](https://github.com/chayprabs/sql-lint-format-online/actions/workflows/ci.yml)

- [Contributing](CONTRIBUTING.md) · [Security](SECURITY.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Changelog](CHANGELOG.md)

## Features

- **9 dialects** — PostgreSQL, MySQL, SQLite, MS SQL Server, Snowflake, BigQuery, Redshift, DuckDB, Oracle
- **Lint** — rule bundles (review / strict / BigQuery), severity levels, one-click fixes where available
- **Format** — keyword case, indentation, comment preservation via sql-formatter
- **Safe rewrites** — expand `SELECT *`, qualify tables, extract CTE, anti-join → `NOT EXISTS`, implicit → explicit JOIN
- **Risky-query warnings** — missing `WHERE` on `UPDATE`/`DELETE`, cartesian joins, `= NULL` mistakes, full-scan hints
- **Schema preflight** — paste DDL to validate column references and basic type checks
- **Patch view** — diff toggle and copy-as-patch
- **Share** — URL hash encodes SQL, dialect, and rule bundle

## Quick start

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173

## Production build

```bash
pnpm build
pnpm --filter @sqlguard/web preview
```

## Docker

```bash
docker compose up --build
```

App: http://localhost:8080

## Project structure

```
packages/
  core/   # Parse, lint, format, rewrite, preflight (TypeScript)
  web/    # Vite + React playground
```

## Self-host

Build static assets with `pnpm build` and serve `packages/web/dist` with any static host (Cloudflare Pages, nginx, S3, etc.). SPA routes require fallback to `index.html`.

## SEO landing pages

- `/sql-format-online`
- `/sql-lint-online`
- `/sql-pretty-print`
- `/bigquery-formatter`
- `/snowflake-formatter`

## License

MIT — see [LICENSE](LICENSE).

## Author

[Chaitanya Prabuddha](https://www.chaitanyaprabuddha.com) · [GitHub](https://github.com/chayprabs/sql-lint-format-online) · [@chayprabs](https://x.com/chayprabs)
