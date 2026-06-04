#!/usr/bin/env python3
"""
craft repo integrity check — dogfooding our own quality bar.

Runs in CI (.github/workflows/validate.yml) and locally:  python scripts/validate.py

Checks, with zero third-party dependencies (stdlib only):
  1. plugin.json is valid JSON and declares name + version + description.
  2. Every skills/*/SKILL.md opens with YAML frontmatter carrying name + description.
  3. Every dist/**/instructions/*.instructions.md declares an applyTo glob.
  4. Every committed .svg parses as well-formed XML and contains no <script>.
  5. Every relative Markdown link / image path resolves on disk
     (brace-globs like {a,b}.md and wildcards are skipped, by design).

Exit code is non-zero if any check fails, so it can gate a merge.
"""
from __future__ import annotations
import json, re, sys, glob
from pathlib import Path
from xml.dom import minidom

ROOT = Path(__file__).resolve().parent.parent
errors: list[str] = []
checks = 0


def ok(cond: bool, msg: str) -> None:
    global checks
    checks += 1
    if not cond:
        errors.append(msg)


# 1 — plugin manifest
manifest = ROOT / ".claude-plugin" / "plugin.json"
try:
    data = json.loads(manifest.read_text())
    for key in ("name", "version", "description"):
        ok(key in data, f"plugin.json missing required key: {key}")
except Exception as e:  # noqa: BLE001 — surface any manifest failure clearly
    ok(False, f"plugin.json is not valid JSON: {e}")

# 2 — skill frontmatter
for skill in sorted(ROOT.glob("skills/*/SKILL.md")):
    text = skill.read_text()
    rel = skill.relative_to(ROOT)
    if not text.startswith("---"):
        ok(False, f"{rel}: missing YAML frontmatter")
        continue
    fm = text.split("---", 2)[1]
    ok("name:" in fm, f"{rel}: frontmatter missing `name:`")
    ok("description:" in fm, f"{rel}: frontmatter missing `description:`")

# 3 — Copilot instruction files declare applyTo
for inst in sorted(ROOT.glob("dist/**/instructions/*.instructions.md")):
    ok("applyTo:" in inst.read_text(), f"{inst.relative_to(ROOT)}: missing `applyTo:`")

# 4 — SVG well-formedness + no scripts
for svg in sorted(ROOT.glob("**/*.svg")):
    rel = svg.relative_to(ROOT)
    raw = svg.read_text()
    try:
        minidom.parseString(raw)
    except Exception as e:  # noqa: BLE001
        ok(False, f"{rel}: not well-formed XML: {e}")
    ok("<script" not in raw, f"{rel}: contains <script> (stripped by GitHub; avoid)")

# 5 — relative markdown links / image paths resolve
LINK = re.compile(r"\]\(([^)]+\.md)\)|src=\"([^\"]+\.svg)\"|\]\(([^)]+\.svg)\)")
for md in sorted(ROOT.glob("**/*.md")):
    base = md.parent
    for m in LINK.finditer(md.read_text()):
        rel = next(g for g in m.groups() if g).split("#")[0]
        if rel.startswith(("http://", "https://")) or any(c in rel for c in "{}*"):
            continue  # external or intentional glob — not a filesystem assertion
        target = (base / rel).resolve()
        ok(target.exists(), f"{md.relative_to(ROOT)}: broken link -> {rel}")

# report
total_svgs = len(list(ROOT.glob("**/*.svg")))
total_skills = len(list(ROOT.glob("skills/*/SKILL.md")))
print(f"craft validate — {checks} assertions over "
      f"{total_skills} skills, {total_svgs} svgs")
if errors:
    print(f"\n✗ {len(errors)} problem(s):")
    for e in errors:
        print(f"  - {e}")
    sys.exit(1)
print("✓ all checks passed")
