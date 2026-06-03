---
name: robustness-at-boundaries
description: >-
  The robustness the AI skips. Use whenever code reads untrusted input (API request,
  user input, file, env, parsed JSON, DB row, external response), handles errors, or
  touches secrets/config. Enforces validate-at-the-edge, never-swallow-errors,
  define-errors-out-of-existence, no-hardcoded-secrets, and meaningful error
  contracts. Counters the #1 AI omission: agents over-build structure but skip input
  validation and error handling exactly where production breaks. Triggers: "add
  error handling", "validate this input", "handle the edge cases", "is this safe",
  "production hardening", any try/catch, any parse/deserialize, any API handler.
---

# robustness-at-boundaries — make the edges safe, keep the core simple

**Purpose**: install the robustness an AI agent reliably forgets. Agents pour
complexity into internal structure while leaving the *boundaries* — where untrusted data
enters and where things actually fail — unguarded. Stanford measured the result: AI
users wrote *more* security bugs and were *more* confident they hadn't. This skill makes
the edges trustworthy without turning the core into defensive sludge.

> Pair with `craft:right-sized-design`: that one stops complexity in the structure;
> this one *adds* the safety at the seams. They are the two halves of "production-ready."

## Reflex card (the heuristics)

1. **Validate where data enters, once.** At every trust boundary — API edge, request
   body, query param, parsed file/JSON, env var, external API response, DB row mapped to
   a type — validate and *parse into a known shape*. Inside that boundary, trust the
   type. Don't re-validate everywhere (that's defensive sludge); don't validate nowhere
   (that's the AI default).
2. **Never swallow errors.** No empty `catch {}`, no bare `except: pass`, no `_ = err`,
   no error buried in a log line and execution continuing as if nothing happened. Either
   handle it meaningfully or let it propagate *with context added*.
3. **Define errors out of existence (Ousterhout).** The best exception is the one that
   can't occur. Design APIs so edge cases are normal cases: return an empty list instead
   of null, make `remove` on a missing key a no-op, use a default. Reduce the *number of
   places* that must handle an error rather than scattering try/catch.
4. **Fail fast and loud at startup; degrade gracefully at runtime.** Missing config →
   crash on boot with a clear message, not a `NullPointerException` an hour into
   production. A flaky downstream call → timeout, retry-with-backoff, or fall back — but
   *log it*, don't pretend it succeeded.
5. **Error messages are for humans.** Include what failed, the offending value (not
   secrets), and ideally what to do. Preserve the cause chain (`raise ... from e`,
   `%w`, `{ cause }`). A bare "Error" or a raw stack to the user is a non-answer.
6. **Secrets and env-specific values never live in source.** No inlined API keys,
   tokens, passwords, or hostnames. Config comes from the environment (12-Factor).
   Validate that required secrets exist at boundary/startup.
7. **Don't return `null`/`None` to signal failure** where it will silently propagate.
   Throw, or return an explicit `Result`/`Option`. Silent nulls become
   `undefined is not a function` three files away.

## Red flags

- `try { ... } catch (e) {}` / `except Exception: pass` / `if err != nil {}` (ignored).
- A handler that maps a request body straight into business logic with no schema check.
- `as SomeType` / `# type: ignore` / `interface{}` used to skip a real runtime check.
- A literal secret, key, password, or `https://prod-host...` in source.
- `catch` that logs and then *continues* down the happy path.
- Returning `null`/`-1`/`""` to mean "it failed."
- The same null-guard repeated in twenty callers (you should have defined the error out
  of existence upstream instead).
- A validation library imported but the dangerous field still untyped/unchecked.

## The procedure

1. **Map the boundaries** of the change: where does untrusted data enter? where can a
   call fail?
2. **At each entry boundary:** parse-and-validate into a known type (zod/pydantic/
   explicit guard). Reject early with a precise error.
3. **At each failure point:** decide handle-here vs. propagate-with-context. Never
   silence. Prefer designing the failure away.
4. **For config/secrets:** pull from env, validate presence at startup, fail fast.
5. **Keep the interior clean:** once past the boundary, code trusts its types — no
   defensive checks scattered through pure logic (that's `craft:right-sized-design`
   territory — robustness at the edge, simplicity in the core).

## Anti-over-correction

Robustness ≠ defensive paranoia. Don't:
- Re-validate the same value at every layer (validate once at the boundary).
- Wrap every line in try/catch (handle at the level that can actually do something).
- Catch-and-rethrow with no added context (pointless noise).
Validation belongs at the boundary; the core stays simple and trusts its types.

## Critique mode

For each boundary in the diff: is input validated? are errors handled or meaningfully
propagated? any swallowed error, silent null, or hardcoded secret? Tag findings
`[robustness-at-boundaries · swallowed-error|missing-validation|hardcoded-secret · SEV]`.
Swallowed errors and missing validation on untrusted input are **HIGH** by default.

## References
- Worked before/after: `examples/swallowed-vs-handled.md`
- Define errors out of existence: `../../references/PRINCIPLES.md` §B
- Language specifics: `../../references/lang/{python,typescript,go}.md`
- Rules 6 & 12: `../../RULES.md`
