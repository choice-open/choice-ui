"use client"

import { ComponentPreview } from "@/components/component-preview"
import { ComponentActions } from "@/components/component-actions"
import { ApiTable } from "@/components/api-table"
import { Installation } from "@/components/installation"
import indexData from "@/generated/index.json"
import { componentsDetails } from "@/generated/components/components-details"
import { storyRegistry } from "@/generated/registry" // lazy: () => import(...)

type StoryLoader = () => Promise<Record<string, unknown>>
const registry = storyRegistry as unknown as Record<string, StoryLoader>
import type { ReactNode } from "react"
import { use, useEffect, useState } from "react"
import { MdRender } from "~/components/md-render"
import type { PropsGroup } from "@/components/api-table"

type StoryExport = { render?: () => ReactNode } | ((props?: Record<string, unknown>) => ReactNode)

type StoryItem = {
  id: string
  name: string
  exportName: string
  description: string
  source?: string
}

type IndexItem = {
  slug: string
  name: string
  title: string
  description: string
  version: string
}

type ComponentDetail = {
  slug: string
  title: string
  package: {
    name: string
    version: string
    description: string
    dependencies: Record<string, string>
    peerDependencies?: Record<string, string>
  }
  exports: string[]
  props: PropsGroup[]
  stories: StoryItem[]
}

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

function StoryRenderer({
  moduleExports,
  exportName,
}: {
  moduleExports: Record<string, unknown> | undefined
  exportName: string
}) {
  const emptyMessage = (
    <span className="text-muted-foreground text-sm">No renderable content for this story.</span>
  )

  if (!moduleExports) {
    return <span className="text-muted-foreground text-sm">Loading...</span>
  }

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

function getStoryCode(source?: string): string {
  return source?.trim() || ""
}

function formatDescription(description: string) {
  if (!description) return null
  return description.split("\n").map((line, idx) => (
    <p
      key={idx}
      className="md-p"
    >
      {line}
    </p>
  ))
}

export default function DocsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug ?? []
  const slugKey = slug.map(slugifyPart).join("/")

  const indexItem = (indexData.components as IndexItem[]).find((item) => item.slug === slugKey)
  const storyModule = useStoryModule(slugKey)

  const detail = componentsDetails[slugKey] as ComponentDetail | undefined

  if (!indexItem) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Component Not Found</h1>
        <p className="text-muted-foreground text-sm">Please check the path or select a component from the sidebar.</p>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Loading...</h1>
        <p className="text-muted-foreground text-sm">Loading component details.</p>
      </div>
    )
  }

  return (
    <>
      <div className="min-w-0 space-y-16">
        <div className="md space-y-2">
          <h1 className="md-h1">{detail.title}</h1>
          {formatDescription(detail.package.description)}

          <ComponentActions
            slugKey={slugKey}
            packageName={detail.package.name}
          />
        </div>

        <Installation
          packageName={detail.package.name}
          components={detail.exports}
        />

        <div className="space-y-16">
          {detail.stories.map((story) => {
            const code = getStoryCode(story.source)
            const anchor = slugifyPart(story.name || story.id)

            return (
              <section
                key={story.id}
                id={anchor}
                className="space-y-4"
              >
                <h2 className="md-h2">{story.name}</h2>

                {story.description ? <MdRender content={story.description} /> : null}

                <ComponentPreview
                  code={code}
                  language="tsx"
                  filename={`${story.name.toLowerCase().replace(/ /g, "-")}.tsx`}
                  slug={slugKey}
                  exportName={story.exportName}
                >
                  <StoryRenderer
                    moduleExports={storyModule}
                    exportName={story.exportName}
                  />
                </ComponentPreview>
              </section>
            )
          })}

          <ApiTable props={detail.props} />
        </div>
      </div>
    </>
  )
}
