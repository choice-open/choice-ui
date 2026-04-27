import { Tabs } from "@choice-ui/react"
import { useState } from "react"

type Topic = "general" | "editing" | "export"

const CONTENT: Record<Topic, { question: string; answer: string }[]> = {
  general: [
    {
      question: "Where do edits live?",
      answer:
        "Entirely in your browser tab. Closing the tab without exporting discards them; reset clears the dirty set instantly.",
    },
    {
      question: "Does the editor talk to a server?",
      answer:
        "No. The Terrazzo pipeline runs in-browser, so the page works offline once loaded.",
    },
  ],
  editing: [
    {
      question: "What does ⌘⇧R do?",
      answer:
        "Toggles the live `<style id=\"cdt-live\">` injection so destructive edits can never lock the editor's own UI.",
    },
    {
      question: "Why do some swatches show ●?",
      answer:
        "That token's resulting JSON differs from the bundled default. Reverting the value clears the marker automatically.",
    },
  ],
  export: [
    {
      question: "What's in the diff patch?",
      answer:
        "Only the tokens you changed, indexed by file + path with the rewritten node. Replay-able by setting node-at-path on a fresh defaults tree.",
    },
    {
      question: "Can I edit tokens.css directly?",
      answer:
        "Treat the export as derived. Editing source tokens and re-exporting keeps the diff intent reviewable.",
    },
  ],
}

export function HelpTabsBlock() {
  const [topic, setTopic] = useState<Topic>("general")
  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Help
        </span>
        <h3 className="text-heading-small">Frequently asked</h3>
      </header>
      <div className="flex flex-col gap-3 px-5 py-4">
        <Tabs value={topic} onChange={(v) => setTopic(v as Topic)}>
          <Tabs.Item value="general">General</Tabs.Item>
          <Tabs.Item value="editing">Editing</Tabs.Item>
          <Tabs.Item value="export">Export</Tabs.Item>
        </Tabs>
        <ul className="flex flex-col gap-3">
          {CONTENT[topic].map((entry) => (
            <li key={entry.question}>
              <div className="text-body-medium text-text-default">{entry.question}</div>
              <div className="text-body-medium text-text-secondary">{entry.answer}</div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
