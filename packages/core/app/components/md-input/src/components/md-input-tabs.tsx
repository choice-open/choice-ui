import { Tabs } from "@choiceform/tabs"
import { forwardRef, memo } from "react"
import { useMdInputContext } from "../context"

export interface MdInputTabsProps {
  className?: string
  i18n?: {
    preview: string
    write: string
  }
}

export const MdInputTabs = memo(
  forwardRef<HTMLDivElement, MdInputTabsProps>((props, ref) => {
    const { i18n = { preview: "Preview", write: "Write" }, className } = props
    const { activeTab, setActiveTab } = useMdInputContext()

    return (
      <Tabs
        ref={ref}
        value={activeTab}
        onChange={(val) => setActiveTab(val as "write" | "preview")}
        className={className}
      >
        <Tabs.Item value="write">{i18n.write}</Tabs.Item>
        <Tabs.Item value="preview">{i18n.preview}</Tabs.Item>
      </Tabs>
    )
  }),
)

MdInputTabs.displayName = "MdInputTabs"
