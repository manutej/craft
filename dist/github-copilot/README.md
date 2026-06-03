# craft → GitHub Copilot port

The `craft` senior-engineer guardrails, repackaged for **GitHub Copilot** so the same
rules apply whether your team codes in Claude Code or in Copilot (with GPT, Claude, or
any model Copilot supports). This is a drop-in `.github/` bundle.

## What's here

```
.github/
├── copilot-instructions.md          ← always-on constitution (the 12 rules + Definition of Done)
├── instructions/                    ← path-triggered guidance (VS Code)
│   ├── right-sized-design.instructions.md        applyTo: **
│   ├── robustness-at-boundaries.instructions.md  applyTo: **
│   ├── dry-and-reuse.instructions.md             applyTo: **
│   ├── trustworthy-tests.instructions.md         applyTo: **
│   ├── code-smells.instructions.md               applyTo: **
│   ├── effects-and-purity.instructions.md        applyTo: **
│   ├── naming-and-comments.instructions.md       applyTo: **
│   ├── supply-chain-hygiene.instructions.md      applyTo: **
│   ├── python.instructions.md                    applyTo: **/*.py
│   ├── typescript.instructions.md                applyTo: **/*.{ts,tsx,js,jsx,mjs,cjs}
│   └── go.instructions.md                        applyTo: **/*.go
└── prompts/
    └── senior-review.prompt.md      ← /senior-review merge-gate review (VS Code Copilot Chat)
```

## Install (per target repo)

Copy the bundle into the repo you want guarded:

```bash
cp -r path/to/craft/dist/github-copilot/.github  /your/repo/.github
# (merge, don't clobber, if the repo already has a .github/)
git add .github && git commit -m "Add craft engineering guardrails for Copilot"
```

## What each piece does, and where it works

| File | Surface | Trigger |
|---|---|---|
| `copilot-instructions.md` | Completions, Copilot Chat, **PR code review** — VS Code, JetBrains, Visual Studio, github.com | **Always on** |
| `instructions/*.instructions.md` | Copilot Chat & edits in **VS Code** | When an edited file matches the `applyTo` glob |
| `prompts/senior-review.prompt.md` | **VS Code** Copilot Chat | Type `/senior-review` |

- **`copilot-instructions.md` is the high-value piece** — it's honored across every
  Copilot surface and every model, including Copilot's automated pull-request review.
  If you adopt only one file, adopt this one.
- The `instructions/` and `prompts/` folders are **VS Code** Copilot features today;
  other IDEs honor `copilot-instructions.md` but may ignore the other two.

## Honest limitations vs. the Claude Code version

This port trades fidelity for portability. Know the gaps:

- **No intent-based auto-trigger.** Claude Code skills fire on *what you're doing*;
  Copilot instructions fire on *which file you touched* (`applyTo` glob) or are always
  on. Coarser, but works.
- **No mechanical enforcement.** Copilot has no hooks, so you can't gate "done" the way
  Claude Code can. Compliance with prose instructions is partial — **wire the rules into
  your CI** (linters, type-checks, tests) and Copilot's PR review to get real
  enforcement. The instructions raise the floor; CI is the gate.
- **No on-demand references.** The deep rationale (the books, the data) isn't loaded the
  way Claude Code loads `references/` on demand. The condensed rules carry the essentials;
  the full source lives in the `craft` plugin.

## Source of truth

This bundle is generated from the `craft` Claude Code plugin (one directory up). Edit the
plugin's `RULES.md` and `skills/*/SKILL.md`, then regenerate — don't hand-edit the port in
isolation, or the two will drift.
