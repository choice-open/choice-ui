"use client"

import { Button, CodeBlock, Tabs, tcx } from "@choice-ui/react"
import { ArrowsMaximizeSmall } from "@choiceform/icons-react"
import { useState } from "react"

type ComponentPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "center" | "start" | "end"
  code?: string
  language?: "tsx" | "ts" | "jsx" | "js"
  filename?: string
  slug?: string
  exportName?: string
}

type TabKey = "preview" | "code"

export function ComponentPreview({
  children,
  className,
  align = "center",
  code,
  language = "tsx",
  filename,
  slug,
  exportName,
  ...props
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<TabKey>("preview")

  const hasCode = typeof code === "string" && code.trim().length > 0
  const canOpenStandalone = slug && exportName

  const openInNewWindow = () => {
    if (!canOpenStandalone) return
    const storyUrl = `/story/${slug}/${exportName}`
    window.open(storyUrl, "_blank", "width=1200,height=800")
  }

  return (
    <div
      className={tcx("group relative my-4 w-full", className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between gap-2 px-2">
        {hasCode ? (
          <Tabs
            value={tab}
            onChange={(value) => setTab(value as TabKey)}
          >
            <Tabs.Item value="preview">Preview</Tabs.Item>
            <Tabs.Item value="code">Code</Tabs.Item>
          </Tabs>
        ) : null}
        {canOpenStandalone && (
          <Button
            variant="ghost"
            onClick={openInNewWindow}
            className="opacity-0 transition-opacity group-hover:opacity-100"
          >
            <ArrowsMaximizeSmall />
            <span>New window</span>
          </Button>
        )}
      </div>

      {tab === "preview" ? (
        <div
          className={tcx(
            "bg-default-background relative flex w-full items-center justify-center rounded-xl border px-4 py-8 dark:border-transparent",
            align === "start" && "items-start",
            align === "end" && "items-end",
          )}
        >
          <div className="flex flex-wrap gap-4">{children}</div>
        </div>
      ) : null}

      {hasCode && tab === "code" ? (
        <CodeBlock
          language={language}
          className="rounded-xl border"
          lineThreshold={32}
          filename={filename}
          expandable={false}
        >
          <CodeBlock.Header
            showLineCount={false}
            className="border-b"
          />
          <CodeBlock.Content language={language}>{code ?? ""}</CodeBlock.Content>
          <CodeBlock.Footer />
        </CodeBlock>
      ) : null}
    </div>
  )
}
