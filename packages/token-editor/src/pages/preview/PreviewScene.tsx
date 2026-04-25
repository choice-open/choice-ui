import { NotificationPrefsBlock } from "./blocks/NotificationPrefsBlock"
import { PricingBlock } from "./blocks/PricingBlock"
import { RecentActivityBlock } from "./blocks/RecentActivityBlock"

/**
 * Right-pane live preview. Built block-by-block: each block is a self-contained
 * scene that earns its place by exercising a meaningful constellation of
 * components and token roles, not a kitchen-sink demo. More blocks land in
 * the next commit; this slice ships three for aesthetic gating.
 */
export function PreviewScene() {
  return (
    <div className="min-h-full bg-background-component/30 p-6">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <header className="flex items-baseline justify-between">
          <div>
            <h2 className="text-base font-semibold">Live preview</h2>
            <p className="text-xs text-text-secondary">
              Real components rendered with your live token edits. Try changing
              colors or radius from the sidebar.
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-text-tertiary">
            3 of 12 blocks
          </span>
        </header>

        <RecentActivityBlock />
        <NotificationPrefsBlock />
        <PricingBlock />
      </div>
    </div>
  )
}
