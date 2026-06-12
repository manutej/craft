<div align="center">

<img src=".github/assets/hero.svg" alt="craft — senior-engineer guardrails against AI code slop" width="100%">

<br/>

![skills](https://img.shields.io/badge/skills-8%20%2B%20router-E3B341?style=flat-square&labelColor=0D1117)
![rules](https://img.shields.io/badge/rules-12-39C5BB?style=flat-square&labelColor=0D1117)
![AI slop](https://img.shields.io/badge/AI%20slop-blocked-F85149?style=flat-square&labelColor=0D1117)
![works with](https://img.shields.io/badge/works%20with-Claude%20Code%20·%20Cursor%20·%20Copilot%20·%20Windsurf%20·%20Cline%20·%20Codex-39C5BB?style=flat-square&labelColor=0D1117)
![grounded in](https://img.shields.io/badge/grounded%20in-Pragmatic%20·%20Fowler%20·%20Ousterhout-58A6FF?style=flat-square&labelColor=0D1117)
![license](https://img.shields.io/badge/license-MIT-3FB950?style=flat-square&labelColor=0D1117)
[![validate](https://github.com/manutej/craft/actions/workflows/validate.yml/badge.svg)](https://github.com/manutej/craft/actions/workflows/validate.yml)
[![live site](https://img.shields.io/badge/live%20site-craft--pink--six.vercel.app-E3B341?style=flat-square&labelColor=0D1117)](https://craft-pink-six.vercel.app)

**Make the AI behave like the 15-year senior who has to _maintain_ this in a year —<br/>not the Tactical Tornado who's moving on tomorrow.**

### → [**See the live site**](https://craft-pink-six.vercel.app) ←

[Why](#why-this-exists) · [How it works](#how-it-works) · [What it catches](#what-it-catches) · [The 9 skills](#the-nine-skills) · [The 13 rules](#the-13-rules) · [Install on any tool](#install--any-agentic-tool) · [Live site](https://craft-pink-six.vercel.app)

</div>

---

## Why this exists

> Working code is not the bar. **Code the next person can read, trust, and change** is the bar.

Basic prompts and AI tools produce code with a short shelf life — it works in the demo, then needs reworking in two weeks. That isn't a vibe; it's measured:

<div align="center">

<img src=".github/assets/evidence.svg" alt="What AI slop costs: duplication up 8x, churn up ~2x, refactoring down 60%, and developers were more confident" width="92%">

</div>

The core diagnosis: **an AI coding agent is a "Tactical Tornado"** (Ousterhout) — fast, prolific, leaving a maintenance wake. Worse, it spends complexity in the _wrong place_: over-building **structure** while skipping robustness at the **boundaries**. `craft` reverses both. Every skill forces _strategic_ (durable) code over _tactical_ (fast-but-disposable) code, and where two approaches both work, it picks the one that leaves the system **Easier To Change**.

---

## How it works

<div align="center">

<img src=".github/assets/how-it-works.svg" alt="How craft works: your change flows through the production-grade router and the nine skills to a proven verdict" width="100%">

</div>

`craft` sits between your agent and **"done."** The `production-grade` router reads the change, fires only the skills that apply, and nothing ships until the work is proven — **while building** (skills steer the agent as it writes, so the strategic version comes out first) or **as a gate after** (`/senior-review`, the Copilot port, or a CI check blocks the merge). Want it interactive? The [**live site**](https://craft-pink-six.vercel.app/#how) animates the same flow.

---

## Architecture

`craft` skills **detect and judge**; they route the mechanical fix to the analysis skills you already have — no duplication.

```mermaid
flowchart LR
    PR["diff / pull request"] --> ROUTER{{"production-grade<br/>router"}}

    subgraph DETECT["craft · detect + judge"]
        direction TB
        RSD["right-sized-design"]:::g
        RB["robustness-at-boundaries"]:::g
        DRY["dry-and-reuse"]:::g
        TT["trustworthy-tests"]:::g
        CS["code-smells"]:::t
        EP["effects-and-purity"]:::t
        NC["naming-and-comments"]:::t
        SC["supply-chain-hygiene"]:::t
    end

    ROUTER --> DETECT
    DETECT --> FIX["refactoring-patterns<br/>complexity-analysis<br/>dependency-analyzer"]:::e
    FIX --> V{"SHIP · SHIP-WITH-FIXES · REWORK"}:::v

    classDef g fill:#1A1410,stroke:#E3B341,color:#E3B341;
    classDef t fill:#0E1A19,stroke:#39C5BB,color:#39C5BB;
    classDef e fill:#10141B,stroke:#58A6FF,color:#9Fc6ff;
    classDef v fill:#1A1010,stroke:#F85149,color:#FF9C94;
```

Two modes from the router (`production-grade`):

- **Generative guard** — invoked _while building_: load the right senior heuristics before the code is written, so it's born right instead of fixed later.
- **Critique** — invoked on a diff/PR: return **one worst-first, principle-tagged list** with the fix for each finding (severity = job-damage × fix-cheapness), plus a Definition-of-Done check.

---

## What it catches

Six real failure modes, before &amp; after — **[explore them interactively on the live site →](https://craft-pink-six.vercel.app/#examples)** (click any case to flip slop ↔ craft). Each names the rule it enforced.

| Failure mode | Without craft | craft enforces | Skill |
|---|---|---|---|
| **Over-engineering** | a factory + interface for exactly one user | smallest diff; no abstraction without 2–3 call sites | [`right-sized-design`](skills/right-sized-design/) |
| **Swallowed errors** | a 404 returned as a "user"; `catch {}` → `{}` | check status, validate the shape, fail loud | [`robustness-at-boundaries`](skills/robustness-at-boundaries/) |
| **Hallucinated deps** | `import requesocks` — a typosquat that doesn't exist | verify on the registry before it hits the lockfile | [`supply-chain-hygiene`](skills/supply-chain-hygiene/) |
| **Duplication** | the 4th hand-rolled `slugify`, subtly wrong | grep first; reuse the one shared source | [`dry-and-reuse`](skills/dry-and-reuse/) |
| **Fake-green tests** | `expect(mock).toBe(...)` — green forever, proves nothing | assert observable behavior against a real fake | [`trustworthy-tests`](skills/trustworthy-tests/) |
| **Logic ⊗ I/O** | the discount rule buried between DB calls and Stripe | pure core, imperative shell — trivially testable | [`effects-and-purity`](skills/effects-and-purity/) |

The one most reviewers miss — a dependency that simply **does not exist** (~19.7% of AI-suggested packages don't; USENIX Security 2025):

```diff
- import requesocks                  # typosquat of "requests" — not a real package
- from datetime_utils import parse   # invented module that just looks plausible
+ from datetime import datetime      # stdlib; verified, canonical
+ import requests                    # the real client, confirmed on PyPI
```

---

## The nine skills

Tier-1 are the 80/20 — the four that attack the most-documented failure mechanisms. Click to expand.

<details>
<summary><b>🪓 right-sized-design</b> &nbsp;·&nbsp; anti-over-engineering / YAGNI / deep modules &nbsp;<code>tier-1</code></summary>

<br/>

**Catches** the #1 AI failure: factories, interfaces, and config "just in case." No abstraction until it has ≥2–3 real call sites; deep modules over shallow; smallest diff that satisfies the request.

```diff
- class DiscountStrategyFactory { /* +interface +manager, 4 files, 1 use */ }
+ function applyDiscount(total, pctOff) {            // one validated function
+   if (pctOff < 0 || pctOff > 100) throw new RangeError(`0–100, got ${pctOff}`);
+   return total * (1 - pctOff / 100);
+ }
```
</details>

<details>
<summary><b>🛡️ robustness-at-boundaries</b> &nbsp;·&nbsp; validate edges · never swallow errors · secrets &nbsp;<code>tier-1</code></summary>

<br/>

**Catches** the #1 AI _omission_: validation and error handling exactly where production breaks. Validate at the boundary, once; never `catch {}` into silence; define errors out of existence; no hardcoded secrets.

```diff
- def create_user(body: dict):
-     user = User(email=body["email"], role=body.get("role", "admin"))  # insecure default
-     try: send_welcome(user); 
-     except Exception: pass                                            # swallowed
+ def create_user(req: CreateUserRequest):   # pydantic validates at the edge → 422 on bad input
+     user = User(email=req.email, role=req.role)  # safe typed default
+     try: send_welcome(user)
+     except EmailServiceError as e: log.warning(...); enqueue_retry(...)  # visible, degrades
```
</details>

<details>
<summary><b>♻️ dry-and-reuse</b> &nbsp;·&nbsp; search-before-build · consolidate-don't-clone &nbsp;<code>tier-1</code></summary>

<br/>

**Catches** the duplication GitClear measures as "rework." DRY is about _knowledge_ (one rule, one home), not incidental look-alikes. Search the repo/stdlib before writing a util; extract instead of copy-paste.

</details>

<details>
<summary><b>✅ trustworthy-tests</b> &nbsp;·&nbsp; no fake tests · prove it ran &nbsp;<code>tier-1</code></summary>

<br/>

**Catches** tautological tests (asserting on their own mocks), implementation-mirroring, and "done" claimed without ever running the code. Test observable behavior; pin untested code with a characterization test before refactoring; show **evidence it ran**.

```diff
- expect(spy).toHaveBeenCalled();        // proves only that we called it
+ expect(checkout({total:200}, "SAVE10").total).toBe(180);   // fails if the math is wrong
```
</details>

<details>
<summary><b>👃 code-smells</b> &nbsp;·&nbsp; Fowler's catalog as a detection lens</summary>

<br/>

Names the smell, states the change-cost, and routes the fix to `refactoring-patterns`. Ranks by job-damage × fix-cheapness — Change Preventers (Shotgun Surgery, Divergent Change) outrank cosmetics. The two AI-signature smells: **Duplicate Code** and **Speculative Generality**.

</details>

<details>
<summary><b>⚗️ effects-and-purity</b> &nbsp;·&nbsp; functional core, imperative shell (pragmatic)</summary>

<br/>

Isolate side effects at the boundary; keep decision logic pure so it's testable without heavy mocks. **Balanced, not dogmatic** — it does _not_ ban mutation or demand monads. Inject the clock/RNG/clients instead of calling them inline.

</details>

<details>
<summary><b>🔤 naming-and-comments</b> &nbsp;·&nbsp; intent-revealing names · comments carry <i>why</i></summary>

<br/>

Vague names (`data`, `tmp`, `Manager`) and comments that restate the code are slop. Names carry intent; comments carry rationale, units, invariants. If a name is hard to pick, the design is unclear.

</details>

<details>
<summary><b>📦 supply-chain-hygiene</b> &nbsp;·&nbsp; verify deps exist · no hallucinated APIs</summary>

<br/>

~20% of AI-suggested packages don't exist (**slopsquatting** — attackers pre-register the recurring hallucinated names). Verify every dependency is real and canonical before install; don't call methods/fields that aren't in the real API; never inline secrets.

</details>

<details>
<summary><b>🗄️ data-and-state-evolution</b> &nbsp;·&nbsp; expand→migrate→contract · safe schema changes</summary>

<br/>

**Catches** the slop a diff can't show: a migration that's fine on dev and locks a 10M-row table in prod, a renamed column that 500s the old code still running mid-deploy, a backfill with no rollback. Every persistent-shape change ships in phases — expand, migrate, contract — with a dry-run on a copy as evidence.

```diff
- ALTER TABLE users RENAME COLUMN username TO handle;   -- breaks every running instance
+ ALTER TABLE users ADD COLUMN handle TEXT;             -- 1. expand (additive, safe)
+ -- 2. code writes both / reads either · batched backfill · 3. contract later
```
</details>

---

## The 13 rules

The always-on constitution ([`RULES.md`](RULES.md)) — drop it into your repo's `CLAUDE.md` / `AGENTS.md` / `.cursorrules`:

| # | Rule | # | Rule |
|--:|---|--:|---|
| 1 | Smallest change that satisfies the request | 7 | Pure logic; quarantine side effects at the edges |
| 2 | No abstraction without ≥2–3 real call sites | 8 | Clear beats clever |
| 3 | Search before you build | 9 | Names carry intent; comments carry _why_ |
| 4 | Consolidate, don't clone | 10 | No tautological tests; prove it ran |
| 5 | Match the codebase, not your defaults | 11 | Pin untested code before refactoring |
| 6 | Validate at the boundary; never swallow errors | 12 | Verify every dependency; never hardcode secrets |
| | | 13 | Data outlives code: expand → migrate → contract |

…closed by a **Definition of Done** that requires _"I ran it — here's the evidence"_, a test seen **red before green**, and a dry-run for every migration.

### Three-tier instructions

Each skill is layered so context is spent only when needed:

`SKILL.md` **reflex card** (heuristics + red flags, always-on) → `references/` **playbook** (the book-grounded rationale, on demand) → `examples/` **worked before/after** (slop-vs-senior code).

---

## Also runs in GitHub Copilot

[`dist/github-copilot/`](dist/github-copilot/) ports the same guardrails to Copilot (with GPT or any model), so the whole team is covered:

- **`copilot-instructions.md`** — the 13 rules; honored by completions, chat, **and Copilot's PR review**, on every IDE.
- **`instructions/*.instructions.md`** — path-triggered per-topic guidance (the 9 skills + Python/TypeScript/Go tells).
- **`prompts/senior-review.prompt.md`** — `/senior-review` in Copilot Chat.

The port trades fidelity for portability (no intent-based auto-trigger, no hooks), so lean on **CI + Copilot PR review** for enforcement. Rules-as-prose get ~25–40% compliance; mechanical gates reach ~95%.

---

## Install — any agentic tool

One constitution ([`RULES.md`](RULES.md)), every platform. **Pick your tool, copy one command** (hover any block on GitHub for the copy button), commit. Same rules everywhere — adopt on one repo or roll out to a whole class.

<details open>
<summary><b>Claude Code</b> — native plugin: 9 skills + a router auto-load, plus the <code>/senior-review</code> gate</summary>

```bash
git clone https://github.com/manutej/craft ~/.claude/plugins/craft
```
Then run `/senior-review <file|dir|PR#>` on any diff, or call a skill directly — e.g. `craft:right-sized-design`.
</details>

<details>
<summary><b>Cursor</b> — Project Rule, always applied across chat, ⌘K edits, and Composer</summary>

```bash
mkdir -p .cursor/rules
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/dist/cursor/craft.mdc -o .cursor/rules/craft.mdc
```
Legacy Cursor (single file): `curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .cursorrules`
</details>

<details>
<summary><b>GitHub Copilot</b> — completions, chat, <b>and</b> automated PR review</summary>

```bash
mkdir -p .github
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .github/copilot-instructions.md
```
Richer port (per-language rules + a `/senior-review` prompt): [`dist/github-copilot/`](dist/github-copilot/).
</details>

<details>
<summary><b>Windsurf</b> — Cascade rules, every session</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .windsurfrules
```
</details>

<details>
<summary><b>Cline / Roo Code</b> — workspace rules, every task</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .clinerules
```
</details>

<details>
<summary><b>Codex · AGENTS.md</b> — the cross-tool standard (Codex, Jules, Gemini CLI…)</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o AGENTS.md
```
One file, many agents — the most portable way to ship the rules to a team.
</details>

<details>
<summary><b>Aider</b> — conventions passed on every request</summary>

```bash
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o CONVENTIONS.md
```
Then add to `.aider.conf.yml`: `read: CONVENTIONS.md`
</details>

> The Cursor `.mdc` is generated from `RULES.md` by [`scripts/gen-ports.py`](scripts/gen-ports.py) — one source of truth, no clones (craft eats its own rule #4). Every other platform reads `RULES.md` directly.

```
craft/
├── RULES.md                     # always-on constitution — the single source
├── commands/senior-review.md    # the /senior-review gate
├── skills/                      # production-grade (router) + 8 guardrails
├── references/                  # PRINCIPLES · SMELLS · EVIDENCE · lang/*
├── dist/cursor/                 # generated Cursor .mdc port
├── dist/github-copilot/         # the Copilot port (per-language + PR review)
└── dist/ci/                     # mechanical enforcement: CI gate + Copilot-review setup
```

### Enforcement — make the rules a hard stop

Rules raise the floor; **gates** change behavior (~40% → ~95% compliance). [`dist/ci/`](dist/ci/) ships a copy-paste **`senior-gate.yml`** (run your lint + type-check + tests as a required check) and a guide to enabling **Copilot's automated PR review** against the shipped rules. This repo dogfoods the idea: its own [`validate`](.github/workflows/validate.yml) workflow checks the manifest, skill frontmatter, SVGs, and links on every push.

---

## Composes with

`craft` detects and judges; it hands the mechanics to the analysis skills you already run: **`refactoring-patterns`** (apply the fix), **`complexity-analysis` / `complexity-metrics`** (quantify), **`dependency-analyzer`** (coupling), **`test-coverage-analyzer`** (coverage). Nothing is duplicated.

## Sources

The Pragmatic Programmer (Hunt &amp; Thomas) · Refactoring (Fowler &amp; Beck) · A Philosophy of Software Design (Ousterhout) · The Grug Brained Developer (Gross) · Working Effectively with Legacy Code (Feathers) · The Twelve-Factor App · Functional Core / Imperative Shell (Bernhardt) · GitClear, Stanford &amp; USENIX empirical studies. Condensed in [`references/`](references/).

<div align="center">
<br/>

**Built by [CETI](https://cetiai.co) — Center for Educational Technology Innovations.**

<sub><code>craft</code> · v0.1.0 · stable · sustainable · production-grade</sub>

</div>
