import type { ReactNode } from "react"
import { NotificationPrefsBlock } from "./blocks/NotificationPrefsBlock"
import { PricingBlock } from "./blocks/PricingBlock"
import { RecentActivityBlock } from "./blocks/RecentActivityBlock"

/**
 * Right-pane live preview, modeled after shadcn `/blocks`. Every block is a
 * self-contained card sized to a single column — no spans, no per-block
 * width overrides — so the waterfall stays visually rhythmic. Blocks whose
 * content needs more horizontal room get restructured to fit a column
 * rather than escape it.
 */
export function PreviewScene() {
  return (
    <div className="min-h-full bg-background-component/30 p-5">
      <div className="columns-1 gap-5 [column-fill:_balance] md:columns-2 xl:columns-3">
        <Block>
          <RecentActivityBlock />
        </Block>
        <Block>
          <NotificationPrefsBlock />
        </Block>
        <Block>
          <PricingBlock />
        </Block>
      </div>
    </div>
  )
}

function Block({ children }: { children: ReactNode }) {
  return <div className="mb-5 break-inside-avoid">{children}</div>
}
