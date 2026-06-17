import {
  Scissors,
  ShieldCheck,
  Copy,
  FlaskConical,
  Bug,
  Split,
  Tag,
  PackageCheck,
  Database,
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

/** The nine functional skills — descriptions distilled from each SKILL.md. */
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
  {
    name: 'data-and-state-evolution',
    icon: Database,
    accent: 'gold',
    blurb: 'Makes schema, migration, and data-shape changes safe to ship — the slop a diff can\'t show.',
    catches: 'One-shot breaking changes, NOT NULL without backfill, missing rollbacks, table-locking backfills.',
  },
]

export interface Rule {
  n: number
  title: string
}

/** The 13-rule constitution (verbatim short form from RULES.md). */
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
  { n: 13, title: 'Data outlives code: change persistent shapes in phases, never in one shot.' },
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
    { text: '# Copilot now reviews every PR against the 13 rules', tone: 'muted' },
    { text: '#   — completions, chat, and automated PR review', tone: 'muted' },
    { text: 'git add .github && git commit -m "adopt craft"', tone: 'good' },
  ],
}

/* ─────────────────────── Install matrix (per platform) ─────────────────────── */

export interface Platform {
  id: string
  name: string
  /** One letter monogram shown in the selector chip. */
  mark: string
  /** What craft does once installed on this platform. */
  tagline: string
  /** The file/path the rules land in. */
  target: string
  /** Exact, click-to-copy install command. Single source: RULES.md. */
  command: string
  /** Optional follow-up tip or deeper-port link. */
  note?: string
}

const RAW = 'https://raw.githubusercontent.com/manutej/craft/main'

/** Every command is copy-paste runnable as-is. The constitution has ONE source
 *  (RULES.md); each platform just points its rules file at it. */
export const PLATFORMS: Platform[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    mark: 'C',
    tagline: 'Native plugin — 9 skills auto-load by description + a /senior-review gate.',
    target: '~/.claude/plugins/craft',
    command: `git clone https://github.com/manutej/craft \\\n  ~/.claude/plugins/craft`,
    note: 'Then run /senior-review on any diff, or call any skill by name (craft:right-sized-design).',
  },
  {
    id: 'cursor',
    name: 'Cursor',
    mark: '⌘',
    tagline: 'Project Rule — always applied across chat, ⌘K edits, and Composer.',
    target: '.cursor/rules/craft.mdc',
    command: `mkdir -p .cursor/rules\ncurl -fsSL ${RAW}/dist/cursor/craft.mdc \\\n  -o .cursor/rules/craft.mdc`,
    note: 'Legacy Cursor: curl RULES.md -o .cursorrules instead.',
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    mark: 'G',
    tagline: 'Custom instructions for completions, chat, and automated PR review.',
    target: '.github/copilot-instructions.md',
    command: `mkdir -p .github\ncurl -fsSL ${RAW}/RULES.md \\\n  -o .github/copilot-instructions.md`,
    note: 'Per-language rules + a PR-review prompt ship in dist/github-copilot/.',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    mark: 'W',
    tagline: 'Cascade rules — loaded into every Cascade and Write session.',
    target: '.windsurfrules',
    command: `curl -fsSL ${RAW}/RULES.md -o .windsurfrules`,
  },
  {
    id: 'cline',
    name: 'Cline / Roo',
    mark: 'R',
    tagline: 'Workspace rules for Cline and Roo Code, read on every task.',
    target: '.clinerules',
    command: `curl -fsSL ${RAW}/RULES.md -o .clinerules`,
  },
  {
    id: 'agents',
    name: 'Codex · AGENTS.md',
    mark: 'A',
    tagline: 'The cross-tool standard — Codex, Jules, Gemini CLI and more read AGENTS.md.',
    target: 'AGENTS.md',
    command: `curl -fsSL ${RAW}/RULES.md -o AGENTS.md`,
    note: 'One file, many agents. The most portable way to ship the rules to a team.',
  },
  {
    id: 'aider',
    name: 'Aider',
    mark: 'a',
    tagline: 'Conventions file passed to the model on every request.',
    target: 'CONVENTIONS.md',
    command: `curl -fsSL ${RAW}/RULES.md -o CONVENTIONS.md`,
    note: 'Add to .aider.conf.yml:  read: CONVENTIONS.md',
  },
]

/* ───────────────────── Case studies (complex before/after) ───────────────────── */

export interface CaseRule {
  n: number
  skill: string
}

export interface Case {
  id: string
  /** Short label for the tab strip. */
  label: string
  title: string
  subtitle: string
  rules: CaseRule[]
  slop: CodeSample
  slopNote: string
  craft: CodeSample
  craftNote: string
  /** One-line "why it matters", evidence-backed where possible. */
  impact: string
}

