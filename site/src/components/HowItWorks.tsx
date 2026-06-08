import { motion, useReducedMotion } from 'motion/react'
import { FileDiff, Cpu, ScanSearch, BadgeCheck, ArrowRight, ArrowDown } from 'lucide-react'
import { Reveal } from './smoothui/Reveal'

const STEPS = [
  {
    icon: FileDiff,
    k: '01',
    t: 'Your change',
    d: 'A diff, a file, or "build me X." The raw AI output — before anyone trusts it.',
  },
  {
    icon: Cpu,
    k: '02',
    t: 'The router reads it',
    d: 'production-grade inspects the change and fires only the skills that apply — no ceremony.',
  },
  {
    icon: ScanSearch,
    k: '03',
    t: 'Skills detect & fix',
    d: 'Over-engineering, swallowed errors, duplication, fake tests, hallucinated deps — named, ranked worst-first, rewritten.',
  },
  {
    icon: BadgeCheck,
    k: '04',
    t: 'Verdict, with evidence',
    d: 'Minimal diff · errors visible · tests prove behavior · every dependency verified. "Done" finally means done.',
  },
]

const MODES = [
  {
    tag: 'while building',
    t: 'Generative guard',
    d: 'Skills load by description and steer the agent as it writes — the strategic version comes out the first time.',
  },
  {
    tag: 'after the fact',
    t: 'Critique gate',
    d: '/senior-review (or the Copilot / CI port) audits an existing diff and blocks the merge until it passes.',
  },
]

/** Animated four-step pipeline showing how a change flows through craft, plus the
 *  two modes it runs in. The connecting line draws on; steps stagger in. */
export function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <div className="mx-auto mt-14 max-w-5xl">
      <div className="relative">
        {/* animated connecting line (desktop) */}
        <motion.div
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px origin-left bg-gradient-to-r from-primary/40 via-teal/40 to-primary/40 lg:block"
          initial={{ scaleX: reduce ? 1 : 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />

        <div className="grid gap-6 lg:grid-cols-4">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const last = i === STEPS.length - 1
            return (
              <Reveal key={s.k} delay={i * 0.12}>
                <div className="relative flex flex-col items-center text-center lg:items-start lg:text-left">
                  <div className="relative z-10 mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl border border-border bg-card text-primary shadow-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                    step {s.k}
                  </div>
                  <h3 className="mt-1 font-display text-base font-bold text-foreground">{s.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.d}</p>

                  {/* mobile connector */}
                  {!last && (
                    <ArrowDown className="mx-auto mt-4 h-5 w-5 text-border lg:hidden" />
                  )}
                  {/* desktop connector arrow between cards */}
                  {!last && (
                    <ArrowRight className="absolute -right-5 top-4 hidden h-5 w-5 text-border lg:block" />
                  )}
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* the two modes */}
      <div className="mx-auto mt-16 grid max-w-3xl gap-4 sm:grid-cols-2">
        {MODES.map((m, i) => (
          <Reveal key={m.t} delay={i * 0.1}>
            <div className="h-full rounded-xl border border-border bg-card p-6">
              <span className="eyebrow !text-[0.6rem] text-primary">{m.tag}</span>
              <h4 className="mt-2 font-display text-lg font-bold text-foreground">{m.t}</h4>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{m.d}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  )
}
