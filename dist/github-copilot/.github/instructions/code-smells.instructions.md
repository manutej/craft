---
applyTo: '**'
description: Name the smell, state the change-cost, prioritize by damage — don't gate on cosmetics.
---

# Code Smells

A smell is a surface symptom of a change-cost problem. Scan diffs for the two AI-signature smells first: Duplicate Code and Speculative Generality.

## Do
- Cite smells by `file:line` — "Long Method at `order_service.py:87`" is actionable; "messy code" is not.
- State why the smell raises the cost of the *next* change, not just that it exists.
- Rank by damage: Change Preventers (Shotgun Surgery, Divergent Change) > Duplicate Code + Speculative Generality > Bloaters > Couplers > cosmetics.
- Gate merges on HIGH findings; note cosmetics, don't block on them.
- Treat a smell as a prompt to investigate, not an automatic defect — sometimes the smelly code is correct.

## Red flags
- A function body that scrolls past one screen (Long Method).
- `switch (event.type)` or `if (role === 'admin')` repeated in three files (Switch-on-type + Shotgun Surgery).
- `a.getB().getC().getD()` — Law of Demeter chain (Message Chains).
- A function with 4+ parameters, or a `boolean` parameter changing behavior (Long Parameter List).
- The same 3-field group passed separately everywhere (Data Clumps).
- An `abstract`/`interface` with exactly one implementer (Speculative Generality).
- Unused imports, methods, or branches the linter grays out (Dead Code).
- A class whose git log mixes auth, email, pricing, and PDF export (Divergent Change).
- A single PR touching 10 files to add one feature (Shotgun Surgery).
