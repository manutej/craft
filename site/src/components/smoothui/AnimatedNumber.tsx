import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface AnimatedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
}

/** Number ticker. Counts 0 → value when scrolled into view, using a spring. */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const reduce = useReducedMotion()
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 28, stiffness: 120 })

  useEffect(() => {
    // Scroll-into-view triggers the count. But above-the-fold elements never
    // fire a scroll-driven intersection, so after first paint we also check
    // whether the element is already on-screen and kick it off then.
    if (inView) {
      motionValue.set(value)
      return
    }
    const raf = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) motionValue.set(value)
    })
    return () => cancelAnimationFrame(raf)
  }, [inView, value, motionValue])

  useEffect(() => {
    if (reduce) {
      if (ref.current)
        ref.current.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`
      return
    }
    return spring.on('change', (latest) => {
      if (ref.current)
        ref.current.textContent = `${prefix}${latest.toFixed(decimals)}${suffix}`
    })
  }, [spring, decimals, prefix, suffix, reduce, value])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {`${prefix}${(0).toFixed(decimals)}${suffix}`}
    </span>
  )
}
