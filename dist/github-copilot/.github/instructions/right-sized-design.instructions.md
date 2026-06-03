---
applyTo: '**'
description: Match structure to the problem — no unrequested abstractions, factories, or generality.
---

# Right-Sized Design

Produce the smallest diff that satisfies the request. No unrequested features, files, abstractions, or config.

## Do
- Write the smallest diff that satisfies the request; treat scope creep as a bug.
- Require ≥2–3 real call sites before extracting an interface, base class, factory, or registry.
- Prefer a plain function or `@dataclass`/struct over a class hierarchy.
- Apply Ousterhout's test: if the interface is as complex as what it hides, inline it.
- Solve today's problem; defer generality until real demand appears.
- Extract a pure helper for testability/clarity even at one call site — that's fine.
- Name magic numbers as constants; use value types (`Money`, `Email`) to kill Primitive Obsession.

## Red flags
- An `interface`/abstract base with exactly one implementation.
- A factory, builder, or strategy where a function literal would do.
- A config option or feature flag passed only one value ever.
- Classes named `Manager / Handler / Helper / Util / Base / Abstract` that just pass through.
- Generics or `<T>` introduced for a single concrete type.
- A plugin/registry wiring exactly two hardcoded cases.
- New files scaffolding imagined future modules.
- A layer of indirection that can be deleted with no behavior change.
- The diff is 3× larger than the request warrants.
