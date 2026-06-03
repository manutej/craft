# EVIDENCE — why this plugin exists (the data)

Use this when someone asks "is the AI-slop problem real, or are we being precious?"
It's real and it's measured. Cite these.

---

## AI assistants measurably degrade code quality

**GitClear — AI Copilot Code Quality, 2025 report** (211M changed lines, Jan
2020–Dec 2024; Google/Microsoft/Meta + enterprise repos):

| Metric | 2021 | 2024 | Move |
|---|---|---|---|
| Refactored ("moved") lines, % of changed code | 25% | <10% | ↓ ~60% |
| Copy/pasted (cloned) lines, % of changed code | 8.3% | 12.3% | ↑ ~48% |
| Duplicated code blocks | — | — | **8× increase in 2024** |
| Code churn (reverted within 2 weeks) | 3.1% (2020) | 5.7% (2024) | nearly doubled |

- **2024 was the first year copy-pasted lines exceeded moved/refactored lines** — a
  historic inversion. "Moved" code is the fingerprint of DRY refactoring; its collapse
  is the clearest signal of AI-induced decay.
- Cloned blocks correlate with **15–50% more defects**.
- **The single most diagnostic metric is the refactored-to-duplicated ratio.** An agent
  that only ever *adds* and never *moves/consolidates* is producing slop by this
  measure. This is your "code has a short shelf life," quantified.
- Source: gitclear.com/ai_assistant_code_quality_2025_research; 2023 precursor:
  gitclear.com/coding_on_copilot_data_shows_ais_downward_pressure_on_code_quality

## The false-confidence paradox

**Stanford — "Do Users Write More Insecure Code with AI Assistants?" (Perry et al.).**
47 participants. Those with AI access produced **more security vulnerabilities**
(notably encryption and SQL injection) **and were more likely to believe their code was
secure.** Implication encoded in the rules: **an agent's self-assessment of quality —
especially security — is near-zero signal. Require external verification.**

**NYU "Asleep at the Keyboard" lineage:** across 89 scenarios, ~40% of Copilot-generated
programs contained exploitable vulnerabilities.

**arXiv 2310.02059 (ACM TOSEM) — "Security Weaknesses of Copilot-Generated Code in
GitHub Projects":** real-world (not lab) Copilot snippets carry recurring CWE-classified
weaknesses. The lab findings hold in the wild.

## Slopsquatting — the AI supply-chain risk

**USENIX Security 2025 — package-hallucination study** (16 LLMs, 576,000 code samples):
- **~19.7% of recommended packages did not exist** (open models ~21.7%, proprietary
  ~5.2%; CodeLlama >⅓).
- **205,000 unique hallucinated package names.**
- **43% of hallucinated packages recurred on all 10 re-runs; 58% recurred more than
  once** — deterministic enough for attackers to pre-register the names. **38% were
  string-similar to a real package.**
- "Slopsquatting" coined by Seth Larson (PSF). Encoded rule: **verify every imported
  third-party package exists and is the intended one before installing.**
- Sources: csoonline.com/article/3961304; theregister.com/2025/04/12;
  en.wikipedia.org/wiki/Slopsquatting

## Practitioner-documented agent failure modes

From Arize, NimbleBrain, and field write-ups:
- **Hallucinated APIs/methods** — agents invent method/field/param names that "feel
  correct," stated as fact ("confident liars that don't crash when unsure").
- **Tautological tests + false done** — agent's own tests/lint/CI pass while the real
  user flow is broken, because the agent never ran the thing it built. The fix that
  works in practice: a **verification-before-completion gate** requiring evidence.
- **Scope creep** — "doing more than asked" is a canonical agent failure.
- **Context truncation** — agents decide on truncated context and don't know what was
  cut, the root of confident hallucination.
- **Cascading errors** — one bad step compounds silently.

## What actually moves compliance

From Cursor's agent best-practices, PromptHub, and Arize's rules-file analysis:

- **Rules-as-prose: ~25–40% compliance. The same rules enforced as runtime gates
  (lint / type-check / test / hook): ~95%.** → The biggest lever is *mechanical
  enforcement*, not more words. This is why `craft` ships `RULES.md` **and** the
  `/senior-review` gate.
- **Specificity beats exhortation.** "Add tests" → bad. "Test the logout edge case using
  the patterns in `__tests__/`, no mocks" → good.
- **Start minimal; add a rule only after you observe the agent repeat a mistake.** A
  giant pre-emptive ruleset is itself an over-engineering trap.
- **Separate always-on Rules from on-demand Skills** to keep context clean.

---

### The one-line case

> Across 211M lines of real code, AI assistants drove duplication up 8× and refactoring
> down 60%, while their users grew *more* confident the output was correct. `craft`
> exists to make the agent behave like the senior who has to maintain this in a year —
> not the tornado who's moving on tomorrow.
