import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface RevealProps {
  children: ReactNode
  from?: 'up' | 'down' | 'left' | 'right'
  delay?: number
  className?: string
}

const offsets = {
  up: { x: 0, y: 24 },
  down: { x: 0, y: -24 },
  left: { x: 24, y: 0 },
  right: { x: -24, y: 0 },
}

/** Reveal-on-scroll wrapper. Fades + slides children into view once. */
export function Reveal({ children, from = 'up', delay = 0, className }: RevealProps) {
  const reduce = useReducedMotion()
  const offset = reduce ? { x: 0, y: 0 } : offsets[from]
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0, ...offset }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
