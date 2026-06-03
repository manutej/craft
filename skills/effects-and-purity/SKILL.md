---
name: effects-and-purity
description: >-
  Separates pure decision logic from I/O so code is testable without heavy mocks
  — without demanding religious purity. Use when a function both computes and
  writes to a DB, network, or log; when datetime.now()/random()/fetch() are
  called inline inside business logic; when a unit test needs five mocks to run;
  when reviewing code that tangles "what to do" with "do it." Triggers: "this is
  hard to test," "I need to mock the clock," "how do I test this without a DB,"
  "pure function," "side effects," "functional core," "inject the dependency."
  NOT a trigger for: making everything pure, banning mutation, or wrapping
  simple code in monads.
---

# effects-and-purity — isolate decisions from I/O; don't ban side effects

**Purpose**: write code where the decision logic can be tested instantly, in
isolation, with no infrastructure — not by eliminating side effects, but by
moving them to the edges. Bernhardt's **Functional Core, Imperative Shell**:
pure functions hold the logic; a thin shell does the I/O. The payoff is
testability, not academic purity.

There are two failure modes, both harmful. (a) Logic tangled with I/O — nothing
is testable without mocking a database, a clock, or a network call. (b)
Over-correction — purity dogma, IO monads, `Result`-chaining, or refusing
reasonable mutation, which is its own FOLD (Fear Of Looking Dumb in Haskell).
This skill addresses (a) without inducing (b). When you feel the pull toward
(b), stop and apply `craft:right-sized-design` instead.

> Side effects are necessary and fine. The skill is about **where** they live,
> not whether they exist.

## Reflex card (the heuristics)

1. **Keep decision logic pure and deterministic.** A function that takes inputs
   and returns outputs — no reads, no writes, no time, no randomness — is
   testable with a single call and an `assertEqual`. That's the goal for the
   *logic* layer.
2. **Push I/O to the edges.** DB reads/writes, network calls, filesystem, the
   clock, randomness, environment variables — these belong in a thin shell that
   calls into the pure core, not scattered through it.
3. **Inject the clock, RNG, and clients; don't call them inline.** Pass `now`
   as a parameter. Pass the HTTP client as a dependency. This is what makes the
   core testable without patching globals or using `freezegun`/`jest.useFakeTimers`.
4. **Don't mutate caller-owned data.** Return new values unless mutation is the
   documented contract. Hidden mutation is how "pure-looking" functions become
   time bombs.
5. **A pure core needs no mocks to test.** If you're still reaching for five
   mocks after extraction, the boundary is in the wrong place.
6. **The mock-count tell.** One or two mocks for true boundaries (network,
   external service) is fine. Five mocks to test a calculation is the smell.

## Red flags (run these on your own diff)

- A function that both **computes a result** and **writes to DB / logs /
  network** in the same body.
- `datetime.now()`, `random()`, `Date.now()`, `Math.random()`, `fetch()`
  called inline inside business logic — the function is now nondeterministic
  and untestable without patching.
- A "pure-looking" function that mutates a global or its argument as a secret
  side channel.
- **Mutable default argument** (Python): `def f(x, acc=[])` — shares state
  across calls silently. Use `acc=None` then `acc = acc or []`.
- A unit test that spins up five mocks to test a calculation — the logic wasn't
  extracted from the I/O.
- Hidden state across calls: anything that behaves differently on the second
  call than the first for the same inputs.

## The procedure

1. **Identify the decision** — what is the function actually computing or
   deciding? Write that in one sentence.
2. **Identify the I/O** — what does it read from / write to? (DB, clock,
   network, filesystem, env, RNG.)
3. **Extract the decision into a pure function.** It takes the data it needs as
   parameters (including any values previously fetched inline) and returns a
   result. No I/O inside.
4. **Inject effectful dependencies.** If the decision needs `now`, pass it in.
   If it needs a computed value from an API call, fetch it in the shell and pass
   the value down.
5. **Leave a thin shell** that does the I/O: fetch inputs, call the pure core,
   write outputs. The shell is boring by design.
6. **Verify the core is testable without mocks.** If you can write
   `assert decide(inputs) == expected` with no patching, the boundary is right.

## Before / after

```python
# BEFORE — logic + I/O tangled; nondeterministic; untestable without freezegun + DB mock
def maybe_expire_subscription(user_id: str) -> None:
    user = db.get_user(user_id)                 # I/O
    if datetime.now() > user.trial_ends_at:     # nondeterministic
        user.status = "expired"
        db.save_user(user)                      # I/O
        analytics.track("trial_expired", user_id)  # I/O

# AFTER — pure core + thin shell
def is_trial_expired(trial_ends_at: datetime, now: datetime) -> bool:
    return now > trial_ends_at                  # pure; trivially testable

def maybe_expire_subscription(user_id: str, now: datetime) -> None:  # shell
    user = db.get_user(user_id)
    if is_trial_expired(user.trial_ends_at, now):
        user.status = "expired"
        db.save_user(user)
        analytics.track("trial_expired", user_id)

# Unit test: no mocks needed
assert is_trial_expired(trial_ends_at=t0, now=t0 + timedelta(days=1)) is True
assert is_trial_expired(trial_ends_at=t0, now=t0 - timedelta(days=1)) is False
```

The shell still has I/O — that's correct. The *decision* is now a one-liner
that anyone can test in 100ms with no infrastructure.

## Anti-over-correction

Don't introduce `Result`/`Either` monads, `IO` wrappers, or effect-system
machinery where injecting a dependency suffices. Don't refuse reasonable
mutation of locally-owned data. Don't make the code harder to read in the
name of purity — **clear beats clever** (RULES §8). If the "pure" version
requires three new types and a bind chain to avoid one `datetime.now()` call,
you've traded one complexity for another. A function parameter is enough.

The right question is: *"Can I test the decision without standing up
infrastructure?"* If yes, stop there.

## Critique mode

When auditing, for each function with both logic and I/O: name what it computes,
name what it reads/writes, and judge whether the decision layer is extractable.
Tag findings `[effects-and-purity · tangled-io · SEV]` for logic mixed with I/O,
`[effects-and-purity · inline-nondeterminism · SEV]` for clock/RNG/env called
inline, `[effects-and-purity · hidden-mutation · SEV]` for secret argument
mutation, and `[effects-and-purity · mock-sprawl · SEV]` when a unit test
needs more than two mocks to exercise a calculation. Resist tagging the absence
of a monad as a finding — that's not a defect.

## References

- Functional core, imperative shell (Bernhardt): `../../references/PRINCIPLES.md` §D
- Python purity and mutable-default pitfalls: `../../references/lang/python.md`
- TypeScript: inject `Date.now`/`fetch`; don't mutate props: `../../references/lang/typescript.md`
- Go: `../../references/lang/go.md`
- Rule 7 (keep decision logic pure; quarantine effects at edges): `../../RULES.md`
- Over-engineering the solution: `../../skills/right-sized-design/SKILL.md`
