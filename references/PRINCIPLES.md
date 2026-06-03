# PRINCIPLES — the durable-code canon, condensed

The senior-engineer wisdom behind every `craft` skill, distilled from four primary
sources. Read this when you want the *why* behind a rule. Each idea is written to
be **applied**, not admired.

---

## A. The Pragmatic Programmer (Hunt & Thomas)

- **DRY — Don't Repeat Yourself.** Every piece of *knowledge* has a single,
  authoritative representation. DRY is about knowledge, not just text: two code
  blocks that happen to look alike but encode different decisions are *not* a DRY
  violation; one rule expressed in three places *is*. Duplication is the tax you pay
  forever.
- **Orthogonality.** Components should be independent. Changing one thing shouldn't
  ripple into unrelated things. Orthogonal systems are easier to test, change, and
  reason about. Ask: "if I change X, how many other places must also change?"
- **ETC — Easier To Change** is the meta-value under all the others. Good design is
  simply design that's easier to change. When two approaches both work, pick the one
  that leaves the system more malleable.
- **Tracer Bullets.** Build a thin, working end-to-end skeleton first, then flesh it
  out. Real feedback under real conditions beats a big speculative build that's
  "almost done" for weeks.
- **Broken Windows.** Don't tolerate small decay — a bad name, a hack, a TODO left to
  rot. Tolerated rot invites more rot. Fix it now or ticket it visibly.
- **Decoupling & the Law of Demeter.** Talk only to your immediate collaborators.
  `a.getB().getC().doThing()` couples you to B's *and* C's internal structure. Tell,
  don't ask.
- **Reversibility.** Avoid one-way-door decisions. Requirements change; keep options
  open. There are no final decisions.
- **Don't outrun your headlights.** Take small, verifiable steps. Don't make decisions
  that reach far beyond what you can currently see and test. *(The most direct rebuke
  of an over-reaching agent.)*

## B. A Philosophy of Software Design (John Ousterhout) — the core text

The whole book is one claim: **complexity is the enemy, and it's manageable.**

**Complexity** = anything about a system's structure that makes it hard to understand
or modify. Two sources:
- **Dependencies** — when code can't be understood or changed in isolation.
- **Obscurity** — when important information isn't obvious.

It shows up as three symptoms: **change amplification** (a simple change touches many
places), **cognitive load** (how much you must hold in your head), and **unknown
unknowns** (you can't even tell what you'd need to change). Complexity is
*incremental* — it accrues from many small, individually-defensible decisions. That's
exactly how an AI agent accumulates it.

**Deep vs. shallow modules.** A module is code behind an interface.
- **Deep** = a *simple interface* hiding a *substantial implementation*. High value:
  it absorbs complexity so callers don't pay for it. This is the goal.
- **Shallow** = an interface nearly as complex as the implementation it hides. A red
  flag — the abstraction costs more than it saves. **"Classitis"** (the reflex that
  more, smaller classes is always better) manufactures shallow modules. *Interface
  simplicity matters more than implementation simplicity.*

**Information hiding vs. leakage.** Each module should encapsulate one design
decision. **Information leakage** = the same decision reflected in multiple modules —
change one, hunt down the rest. **Temporal decomposition** (structuring code by order
of execution instead of by knowledge) is a common cause of leakage.

**Define errors out of existence.** The best way to handle an exceptional case is to
design the API so it *can't arise*. E.g., make `unset(x)` mean "x ends up unset," so
calling it on an already-unset value is a harmless no-op, not an error. **Reduce the
number of places that must handle an error** rather than throwing and catching
everywhere. This is the antidote to both AI failure modes: swallowed errors *and*
defensive try/catch sprawl.

**Strategic vs. tactical programming.**
- *Tactical* = just make this feature/bug work now. Each shortcut adds a little
  complexity; it compounds.
- *Strategic* = treat working code as insufficient; invest continuously (~10–20% of
  effort) in good design.
- The **Tactical Tornado** is the prolific dev who ships fast and leaves a wake of
  destruction for everyone who maintains the code. **An AI agent is a Tactical Tornado
  by default.** Every `craft` rule exists to force strategic behavior.

