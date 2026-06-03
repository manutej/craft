---
applyTo: '**'
description: Search before you build; one authoritative home per piece of knowledge.
---

# DRY and Reuse

Every piece of knowledge has one authoritative representation. Duplicated blocks carry 15–50% more defects (GitClear, 211M-line study).

## Do
- Search the codebase (and stdlib/existing deps) before writing any helper, util, type, or constant.
- Copy-paste → extract to one place and call it twice instead.
- Let diffs delete and relocate code, not only add it; a pure-addition diff on a large change is a reuse miss.
- Define each validation rule, status enum, magic constant, and business calculation once and import it everywhere.
- Reach for `itertools`, `lodash-es`, `slices`, `Intl` before reinventing them.
- Search by *intent* (what it does), not just by name — agents miss helpers by searching the wrong noun.
- Distinguish knowledge duplication (consolidate) from incidental similarity (leave separate).

## Red flags
- A new function whose body already exists elsewhere in the repo.
- The same constant, regex, URL, or status string in 2+ files.
- A block copy-pasted and lightly edited.
- The same business rule (discount, permission check, tax) computed in several places.
- A util that re-implements `groupBy`, `debounce`, `chunk`, `deepEqual`, or date math.
- A `v2` function sitting next to `v1` with 90% overlap.
- A large diff that only ever adds, never moves or deletes.
