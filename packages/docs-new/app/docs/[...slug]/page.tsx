"use client"

import { use } from "react"
import type { ReactNode } from "react"
import { ComponentPreview } from "@/components/component-preview"
import components from "@/generated/components.json"
import { storyRegistry } from "@/generated/registry"
import { MdRender } from "~/components/md-render"

function slugifyPart(part: string): string {
  return part
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase()
}

type StoryExport = { render?: () => ReactNode } | ((props?: Record<string, unknown>) => ReactNode)
type PropGroup = {
  displayName?: string
  description?: string
  props?: {
    name: string
    type: string
    required: boolean
    defaultValue?: string
    description?: string
  }[]
}

function cleanDescription(text?: string): string {
  if (!text) return ""
  const withoutCode = text.replace(/```[\s\S]*?```/g, "")
  const withoutExample = withoutCode.replace(/@example[\s\S]*/gi, "")
  const firstLine = withoutExample
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)[0]
  return firstLine ?? ""
}

function normalizePropGroups(raw?: unknown): PropGroup[] {
  if (!Array.isArray(raw)) return []
  const first = raw[0] as Record<string, unknown> | undefined
  if (first && "props" in first) {
    return raw as PropGroup[]
  }
  return [
    {
      props: raw as PropGroup["props"],
    },
  ]
}

function renderStory(
  moduleExports: Record<string, unknown> | undefined,
  exportName: string,
): ReactNode {
  if (!moduleExports) {
    return null
  }

  const storyExport = moduleExports[exportName] as StoryExport | undefined

  if (!storyExport) {
    return null
  }

  if (typeof storyExport === "function") {
    return storyExport({})
  }

  if (
    typeof storyExport === "object" &&
    storyExport !== null &&
    "render" in storyExport &&
    typeof storyExport.render === "function"
  ) {
    return storyExport.render()
  }

  return null
}

function getStoryCode(
  moduleExports: Record<string, unknown> | undefined,
  exportName: string,
  fallback?: string,
): string {
  if (fallback && fallback.trim().length > 0) {
    return fallback
  }

  if (!moduleExports) {
    return ""
  }

  const storyExport = moduleExports[exportName] as StoryExport | undefined
  if (!storyExport) {
    return ""
  }

  if (typeof storyExport === "function") {
    return storyExport.toString()
  }

  if (
    typeof storyExport === "object" &&
    storyExport !== null &&
    "render" in storyExport &&
    typeof storyExport.render === "function"
  ) {
    return storyExport.render.toString()
  }

  return ""
}

function formatDescription(description: string) {
  if (!description) return null
  return description.split("\n").map((line, idx) => (
    <p
      key={idx}
      className="text-body-large"
    >
      {line}
    </p>
  ))
}

export default function DocsCatchAllPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const resolvedParams = use(params)
  const slug = resolvedParams.slug ?? []
  const normalizedSlug = slug.map(slugifyPart)
  const slugKey = normalizedSlug.join("/")
  const doc = components.find((item) => item.slug.join("/") === slugKey)
  const storyModule = storyRegistry[slugKey] as Record<string, unknown> | undefined

  if (!doc) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">未找到组件</h1>
        <p className="text-muted-foreground text-sm">请检查路径或选择侧栏中的组件。</p>
      </div>
    )
  }

  const description = doc.description || `${doc.componentName} 的自动化文档。`

  return (
    <>
      <div className="min-w-0 space-y-8">
        <div className="space-y-2">
          <h1 className="text-heading-display">{doc.title}</h1>

          {formatDescription(description)}
        </div>

        <div className="space-y-10">
          {doc.stories.map((story) => {
            const content = renderStory(storyModule, story.exportName)
            const code = getStoryCode(storyModule, story.exportName, story.source ?? "")
            const anchor = slugifyPart(story.name || story.id)

            return (
              <section
                key={story.id}
                id={anchor}
                className="space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl font-medium">{story.name}</h2>
                </div>

                {story.description ? <MdRender content={story.description} /> : null}

                <ComponentPreview
                  code={code}
                  language="tsx"
                >
                  {content ?? (
                    <span className="text-muted-foreground text-sm">该 story 暂无可渲染内容。</span>
                  )}
                </ComponentPreview>
              </section>
            )
          })}

          {doc.props && doc.props.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">API</h2>
              {normalizePropGroups(doc.props).map((group, idx) => (
                <div
                  key={`${group.displayName ?? idx}-${idx}`}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{group.displayName || doc.componentName}</p>
                    {cleanDescription(group.description) ? (
                      <span className="text-muted-foreground">
                        {cleanDescription(group.description)}
                      </span>
                    ) : null}
                  </div>
                  <div className="overflow-hidden rounded-xl border">
                    <table className="w-full text-left">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="w-1/5 px-4 py-2 font-semibold">Prop</th>
                          <th className="w-2/5 px-4 py-2 font-semibold">Type</th>
                          <th className="w-1/5 px-4 py-2 font-semibold">Default</th>
                          <th className="w-1/5 px-4 py-2 font-semibold">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(group.props ?? []).map((prop) => (
                          <tr
                            key={prop.name}
                            className="border-t"
                          >
                            <td className="px-4 py-2 font-mono">{prop.name}</td>
                            <td className="px-4 py-2 font-mono whitespace-pre-wrap">{prop.type}</td>
                            <td className="text-muted-foreground px-4 py-2 font-mono">
                              {prop.defaultValue ?? "—"}
                            </td>
                            <td className="text-muted-foreground px-4 py-2">
                              {cleanDescription(prop.description) || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </section>
          ) : null}
        </div>
      </div>

      <aside className="hidden xl:block xl:pl-6">
        <div className="sticky top-24 space-y-3">
          <div className="text-xs font-semibold">On this page</div>
          <div className="space-y-2">
            {doc.stories.map((story) => {
              const anchor = slugifyPart(story.name || story.id)
              return (
                <a
                  key={story.id}
                  href={`#${anchor}`}
                  className="block text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50"
                >
                  {story.name}
                </a>
              )
            })}
          </div>
        </div>
      </aside>
    </>
  )
}
