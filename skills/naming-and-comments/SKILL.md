---
name: naming-and-comments
description: >-
  Names and comments are the primary channel through which code communicates
  intent to the next engineer. Use when choosing an identifier ("what should I
  call this", "rename this", "is this name clear"), deciding whether to add a
  comment ("should I comment this", "does this need explaining"), or auditing
  existing prose ("clean up the comments", "too many comments", "comment slop").
  Also fires when a name is hard to pick — that difficulty is a design smell, not
  a vocabulary problem (Ousterhout: Hard to Pick Name).
---

# naming-and-comments — names carry intent; comments carry why

**Purpose**: names and comments are where code either communicates or hides its
intent. AI agents produce vague names (`data`, `result`, `handle`, `manager`,
`temp`, `item`, `process`) and comment slop that restates the line below it.
Both are noise; noise degrades every engineer who reads the code after you.

The workspace rule is explicit: **the diff is the comment** — a comment that
only describes *what* the code does is banned. Comments must carry *why*:
rationale, units, invariants, non-obvious trade-offs, links to tickets or
requirements. If the *what* is unclear, fix the name; don't add a comment to
compensate.

A name that is hard to pick signals unclear design (Ousterhout's red flag:
**Hard to Pick Name**). Don't push through; investigate the abstraction.

## Reflex card (the heuristics)

1. **Intention-revealing names.** A reader should infer purpose without reading
   the body. Name by what the thing *means in the domain*, not its type or
   mechanics (`expireStaleSessionsOlderThan` not `processData`).
2. **Length proportional to scope.** A loop-local `i` is fine; a module-level
   export needs a full, unambiguous name. The wider the scope, the higher the
   naming bar.
3. **Ban noise words.** `Manager / Helper / Util / Processor / Handler /
   Info / Data / Object / temp / obj` add syllables and no information. Cut them
   or replace them with the actual concept.
4. **No unexplained abbreviations.** `sesExp` is not a name. `sessionExpiryMs`
   is. Exception: universally understood acronyms (`http`, `url`, `id`).
5. **Booleans are predicates.** `isActive`, `hasAccess`, `canRetry` — not
   `active`, `access`, `retry` (those read as nouns or verbs, not conditions).
6. **Functions are verbs; things are nouns.** `expireSession()` not
   `sessionExpiry()`; `SessionCache` not `ManageSession`.
7. **One term per concept across the codebase.** Pick one of `fetch / get /
   load / retrieve` for the same operation and stick to it. Mixed vocabulary
   forces readers to wonder if they're different things.
8. **Named constants for magic literals.** `SESSION_EXPIRY_MS = 30 * 60 * 1000`
   not a bare `1800000`. The name is the documentation.
9. **Comments explain WHY, not WHAT.** Document rationale, units, invariants,
   gotchas, and non-obvious trade-offs. Delete comments that restate the code.
10. **A comment apologizing for code means fix the code.** `# this is a hack
    because...` → fix the hack, or open a ticket and link it.
11. **Keep comments next to what they describe; update them with the code.**
    A stale comment is worse than no comment — it is an active lie.

## Red flags

- Single-letter or opaque names outside tiny local scopes.
- `Manager / Helper / Util / Processor / data / result / temp / obj / item` in
  any identifier that crosses a function boundary.
- A comment that says exactly what the next line says (`# increment i` above
  `i += 1`).
- Commented-out dead code committed to the repo.
- A boolean named as a noun (`active` instead of `isActive`).
- The same concept called three different things in three files.
- A magic number or string literal with no name and no comment explaining it.
- A name you struggled to choose (Ousterhout: Hard to Pick Name — investigate
  the design before you commit to any name).
- A `Vague Name` (Ousterhout): too imprecise to convey useful information
  (`handle`, `process`, `do`).

## The procedure

For each new identifier:
1. Ask: "Could a stranger reading only this name — no body, no context — guess
   what it is and does?" If not, rename.
2. Check for noise words and abbreviations; eliminate both.
3. Check that the same concept is named consistently elsewhere in the codebase.

For each comment:
1. Ask: "Does this add information the code doesn't already carry?" If no,
   delete it.
2. If the *what* is unclear, fix the name. Don't add a comment to compensate.
3. If the comment is a `# TODO` or `# hack`, either fix it now or convert it
   to a tracked ticket and link the ticket number.

When a name is hard to pick: stop naming and investigate the abstraction. A
module with one clear responsibility names itself; one that does two things
can't be named without an `And`.

## Before / after

```python
# BEFORE — vague name, comment restates the code
def proc(d):
    # loop through data
    for item in d:
        if item["ts"] < time.time() - 1800:
            del_item(item)

# AFTER — intention-revealing name, comment carries WHY
# 30-minute threshold per §AUTH-112: tokens issued before this window
# cannot be rotated without a full re-auth, so we purge them proactively
# rather than let them accumulate and slow the next gc sweep.
SESSION_EXPIRY_SECS = 30 * 60

def expire_stale_sessions(sessions: list[Session]) -> None:
    cutoff = time.time() - SESSION_EXPIRY_SECS
    for session in sessions:
        if session.issued_at < cutoff:
            session_store.delete(session)
```

Changes: `proc` → `expire_stale_sessions` (verb + domain noun); `d` →
`sessions` (type-and-domain); `item` → `session`; `1800` → `SESSION_EXPIRY_SECS`
(named constant); comment deleted (restated the loop) and replaced with one that
explains the *why* — the requirement reference and the gc motivation.

## Critique mode

For each identifier: state whether a stranger could infer its purpose from the
name alone. For each comment: state whether it adds information the code doesn't
carry. Recommend rename or delete as appropriate. Tag findings:

`[naming-and-comments · vague-name · SEV]`
`[naming-and-comments · comment-repeats-code · SEV]`
`[naming-and-comments · hard-to-pick-name · SEV]`

`hard-to-pick-name` findings should also trigger a design investigation —
recommend the caller open a `right-sized-design` review on the surrounding
abstraction.

## References

- Vague Name, Hard to Pick Name, Comment Repeats Code, Nonobvious Code:
  `../../references/PRINCIPLES.md` §B (Ousterhout red flags table)
- Rule 9 ("Names carry intent; comments carry *why*"): `../../RULES.md`
- Workspace house rule: "the diff is the comment" — `../../RULES.md` Definition
  of Done
- Right-sizing abstractions that produce hard-to-name modules:
  `../right-sized-design/SKILL.md`
