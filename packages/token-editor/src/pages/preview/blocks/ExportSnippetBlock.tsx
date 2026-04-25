import { Button, CodeBlock } from "@choice-ui/react"

const SAMPLE = `{
  "version": 1,
  "edits": [
    {
      "file": "colors-w3c.json",
      "path": "color.blue.500",
      "$type": "color",
      "node": {
        "$type": "color",
        "$value": { "colorSpace": "srgb", "components": [0.05, 0.45, 1], "alpha": 1 }
      }
    },
    {
      "file": "spacing-w3c.json",
      "path": "spacing.default",
      "$type": "dimension",
      "node": { "$type": "dimension", "$value": { "value": 0.3, "unit": "rem" } }
    }
  ]
}`

export function ExportSnippetBlock() {
  return (
    <section className="flex flex-col rounded-lg border border-border-default bg-background-default shadow-sm">
      <header className="flex items-baseline justify-between border-b border-border-default px-5 py-4">
        <div>
          <span className="text-body-small uppercase tracking-wide text-text-tertiary">
            Patch preview
          </span>
          <h3 className="text-heading-small">Diff exported as JSON patch</h3>
        </div>
        <Button variant="secondary">Copy</Button>
      </header>
      <div className="px-5 py-4">
        <CodeBlock language="json">
          <CodeBlock.Content>{SAMPLE}</CodeBlock.Content>
        </CodeBlock>
      </div>
    </section>
  )
}
