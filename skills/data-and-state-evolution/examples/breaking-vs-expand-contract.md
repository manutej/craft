# Worked example — splitting a column the breaking way vs. the phased way

**The ask**: `users.name` holds full names; product needs separate `first_name` /
`last_name` for the new email templates.

## ❌ The one-shot version (looks complete, breaks production)

```sql
-- migration 0042_split_name.sql
ALTER TABLE users ADD COLUMN first_name TEXT NOT NULL;
ALTER TABLE users ADD COLUMN last_name  TEXT NOT NULL;
UPDATE users SET first_name = split_part(name, ' ', 1),
                 last_name  = split_part(name, ' ', 2);
ALTER TABLE users DROP COLUMN name;
```

```python
# deployed in the same release
def display_name(user):
    return f"{user.first_name} {user.last_name}"
```

Five failures hiding in eleven tidy lines:

1. **`NOT NULL` before the backfill** — the `ADD COLUMN` fails outright on any
   existing rows (or, on engines that allow it, the table is briefly
   unsatisfiable). Order matters.
2. **Unbatched `UPDATE`** — one statement rewrites every row in one transaction.
   At 10M rows that's a long exclusive lock; writes queue, latency spikes, the
   deploy "works" and the pager goes off anyway.
3. **`DROP COLUMN name` in the same deploy** — during rollout the previous code
   version is still running and still selects `name`. Every one of its queries
   500s until the old pods drain.
4. **`split_part(name, ' ', 2)` is a wrong-data generator** — "Mary Jane Watson"
   loses "Watson"; single-word names get an empty `last_name` that `NOT NULL`
   happily accepts. The migration *succeeds* and the data is silently wrong —
   the most expensive kind of failure (axis K: clean-but-wrong).
5. **No rollback** — once `name` is dropped, `down` cannot restore it. Reverting
   the deploy un-deploys the code but the data is gone.

## ✅ The expand → migrate → contract version

**Deploy 1 — expand (additive only, instantly safe):**

```sql
-- migration 0042_add_split_name_columns.sql
ALTER TABLE users ADD COLUMN first_name TEXT;   -- nullable during transition
ALTER TABLE users ADD COLUMN last_name  TEXT;
-- down: ALTER TABLE users DROP COLUMN first_name; ALTER TABLE users DROP COLUMN last_name;
```

```python
# code writes BOTH shapes, reads either
def set_name(user, first, last):
    user.first_name, user.last_name = first, last
    user.name = f"{first} {last}"            # keep the old shape alive

def display_name(user):
    if user.first_name is not None:
        return f"{user.first_name} {user.last_name}"
    return user.name                          # old rows still work
```

**Deploy 2 — migrate (batched backfill, resumable, off the schema path):**

```python
# backfill_split_names.py — run as a job, not a migration
while batch := next_unfilled_batch(limit=5_000):       # bounded lock per batch
    for u in batch:
        u.first_name, u.last_name = split_full_name(u.name)  # handles 1- and 3-word names
    commit()
```

**Deploy 3+ — contract (each its own change, after verification):**

```sql
ALTER TABLE users ALTER COLUMN first_name SET NOT NULL;  -- now the real constraint
ALTER TABLE users ALTER COLUMN last_name  SET NOT NULL;
-- ...and only after no reader touches it for a full release cycle:
ALTER TABLE users DROP COLUMN name;
```

## The evidence that makes it "done"

```text
$ ./scripts/migrate --dry-run --target 0042 --db copy_of_prod
0042_add_split_name_columns: OK  (10,481,332 rows unaffected, 0.4s, additive)
$ ./scripts/migrate --rollback --target 0041 --db copy_of_prod
0042 down: OK (columns dropped, 0.3s)
$ python backfill_split_names.py --db copy_of_prod --dry-run
2,097 batches × 5,000 rows · max batch 1.8s · 312 rows flagged AMBIGUOUS_NAME → review file
```

No copy-of-prod dry-run, no rollback run, no batch timing → the migration is
**unverified**, whatever the diff looks like.

## The senior tell

The one-shot version is *shorter* and reads *cleaner* — which is exactly why
on-sight review passes it. Safety here lives in the **deploy sequencing**, not in
the SQL text. That is why this skill exists as its own lens instead of a bullet
under code review.
