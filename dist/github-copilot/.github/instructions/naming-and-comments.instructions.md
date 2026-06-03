---
applyTo: '**'
description: Names carry intent; comments carry why — delete anything that restates the code.
---

# Naming and Comments

The diff is the comment. A comment that describes *what* the code does is banned; comments must carry *why*.

## Do
- Name by what a thing means in the domain, not its type or mechanics (`expireStaleSessionsOlderThan`, not `processData`).
- Scale name length to scope: loop-local `i` is fine; a module-level export needs a full, unambiguous name.
- Make booleans predicates: `isActive`, `hasAccess`, `canRetry` — not `active`, `access`, `retry`.
- Functions are verbs; things are nouns: `expireSession()` not `sessionExpiry()`.
- Use one term per concept across the codebase; mixed vocabulary implies different things.
- Name magic numbers and strings as constants; the name is the documentation.
- Write comments that explain rationale, units, invariants, gotchas, or ticket links.
- Delete comments that restate the next line.
- When a name is hard to pick, investigate the abstraction — a module with one responsibility names itself.

## Red flags
- Single-letter or opaque names outside tiny local scopes.
- `Manager / Helper / Util / Processor / data / result / temp / obj / item` crossing a function boundary.
- A comment that says exactly what the next line says.
- Commented-out dead code committed to the repo.
- A boolean named as a noun (`active` instead of `isActive`).
- The same concept named three different ways in three files.
- A magic number or string literal with no name and no explaining comment.
- A name you struggled to choose — stop and investigate the surrounding design.
- A `# this is a hack because...` comment with no fix and no linked ticket.
