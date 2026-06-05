import { motion, useReducedMotion } from 'motion/react'
import { AnimatedNumber } from './smoothui/AnimatedNumber'
import { cn } from '@/lib/utils'
import type { Stat } from '@/data'

/** A single evidence bar: animated fill + spring number ticker. */
export function StatBar({ stat, delay = 0 }: { stat: Stat; delay?: number }) {
  const reduce = useReducedMotion()
  const tone = stat.tone === 'danger' ? 'bg-danger' : 'bg-teal'
  const text = stat.tone === 'danger' ? 'text-danger' : 'text-teal'

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <span className="text-sm text-foreground sm:text-base">{stat.label}</span>
        <span className={cn('font-display text-2xl font-bold tabular-nums sm:text-3xl', text)}>
          <span className="mr-0.5 text-lg">{stat.arrow}</span>
          <AnimatedNumber
            value={stat.value}
            decimals={stat.decimals ?? 0}
            prefix={stat.prefix}
            suffix={stat.suffix}
          />
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
        <motion.div
          className={cn('h-full rounded-full', tone)}
          initial={{ width: reduce ? `${stat.pct}%` : 0 }}
          whileInView={{ width: `${stat.pct}%` }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="font-mono text-[0.7rem] text-muted-foreground">{stat.source}</p>
    </div>
  )
}
