---
name: dry-and-reuse
description: >-
  Stops duplication and reinvention — the failure GitClear measures as "rework"
  (copy-paste up, refactoring down, the signature of AI code with a short shelf
  life). Use before writing any helper, util, type, constant, or component, and when
  reviewing a diff for repeated logic. Enforces search-before-build, consolidate-
  don't-clone, and DRY-as-knowledge (one rule, one authoritative place). Triggers:
  "is there already a function for this", "this looks duplicated", "DRY this up",
  "extract the common logic", "we keep rewriting this", before adding any utility.
---

# dry-and-reuse — search before you build, consolidate before you clone

**Purpose**: kill the duplication that gives AI code its short shelf life. GitClear's
211M-line study found copy-pasted code now *exceeds* refactored code for the first time
ever, and duplicated blocks rose 8× — because agents reflexively *add* and almost never
*move/merge*. Duplicated blocks carry 15–50% more defects. The senior move is to find
what exists and reuse it.

## DRY is about knowledge, not text

The real rule (Pragmatic Programmer): **every piece of *knowledge* has a single,
authoritative representation.** Two consequences agents get wrong in both directions:
- Two blocks that *look* alike but encode **different decisions** are **not** a DRY
  violation — don't force them into one abstraction (that's coupling unrelated things).
- One business rule expressed in three places **is** a violation even if the code looks
  different each time — that's the dangerous kind, because the copies drift.

## Reflex card

1. **Search before you build.** Before writing a helper/util/type/constant, grep the
   codebase (and the stdlib, and existing deps) for one that already does it. Reuse beats
   rewrite, every time.
2. **Consolidate, don't clone.** About to copy-paste a block? Extract it to one place and
   call it twice instead. Copy-paste is a debt you pay at every future change.
3. **Move/merge, don't only add.** The healthiest diffs *delete* and *relocate* code as
   well as adding it. If your change is pure addition and you suspect overlap, look
   harder. The refactored-to-duplicated ratio is the #1 quality signal.
4. **One rule, one home.** A validation rule, a tax calculation, a status enum, a magic
   constant — define it once and import it. Never let the same knowledge live in two
   files.
5. **Reuse the stdlib first.** Don't hand-roll what `itertools`/`lodash`/`slices`/`Intl`
   already gives you. Reinventing stdlib is DRY slop *and* a bug farm.
6. **But don't abstract incidental similarity.** If pulling two look-alikes together
   requires flags and special-cases to keep them apart, they were different rules —
   leave them. (Hand the judgment to `craft:right-sized-design`.)

## Red flags

- A new function whose body you've seen elsewhere in the repo.
- The same constant / regex / URL / status string in 2+ files.
- A block copy-pasted and then lightly edited (the most defect-prone pattern).
- The same business rule (discount, tax, permission check) computed in several places.
- A util that re-implements `groupBy`, `debounce`, `chunk`, `deepEqual`, date math, etc.
- A "v2" of a function sitting next to "v1" with 90% overlap.
- A diff that only ever adds, never moves or deletes, across a large change.

## The procedure

1. **Before writing:** search by intent (what it *does*), not just by name — agents miss
   existing helpers because they searched for the wrong noun. Grep for the operation, the
   constant's value, the rule's keywords.
2. **On a hit:** reuse it. If it's *almost* right, extend the existing one (carefully,
   without breaking its other callers) rather than forking a copy.
3. **On real duplication found in review:** extract to a single home (hand the mechanics
   to `refactoring-patterns`: Extract Function, Pull Up Method, Extract Class). Place the
   single source where both callers can reach it without creating a bad dependency.
4. **Confirm it's *knowledge* duplication, not coincidence,** before merging — see the
   "incidental similarity" caveat above.

## Inline example

```python
# ❌ Agent clones the rule into a third place
def can_edit(user, doc):
    return user.role == "admin" or user.id == doc.owner_id   # rule copy #3

# ✅ One authoritative home, reused
# permissions.py
def can_edit(user, doc) -> bool:
    """Single source of truth for edit permission."""
    return user.is_admin or user.id == doc.owner_id
# everywhere else: from permissions import can_edit
```
When the rule changes (say, editors can also edit), you change it once — not hunt three
drifted copies.

## Critique mode

Scan the diff for repeated logic, duplicated constants, and reinvented stdlib/existing
utilities. For each: is this *knowledge* duplication (consolidate) or incidental
similarity (leave it)? Tag `[dry-and-reuse · duplicate-knowledge|reinvented-util · SEV]`.
Cross-check suspected structural duplication with `dependency-analyzer`.

## References
- DRY-as-knowledge: `../../references/PRINCIPLES.md` §A
- Duplicate Code / Repetition: `../../references/SMELLS.md`
- The GitClear data: `../../references/EVIDENCE.md`
- Rules 3 & 4: `../../RULES.md`
