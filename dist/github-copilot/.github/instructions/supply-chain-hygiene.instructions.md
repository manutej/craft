---
applyTo: '**'
description: Verify every new dependency exists and is canonical before installing; never inline secrets.
---

# Supply Chain Hygiene

~19.7% of AI-suggested packages don't exist (USENIX 2025, 576k completions); 43% of hallucinated names recur deterministically — enough for attackers to pre-register them (slopsquatting). Verify before you install.

## Do
- Look up every new package on the real registry before installing: `pip index versions <pkg>` / pypi.org, npmjs.com, pkg.go.dev.
- Confirm it's the intended package: check download counts, maintainer history, and first-publish date. A package published this week with a name one character off a popular one is the attack.
- Justify each dependency: does stdlib or an existing dep already do this? Every dep is attack surface and maintenance debt.
- Pin versions and commit the lockfile (`package-lock.json`, `poetry.lock`, `go.sum`).
- Confirm every called method, field, or endpoint exists in the real docs, published types, or library source — not in the agent's assertion.
- Pull secrets, API keys, tokens, and env-specific hostnames from env vars or a secrets manager; validate presence at startup and fail fast.
- Add `.env` to `.gitignore` before the first commit.

## Red flags
- An import of a package not in the manifest or lockfile.
- A new dependency added for a one-liner that stdlib already covers.
- A package name one character off a popular one, or published this week.
- A method, field, or endpoint call not locatable in the library's actual source or published types.
- A hardcoded API key, token, password, connection string, or prod URL in source.
- A committed `.env` or any file whose name suggests it holds credentials.
- An unpinned floating version range (`^`, `*`, `>=`) on a security-sensitive dep.
- Running `pip install` / `npm install` / `go get` of a name the AI produced without verifying it first.
