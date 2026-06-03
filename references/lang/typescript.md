# Language addendum — TypeScript / JavaScript

Apply the universal `craft` rules; these are the TS/JS-specific tells and idioms.

## Boundary validation & errors
- Validate untrusted input at the edge with **zod** / **valibot** (or explicit guards)
  and infer types from the schema — don't `as SomeType` your way past validation.
  `as` is a lie to the compiler; a runtime check is the truth.
- No empty `catch {}`. Catch, add context, rethrow — or handle meaningfully. Don't
  swallow a rejected promise (every `await` in a path that can throw needs an owner).
- Avoid returning `null`/`undefined` to signal failure where a `Result`/throwing API is
  clearer. Model absence explicitly; enable `strictNullChecks`.

## Purity & side effects
- Functional core, imperative shell: keep React components/handlers thin; push logic
  into pure functions. Inject `Date.now`/`fetch`/`crypto` rather than calling inline.
- Don't mutate props, state, or shared objects in place — return new values
  (`map`/`filter`/spread). Hidden mutation is the top React bug source.

## Smells & over-engineering
- Resist premature `interface` + DI containers + barrel-of-factories for one
  implementation. A function and a type alias usually suffice.
- `any` is a smell; `unknown` + narrowing is the honest version. A wall of `as any` is
  validation that was skipped.
- Reuse before rebuild: check `lodash-es`/stdlib (`Array`, `Object`, `structuredClone`,
  `Intl`) before hand-rolling.

## Tests
- Vitest/Jest + Testing Library. Test **behavior the user observes**, not internal
  calls. A test whose only assertion is `expect(mockFn).toHaveBeenCalled()` proves
  nothing about correctness.
- Prefer real modules; mock only true boundaries (network, time).

## Supply chain
- ~20% of AI-suggested npm packages may not exist. Verify on npmjs.com, check weekly
  downloads/maintenance, watch for typosquats (`crossenv` vs `cross-env`). Pin
  versions; commit the lockfile.
- Secrets via env (`process.env`) + a vault — never literals, never committed `.env`.
