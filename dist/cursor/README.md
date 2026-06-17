# craft — Cursor port

Modern Cursor (Project Rules) reads `.cursor/rules/*.mdc`. Install:

```bash
mkdir -p .cursor/rules
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/dist/cursor/craft.mdc \
  -o .cursor/rules/craft.mdc
```

Legacy Cursor (`.cursorrules`, single file) — just use RULES.md directly:

```bash
curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .cursorrules
```

Generated from `RULES.md` by `scripts/gen-ports.py` — do not edit by hand.
