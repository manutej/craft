# craft → mechanical enforcement

Rules raise the floor; **gates** are what actually change behavior. The data is blunt:
rules-as-prose earn **~25–40%** compliance, but the same rules enforced as runtime
checks reach **~95%**. This folder is the enforcement layer for repos that adopt `craft`.

## The enforcement ladder (bottom → top, each adds compliance)

| Rung | What | Where it lives |
|---|---|---|
| 1. **Always-on rules** | the 12-rule constitution in the agent's context | `RULES.md` → `.github/copilot-instructions.md` (Copilot port) |
| 2. **AI reviewer** | Copilot's automated PR review, reading those rules | GitHub setting (below) |
| 3. **Required CI gate** | your linters + type-checker + tests, red blocks merge | [`senior-gate.yml`](senior-gate.yml) |
| 4. **Branch protection** | the gate is *required*, not optional | repo Settings → Branches |

Rungs 1–2 catch judgment; rungs 3–4 are the hard stop. You want all four.

## 1. Install the CI gate

```bash
cp dist/ci/senior-gate.yml  /your/repo/.github/workflows/senior-gate.yml
```

Open it, uncomment the block for your stack (Node / Python / Go), and replace the
placeholder step with your real `lint` + `typecheck` + `test` commands. Commit.

## 2. Make it required (this is the part people skip)

GitHub → repo **Settings → Branches → Add branch ruleset / protection rule** for `main`:

- ✅ **Require status checks to pass** → add **`senior-gate`**
- ✅ **Require a pull request before merging**

A gate that isn't *required* is just a suggestion with extra steps.

## 3. Turn on Copilot's automated PR review

Copilot's PR review reads `.github/copilot-instructions.md` (shipped in the
[`../github-copilot/`](../github-copilot/) bundle), so it reviews against the craft rules.

- **Per repo / org:** GitHub → **Settings → Copilot → Code review** → enable automatic
  review, **or** add a repository ruleset that **requests Copilot review** on every PR.
- **Manually:** on any PR, add **Copilot** as a reviewer.

Copilot is rung 2 — a fast first pass. It is *not* a substitute for rung 3: an AI
reviewer can miss things and its approval is not a green build. Keep the CI gate required.

## Why this exists

> An AI agent's confidence is near-zero signal — Stanford showed AI-assisted developers
> were *more* confident and *more* wrong. Don't trust "it's production-ready." Make the
> build prove it.

See [`../../references/EVIDENCE.md`](../../references/EVIDENCE.md) for the numbers.
