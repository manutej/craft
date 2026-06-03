---
name: supply-chain-hygiene
description: >-
  The verification gate AI agents skip. Use whenever you add a dependency, ask
  "is this package safe", import a library, call an external API, pin versions,
  or check a package exists. Catches hallucinated packages (19.7% of AI
  suggestions, USENIX 2025), hallucinated APIs, typosquats, and inlined
  secrets before they reach the codebase. Triggers: "add a dependency", "is
  this package safe", "import this library", "call this API", "pin versions",
  "check this package exists", any new third-party import.
---

# supply-chain-hygiene — verify before you install, never inline secrets

**Purpose**: AI agents hallucinate dependencies and APIs with confidence. The
numbers are not academic: USENIX Security 2025 sampled 576,000 code completions
across 16 LLMs and found **~19.7% of recommended packages don't exist**
(open models ~21.7%, proprietary ~5.2%). Of those invented names, **43%
recurred on every one of 10 re-runs** — deterministic enough for attackers to
pre-register them before a developer runs `pip install`. Seth Larson (PSF)
coined the term: **slopsquatting**. Another 38% are string-similar to a real
package, making the typosquat indistinguishable at a glance. Agents also invent
methods, fields, and endpoint names that *feel correct* but aren't in the real
API — "confident liars that don't crash when unsure." And they inline secrets.
This skill is the verification gate for anything crossing into third-party or
external territory.

> Pair with `craft:robustness-at-boundaries` (which covers secret/config
> hygiene at the boundary) and `craft:dry-and-reuse` (which drives down the
> dependency count in the first place).

## Reflex card

1. **Confirm every new package exists on the real registry** before installing —
   PyPI (`pip index versions <pkg>` / pypi.org), npm (npmjs.com), or
   pkg.go.dev. Don't trust the name the agent produced; look it up.
2. **Confirm it's the intended package, not a typosquat.** Check download
   counts, maintenance activity, and first-publish date. `crossenv` vs
   `cross-env` is the canonical npm example. A package published yesterday with
   a name one character off a popular one is the attack.
3. **Justify the dependency.** Does stdlib or an existing dep already do this?
   A one-liner that replaces a two-liner is not worth a dependency. Every dep
   is attack surface and maintenance debt. (See `craft:dry-and-reuse`.)
4. **Pin versions and commit the lockfile.** `package-lock.json`, `poetry.lock`,
   `go.sum`. A floating version range on a security-sensitive package is a
   future incident.
5. **Don't call a method/field/endpoint you haven't confirmed in the real
   docs, types, or schema.** "It feels like it should exist" is exactly how
   hallucinated APIs ship. Check the actual type definitions or current
   documentation — not the agent's assertion, not a plausible-sounding name.
6. **Config lives in the environment, not in source.** Secrets, API keys,
   tokens, passwords, and environment-specific hostnames come from env vars or
   a secrets manager (12-Factor). Validate required secrets exist at startup;
   fail fast with a clear message.
7. **Never commit a `.env`.** Add it to `.gitignore` before the first commit,
   not after.

## Red flags

- An import of a package not in the manifest or lockfile.
- A brand-new dependency added for a one-liner that stdlib already covers.
- A package name one character off a popular one, or published this week.
- A method, field, or endpoint call you cannot locate in the library's actual
  source or published types.
- A hardcoded key, token, password, connection string, or prod URL in source.
- A committed `.env` or any file whose name suggests it holds credentials.
- An unpinned floating version range (`^`, `*`, `>=`) on a security-sensitive
  dep.
- `pip install` / `npm install` / `go get` of a name the agent produced rather
  than one you looked up.

## The procedure

For **every new dependency**:
1. Look up the name on the real registry — does it exist? Is the import name
   the same as the package name? (Python: `pip index versions <pkg>`;
   npm: `npm view <pkg>`; Go: `pkg.go.dev/<module>`.)
2. Confirm it's the intended package: check downloads, maintainers, age. Rule
   out typosquats.
3. Justify it: stdlib or an existing dep first. If neither fits, add and pin.
4. Commit the lockfile.

For **every external API call**:
1. Confirm the method/endpoint/field is real — current docs, published types,
   or the library's actual source. Not a prior conversation.

For **config and secrets**:
1. Pull from env; never inline.
2. At startup, check required keys are present and non-empty; crash early with
   a precise message naming the missing variable.
3. Verify `.env` is in `.gitignore` before the first commit.

## Example

```python
# Agent-generated: hallucinated package, inlined secret
import anthropic_client   # does not exist on PyPI
client = anthropic_client.Client(api_key="sk-ant-REDACTED...")

# Verified version: real package, env-sourced secret
import anthropic           # confirmed: pypi.org/project/anthropic
import os

api_key = os.environ["ANTHROPIC_API_KEY"]   # fail-fast if missing
if not api_key:
    raise RuntimeError("ANTHROPIC_API_KEY must be set")
client = anthropic.Anthropic(api_key=api_key)
```

`anthropic_client` sounds plausible. It doesn't exist. The real package is
`anthropic`. The name difference is exactly what slopsquatting exploits.

## Critique mode

For each new import or external call in the diff: is the package confirmed to
exist and be the canonical one? is the method/endpoint real and verified? is
any secret or env-specific value inlined? is the lockfile committed? Tag
findings:

`[supply-chain-hygiene · hallucinated-package|hallucinated-api|hardcoded-secret · SEV]`

A hallucinated package or hardcoded secret is **HIGH** by default. A plausible
but unverified API call is **MEDIUM** until the caller confirms it against real
docs.

## References

- Slopsquatting data (USENIX 2025, 576k samples):
  [`../../references/EVIDENCE.md`](../../references/EVIDENCE.md) §Slopsquatting
- Python supply-chain specifics:
  [`../../references/lang/python.md`](../../references/lang/python.md) §Supply chain
- TypeScript/JS supply-chain specifics:
  [`../../references/lang/typescript.md`](../../references/lang/typescript.md) §Supply chain
- Go supply-chain specifics:
  [`../../references/lang/go.md`](../../references/lang/go.md) §Supply chain
- Rule 12 (the always-on form of this skill):
  [`../../RULES.md`](../../RULES.md)
