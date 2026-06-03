---
applyTo: '**'
description: Tests must be able to fail for the right reason; done requires run evidence.
---

# Trustworthy Tests

A test you cannot imagine failing is not a test. Before accepting any test ask: *"What real bug makes this go red?"*

## Do
- Assert on observable behavior (return values, visible state) — not on which private methods were called.
- Mock only true boundaries: network, clock, randomness, third-party services. Call your own pure logic for real.
- Cover the empty input, boundary value, error path, and malformed payload — not just the happy path.
- Write a characterization test that locks current behavior before refactoring untested code.
- Show run evidence before claiming done: paste test output, curl response, or log line. "It should work" is not done.
- If you cannot imagine the test failing, delete or rewrite it.

## Red flags
- All assertions reference mocks/spies; no real return value or state is checked.
- `assert result is not None` / `expect(x).toBeDefined()` as the lone assertion.
- Tests that mirror the implementation branch-for-branch — they pass for a buggy rewrite that keeps the shape.
- 100% line coverage with zero edge cases tested.
- A "done" / "production-ready" claim with no command output or run evidence.
- Refactor of previously-untested code with no characterization test added first.
- Snapshot tests blindly regenerated on every change.
