---
applyTo: '**'
description: Validate at every trust boundary, never swallow errors, keep secrets out of source.
---

# Robustness at Boundaries

Make every trust boundary safe — where untrusted data enters and where calls fail — without scattering defensive checks through pure logic.

## Do
- Parse and validate untrusted input (API body, query param, file, env var, DB row, external response) into a known type at the edge, once.
- Inside a validated boundary, trust the type — no repeated re-validation.
- Never swallow errors: either handle meaningfully or propagate with added context.
- Design errors out of existence: `dict.get(k, default)`, empty-list iteration, `remove` as no-op — fewer places that must handle an error.
- Fail fast at startup for missing config; degrade gracefully at runtime with timeout/retry/fallback + logging.
- Include what failed, the offending value (not secrets), and next steps in error messages. Preserve cause chains (`raise ... from e`, `%w`, `{ cause }`).
- Pull secrets and env-specific values from the environment (12-Factor); validate presence at startup.
- Return an explicit `Result`/`Option` or throw rather than returning `null`/`-1`/`""` to signal failure.

## Red flags
- `try { } catch (e) {}` / `except Exception: pass` / `if err != nil {}` — error ignored.
- API handler maps request body straight to business logic with no schema check.
- `as SomeType` / `# type: ignore` / `interface{}` used to skip a real runtime check.
- A literal API key, token, password, or `https://prod-host` in source.
- `catch` that logs and continues down the happy path as if nothing failed.
- The same null-guard repeated across many callers (define the error away upstream).
- A validation library imported but the dangerous field still unchecked.
