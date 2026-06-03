---
name: production-grade
description: >-
  Router and orchestrator for the craft code-quality guardrails. Use FIRST on any
  broad "is this production-ready?", "review this code/diff/PR", "build this
  properly", "why does our AI-generated code keep needing rework", or "make this
  maintainable" request. Two modes: GENERATIVE GUARD (load the right senior
  heuristics before writing code) and CRITIQUE (audit a diff/file and return one
  worst-first ranked list of findings). Decomposes the request, fires the relevant
  craft member skills plus the existing complexity/refactoring/dependency/test
  skills in the right order, resolves their conflicts, and returns a single merged
  verdict. Defer to a single member skill only when the task is already narrow.
---

# production-grade — the senior-review router

**Purpose**: be the 15-year senior engineer who can glance at a change and say
*"this won't survive contact with production, and here's exactly why."* This skill
decomposes a request, dispatches to the right guardrails, and merges their output
into one verdict — instead of dumping nine separate checklists.

Anchor frame (state it, then act on it): **an AI coding agent is a Tactical Tornado
by default** — fast, prolific, leaving a maintenance wake. Every move here forces
*strategic* (durable) code over *tactical* (fast-but-disposable) code. The bar is not
"it works"; the bar is "the next engineer can read, trust, and change it." See
`references/PRINCIPLES.md` and `references/EVIDENCE.md`.

## When to use this router vs. go direct

- **Route here** when the request is broad: "review this PR," "is this
  production-ready," "build feature X properly," "our AI code keeps needing rework —
  fix the process," "audit this module."
- **Go direct to a member skill** when the task is already narrow: only naming →
  `craft:naming-and-comments`; only a dependency question → `craft:supply-chain-hygiene`.
- **Don't route** for trivial one-line edits. Overhead isn't worth it.

## The two modes

### Mode A — Generative Guard (before/while writing code)
Pull the relevant reflex cards into context *before* the agent writes, so the code is
born right instead of being fixed later.
1. Read `RULES.md` (the 12 rules + Definition of Done) — always.
2. Classify the task and load the matching member skills' Tier-1 reflex cards
   (the table below).
3. Build with the smallest-diff-that-works discipline.
4. Close with the **Definition of Done** gate from `RULES.md` — including *"I ran it,
   here's the evidence."*

### Mode B — Critique (auditing a diff / file / PR)
Return **one ranked, worst-first list**, each item tagged `[skill · principle ·
severity]`, with the concrete fix. Not nine lists. Not vibes.
1. Determine what changed (the diff) and what it touches.
2. Fire the relevant lenses (below) in dependency order.
3. **Merge & dedupe** findings; one issue may trip several lenses — report it once,
   under its root cause.
4. Rank by **severity = job-damage × fix-cheapness**.
5. Emit the Output Contract.

## Dispatch map — intent → skill

| The change involves… | Fire | Layer |
|---|---|---|
| New class / interface / factory / config / abstraction | `craft:right-sized-design` | craft |
| Error handling, input validation, secrets, boundaries | `craft:robustness-at-boundaries` | craft |
| A helper that may already exist; copy-paste; duplication | `craft:dry-and-reuse` | craft |
| Smelly structure (long method, god class, feature envy…) | `craft:code-smells` | craft |
| Logic tangled with I/O / mutation / nondeterminism | `craft:effects-and-purity` | craft |
| Names, comments, readability | `craft:naming-and-comments` | craft |
| Tests (writing or judging them); "is it actually done?" | `craft:trustworthy-tests` | craft |
| New dependency / external API call | `craft:supply-chain-hygiene` | craft |
| Quantified complexity metrics (cyclomatic/cognitive) | `complexity-analysis` | existing |
| The concrete refactoring to apply once a smell is found | `refactoring-patterns` | existing |
| Coupling / circular deps / god modules | `dependency-analyzer` | existing |
| Coverage gaps, risk-ranked | `test-coverage-analyzer` | existing |

**craft skills *detect and judge*; the existing skills *measure and fix*.** When
`code-smells` names a Long Method, hand the fix to `refactoring-patterns`. When you
suspect deep coupling, confirm with `dependency-analyzer`.

## Canonical critique chain (order matters)

Run lenses outside-in, cheap-and-structural first:

1. **Scope** — does the diff match the request? (`right-sized-design`) — *catch
   over-engineering and scope creep before reading further.*
2. **Reuse** — is anything here duplicating what exists? (`dry-and-reuse`)
3. **Structure** — smells & coupling (`code-smells` → `dependency-analyzer`)
4. **Robustness** — validation, errors, secrets (`robustness-at-boundaries`)
5. **Effects** — purity / testability (`effects-and-purity`)
6. **Clarity** — names & comments (`naming-and-comments`)
7. **Trust** — tests prove behavior; it actually ran (`trustworthy-tests`)
8. **Supply chain** — deps verified, no hallucinated APIs (`supply-chain-hygiene`)

## Tension resolution (when guardrails conflict)

| Tension | Resolution |
|---|---|
| "Add validation/robustness" vs. "smallest diff / don't over-engineer" | Robustness at *boundaries* always wins; over-engineering is internal structure, not edge safety. Validate the edge; keep the core simple. |
| "Make it pure/testable" vs. "don't add abstraction" | Extracting a pure function is not speculative generality — it pays off immediately in testability. Allow it. A new *interface/factory* needs ≥2–3 call sites; a pure helper does not. |
| "DRY / consolidate" vs. "a little duplication is fine" | DRY applies to *knowledge* (one rule, one place). Two look-alike blocks encoding *different* decisions may stay. Don't abstract incidental similarity. |
| "Match the codebase" vs. "the codebase is wrong" | Match it for this diff; raise the systemic fix as a separate, visible item — don't smuggle a refactor into an unrelated change (Broken Windows ticketed, not silently rewritten). |
| Severity disagreements between lenses | Router decides by job-damage × fix-cheapness; a Change Preventer outranks a cosmetic smell. |

## Output Contract (Mode B)

```
## Verdict: SHIP / SHIP-WITH-FIXES / REWORK
One-sentence senior summary. (e.g. "Logic is correct but the diff doubles an
existing util and swallows the parse error — rework before merge.")

## Must-fix (blocks merge)
1. [robustness-at-boundaries · swallowed-error · HIGH] path/file.ts:42 —
   <what's wrong> → <the fix> (links: refactoring-patterns / RULES rule 6)
2. ...

## Should-fix (not blocking, but real debt)
- [code-smells · duplicate-code · MED] ...

## Nits (optional)
- [naming-and-comments · vague-name · LOW] ...

## Definition-of-Done check
- [x]/[ ] for each item in RULES.md's gate, with the missing evidence called out.
```

Always: name the **principle**, cite the **file:line**, give the **fix**, and rank by
severity. Never assert taste without a named principle. Praise is fine but brief —
this is editing, not a performance review.

## References
- The 12 rules + Definition of Done: `../../RULES.md`
- Why durable code wins: `../../references/PRINCIPLES.md`
- The smell catalog: `../../references/SMELLS.md`
- The data behind all of it: `../../references/EVIDENCE.md`
- Language tells: `../../references/lang/{python,typescript,go}.md`
