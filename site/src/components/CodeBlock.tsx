import { cn } from '@/lib/utils'
import type { CodeSample } from '@/data'

const TONE: Record<string, string> = {
  muted: 'text-[hsl(var(--code-muted))]',
  danger: 'text-danger',
  good: 'text-teal',
  accent: 'text-primary',
}

/**
 * Editor-style code panel with a constant elevated surface and semantic
 * line tinting (comments muted, the key line in accent / danger / good).
 */
export function CodeBlock({
  sample,
  accent = 'gold',
  className,
}: {
  sample: CodeSample
  accent?: 'gold' | 'teal' | 'danger'
  className?: string
}) {
  const dot =
    accent === 'danger' ? 'bg-danger' : accent === 'teal' ? 'bg-teal' : 'bg-primary'

  return (
    <div
      className={cn(
        'overflow-hidden rounded-lg border shadow-sm',
        'border-[hsl(var(--code-border))] bg-[hsl(var(--code-bg))]',
        className
      )}
    >
      <div className="flex items-center justify-between border-b border-[hsl(var(--code-border))] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={cn('h-2.5 w-2.5 rounded-full', dot)} />
          <span className="font-mono text-xs text-[hsl(var(--code-fg))]">
            {sample.filename}
          </span>
        </div>
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[hsl(var(--code-muted))]">
          {sample.lang}
        </span>
      </div>
      <pre className="overflow-x-auto px-4 py-4 text-[0.82rem] leading-[1.7]">
        <code className="font-mono text-[hsl(var(--code-fg))]">
          {sample.lines.map((line, i) => (
            <div key={i} className={cn('whitespace-pre', line.tone && TONE[line.tone])}>
              {line.text || ' '}
            </div>
          ))}
        </code>
      </pre>
    </div>
  )
}
