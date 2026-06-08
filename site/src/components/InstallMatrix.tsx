import { useState } from 'react'
import { motion } from 'motion/react'
import { Folder, Lightbulb } from 'lucide-react'
import { PLATFORMS } from '@/data'
import { CodeBlock } from './CodeBlock'
import { cn } from '@/lib/utils'

/**
 * Platform-picker install panel. One click selects an agentic coding tool; the
 * exact, copy-paste-runnable command appears with a click-to-copy button and the
 * file it lands in. Every command resolves to the single source, RULES.md.
 */
export function InstallMatrix() {
  const [active, setActive] = useState(0)
  const p = PLATFORMS[active]
  const sample = {
    filename: p.target,
    lang: 'bash',
    lines: p.command.split('\n').map((text) => ({ text })),
  }

  return (
    <div className="mx-auto mt-14 max-w-4xl">
      {/* platform selector */}
      <div className="flex flex-wrap justify-center gap-2">
        {PLATFORMS.map((plat, i) => (
          <button
            key={plat.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
              i === active
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
            )}
          >
            <span
              className={cn(
                'inline-flex h-5 w-5 items-center justify-center rounded font-mono text-[0.7rem] font-bold',
                i === active ? 'bg-primary/20 text-primary' : 'bg-secondary text-muted-foreground'
              )}
            >
              {plat.mark}
            </span>
            {plat.name}
          </button>
        ))}
      </div>

      {/* active platform */}
      <motion.div
        key={p.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-8"
      >
        <p className="mb-4 text-center text-sm text-muted-foreground">{p.tagline}</p>
        <CodeBlock sample={sample} accent="gold" copyable copyText={p.command} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Folder className="h-3.5 w-3.5" /> {p.target}
          </span>
        </div>
        {p.note && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-border bg-card/60 px-4 py-3 text-sm text-muted-foreground">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span>{p.note}</span>
          </div>
        )}
      </motion.div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-muted-foreground">
        Every command writes the same constitution from one source —{' '}
        <code className="font-mono text-foreground">RULES.md</code>. Adopt it on one
        repo or a hundred; the rules stay identical across every tool your team uses.
      </p>
    </div>
  )
}