**Comments are a design tool.** Write them as part of design, capturing what is *not*
obvious from the code — intent, rationale, units, invariants. If something is hard to
comment, the design is probably wrong. "Working code isn't enough."

**Ousterhout's red flags** — each is a self-check you can run on your own diff:
| Red flag | Meaning |
|---|---|
| Shallow Module | interface ≈ as complex as the implementation |
| Information Leakage | one design decision spread across modules |
| Temporal Decomposition | structure mirrors execution order, not knowledge |
| Overexposure | API forces callers to learn rare features for common tasks |
| Pass-Through Method | a method that just calls another with the same signature |
| Repetition | the same snippet keeps appearing (DRY echo) |
| Special-General Mixture | special-case code tangled into general-purpose code |
| Conjoined Methods | two methods you must read together to understand either |
| Comment Repeats Code | the comment adds nothing the code didn't say |
| Implementation Doc in Interface | interface docs leak implementation details |
| Vague Name | name too imprecise to convey useful information |
| Hard to Pick Name | naming difficulty signals unclear design |
| Hard to Describe | needs a long comment ⇒ the unit does too much |
| Nonobvious Code | behavior can't be understood by reading it |

## C. The Grug Brained Developer (Carson Gross)

Caveman voice, serious points. The anti-over-engineering manifesto.

- **Complexity is the demon.** "Complexity very, very bad." It's the single worst
  thing in software, and it enters through *well-meaning* developers who don't fear it.
- **"No" is the best weapon.** Refusing a feature or an abstraction *before* it enters
  is vastly cheaper than removing it later.
- **The 80/20 solution** — "80 want with 20 code." Deliver most of the value with a
  fraction of the complexity. Skip the bells the spec didn't ask for.
- **Don't factor too early.** Premature abstraction is a top complexity source. Watch
  the code; let the natural cut-points reveal themselves; *then* refactor.
- **FOLD — Fear Of Looking Dumb.** A major engine of complexity: people pad solutions
  to seem smart/thorough. AI agents simulate FOLD — they over-build to look complete.
  Resist it.
- **Tests, yes — but** favor a few integration-ish tests over a wall of mock-heavy
  unit tests. Tests buy you the courage to refactor.
- **Master your tools** (debugger, logs, editor). Most under-invest here.

## D. Supporting voices (one idea each)

- **Feathers — Working Effectively with Legacy Code.** "Legacy code is code without
  tests." Use **seams** to change behavior without editing in place, and write
  **characterization tests** to pin existing behavior *before* you refactor it.
- **The Twelve-Factor App.** Config (and secrets) live in the environment, strictly
  separated from code. Never inline an API key, a hostname, or an environment literal.
- **Bernhardt — Functional Core, Imperative Shell.** Push pure, deterministic decision
  logic into a side-effect-free core; isolate I/O at the boundary. The payoff: the
  core is testable without mocks.
- **SOLID (Martin) — used honestly.** SRP ≈ "one reason to change"; DIP/ISP ≈
  decoupling. But SOLID is routinely *invoked to justify over-engineering* — DIP/OCP
  often breed premature interfaces and indirection for flexibility never needed. Apply
  SOLID to *reduce* complexity, never to add speculative layers.
- **McConnell — Code Complete.** Managing complexity is *the* primary technical
  imperative. Practice defensive programming: validate at boundaries.
- **Kernighan & Pike — The Practice of Programming.** Prefer clear over clever. "Let
  the data structure the program." Simplicity, clarity, generality — in that order.

---

## The synthesis (what a senior actually optimizes for)

1. **Smallest-diff-that-works** — reject the unrequested.
2. **Refactor-to-consolidate, don't only add** — the refactored-vs-cloned ratio is the
   single most diagnostic quality signal.
3. **No abstraction without ≥2–3 real call sites** — let cut-points emerge.
4. **Deep modules / hide decisions** — simple interfaces over big implementations.
5. **Define errors out of existence; validate at boundaries; never swallow.**
6. **Prove it ran; no tautological tests; pin before you refactor.**
7. **Verify every dependency; never inline secrets.**
8. **Clear over clever; comments carry intent.**
9. **Distrust your own confidence — require external evidence.**
10. **Enforce mechanically, not just verbally.**
