# SMELLS — Fowler's code-smell catalog, as a detection lens

A **code smell** is a surface symptom that usually points to a deeper problem. Smells
aren't bugs — the code runs — they're signals that the code will be expensive to
change. This is the *detection* catalog; the *fixes* live in the existing
`refactoring-patterns` skill, which this file cross-references.

> Source: Fowler & Beck, *Refactoring* (2nd ed.). Five families.

---

## 1. Bloaters — code that has grown too large

| Smell | Tell | Typical fix |
|---|---|---|
| **Long Method** | a function you must scroll; many responsibilities | Extract Method; Guard Clauses; Replace Temp with Query |
| **Large Class** | a class with too many fields/methods/jobs | Extract Class; Extract Subclass; split by responsibility |
| **Primitive Obsession** | `string`/`int` standing in for a domain concept (money, email, id) | Replace Primitive with Object; introduce a value type |
| **Long Parameter List** | 4+ params, or flags toggling behavior | Introduce Parameter Object; Preserve Whole Object |
| **Data Clumps** | the same group of fields travels together everywhere | Extract Class / value object for the clump |

**AI tell:** agents love Long Method and Long Parameter List — they keep appending to
one function and threading "just one more flag."

## 2. Object-Orientation Abusers — OO used wrongly

| Smell | Tell | Typical fix |
|---|---|---|
| **Switch Statements** | a `switch`/if-chain on a type tag, repeated in several places | Replace Conditional with Polymorphism; strategy/map dispatch |
| **Temporary Field** | a field only valid in certain states | Extract Class; Introduce Null Object |
| **Refused Bequest** | a subclass ignores most of what it inherits | replace inheritance with delegation |
| **Alternative Classes, Different Interfaces** | two classes do the same job with different method names | unify the interface; Extract Superclass |

**AI tell:** repeated `switch (type)` blocks that should be one polymorphic dispatch —
classic copy-paste-driven growth.

## 3. Change Preventers — one change forces many edits

| Smell | Tell | Typical fix |
|---|---|---|
| **Divergent Change** | one class changes for many unrelated reasons | Extract Class along the axes of change |
| **Shotgun Surgery** | one logical change means small edits scattered across many files | Move Method/Field to consolidate; pull the concept into one place |
| **Parallel Inheritance Hierarchies** | adding a subclass here forces a subclass there | merge or collapse the hierarchies |

**Why these are the expensive ones:** they directly attack ETC. A codebase with
Shotgun Surgery is one where every feature costs more than the last.

## 4. Dispensables — pointless code that should be deleted

| Smell | Tell | Typical fix |
|---|---|---|
| **Duplicate Code** | the same structure in multiple places | Extract Function/Class; Pull Up Method *(the GitClear metric)* |
| **Dead Code** | unused vars, params, methods, branches, files | delete it; version control remembers |
| **Lazy Class** | a class not doing enough to justify itself | Inline Class; collapse hierarchy |
| **Data Class** | only fields + getters/setters, no behavior | Move behavior onto the data (where it belongs) |
| **Speculative Generality** | "we might need it" hooks, params, abstract bases with one impl | Collapse Hierarchy; Inline; Remove Dead Parameter |
| **Comments (as deodorant)** | comments masking bad code instead of explaining intent | refactor the code so it needs no excuse |

**AI tell:** **Speculative Generality** and **Duplicate Code** are the two signature
AI-slop smells. Agents add config/abstraction "just in case," and they clone instead
of consolidating. Hunt these first.

## 5. Couplers — too much coupling between classes

| Smell | Tell | Typical fix |
|---|---|---|
| **Feature Envy** | a method more interested in another object's data than its own | Move Method to where the data lives |
| **Inappropriate Intimacy** | classes reaching into each other's internals | Move/Hide; replace bidirectional with one-way |
| **Message Chains** | `a.getB().getC().getD()` | Hide Delegate; obey Law of Demeter |
| **Middle Man** | a class that only delegates and adds nothing | Inline / Remove Middle Man |
| **Incomplete Library Class** | a library missing methods you need | Introduce Foreign Method / Local Extension |

---

## Smell → severity heuristic (how to rank what you find)

Don't dump every smell equally. Rank by **job-damage × fix-cheapness**:

1. **Change Preventers** (Shotgun Surgery, Divergent Change) — highest damage; they tax
   every future change. Fix even when expensive.
2. **Duplicate Code + Speculative Generality** — the AI-slop core; usually cheap to fix
   now, costly later.
3. **Bloaters** — high cognitive load; fix the ones on hot paths first.
4. **Couplers** — fix when they block testability or cause Shotgun Surgery.
5. **Cosmetic smells** (a lone Lazy Class, a stray comment) — note, don't gate on them.

A smell is a *prompt to investigate*, not an automatic defect. Sometimes the smelly
code is the right code. Name the smell, state the cost, propose the fix — then let
severity decide whether it blocks the merge.
