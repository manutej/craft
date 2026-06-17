import { useState } from 'react'
import { motion } from 'motion/react'
import { CASES } from '@/data'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

function StateLabel({ tone, text }: { tone: 'danger' | 'teal'; text: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={cn('h-2 w-2 rounded-full', tone === 'danger' ? 'bg-danger' : 'bg-teal')} />
      <span className="font-mono text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {text}
      </span>
    </div>
  )
}

/**
 * Before/after case switcher. Six real failure modes craft catches; one click
 * swaps the pair. Each case names the rule(s) it trips and closes with an
 * evidence-backed "why it matters." Show, don't tell.
 */
export function CaseStudies() {
  const [active, setActive] = useState(0)
  const c = CASES[active]

  return (
    <div className="mx-auto mt-14 max-w-5xl">
      {/* case selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {CASES.map((cs, i) => (
          <button
            key={cs.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              'rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors',
              i === active
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            )}
          >
            {cs.label}
          </button>
        ))}
      </div>

      <motion.div
        key={c.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        <div className="text-center">
          <h3 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            {c.title}
          </h3>
          <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">{c.subtitle}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {c.rules.map((r) => (
              <span
                key={`${r.n}-${r.skill}`}
                className="rounded-md border border-border bg-card px-2.5 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
              >
                rule {String(r.n).padStart(2, '0')} · {r.skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div>
            <StateLabel tone="danger" text="without craft" />
            <CodeBlock sample={c.slop} accent="danger" />
            <p className="mt-3 text-sm text-muted-foreground">{c.slopNote}</p>
          </div>
          <div>
            <StateLabel tone="teal" text="with craft" />
            <CodeBlock sample={c.craft} accent="teal" />
            <p className="mt-3 text-sm text-muted-foreground">{c.craftNote}</p>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-teal/30 bg-teal/[0.06] p-4 text-center">
          <p className="text-sm text-foreground">
            <span className="font-mono text-xs uppercase tracking-wider text-teal">
              why it matters ·{' '}
            </span>
            {c.impact}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
