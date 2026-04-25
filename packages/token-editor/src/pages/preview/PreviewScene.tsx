import type { ReactNode } from "react"
import { NotificationPrefsBlock } from "./blocks/NotificationPrefsBlock"
import { PricingBlock } from "./blocks/PricingBlock"
import { RecentActivityBlock } from "./blocks/RecentActivityBlock"

/**
 * Right-pane live preview. Built block-by-block: each block is a self-contained
 * scene that earns its place by exercising a meaningful constellation of
 * components and token roles, not a kitchen-sink demo. Layout is a CSS
 * columns waterfall so blocks of varying heights pack tightly while sharing
 * a uniform column width — the same shape as shadcn's `/blocks` page. Wider
 * compositions (currently just Pricing) opt into `column-span: all` to break
 * out of the column flow when their internal layout demands more room.
 *
 * More blocks land in the next commit; this slice ships three for aesthetic
 * gating.
 */
export function PreviewScene() {
  return (
    <div className="min-h-full bg-background-component/30 p-6">
      <header className="mb-5 flex items-baseline justify-between">
        <div>
          <h2 className="text-body-large-strong">Live preview</h2>
          <p className="text-body-medium text-text-secondary">
            Real components rendered with your live token edits. Try changing
            colors or radius from the sidebar.
          </p>
        </div>
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          3 of 12 blocks
        </span>
      </header>

      <div className="columns-1 gap-5 [column-fill:_balance] xl:columns-2">
        <Block>
          <RecentActivityBlock />
        </Block>
        <Block>
          <NotificationPrefsBlock />
        </Block>
        <Block wide>
          <PricingBlock />
        </Block>
      </div>
    </div>
  )
}

function Block({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <div className={"mb-5 break-inside-avoid " + (wide ? "[column-span:all]" : "")}>
      {children}
    </div>
  )
}
