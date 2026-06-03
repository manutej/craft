---
applyTo: '**/*.{ts,tsx,js,jsx,mjs,cjs}'
description: TypeScript/JavaScript-specific craft tells — validation, purity, smells, tests, and supply chain.
---

# TypeScript / JavaScript Craft

Apply universal craft rules; these are the TS/JS-specific tells and idioms.

## Do
- Validate untrusted input at the edge with **zod** or **valibot** and infer types from the schema; never `as SomeType` past a real runtime check.
- Handle every rejected promise — every `await` on a path that can throw needs an owner.
- Enable `strictNullChecks`; model absence explicitly rather than propagating `null`/`undefined`.
- Inject `Date.now`, `fetch`, and `crypto` as dependencies rather than calling them inline inside business logic.
- Return new values with `map`/`filter`/spread; don't mutate props, state, or shared objects in place.
- Resist premature `interface` + DI containers for a single implementation — a function and a type alias usually suffice.
- Use `unknown` + narrowing instead of `any`; a wall of `as any` is validation that was skipped.
- Check `Array`, `Object`, `structuredClone`, and `Intl` before adding a utility library.
- Test with Vitest/Jest + Testing Library; assert on behavior the user observes, not internal call counts.
- Verify npm packages on npmjs.com (check weekly downloads, watch typosquats); pin versions and commit the lockfile.
- Secrets via `process.env` + a vault — never literals, never committed `.env`.

## Red flags
- Empty `catch {}` or a promise chain with no `.catch` / `try/await` owner.
- `as SomeType` used to skip a runtime check.
- `Date.now()` or `Math.random()` called inline inside business logic.
- `any` — especially a wall of `any` casts to silence the compiler.
- Props or shared state mutated in place inside a component or handler.
- `expect(mockFn).toHaveBeenCalled()` as the only test assertion.
- An npm package name the AI produced that hasn't been verified on npmjs.com.
- ~20% of AI-suggested npm packages may not exist — always verify before `npm install`.
