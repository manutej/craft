---
name: trustworthy-tests
description: >-
  Makes tests prove something and makes "done" mean done. Use when writing tests,
  judging existing tests, or before claiming a task is complete/production-ready.
  Catches tautological tests (asserting on their own mocks), tests that mirror the
  implementation, fake green CI, and the agent's habit of declaring victory without
  ever running the code. Enforces test-observable-behavior, the verification-before-
  done evidence gate, and characterization-tests-before-refactoring-untested-code.
  Triggers: "write tests for this", "are these tests any good", "is this done", "is
  it production-ready", "add coverage", before any "done"/handoff claim.
---

# trustworthy-tests — a test must be able to fail for the right reason

**Purpose**: AI agents produce *green* test suites that prove nothing — tests that assert
on the mocks they just set up, mirror the implementation line for line, and pass while
the actual feature is broken because the agent never ran it. And they declare "done /
production-ready" on confidence alone, which Stanford showed is *inversely* correlated
with correctness. This skill makes tests load-bearing and makes "done" require evidence.

> This is discipline, not mechanics. For the *how* of writing tests use the existing
> `test-coverage-analyzer`, `pytest-patterns`, `jest-react-testing`. This skill decides
> whether a test is *worth* anything and whether the work is actually finished.

## The cardinal rule

**A test you can't imagine failing is not a test.** Before accepting any test, ask:
*"What real bug would make this go red?"* If the only answer is "if my mock changes," it
tests nothing.

## Reflex card

1. **Test observable behavior, not implementation.** Assert on what the function returns
   or the state the user can see — not on which private methods got called in what order.
   Implementation-mirroring tests break on every refactor and catch no real bugs.
2. **No tautological tests.** A test whose only assertion is `mock.assert_called()` /
   `expect(spy).toHaveBeenCalled()` — with no check on the actual result — is theater.
   Mock the *boundary*, assert on the *outcome*.
3. **Mock only true boundaries.** Network, clock, randomness, third-party services. Don't
   mock the thing under test, and don't mock your own pure logic — call it for real
   (cheaper and more honest). Over-mocking is how green-but-meaningless suites happen.
4. **Cover the edges, not just the happy path.** The empty input, the boundary value, the
   error path, the malformed payload. The happy path is what already works in the demo;
   the edges are where production breaks.
5. **Prove it ran (the evidence gate).** Before saying "done," actually execute the code
   end-to-end and show the evidence: the test output, the curl request/response, the log
   line, the screenshot. "It should work" / "this is production-ready" without evidence is
   not done. Your confidence is near-zero signal.
6. **Pin before you refactor untested code (Feathers).** If you're about to change code
   with no tests, first write a **characterization test** that locks in its *current*
   behavior. Then refactor. Otherwise "refactor" silently becomes "rewrite with
   regressions" and nobody notices until prod.

## Red flags

- A test whose assertions all reference mocks/spies, never a real return value or state.
- One assertion per test that's just `assert result is not None` / `expect(x).toBeDefined()`.
- Tests that re-state the implementation (same branches, same order) — they'll pass for a
  buggy rewrite that keeps the shape.
- 100% "coverage" with no edge cases — coverage measures lines executed, not behavior
  verified.
- A "done" / "production-ready" claim with no command output or run evidence anywhere.
- Refactor of previously-untested code with no characterization test added first.
- Snapshot tests blindly regenerated on every change (rubber-stamping, not testing).

## The Definition-of-Done evidence gate

A task is done only when you can paste evidence it *ran*:
```
✅ Done. Evidence:
$ pytest tests/test_checkout.py -q
... 14 passed in 0.4s
$ curl -s localhost:8000/checkout -d '{"cart":...}' | jq .status
"confirmed"
```
No evidence → say "implemented but unverified," not "done." Honesty about an unverified
state beats a false "production-ready."

## Inline example

```typescript
// ❌ Tautological — passes even if applyDiscount returns garbage
it("applies discount", () => {
  const spy = vi.spyOn(pricing, "applyDiscount");
  checkout(cart, "SAVE10");
  expect(spy).toHaveBeenCalled();           // proves only that we called it
});

// ✅ Tests the behavior a user cares about
it("takes 10% off the cart total", () => {
  const result = checkout({ total: 200 }, "SAVE10");
  expect(result.total).toBe(180);           // fails if the math is wrong
});
it("rejects an unknown code", () => {
  expect(() => checkout({ total: 200 }, "NOPE")).toThrow(/unknown code/i);
});
```

## Critique mode

For each test: what real bug makes it fail? If "none," flag it. Check for mock-only
assertions, implementation-mirroring, missing edge cases, and — for the change as a whole
— whether there's evidence it actually ran. Tag `[trustworthy-tests · tautological-test|
no-edge-cases|unverified-done|no-characterization-test · SEV]`.

## References
- Characterization tests / seams: `../../references/PRINCIPLES.md` §D (Feathers)
- The false-confidence data: `../../references/EVIDENCE.md`
- Rules 10 & 11 + Definition of Done: `../../RULES.md`
