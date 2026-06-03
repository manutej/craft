# craft — senior-engineer guardrails against AI code slop

> Eight composable skills + an always-on rules constitution + a `/senior-review` gate.
> The job: make an AI coding agent behave like the 15-year senior who has to **maintain**
> the code in a year — not the Tactical Tornado who's moving on tomorrow.

## Why this exists

Across 211M lines of real code (GitClear, 2020–2024), AI assistants drove **duplicated
code up 8×** and **refactoring down ~60%**, while **churn nearly doubled** — and their
users grew *more* confident the output was correct (Stanford). That gap between
"the AI says it's production-ready" and "this needs reworking in two weeks" is exactly
what `craft` closes. See [`references/EVIDENCE.md`](references/EVIDENCE.md).

The core diagnosis: **an AI coding agent is a "Tactical Tornado" by default**
(Ousterhout) — fast, prolific, leaving a maintenance wake. Worse, it spends complexity in
the wrong place: over-building *structure* while skipping robustness at the *boundaries*.
Every skill here forces *strategic* (durable) code over *tactical* (fast-but-disposable)
code.

## What's in the box

```
craft/
├── RULES.md                    ← always-on constitution: 12 rules + Definition of Done
├── commands/senior-review.md   ← /senior-review — the merge-gate critique
├── skills/
│   ├── production-grade/       ← ROUTER: "review this / is it production-ready?"
│   ├── right-sized-design/     ← anti-over-engineering, YAGNI, deep modules     [tier-1]
│   ├── robustness-at-boundaries/ ← validate edges, never swallow errors, secrets [tier-1]
│   ├── dry-and-reuse/          ← search-before-build, consolidate-don't-clone   [tier-1]
│   ├── trustworthy-tests/      ← no fake tests; prove it ran                     [tier-1]
│   ├── code-smells/            ← Fowler's catalog as a detection lens
│   ├── effects-and-purity/     ← functional core / imperative shell (pragmatic)
│   ├── naming-and-comments/    ← intent-revealing names; comments carry *why*
│   └── supply-chain-hygiene/   ← verify deps exist (anti-slopsquat), no hallucinated APIs
├── references/                 ← shared depth: PRINCIPLES, SMELLS, EVIDENCE, lang/*
└── dist/github-copilot/        ← same guardrails ported to a drop-in GitHub Copilot .github/ bundle
```

## Other editors — GitHub Copilot (GPT or any model)

`dist/github-copilot/` is a generated port of these guardrails for **GitHub Copilot**, so
the same rules apply to teammates using Copilot instead of Claude Code. It ships
`copilot-instructions.md` (the constitution — honored by completions, chat, and PR
review), `instructions/*.instructions.md` (path-triggered per-topic guidance), and a
`/senior-review` prompt. The port trades fidelity for portability — no intent-based
auto-trigger, no hooks — so lean on CI + Copilot's PR review for real enforcement. See
[`dist/github-copilot/README.md`](dist/github-copilot/README.md). It's generated from
`RULES.md` + `skills/`; edit those and regenerate rather than hand-editing the port.
```

### The three-tier instruction model

Each skill is layered so context is spent only when needed:
1. **Reflex card** — in each `SKILL.md`, loaded when the skill fires: ~10 heuristics, a
   red-flag list, a checklist. Dense and always-on for that skill.
2. **Playbook** — `references/*.md`, loaded on demand: the book-grounded rationale,
   decision tables, thresholds, sources.
3. **Worked examples** — `examples/*.md`: before/after **slop-vs-senior** code.

## How to use it

**Always-on (highest leverage):** paste or `@`-reference [`RULES.md`](RULES.md) into your
repo's `CLAUDE.md` / `AGENTS.md` / `.cursorrules`. Rules-as-prose alone get ~25–40%
compliance; pairing them with the gate below pushes toward ~95%.

**As a gate:** run `/senior-review` on a diff/file/PR before merge. It returns one
worst-first, principle-tagged list with the fix for each finding.

**While building:** the router (`craft:production-grade`) and the eight skills
auto-trigger on the relevant work (their `description` fields carry the triggers), or
invoke one directly, e.g. `craft:right-sized-design`.

## What it composes with

`craft` skills **detect and judge**; they hand the mechanics to the skills you already
have: `refactoring-patterns` (apply the fix), `complexity-analysis` /
`complexity-metrics` (quantify), `dependency-analyzer` (coupling),
`test-coverage-analyzer` (coverage). No duplication of those.

## Sources

The Pragmatic Programmer (Hunt & Thomas) · Refactoring (Fowler & Beck) · A Philosophy of
Software Design (Ousterhout) · The Grug Brained Developer (Gross) · Working Effectively
with Legacy Code (Feathers) · The Twelve-Factor App · Functional Core/Imperative Shell
(Bernhardt) · GitClear, Stanford & USENIX empirical studies. Condensed in
[`references/`](references/).

---
*Built by CETI — Center for Educational Technology Innovations. Version 0.1.0.*
