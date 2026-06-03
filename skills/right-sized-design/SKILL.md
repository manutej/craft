---
name: right-sized-design
description: >-
  Fights over-engineering and premature abstraction — the #1 documented AI coding
  failure. Use when about to add a class, interface, factory, base-class, config
  layer, plugin system, generic "framework," or any abstraction; when a diff feels
  bigger than the request; or when reviewing code that has more structure than the
  problem warrants. Enforces smallest-diff-that-works, YAGNI, "no abstraction
  without 2-3 real call sites," and Ousterhout's deep-vs-shallow-module test.
  Triggers: "is this over-engineered", "simplify this", "do we need this
  abstraction", "this feels heavy", "make it production-ready" (often means
  add-robustness-not-structure).
---

# right-sized-design — match the structure to the problem

**Purpose**: stop the agent from building a cathedral for a garden shed. Over-engineering
is the single most common AI slop pattern: agents add factories, interfaces, config, and
"flexibility" no one asked for, because padding a solution *looks* thorough (Grug's FOLD —
Fear Of Looking Dumb). Real seniority is knowing what to leave out.

> The inversion to watch for: AI spends complexity on the *structure* while skipping
> robustness at the *boundaries*. This skill handles the first half; pair it with
> `craft:robustness-at-boundaries` for the second.

## Reflex card (the heuristics)

1. **Smallest diff that satisfies the request.** No unrequested features, files,
   abstractions, or config. If the spec didn't ask for it, it's scope creep.
2. **No abstraction without ≥2–3 real call sites.** One implementation behind an
   interface is Speculative Generality. Let the cut-points *emerge* from real
   duplication, then refactor. Don't factor too early.
3. **A pure helper is cheap; a framework is not.** Extracting a small function is fine
   at one call site (it aids testing/clarity). A new *interface / factory / base class /
   DI container / plugin registry* must earn its place with multiple real consumers.
4. **Deep over shallow (Ousterhout).** A good module has a *simple interface* hiding a
   *substantial implementation*. If the interface is about as complex as what it hides,
   the abstraction is shallow — delete it and inline.
5. **Beware classitis.** More, smaller classes is not automatically better. A module of
   functions or one `@dataclass`/struct often beats a hierarchy.
6. **Solve today's problem.** "We might need it later" is the most expensive sentence in
   software. Build for the present; ETC (Easier To Change) means you *can* add it later
   cheaply — so don't pre-pay.
7. **80/20.** Deliver the 80% of value with 20% of the code. Drop the speculative bells.

## Red flags (run these on your own diff)

- An `interface`/abstract base with exactly **one** implementation.
- A factory/builder/strategy where a function or a literal would do.
- A config option, feature flag, or parameter with exactly **one** value ever passed.
- "Manager / Handler / Helper / Util / Base / Abstract" classes that just hold or pass
  through (Pass-Through Method, Middle Man).
- Generics/`<T>`/`any` introduced for a single concrete type.
- A plugin/registry system for two hardcoded cases.
- New files/folders that scaffold for imagined future modules.
- A layer of indirection you can delete with no behavior change → delete it.
- The diff is 3× the size you'd expect for the request.

## The decision procedure

When tempted to add structure, ask in order:
1. **Does the request actually need this?** If not → stop.
2. **How many real call sites exist *today*?** 0–1 → inline it. 2 → maybe, only if the
   knowledge is genuinely the same. 3+ → yes, extract.
3. **Is the interface simpler than the implementation it hides?** If not → it's a
   shallow module; don't build it.
4. **Can I delete this and lose nothing?** If yes → delete it.
5. **Will this make the system easier or harder to change?** Harder → don't.

## What over-engineering is NOT (don't over-correct)

Cutting structure must not cut *robustness*. These are always justified and are **not**
over-engineering:
- Input validation at boundaries, error handling, and security checks.
- Extracting a pure function for testability.
- A value type that kills Primitive Obsession (e.g. `Money`, `Email`, `UserId`).
- Naming a magic number as a constant.
- A genuinely-needed abstraction with multiple real call sites.

The goal is **right-sized**, not minimal-at-all-costs. Simple structure, robust edges.

## Critique mode

When auditing, for each piece of structure: name it, count its real call sites, apply
the deep/shallow test, and either justify it or recommend collapse (hand the mechanics
to `refactoring-patterns`: Inline Class, Collapse Hierarchy, Remove Dead Parameter,
Remove Middle Man). Tag findings `[right-sized-design · speculative-generality · SEV]`.

## References
- Worked before/after: `examples/over-vs-right-sized.md`
- Deep/shallow modules, strategic vs tactical: `../../references/PRINCIPLES.md` §B
- Speculative Generality, Middle Man, Lazy Class: `../../references/SMELLS.md`
- Rules 1–2: `../../RULES.md`
