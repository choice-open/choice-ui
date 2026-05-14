import { IconButton, Separator, ToggleButton, Tooltip } from "@choice-ui/react"
import {
  ParagraphList,
  PreviewView,
  SettingsRegular,
  Star,
  ViewGrid,
  ViewSmall,
} from "@choiceform/icons-react"
import { useState } from "react"

type Layout = "grid" | "list"

export function ViewToolbarBlock() {
  const [layout, setLayout] = useState<Layout>("grid")
  const [showHidden, setShowHidden] = useState(false)
  const [aiSuggest, setAiSuggest] = useState(true)

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          View
        </span>
        <h3 className="text-heading-small">Toolbar controls</h3>
      </header>
      <div className="flex items-center gap-1.5 px-5 py-3">
        <ToggleButton
          value={layout === "grid"}
          onChange={(on) => on && setLayout("grid")}
          aria-label="Grid layout"
        >
          <ViewGrid />
        </ToggleButton>
        <ToggleButton
          value={layout === "list"}
          onChange={(on) => on && setLayout("list")}
          aria-label="List layout"
        >
          <ParagraphList />
        </ToggleButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip content={showHidden ? "Hide drafts" : "Show drafts"}>
          <ToggleButton
            value={showHidden}
            onChange={setShowHidden}
            aria-label="Toggle drafts"
          >
            {showHidden ? <PreviewView /> : <ViewSmall />}
          </ToggleButton>
        </Tooltip>

        <Tooltip content={aiSuggest ? "AI suggestions on" : "AI suggestions off"}>
          <ToggleButton
            value={aiSuggest}
            onChange={setAiSuggest}
            aria-label="Toggle AI suggestions"
          >
            <Star />
          </ToggleButton>
        </Tooltip>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Tooltip content="Open settings">
          <IconButton variant="ghost" aria-label="Settings">
            <SettingsRegular />
          </IconButton>
        </Tooltip>
      </div>
    </section>
  )
}
