import { GithubIcon } from './GithubIcon'
import { ThemeToggle } from './ThemeToggle'
import { REPO_URL } from '@/data'

const LINKS = [
  { href: '#problem', label: 'The cost' },
  { href: '#how', label: 'How it works' },
  { href: '#examples', label: 'Examples' },
  { href: '#skills', label: 'Skills' },
  { href: '#install', label: 'Install' },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="container flex h-16 items-center justify-between gap-4">
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            craft
          </span>
          <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
            by CETI
          </span>
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border px-3 text-sm text-foreground transition-colors hover:bg-secondary"
          >
            <GithubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
