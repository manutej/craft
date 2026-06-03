---
applyTo: '**'
description: Isolate decision logic from I/O so it's testable — without demanding purity or banning mutation.
---

# Effects and Purity

Functional core, imperative shell (Bernhardt): pure functions hold the logic; a thin shell does the I/O. The goal is testability, not academic purity.

## Do
- Keep decision logic in plain functions that take inputs and return outputs — no reads, no writes, no clock, no randomness inside.
- Push DB, network, filesystem, clock, and RNG to a thin shell that calls into the pure core.
- Inject `now`, HTTP clients, and RNG as parameters rather than calling them inline.
- Return new values instead of mutating caller-owned data unless mutation is the documented contract.
- Verify the core is testable: if `assert decide(inputs) == expected` needs no mocks, the boundary is right.
- One or two mocks for true external boundaries is fine; five mocks to test a calculation is the smell.

## Red flags
- A function that both computes a result and writes to DB/logs/network in the same body.
- `datetime.now()`, `Date.now()`, `Math.random()`, `fetch()` called inline inside business logic.
- A "pure-looking" function that mutates a global or its argument as a hidden side channel.
- Python mutable default argument: `def f(x, acc=[])` — shares state across calls; use `acc=None`.
- A unit test that spins up five mocks to test a calculation — the logic wasn't extracted from the I/O.
- Hidden state across calls: same inputs, different outputs on the second call.
- Introducing `Result`/`Either` monads, `IO` wrappers, or effect-system machinery where injecting a dependency parameter suffices — clear beats clever.
- Refusing reasonable mutation of locally-owned data in the name of purity.
