# Contributing to SQLGuard

Thank you for your interest in contributing.

## Development setup

```bash
pnpm install
pnpm dev        # starts packages/web on http://localhost:5173
pnpm test       # unit tests
pnpm test:e2e   # Playwright e2e
pnpm build
```

## Pull requests

1. Fork and create a branch from `main`.
2. Keep changes focused; match existing code style.
3. Add or update tests for behavior changes.
4. Ensure `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` pass.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `chore:`, `docs:`, `test:`.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
