#!/usr/bin/env python3
"""gen-ports.py — generate per-platform rule ports from the single source RULES.md.

craft's own rule #4 is "consolidate, don't clone." So we do NOT keep five hand-edited
copies of the constitution. RULES.md is the source of truth; every agentic-coding
platform that wants the rules inline (rather than curl-ing RULES.md directly) gets a
generated port here. Re-run after editing RULES.md:

    python3 scripts/gen-ports.py

Most platforms (Windsurf, Cline, Codex/AGENTS.md, Aider) read a plain rules file, so
their install is just `curl RULES.md -o <target>` and they need no generated file.
Only formats that require a wrapper (Cursor .mdc frontmatter) are emitted here.
GitHub Copilot keeps its richer hand-authored port under dist/github-copilot/.
"""
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
RULES = (ROOT / "RULES.md").read_text(encoding="utf-8")

# Cursor: modern .cursor/rules/*.mdc needs YAML frontmatter to be always-applied.
cursor = ROOT / "dist" / "cursor"
cursor.mkdir(parents=True, exist_ok=True)
mdc = (
    "---\n"
    "description: craft — senior-engineer code-quality guardrails (anti AI-slop)\n"
    "globs:\n"
    "alwaysApply: true\n"
    "---\n\n"
    + RULES
)
(cursor / "craft.mdc").write_text(mdc, encoding="utf-8")

# A tiny per-platform README so the dist folder is self-explanatory.
(cursor / "README.md").write_text(
    "# craft — Cursor port\n\n"
    "Modern Cursor (Project Rules) reads `.cursor/rules/*.mdc`. Install:\n\n"
    "```bash\n"
    "mkdir -p .cursor/rules\n"
    "curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/dist/cursor/craft.mdc \\\n"
    "  -o .cursor/rules/craft.mdc\n"
    "```\n\n"
    "Legacy Cursor (`.cursorrules`, single file) — just use RULES.md directly:\n\n"
    "```bash\n"
    "curl -fsSL https://raw.githubusercontent.com/manutej/craft/main/RULES.md -o .cursorrules\n"
    "```\n\n"
    "Generated from `RULES.md` by `scripts/gen-ports.py` — do not edit by hand.\n",
    encoding="utf-8",
)

print(f"wrote {cursor/'craft.mdc'} ({len(mdc)} bytes)")
print(f"wrote {cursor/'README.md'}")
print("other platforms install by curl-ing RULES.md directly — no generated file needed.")
