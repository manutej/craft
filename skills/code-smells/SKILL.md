---
name: code-smells
description: >-
  Detection lens for Fowler's five smell families — names the smell, states
  the change-cost, and hands the fix to `refactoring-patterns`. Use when
  reviewing a diff, auditing a module, or deciding whether to gate a merge.
  Triggers: "does this code have smells", "review for smells", "is this
  clean", "what's wrong with this design", "this class is getting big", "why
  is every change touching 12 files", "switch on type", "this method is too
  long", "is this AI slop".
---

# code-smells — name the symptom, measure the cost, route the fix

**Purpose**: a code smell is a surface symptom of a deeper change-cost problem —
the code runs, but it will cost more to modify than it should. This skill is the
*detection* lens: it names the smell, states the economic cost, and hands the fix
to `refactoring-patterns`. The two signature AI-slop smells are **Duplicate Code**
(agents clone instead of consolidating) and **Speculative Generality** (agents add
abstraction "just in case"). Hunt these first on any AI-generated diff.

> Relationship: `code-smells` (detect / judge severity) → `refactoring-patterns`
> (apply the fix) → `dependency-analyzer` (confirm coupling reach) →
> `complexity-analysis` (quantify cognitive load). Don't apply fixes in this skill;
> route them.

## Reflex card — the 13 highest-value smells

Scan the diff by Fowler family. One tell each:

**Bloaters** (grown too large)
1. **Long Method** — a function you must scroll; does more than one thing. Tell: multiple levels of nesting or abstraction in one body.
2. **Large Class** — a class with fields/methods from multiple responsibilities. Tell: you need to read the whole file to find one behavior.
3. **Long Parameter List** — 4+ parameters, or a boolean flag that changes behavior. Tell: callers pass `null` or `false` for half the params.
4. **Primitive Obsession** — `string`/`int` standing in for a domain concept (`email`, `money`, `userId`). Tell: repeated validation of the same raw value at every call site.
5. **Data Clumps** — the same group of 3+ fields travels together everywhere. Tell: you copy the same field triplet into five function signatures.

**OO Abusers** (OO used wrongly)
6. **Switch-on-type** — a `switch`/if-chain on a type tag, repeated in multiple places. Tell: adding a new type means hunting for every `switch` in the codebase.

**Change Preventers** (one change → many edits)
7. **Divergent Change** — one class changes for many unrelated reasons. Tell: the git log for this file touches pricing, auth, and email in the same commits.
8. **Shotgun Surgery** — one logical change means edits scattered across many files. Tell: a single PR touches 10 files to add one feature.

**Dispensables** (code that should not exist)
9. **Duplicate Code** — the same structure in multiple places. Tell: identical or near-identical blocks; same bug fixed in two places. *AI signature smell.*
10. **Speculative Generality** — "we might need it" hooks, abstract base with one implementation, config option never varied. Tell: deleting the abstraction loses nothing. *AI signature smell.*
11. **Dead Code** — unused vars, params, methods, branches. Tell: `grep` finds no callers; IDE grays it out.

**Couplers** (too much coupling)
12. **Feature Envy** — a method that uses another object's data more than its own. Tell: most lines in the method start with `other.get…`.
13. **Message Chains** — `a.getB().getC().getD()`. Tell: a chain you can't mock without building half the object graph. Violates Law of Demeter.

## Severity ranking

Rank findings by **job-damage × fix-cheapness** — don't dump everything equally:

1. **Change Preventers** (Shotgun Surgery, Divergent Change) — highest. They tax *every* future change; the codebase compounds in cost with each feature. Fix even when expensive.
2. **Duplicate Code + Speculative Generality** — the AI-slop core. Cheap to fix now, exponentially costly later as the copies diverge.
3. **Bloaters** — high cognitive load, error-prone on hot paths. Prioritize Long Method and Long Parameter List on frequently-modified code.
4. **Couplers** — fix when they block testability or are the root of Shotgun Surgery.
5. **Cosmetic smells** (lone Dead Code, stray comment-as-deodorant) — note, don't gate.

