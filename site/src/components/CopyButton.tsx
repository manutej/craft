import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Click-to-copy button with a transient "Copied" confirmation. Falls back to a
 * hidden textarea + execCommand when the async clipboard API is unavailable
 * (older browsers / non-secure contexts), so it works everywhere students open it.
 */
export function CopyButton({
  text,
  label,
  className,
}: {
  text: string
  label?: string
  className?: string
}) {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand('copy')
      } catch {
        /* give up silently — selection is at least available */
      }
      document.body.removeChild(ta)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={copied ? 'Copied to clipboard' : 'Copy to clipboard'}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[0.7rem] transition-colors',
        copied
          ? 'border-teal/50 text-teal'
          : 'border-[hsl(var(--code-border))] text-[hsl(var(--code-muted))] hover:border-primary/40 hover:text-[hsl(var(--code-fg))]',
        className
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {label ?? (copied ? 'Copied' : 'Copy')}
    </button>
  )
}
