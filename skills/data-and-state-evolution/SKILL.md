---
name: data-and-state-evolution
description: >-
  Makes schema, migration, and data-shape changes safe to ship. Use when writing a
  database migration, altering a table, adding/renaming/dropping a column, changing
  the shape of an API payload / event / serialized object, backfilling data, or
  reviewing any diff that touches persistent state. Catches one-shot breaking
  changes, NOT NULL without backfill, missing/untested rollbacks, nullability
  drift, and backfills that lock production tables. Enforces expand→migrate→
  contract, one-deploy-window backward compatibility, and dry-run-on-a-copy
  evidence. Triggers: "write a migration", "alter table", "add a column", "rename
  this field", "change the schema", "is this migration safe", "change this
  response/event shape", "backfill".
---

# data-and-state-evolution — data outlives code; change its shape in phases

**Purpose**: code review optimizes for what a senior catches *on sight*, but the
highest-cost slop in this category is invisible in a diff: a migration that is fine on
the empty dev DB and locks a 10M-row table in prod, a renamed column that 500s the old
code still running mid-deploy, a backfill with no rollback. A wrong code deploy reverts
in minutes; a wrong data migration can be unrecoverable. That asymmetry demands its own
discipline — this skill is it.

> Scope: anything with a persisted or shared *shape* — DB schemas, API
> request/response payloads, event/queue messages, serialized caches, file formats.
> For the error-handling and validation *around* that data, pair with
> `craft:robustness-at-boundaries`; for proving the migration ran, `craft:trustworthy-tests`.

## Reflex card

1. **Expand → migrate → contract — never break in one step.** Any
   backward-incompatible change to a shape something else reads ships as three
   changes: add the new shape alongside the old, migrate every reader/writer, then
   remove the old shape as its own later change. *(Sato's Parallel Change.)*
2. **Survive one deploy window.** During rollout, old code and new code run against
   the same schema simultaneously. If the old version crashes on the new schema (or
   vice versa), the change is not safe — phase it.
3. **Migrations are code** — versioned, reviewed, tested, deployed with the same rigor
   as application changes. "All database changes are migrations." *(Fowler & Sadalage.)*
4. **Every migration has a tested rollback.** A `down` that raises
   `NotImplementedError` is a one-way door pretending to be a migration. If rollback
   is truly impossible (data destroyed), say so explicitly and get sign-off — don't
   hide it behind an empty stub.
5. **Dry-run on a copy at production scale** before prod. Forward *and* rollback. An
   empty dev database proves syntax, not safety — row counts, lock time, and
   constraint violations only show up at scale.
6. **Watch nullability and defaults drift.** `NOT NULL` without a default *and* a
   backfill breaks every existing row. Loosening to nullable quietly moves the crash
   downstream — every consumer now needs a null path it doesn't have. Changing a
   default changes behavior for every caller that relied on the old one.
7. **Batch big backfills.** `UPDATE` on a large table in one statement/transaction
   locks it for the duration. Backfill in bounded batches, separately from the schema
   change, resumable if interrupted.
8. **Never change a field's meaning while keeping its name.** A reader can't tell
   "old semantics" from "new semantics" by looking at the value. New meaning → new
   field; retire the old one through expand/contract.

## Red flags (run these on your own diff)

- `DROP`/`RENAME` of a column/table in the **same deploy** as the code change that
  stops (or starts) reading it.
- `ADD COLUMN ... NOT NULL` with no default and no backfill step.
- A migration with no `down`, or a `down` that is `pass` / raises NotImplemented.
- Schema change + data backfill + code change all in **one** deploy/transaction.
- An unbatched `UPDATE`/`ALTER` touching a table whose production size you don't know.
- Type narrowing (shrinking a VARCHAR, int→smallint, dropping precision) with no
  audit of existing max values.
- An enum/check-constraint value removed while rows still hold it.
- An event/API field whose **meaning** changed but whose name didn't.
- "Tested it locally" where local = an empty or toy-sized database.

## The decision procedure

For any change to a persisted/shared shape, in order:
1. **Who reads this shape today?** List them: code paths, other services, queue
   consumers, analytics jobs, cached serializations. Unknown readers = not ready.
2. **Can the *currently deployed* code run against the new schema?** If no →
   expand/contract; never a one-shot.
3. **Sequence it**: (a) expand — additive schema change, deploy; (b) code
   writes both / reads either, deploy; (c) backfill, batched; (d) flip reads to the
   new shape, deploy; (e) contract — drop the old shape, as its own change, later.
4. **Dry-run forward and rollback on a copy** with production-scale data. Record row
   counts and timing.
5. **Paste the evidence** — the dry-run output is part of the diff's
   Definition of Done, not an optional extra.

Steps 3–4 scale with blast radius: a column on a 100-row internal config table does
not need the full ceremony — but you must be able to *say* the blast radius is small,
not assume it.

## Before / after (compact — worked example in `examples/`)

```sql
-- ❌ One deploy: breaks every running instance that still writes `username`
ALTER TABLE users RENAME COLUMN username TO handle;

-- ✅ Expand → migrate → contract (three deploys)
ALTER TABLE users ADD COLUMN handle TEXT;                     -- 1. expand (additive)
-- 2. code writes both, reads handle ?? username; batched backfill
UPDATE users SET handle = username WHERE handle IS NULL AND id BETWEEN :lo AND :hi;
ALTER TABLE users DROP COLUMN username;                       -- 3. contract (own deploy, later)
```

## What this is NOT (don't over-correct)

- **Not schema fear.** Evolutionary design *expects* the schema to change
  continuously; the point is phasing, not freezing.
- **Not "make everything nullable."** Nullable-by-default is its own drift — after
  the backfill completes, contract to the real constraint (`SET NOT NULL`).
- **Not heavyweight DBA process everywhere.** The numbers here (one deploy window,
  batch sizes) are defaults that proxy for *blast radius* — a tiny internal table
  earns a lighter path, a 10M-row hot table earns a heavier one. Judge the radius;
  don't apply ceremony mechanically.

## Critique mode

For each schema/data/shape change in the diff: name the readers; check it survives a
deploy window (old + new code concurrently); check the rollback exists *and was run*;
check NOT NULL/defaults/backfill; check backfill batching against the table's real
size; check no field changed meaning under a stable name. No dry-run evidence → the
change is unverified, say so. Tag findings `[data-and-state-evolution ·
breaking-shape-change|no-rollback|nullability-drift|unbatched-backfill|semantic-drift
· SEV]`.

## References
- Worked before/after: `examples/breaking-vs-expand-contract.md`
- Parallel change (expand/contract), evolutionary database design: `../../references/PRINCIPLES.md` §D
- Rule 13 + Definition of Done: `../../RULES.md`
