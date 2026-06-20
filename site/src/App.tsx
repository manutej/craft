import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { GithubIcon } from './components/GithubIcon'
import { Navbar } from './components/Navbar'
import { SectionHeading } from './components/SectionHeading'
import { StatBar } from './components/StatBar'
import { HowItWorks } from './components/HowItWorks'
import { CaseStudies } from './components/CaseStudies'
import { InstallMatrix } from './components/InstallMatrix'
import { Reveal } from './components/smoothui/Reveal'
import { TextRise } from './components/smoothui/TextRise'
import { MagneticButton } from './components/smoothui/MagneticButton'
import { AnimatedNumber } from './components/smoothui/AnimatedNumber'
import { cn } from './lib/utils'
import { SKILLS, RULES, STATS, SOURCES, REPO_URL } from './data'

function HeroStat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        <AnimatedNumber value={value} suffix={suffix} />
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  )
}

export default function App() {
  return (
    <div id="top" className="min-h-screen bg-background">
      <Navbar />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="grid-bg absolute inset-0 -z-10" />
        <div
          className="absolute inset-x-0 top-0 -z-10 h-[420px] opacity-60"
          style={{
            background:
              'radial-gradient(60% 100% at 50% 0%, hsl(var(--primary) / 0.10), transparent 70%)',
          }}
        />
        <div className="container grid items-center gap-12 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <Reveal>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="eyebrow !text-[0.65rem]">CETI · engineering guardrails</span>
              </div>
            </Reveal>

            <TextRise
              as="h1"
              text="Code that survives contact with production."
              className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-[3.5rem]"
            />

            <Reveal delay={0.18}>
              <p className="mt-3 font-display text-xl font-medium text-primary">
                Senior-engineer guardrails against AI code slop.
              </p>
            </Reveal>

            <Reveal delay={0.26}>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                AI agents write fast and leave a maintenance wake — duplication up,
                refactoring down, confident-but-wrong everywhere. <strong className="font-semibold text-foreground">craft</strong> is
                nine guardrail skills, a router, and a thirteen-rule constitution that make
                your agent write the <em className="text-foreground not-italic underline decoration-teal/50 underline-offset-4">strategic</em> version —
                and prove it before it says “done.”
              </p>
            </Reveal>

            <Reveal delay={0.34}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#install">
                  <MagneticButton className="px-6 py-3 text-base">
                    Install <ArrowRight className="h-4 w-4" />
                  </MagneticButton>
                </a>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <GithubIcon className="h-4 w-4" /> View on GitHub
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.42}>
              <div className="mt-10 flex gap-10 border-t border-border pt-6">
                <HeroStat value={9} label="guardrail skills" />
                <HeroStat value={13} label="always-on rules" />
                <HeroStat value={6} label="canon sources" />
              </div>
            </Reveal>
          </div>

          {/* Hero visual — the hand-authored animated banner */}
          <Reveal from="left" delay={0.2}>
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/20">
              <img
                src="/hero.svg"
                alt="craft — tactical chaos resolving into strategic, ordered code"
                className="w-full"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── The cost (evidence) ───────────────────── */}
      <section id="problem" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="The tactical tornado" title="What AI slop actually costs">
            Not opinion — measured across 211 million lines of real production code.
            The shape is unmistakable: more cloning, less refactoring, higher churn.
          </SectionHeading>

          <div className="mx-auto mt-14 grid max-w-4xl gap-x-12 gap-y-10 sm:grid-cols-2">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08}>
                <StatBar stat={s} delay={i * 0.05} />
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mx-auto mt-12 max-w-3xl rounded-lg border border-danger/30 bg-danger/[0.06] p-5 text-center">
              <p className="text-sm text-foreground sm:text-base">
                And developers using AI wrote{' '}
                <span className="font-semibold text-danger">more</span> security
                vulnerabilities — while being{' '}
                <span className="font-semibold text-danger">more confident</span> the
                code was secure.
                <span className="ml-1 text-muted-foreground">— Stanford</span>
              </p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">
                An agent’s confidence is near-zero signal. craft makes it prove the work instead.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── How it works ───────────────────── */}
      <section id="how" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="How it works" title="From raw output to a verdict">
            craft sits between your agent and “done.” The router reads the change,
            the right skills detect and fix the failure modes, and nothing ships
            until the work is proven — while building, or as a gate after.
          </SectionHeading>
          <HowItWorks />
        </div>
      </section>

      {/* ──────────────── Case studies — seeing is believing ──────────────── */}
      <section id="examples" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading
            eyebrow="Seeing is believing"
            title="Six problems it catches out of the box"
          >
            Real failure modes, before and after. Pick one — the slop on the left
            compiles and ships; the craft version on the right is the change you
            actually wanted, with the rule it enforced.
          </SectionHeading>
          <CaseStudies />
        </div>
      </section>

      {/* ───────────────────── The nine skills ───────────────────── */}
      <section id="skills" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="The toolkit" title="Nine skills, one router">
            Each skill targets a documented AI failure mode. The{' '}
            <code className="font-mono text-primary">production-grade</code> router fires
            the right ones — before code is written, or to audit a diff after.
          </SectionHeading>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SKILLS.map((skill, i) => {
              const Icon = skill.icon
              const isGold = skill.accent === 'gold'
              return (
                <Reveal key={skill.name} delay={i * 0.05}>
                  <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-black/20">
                    <div
                      className={cn(
                        'mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg',
                        isGold ? 'bg-primary/12 text-primary' : 'bg-teal/12 text-teal'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-mono text-sm font-semibold text-foreground">
                      {skill.name}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {skill.blurb}
                    </p>
                    <p className="mt-3 border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground/80">
                      <span
                        className={cn(
                          'font-mono uppercase tracking-wider',
                          isGold ? 'text-primary' : 'text-teal'
                        )}
                      >
                        catches ·{' '}
                      </span>
                      {skill.catches}
                    </p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ───────────────────── The 13 rules ───────────────────── */}
      <section id="rules" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="The constitution" title="Thirteen rules, always on">
            Loaded into every session. They distill the judgment a 15-year engineer
            applies without thinking — made explicit so your agent does too.
          </SectionHeading>

          <div className="mx-auto mt-14 grid max-w-4xl gap-x-10 gap-y-1 sm:grid-cols-2">
            {RULES.map((rule, i) => (
              <Reveal key={rule.n} delay={(i % 6) * 0.05}>
                <div className="flex items-start gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-secondary">
                  <span className="mt-0.5 font-mono text-sm font-bold tabular-nums text-primary">
                    {String(rule.n).padStart(2, '0')}
                  </span>
                  <span className="text-sm leading-relaxed text-foreground sm:text-[0.95rem]">
                    {rule.title}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────── Enforcement ladder ───────────────────── */}
      <section className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="Rules aren’t enough" title="From advice to a hard stop">
            Prose in a prompt is a suggestion. The same rules as a required gate are
            enforcement. craft ships both — so the build proves it, not the agent.
          </SectionHeading>

          <div className="mx-auto mt-14 grid max-w-3xl items-center gap-8 sm:grid-cols-2">
            <Reveal from="right">
              <div className="rounded-xl border border-border bg-card p-8 text-center">
                <div className="font-display text-5xl font-bold text-muted-foreground">
                  <AnimatedNumber value={40} suffix="%" />
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  rules as prose alone
                </p>
              </div>
            </Reveal>
            <Reveal from="left" delay={0.12}>
              <div className="rounded-xl border border-teal/40 bg-teal/[0.06] p-8 text-center">
                <div className="font-display text-5xl font-bold text-teal">
                  <AnimatedNumber value={95} suffix="%" />
                </div>
                <p className="mt-2 text-sm text-foreground">
                  with a required CI gate
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ol className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              {['always-on rules', 'Copilot PR review', 'required CI gate', 'branch protection'].map(
                (step, i, arr) => (
                  <li key={step} className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
                      <Check className="h-3.5 w-3.5 text-teal" />
                      {step}
                    </span>
                    {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-border" />}
                  </li>
                )
              )}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Install ───────────────────── */}
      <section id="install" className="border-b border-border py-20 sm:py-28">
        <div className="container">
          <SectionHeading eyebrow="Two minutes · any tool" title="Works where your team works">
            One constitution, every agentic coding platform — Claude Code, Cursor,
            GitHub Copilot, Windsurf, Cline, Codex and more. Pick a tool, click to
            copy one command, ship.
          </SectionHeading>

          <InstallMatrix />

          <Reveal delay={0.1}>
            <div className="mt-12 flex justify-center">
              <a href={REPO_URL} target="_blank" rel="noreferrer">
                <MagneticButton className="px-6 py-3 text-base">
                  <GithubIcon className="h-4 w-4" /> Get craft on GitHub
                  <ArrowRight className="h-4 w-4" />
                </MagneticButton>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────────────────── Footer ───────────────────── */}
      <footer className="py-16">
        <div className="container">
          <Reveal>
            <p className="eyebrow text-center">Grounded in the canon</p>
            <div className="mx-auto mt-6 grid max-w-4xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SOURCES.map((s) => (
                <div
                  key={s.title}
                  className="rounded-lg border border-border bg-card px-4 py-3"
                >
                  <div className="text-sm font-semibold text-foreground">{s.title}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{s.author}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="mt-14 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-lg font-bold text-foreground">craft</span>
              <span className="font-mono text-xs text-muted-foreground">· MIT · v0.1.0</span>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Built by CETI — Center for Educational Technology Innovations. For
              engineering teams who ship AI-assisted code that has to last.
            </p>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/80"
            >
              <GithubIcon className="h-4 w-4" /> github.com/manutej/craft
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
