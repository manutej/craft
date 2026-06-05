import { motion, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface TextRiseProps {
  text: string
  stagger?: number
  delay?: number
  className?: string
  as?: 'span' | 'h1' | 'h2' | 'p'
}

/** Word-stagger text rise. Each word fades + lifts into place on mount. */
export function TextRise({
  text,
  stagger = 0.06,
  delay = 0,
  className,
  as = 'span',
}: TextRiseProps) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = motion[as]

  return (
    <MotionTag
      className={cn('inline-flex flex-wrap gap-x-[0.3em]', className)}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <span key={`${word}-${i}`} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: reduce ? 0 : '110%', opacity: reduce ? 1 : 0 },
              visible: {
                y: 0,
                opacity: 1,
                transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  )
}
