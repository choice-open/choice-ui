import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  return (
    <header className="border-border/40 bg-background/80 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-8 flex items-center">
          <Link
            className="mr-6 flex items-center gap-2"
            href="/"
          >
            <div className="h-6 w-6 rounded-full bg-zinc-900 dark:bg-zinc-50" />
            <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Hero UI
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link
              href="/docs"
              className={cn("hover:text-foreground/80 transition-colors", "text-foreground")}
            >
              Docs
            </Link>
            <Link
              href="/components"
              className={cn("hover:text-foreground/80 transition-colors", "text-foreground/60")}
            >
              Components
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <button className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50">
              <span className="text-xs">Quick search...</span>
              <kbd className="bg-muted pointer-events-none hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 select-none sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>
          </div>
          <nav className="flex items-center gap-2">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
