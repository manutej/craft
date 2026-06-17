---
applyTo: '**'
description: Data outlives code — change schemas, payloads, and event shapes in phases (expand → migrate → contract), with dry-run evidence.
---

# Data & State Evolution

A wrong code deploy reverts in minutes; a wrong data migration can be unrecoverable.
The riskiest migration slop is invisible in the diff — it only shows up at production
scale, mid-deploy, or in the rollback you never tested.

## Do
- Ship every backward-incompatible shape change as **expand → migrate → contract**:
  add the new shape alongside the old, move every reader/writer, remove the old shape
  as its own later change.
- Keep old and new code working against the same schema for at least one deploy window.
- Treat migrations as code: versioned, reviewed, tested — with a rollback that was
  actually run, not a stub.
- Dry-run forward **and** rollback on a copy with production-scale data; record row
  counts and timing as evidence.
- Give every `NOT NULL` a default or a completed backfill; restore the real constraint
  (`SET NOT NULL`) once the backfill is done.
- Run large backfills in bounded, resumable batches, separate from the schema change.
- Introduce a new field when a field's **meaning** changes; never reuse the name.

## Red flags
- `DROP`/`RENAME` of a column/table in the same deploy as the code change that reads it.
- `ADD COLUMN ... NOT NULL` with no default and no backfill.
- A migration whose `down` is empty or raises NotImplemented.
- Schema change + backfill + code change in one deploy or one transaction.
- An unbatched `UPDATE` on a table whose production size you don't know.
- Type narrowing with no audit of existing values; enum values removed while rows hold them.
- "Tested locally" on an empty database.

## The bar
No copy-of-prod dry-run, no rollback run, no batch timing → the migration is
**unverified**. Say so instead of calling it done.
