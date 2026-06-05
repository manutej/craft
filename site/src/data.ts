import {
  Scissors,
  ShieldCheck,
  Copy,
  FlaskConical,
  Bug,
  Split,
  Tag,
  PackageCheck,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const REPO_URL = 'https://github.com/manutej/craft'

export interface Skill {
  name: string
  icon: LucideIcon
  accent: 'gold' | 'teal'
  blurb: string
  catches: string
}

/** The eight functional skills — descriptions distilled from each SKILL.md. */
export const SKILLS: Skill[] = [
  {
    name: 'right-sized-design',
    icon: Scissors,
    accent: 'gold',
    blurb: 'Fights over-engineering and premature abstraction — the #1 documented AI coding failure.',
    catches: 'Speculative factories, interfaces with one impl, "while I\'m here" scope creep.',
  },
  {
    name: 'robustness-at-boundaries',
    icon: ShieldCheck,
    accent: 'teal',
    blurb: 'The robustness the AI skips. Validate where untrusted data enters; never swallow errors.',
    catches: 'Unchecked inputs, catch-{}-into-silence, hardcoded secrets, errors that vanish.',
  },
  {
    name: 'dry-and-reuse',
    icon: Copy,
    accent: 'gold',
    blurb: 'Stops duplication and reinvention — the "rework" GitClear measures as a short shelf life.',
    catches: 'Copy-pasted blocks, re-implemented helpers, knowledge duplicated across files.',
  },
  {
    name: 'trustworthy-tests',
    icon: FlaskConical,
    accent: 'teal',
    blurb: 'Makes tests prove something, and makes "done" mean done.',
    catches: 'Tautological tests asserting on their own mocks, tests that mirror the code, fake-green CI.',
  },
  {
    name: 'code-smells',
    icon: Bug,
    accent: 'gold',
    blurb: "Detection lens for Fowler's five smell families — names the smell, states the change-cost.",
    catches: 'Duplicate Code and Speculative Generality — the two AI-signature smells, ranked worst-first.',
  },
  {
    name: 'effects-and-purity',
    icon: Split,
    accent: 'teal',
    blurb: 'Separates pure decision logic from I/O so code is testable — without demanding religious purity.',
    catches: 'Business logic tangled with I/O; pragmatic functional core, imperative shell.',
  },
  {
    name: 'naming-and-comments',
    icon: Tag,
    accent: 'gold',
    blurb: 'Names and comments are the primary channel through which code communicates intent.',
    catches: 'Vague names (data, result, handle, manager, temp) and comments that restate the code.',
  },
  {
    name: 'supply-chain-hygiene',
    icon: PackageCheck,
    accent: 'teal',
    blurb: 'The verification gate AI agents skip — before a hallucinated import reaches your lockfile.',
    catches: 'Hallucinated packages & APIs, typosquats, inlined secrets.',
  },
]

export interface Rule {
  n: number
  title: string
}

/** The 12-rule constitution (verbatim short form from RULES.md). */
export const RULES: Rule[] = [
  { n: 1, title: 'Smallest change that satisfies the request.' },
  { n: 2, title: 'No abstraction until it has earned its place (≥2–3 real call sites).' },
  { n: 3, title: 'Search before you build.' },
  { n: 4, title: "Consolidate, don't clone." },
  { n: 5, title: 'Match the codebase, not your defaults.' },
  { n: 6, title: 'Validate at the boundary; never swallow errors.' },
  { n: 7, title: 'Keep decision logic pure; quarantine side effects at the edges.' },
  { n: 8, title: 'Clear beats clever.' },
  { n: 9, title: 'Names carry intent; comments carry why.' },
  { n: 10, title: 'No tautological tests; prove it actually ran.' },
  { n: 11, title: 'Before refactoring untested code, pin it first.' },
  { n: 12, title: "Trust no dependency or API you haven't verified exists." },
]

export interface Stat {
  label: string
  value: number
  decimals?: number
  prefix?: string
  suffix: string
  arrow: '↑' | '↓'
  pct: number
  tone: 'danger' | 'teal'
  source: string
}

/** Headline empirical stats (verbatim figures from references/EVIDENCE.md). */
export const STATS: Stat[] = [
  {
    label: 'Duplicated code blocks',
    value: 8,
    suffix: '×',
    arrow: '↑',
    pct: 92,
    tone: 'danger',
    source: 'GitClear · 211M changed lines · 2024',
  },
  {
    label: 'Code churn — reverted within 2 weeks',
    value: 2,
    suffix: '×',
    arrow: '↑',
    pct: 60,
    tone: 'danger',
    source: '3.1% (2020) → 5.7% (2024)',
  },
  {
    label: 'Refactoring — the good kind of change',
    value: 60,
    suffix: '%',
    arrow: '↓',
    pct: 40,
    tone: 'teal',
    source: 'moved lines: 25% → under 10% of changes',
  },
  {
    label: 'AI-suggested packages that do not exist',
    value: 19.7,
    decimals: 1,
    suffix: '%',
    arrow: '↑',
    pct: 70,
    tone: 'danger',
    source: 'USENIX Security 2025 · 576,000 samples',
  },
]

export interface CodeLine {
  text: string
  tone?: 'muted' | 'danger' | 'good' | 'accent'
}

export interface CodeSample {
  filename: string
  lang: string
  lines: CodeLine[]
}

export const SLOP_SAMPLE: CodeSample = {
  filename: 'users.py',
  lang: 'the AI default',
  lines: [
    { text: '# factory + interface for exactly ONE concrete user', tone: 'muted' },
    { text: 'class AbstractUserBuilder(ABC):' },
    { text: '    @abstractmethod' },
    { text: '    def build(self, data): ...' },
    { text: '' },
    { text: 'class UserBuilder(AbstractUserBuilder):' },
    { text: '    def build(self, data):' },
    { text: '        try:' },
    { text: '            return User(data["name"], data["email"])' },
    { text: '        except Exception:' },
    { text: '            return None   # the error vanishes here', tone: 'danger' },
  ],
}

export const CRAFT_SAMPLE: CodeSample = {
  filename: 'users.py',
  lang: 'with craft',
  lines: [
    { text: '# validate at the boundary; one obvious function', tone: 'muted' },
    { text: 'def parse_user(payload: dict) -> User:' },
    { text: '    data = UserInput.model_validate(payload)   # raises on bad input', tone: 'accent' },
    { text: '    return User(name=data.name, email=data.email)', tone: 'good' },
    { text: '' },
    { text: '# no abstraction without 2–3 real call sites.' , tone: 'muted'},
    { text: '# no swallowed errors. no dead interface.', tone: 'muted' },
    { text: '# the diff matches exactly what was asked for.', tone: 'muted' },
  ],
}

export const INSTALL_CLAUDE: CodeSample = {
  filename: 'Claude Code',
  lang: 'bash',
  lines: [
    { text: '# clone the plugin into your Claude Code plugins', tone: 'muted' },
    { text: 'git clone https://github.com/manutej/craft \\' },
    { text: '    ~/.claude/plugins/craft' },
    { text: '' },
    { text: '# skills auto-load by description. audit any diff:', tone: 'muted' },
    { text: '/senior-review', tone: 'accent' },
  ],
}

export const INSTALL_COPILOT: CodeSample = {
  filename: 'GitHub Copilot',
  lang: 'bash',
  lines: [
    { text: '# drop the Copilot port into your repo', tone: 'muted' },
    { text: 'cp -r craft/dist/github-copilot/.github .' },
    { text: '' },
    { text: '# Copilot now reviews every PR against the 12 rules', tone: 'muted' },
    { text: '#   — completions, chat, and automated PR review', tone: 'muted' },
    { text: 'git add .github && git commit -m "adopt craft"', tone: 'good' },
  ],
}

export interface Source {
  title: string
  author: string
}

export const SOURCES: Source[] = [
  { title: 'The Pragmatic Programmer', author: 'Hunt & Thomas — DRY, ETC, orthogonality' },
  { title: 'Refactoring', author: 'Martin Fowler — the five smell families' },
  { title: 'A Philosophy of Software Design', author: 'John Ousterhout — deep vs shallow modules' },
  { title: 'Working Effectively with Legacy Code', author: 'Michael Feathers — characterization tests' },
  { title: 'The Grug Brained Developer', author: 'on the complexity demon' },
  { title: 'Boundaries', author: 'Gary Bernhardt — functional core, imperative shell' },
]
