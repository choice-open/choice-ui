"use client"

import { ThemeToggle } from "@/components/theme-toggle"
import { storyRegistry } from "@/generated/registry" // lazy: () => import(...)

type StoryLoader = () => Promise<Record<string, unknown>>
const registry = storyRegistry as unknown as Record<string, StoryLoader>
import type { ReactNode } from "react"
import { use, useEffect, useRef, useState } from "react"
import Stats from "stats.js"

type StoryExport = { render?: () => ReactNode } | ((props?: Record<string, unknown>) => ReactNode)

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function useStoryModule(slugKey: string) {
  const [mod, setMod] = useState<Record<string, unknown> | undefined>(undefined)

  useEffect(() => {
    let cancelled = false
    if (slugKey in registry) {
      registry[slugKey]().then((m) => {
        if (!cancelled) setMod(m as Record<string, unknown>)
      })
    }
    return () => {
      cancelled = true
    }
  }, [slugKey])

  return mod
}

function StoryRenderer({
  moduleExports,
  exportName,
}: {
  moduleExports: Record<string, unknown> | undefined
  exportName: string
}) {
  const emptyMessage = (
    <div className="flex h-screen items-center justify-center">
      <span className="text-muted-foreground text-sm">Story not found.</span>
    </div>
  )

  if (!moduleExports) return emptyMessage

  const storyExport = moduleExports[exportName] as StoryExport | undefined
  if (!storyExport) return emptyMessage

  if (typeof storyExport === "function") {
    const Component = storyExport
    return <Component />
  }

  if (
    typeof storyExport === "object" &&
    storyExport !== null &&
    "render" in storyExport &&
    typeof storyExport.render === "function"
  ) {
    const Component = storyExport.render
    return <Component />
  }

  return emptyMessage
}

function PerformanceMonitor() {
  const statsRef = useRef<Stats | null>(null)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    // Initialize Stats.js
    const stats = new Stats()
    stats.showPanel(0) // 0: fps, 1: ms, 2: mb
    stats.dom.style.cssText = "position:fixed;bottom:0;left:0;z-index:10000;"
    document.body.appendChild(stats.dom)
    statsRef.current = stats

    // Animation loop for stats
    const animate = () => {
      stats.begin()
      stats.end()
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    // Initialize react-scan
    import("react-scan").then(({ scan }) => {
      scan({
        enabled: true,
        log: false,
      })
    })

    return () => {
      if (statsRef.current) {
        document.body.removeChild(statsRef.current.dom)
      }
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return null
}

/**
 * Standalone story page for isolated testing.
 * URL format: /story/{componentSlug}/{exportName}
 * Example: /story/utilities/virtualized-grid/Basic
 */
export default function StoryPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug ?? []

  // Last segment is the export name, rest is the component slug
  if (slug.length < 2) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="text-secondary-foreground">
          Invalid URL. Format: /story/component-slug/ExportName
        </span>
      </div>
    )
  }

  const exportName = slug[slug.length - 1]
  const componentSlug = slug.slice(0, -1).map(slugifyPart).join("/")

  const storyModule = useStoryModule(componentSlug)

  return (
    <>
      <PerformanceMonitor />
      <div className="border-default-boundary/40 bg-default-background/80 supports-[backdrop-filter]:bg-default-background/60 sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b px-8 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <h1 className="text-heading-medium">{componentSlug}</h1>
          <span>/</span>
          <h2 className="text-heading-medium text-secondary-foreground">{exportName}</h2>
        </div>
        <ThemeToggle />
      </div>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center p-8">
        <StoryRenderer
          moduleExports={storyModule}
          exportName={exportName}
        />
      </div>
    </>
  )
}
