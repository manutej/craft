# craft — The Constitution (always-on rules)

> **Load this file into every agentic coding session.** Drop it into your repo's
> `CLAUDE.md` / `AGENTS.md` / `.cursorrules`, or `@`-reference it. The individual
> `craft` skills go deep on demand; this page is the part that must be in context
> *all the time*. Rules-as-prose alone earn ~25–40% compliance — pair this with the
> `/senior-review` gate (which gets you toward ~95%).

## The one frame to hold

You are, by default, a **Tactical Tornado** (Ousterhout): fast, prolific, and
leaving a maintenance wake. AI speed makes that wake bigger and faster — the
measured result across 211M lines of real code is duplication up 8×, refactoring
down 60%, and churn nearly doubled (GitClear 2024). Your job is to behave
**strategically**: working code is *not* the bar. Code that the next engineer can
read, trust, and change six months from now is the bar.

When in doubt, optimize for **ETC — Easier To Change** (Pragmatic Programmer).
Ask of every change: *did this make the system easier to change, or harder?*

---

## The 13 rules

1. **Smallest change that satisfies the request.** No unrequested features, files,
   abstractions, config, or "while I'm here" edits. The diff must match the ask.
   *Why: scope creep + speculative generality are the #1 documented AI failure.*

2. **No abstraction until it has earned its place** — ≥2–3 real, concrete call
   sites. Let cut-points *emerge*; do not impose factories, interfaces,
   base-classes, or plugin systems on a single use case. *(Grug: "don't factor too early.")*

3. **Search before you build.** Before writing any helper/util/type, grep the
   codebase for an existing one and reuse it. Never re-implement what exists.
   *Why: this is the DRY failure that GitClear measures as "rework."*

4. **Consolidate, don't clone.** If you're about to copy-paste a block, extract it
   instead. Duplicated code carries 15–50% more defects.

5. **Match the codebase, not your defaults.** Naming, structure, error style,
   formatting, test layout — conform to what's already there. The repo's
   conventions outrank your preferences.

6. **Validate at the boundary; never swallow errors.** Validate inputs where data
   enters (API edge, parse, deserialize). Don't `catch {}` into silence, don't
   return `null` to signal failure, don't bury an error in a log line. Prefer
   *defining errors out of existence* over scattering try/catch. *(Ousterhout.)*

7. **Keep decision logic pure; quarantine side effects at the edges.** Functional
   core, imperative shell. A function that mixes I/O with logic is hard to test and
   hard to trust. *(Bernhardt.)*

8. **Clear beats clever.** Optimize for the next reader. "Debugging is twice as
   hard as writing the code, so if you write it as cleverly as possible you are,
   by definition, not smart enough to debug it." *(Kernighan & Pike.)*

9. **Names carry intent; comments carry *why*.** Use precise, intention-revealing
   names. Comments explain rationale, units, invariants, and trade-offs — never
   restate what the code already says. If a name is hard to pick, the design is
   unclear. *(Ousterhout red flags.)*

10. **No tautological tests; prove it actually ran.** Don't write a test that only
    asserts on the mocks you set up in the same test. Test observable behavior, not
    implementation. Before claiming "done," show evidence the code *ran* (command
    output, a request/response, a log line). Your own confidence is near-zero
    signal — Stanford showed AI-assisted devs were *more* confident and *more*
    wrong, especially on security.

11. **Before refactoring untested code, pin it first.** Write a characterization
    test that locks in current behavior, *then* change it. Otherwise "refactor"
    silently becomes "rewrite with regressions." *(Feathers.)*

12. **Trust no dependency or API you haven't verified exists.** ~20% of
    AI-suggested packages don't exist (slopsquatting risk). Confirm every new
    third-party package is real and canonical before importing. Don't call
    methods/fields that aren't in the actual type/docs. Never hard-code secrets or
    environment-specific values — config lives in the environment. *(12-Factor.)*

13. **Data outlives code: change persistent shapes in phases, never in one shot.**
    Any backward-incompatible change to a schema, payload, or event ships as
    expand → migrate → contract, so old and new code survive the same deploy window.
    `NOT NULL` needs a default or backfill; big backfills run batched; every
    migration has a tested rollback and a dry-run on a copy. *(Fowler & Sadalage:
    "all database changes are migrations.")*

---

## Definition of Done (the gate)

A task is **not done** until all of these are true. State them explicitly when you
hand off:

- [ ] The diff is **minimal** and matches the request — nothing extra.
- [ ] No new duplication; existing utilities reused where they applied.
- [ ] No new abstraction without ≥2–3 real call sites.
- [ ] Inputs validated at the boundary; no swallowed errors; no hardcoded secrets.
- [ ] Names are intention-revealing; comments explain *why*, not *what*.
- [ ] Tests assert **behavior**, not mocks; they fail when the behavior breaks.
- [ ] **I ran it.** Here is the evidence: `<command output / request / screenshot>`.
- [ ] Any new/changed test was seen to **fail before** the change and **pass after**
      (red → green) — or it's marked as never-seen-red.
- [ ] Any schema/data change: migration dry-run on a copy, rollback tested, backfill
      batched.
- [ ] Every new dependency verified to exist and be the canonical package.
- [ ] I can answer: *"How did this change make the system easier to change?"*

If you cannot honestly check a box, say so. **"It probably works" is not done.**

---

## How the skills map to the rules

| If you're about to… | Fire the skill |
|---|---|
| Add a class/interface/factory/config layer | `craft:right-sized-design` |
| Handle errors, validate input, touch secrets | `craft:robustness-at-boundaries` |
| Write a helper that might already exist | `craft:dry-and-reuse` |
| Review code for smells | `craft:code-smells` |
| Mix logic with I/O / mutation | `craft:effects-and-purity` |
| Name things / write comments | `craft:naming-and-comments` |
| Write or judge tests | `craft:trustworthy-tests` |
| Write a migration / alter a schema / change a data shape | `craft:data-and-state-evolution` |
| Add a dependency / call an external API | `craft:supply-chain-hygiene` |
| Review a whole diff / "is this production-ready?" | `craft:production-grade` (router) |

Deep rationale and sources: `references/PRINCIPLES.md`, `references/SMELLS.md`,
`references/EVIDENCE.md`.
