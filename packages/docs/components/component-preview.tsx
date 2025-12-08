"use client"

import { CodeBlock, Tabs, tcx } from "@choice-ui/react"
import { useState } from "react"

type ComponentPreviewProps = React.HTMLAttributes<HTMLDivElement> & {
  align?: "center" | "start" | "end"
  code?: string
  language?: "tsx" | "ts" | "jsx" | "js"
  filename?: string
}

type TabKey = "preview" | "code"

export function ComponentPreview({
  children,
  className,
  align = "center",
  code,
  language = "tsx",
  filename,
  ...props
}: ComponentPreviewProps) {
  const [tab, setTab] = useState<TabKey>("preview")

  const hasCode = typeof code === "string" && code.trim().length > 0

  return (
    <div
      className={tcx("group relative my-4 w-full", className)}
      {...props}
    >
      {hasCode ? (
        <Tabs
          value={tab}
          onChange={(value) => setTab(value as TabKey)}
          className="mb-4 px-2"
        >
          <Tabs.Item value="preview">Preview</Tabs.Item>
          <Tabs.Item value="code">Code</Tabs.Item>
        </Tabs>
      ) : null}

      {tab === "preview" ? (
        <div
          className={tcx(
            "flex w-full items-center rounded-xl border px-4 py-8",
            // "bg-[radial-gradient(var(--color-secondary-background)_1px,transparent_1px)] [background-size:8px_8px]",
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
        >
          <CodeBlock.Header />
          <CodeBlock.Content
            code={code ?? ""}
            language={language}
          />
          <CodeBlock.Footer />
        </CodeBlock>
      ) : null}
    </div>
  )
}