/** Six real failure modes craft catches out of the box — seeing is believing. */
export const CASES: Case[] = [
  {
    id: 'over-engineering',
    label: 'Over-engineering',
    title: 'A factory and an interface — for exactly one user',
    subtitle: 'Asked to "add a user," the agent invents an abstraction hierarchy no caller needs.',
    rules: [
      { n: 1, skill: 'right-sized-design' },
      { n: 2, skill: 'right-sized-design' },
    ],
    slop: SLOP_SAMPLE,
    slopNote:
      'Speculative ABC + builder for a single concrete type — and a catch that swallows the failure. Compiles, ships, breaks quietly.',
    craft: CRAFT_SAMPLE,
    craftNote:
      'One obvious function. Validate at the boundary, no dead interface, errors stay visible. The diff is exactly the ask.',
    impact:
      'Speculative generality is the #1 documented AI failure mode. Every unused abstraction is a tax the next engineer pays to change anything.',
  },
  {
    id: 'swallowed-errors',
    label: 'Swallowed errors',
    title: 'The fetch that turns a 404 into a "user"',
    subtitle: 'Untrusted response, no status check, and a catch that returns an empty object on failure.',
    rules: [{ n: 6, skill: 'robustness-at-boundaries' }],
    slop: {
      filename: 'getUser.ts',
      lang: 'the AI default',
      lines: [
        { text: 'async function getUser(id: string) {' },
        { text: '  try {' },
        { text: '    const res = await fetch(`/api/users/${id}`)' },
        { text: '    return await res.json()  // 404 body parsed as a user', tone: 'danger' },
        { text: '  } catch {' },
        { text: '    return {}                // network error → silent {}', tone: 'danger' },
        { text: '  }' },
        { text: '}' },
      ],
    },
    slopNote:
      'A 404 returns the error body as if it were a user; a network failure returns {}. Downstream code reads user.name on garbage.',
    craft: {
      filename: 'getUser.ts',
      lang: 'with craft',
      lines: [
        { text: 'async function getUser(id: string): Promise<User> {' },
        { text: '  const res = await fetch(`/api/users/${id}`)' },
        { text: '  if (!res.ok) throw new ApiError(res.status, id)  // fail loud', tone: 'accent' },
        { text: '  return UserSchema.parse(await res.json())        // validate shape', tone: 'good' },
        { text: '}' },
      ],
    },
    craftNote:
      'Check the status, validate the shape at the boundary, throw a typed error. The failure is now visible and handleable.',
    impact:
      'Swallowed errors are the bugs that survive to production and corrupt state silently. craft never lets an error vanish into a return value.',
  },
  {
    id: 'hallucinated-deps',
    label: 'Hallucinated deps',
    title: 'Importing a package that does not exist',
    subtitle: 'The model confidently imports a plausible-sounding library — a typosquat waiting to be registered.',
    rules: [{ n: 12, skill: 'supply-chain-hygiene' }],
    slop: {
      filename: 'parse.py',
      lang: 'the AI default',
      lines: [
        { text: 'import requesocks            # typosquat of "requests"', tone: 'danger' },
        { text: 'from datetime_utils import parse  # invented module', tone: 'danger' },
        { text: '' },
        { text: 'ts = parse(payload["created"])' },
        { text: 'r  = requesocks.get(url)' },
      ],
    },
    slopNote:
      'Both imports look reasonable; neither is real. The day an attacker registers "requesocks" on PyPI, this becomes a supply-chain breach.',
    craft: {
      filename: 'parse.py',
      lang: 'with craft',
      lines: [
        { text: '# verified on PyPI: real, canonical, maintained.', tone: 'muted' },
        { text: 'from datetime import datetime', tone: 'good' },
        { text: 'import requests              # the canonical client', tone: 'good' },
        { text: '' },
        { text: 'ts = datetime.fromisoformat(payload["created"])' },
        { text: 'r  = requests.get(url, timeout=10)' },
      ],
    },
    craftNote:
      'Verify every new dependency exists and is canonical before it touches the lockfile. Prefer the stdlib when it already does the job.',
    impact:
      '~19.7% of AI-suggested packages do not exist (USENIX Security 2025, 576k samples). One installed typosquat compromises the whole build.',
  },
  {
    id: 'duplication',
    label: 'Duplication',
    title: 'Re-implementing a helper that already exists',
    subtitle: 'The agent writes slugify from scratch — the fourth near-copy in the codebase.',
    rules: [
      { n: 3, skill: 'dry-and-reuse' },
      { n: 4, skill: 'dry-and-reuse' },
    ],
    slop: {
      filename: 'post.ts',
      lang: 'the AI default',
      lines: [
        { text: '// re-invents lib/text.ts → slugify(), subtly different', tone: 'danger' },
        { text: 'function makeSlug(s: string) {' },
        { text: "  return s.toLowerCase()" },
        { text: "    .replace(/[^a-z0-9]+/g, '-')" },
        { text: "    .replace(/^-|-$/g, '')   // off-by-one vs the real one", tone: 'danger' },
        { text: '}' },
      ],
    },
    slopNote:
      'A fourth copy of logic that already lives in lib/text.ts — and it handles edge cases differently. Now a bug must be fixed in four places.',
    craft: {
      filename: 'post.ts',
      lang: 'with craft',
      lines: [
        { text: "import { slugify } from '@/lib/text'  // grep first", tone: 'accent' },
        { text: '' },
        { text: 'const slug = slugify(title)' },
        { text: '// one definition. fix a bug once, not in four files.', tone: 'muted' },
      ],
    },
    craftNote:
      'Search before you build. Reuse the existing utility; if it needs a tweak, improve the one source everyone shares.',
    impact:
      'Duplicated code carries 15–50% more defects. GitClear measured the AI signature across 211M lines: copy-paste up 8×, refactoring down 60%.',
  },
  {
    id: 'fake-tests',
    label: 'Fake-green tests',
    title: 'A test that asserts on its own mock',
    subtitle: 'It is green forever and proves nothing — the most common way "done" is a lie.',
    rules: [{ n: 10, skill: 'trustworthy-tests' }],
    slop: {
      filename: 'charge.test.ts',
      lang: 'the AI default',
      lines: [
        { text: "test('charges the card', () => {" },
        { text: '  const charge = jest.fn()' },
        { text: '    .mockReturnValue({ ok: true })' },
        { text: '  const res = charge(100)' },
        { text: '  expect(res.ok).toBe(true)  // asserts the mock', tone: 'danger' },
        { text: '})  // green even if charging is completely broken', tone: 'danger' },
      ],
    },
    slopNote:
      'The test sets up a mock and then asserts the mock returned what the mock was told to return. The real charge logic is never exercised.',
    craft: {
      filename: 'charge.test.ts',
      lang: 'with craft',
      lines: [
        { text: "test('charges the card', async () => {" },
        { text: '  const gateway = new FakeGateway()' },
        { text: '  await chargeOrder(order, gateway)', tone: 'accent' },
        { text: '  expect(gateway.captured).toEqual(', tone: 'good' },
        { text: "    [{ amount: 100, currency: 'usd' }])", tone: 'good' },
        { text: '})  // fails the moment the charge logic breaks' },
      ],
    },
    craftNote:
      'Assert observable behavior against a real fake, not the mock you just wrote. The test now fails when the behavior regresses.',
    impact:
      'Tautological tests give fake-green CI — the illusion of coverage. Stanford found AI-assisted devs were more confident and more wrong, especially on security.',
  },
  {
    id: 'effects-tangle',
    label: 'Logic ⊗ I/O',
    title: 'Business logic tangled with the database and Stripe',
    subtitle: 'The discount rule is buried between two DB calls and a network charge — untestable without heavy mocks.',
    rules: [{ n: 7, skill: 'effects-and-purity' }],
    slop: {
      filename: 'cart.py',
      lang: 'the AI default',
      lines: [
        { text: 'def price_cart(cart_id):' },
        { text: '    cart = db.query(Cart).get(cart_id)        # I/O', tone: 'muted' },
        { text: '    total = sum(i.price * i.qty for i in cart.items)' },
        { text: '    if total > 100: total *= 0.9   # rule, buried', tone: 'danger' },
        { text: '    db.execute("UPDATE carts ...")            # I/O', tone: 'muted' },
        { text: '    stripe.charge(total)        # side effect', tone: 'danger' },
      ],
    },
    slopNote:
      'To unit-test "orders over $100 get 10% off" you must mock a database and a payment gateway. So nobody does, and the rule drifts.',
    craft: {
      filename: 'cart.py',
      lang: 'with craft',
      lines: [
        { text: '# pure core: no DB, no network — provable in microseconds', tone: 'muted' },
        { text: 'def discounted_total(items: list[Item]) -> Money:', tone: 'accent' },
        { text: '    total = sum(i.price * i.qty for i in items)' },
        { text: '    return total * 0.9 if total > 100 else total', tone: 'good' },
        { text: '' },
        { text: '# the shell does the I/O and calls this. logic stays testable.', tone: 'muted' },
      ],
    },
    craftNote:
      'Functional core, imperative shell. The decision is a pure function; I/O lives at the edges. The rule is now trivially unit-tested.',
    impact:
      'When logic is welded to I/O, tests need elaborate mocks — so the most important rules go untested. Separation makes correctness cheap to prove.',
  },
]

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