**A smell is a prompt to investigate, not an automatic defect.** Sometimes the smelly
code is the right code — a `switch` on an external enum you don't own, duplication
that's cheaper than a wrong abstraction. Name the smell, state the cost, then let
severity decide whether it blocks the merge.

## Red flags (observable patterns)

- A function body you must scroll past one screen.
- `switch (event.type)` or `if (user.role === 'admin')` repeated in three files.
- `order.getCustomer().getAddress().getCity()` — Law of Demeter chain.
- A function with 4+ parameters, or a `boolean` parameter (`processOrder(order, true, false, null)`).
- The same 3-field group (`lat`, `lng`, `zoom`) passed in separate params everywhere.
- An `abstract`/`interface` with exactly one implementing class, or an `Optional`-style base with one consumer.
- Unused imports, methods flagged by the linter, branches guarded by a constant.
- A class whose git log reads: auth fix, email change, pricing tweak, PDF export — one class, four axes.

## The procedure

1. **Scan the diff** (not the whole repo unless asked). Read changed functions and classes in full.
2. **Name each smell with `file:line`** — be specific. "Long Method" at `order_service.py:87` is actionable. "The code is messy" is not.
3. **State the change-cost** — why does this smell raise the price of the *next* change? One sentence.
4. **Propose the refactoring-patterns fix** — name the Fowler refactoring (Extract Method, Replace Conditional with Polymorphism, Introduce Parameter Object, etc.). Don't apply it here; route it.
5. **Rank by severity** using the tiers above. Lead with Change Preventers; close with cosmetics.
6. **Don't gate on cosmetics** — call them out, give a SEV, move on.

## Before / after — Switch-on-type

```python
# BEFORE — smell: Switch-on-type (OO Abuser) repeated in renderer and serializer
def render(shape):
    if shape.type == 'circle':
        return draw_circle(shape.radius)
    elif shape.type == 'rect':
        return draw_rect(shape.w, shape.h)
    elif shape.type == 'triangle':
        return draw_triangle(shape.points)
    # every new shape type → edit this function AND the serializer
```

```python
# AFTER — polymorphic dispatch; adding a shape touches one place
RENDERERS = {
    'circle':   lambda s: draw_circle(s.radius),
    'rect':     lambda s: draw_rect(s.w, s.h),
    'triangle': lambda s: draw_triangle(s.points),
}

def render(shape):
    renderer = RENDERERS.get(shape.type)
    if renderer is None:
        raise ValueError(f"Unknown shape type: {shape.type!r}")
    return renderer(shape)
```

Fix via `refactoring-patterns`: Replace Conditional with Polymorphism (or dict dispatch
for simple cases). If this switch appears in three files, that's Shotgun Surgery layered
on top — escalate severity.

## Critique mode

For each smell found, emit a tagged finding:

```
[code-smells · shotgun-surgery · SEV:HIGH] order_service.py:87 and email_sender.py:34
and pdf_export.py:112 all change when a new OrderStatus is added. Consolidate status
handling into one module. → refactoring-patterns: Move Method + Extract Class.
```

Tag format: `[code-smells · <smell-kebab-case> · SEV:(HIGH|MED|LOW)]`. SEV:HIGH =
Change Preventers and AI-slop core. SEV:MED = Bloaters and Couplers on hot paths.
SEV:LOW = cosmetics and isolated dispensables.

Lead every review with the highest-SEV finding. Close with a one-line verdict:
*"3 findings: 1 HIGH (Shotgun Surgery), 1 MED (Long Method), 1 LOW (Dead Code). HIGH blocks merge."*

## References

- Full smell catalog with Fowler family tables: `../../references/SMELLS.md`
- ETC principle, deep/shallow modules, strategic vs tactical: `../../references/PRINCIPLES.md`
- Rules 1, 3, 4 (smallest change, search before build, consolidate don't clone): `../../RULES.md`
- **Fixes** (Extract Method, Replace Conditional with Polymorphism, Introduce Parameter Object, etc.): the `refactoring-patterns` skill — this skill detects; that skill applies.
