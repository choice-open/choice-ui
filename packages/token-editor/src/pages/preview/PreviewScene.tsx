import type { ReactNode } from "react"
import { AlertsBlock } from "./blocks/AlertsBlock"
import { AllTokensBlock } from "./blocks/AllTokensBlock"
import { AssetUploadBlock } from "./blocks/AssetUploadBlock"
import { ContributorsTableBlock } from "./blocks/ContributorsTableBlock"
import { CoverageBlock } from "./blocks/CoverageBlock"
import { DateRangeBlock } from "./blocks/DateRangeBlock"
import { DesignFiltersBlock } from "./blocks/DesignFiltersBlock"
import { EditVelocityBlock } from "./blocks/EditVelocityBlock"
import { ExportSnippetBlock } from "./blocks/ExportSnippetBlock"
import { HelpTabsBlock } from "./blocks/HelpTabsBlock"
import { NotificationPrefsBlock } from "./blocks/NotificationPrefsBlock"
import { PricingBlock } from "./blocks/PricingBlock"
import { PublishOptionsBlock } from "./blocks/PublishOptionsBlock"
import { QuickSearchBlock } from "./blocks/QuickSearchBlock"
import { RecentActivityBlock } from "./blocks/RecentActivityBlock"
import { ReleaseScheduleBlock } from "./blocks/ReleaseScheduleBlock"
import { SaveProfileBlock } from "./blocks/SaveProfileBlock"
import { StatusBadgesBlock } from "./blocks/StatusBadgesBlock"
import { SyncStatusBlock } from "./blocks/SyncStatusBlock"
import { ViewToolbarBlock } from "./blocks/ViewToolbarBlock"

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
          <EditVelocityBlock />
        </Block>
        <Block>
          <ViewToolbarBlock />
        </Block>
        <Block>
          <RecentActivityBlock />
        </Block>
        <Block>
          <DesignFiltersBlock />
        </Block>
        <Block>
          <ContributorsTableBlock />
        </Block>
        <Block>
          <DateRangeBlock />
        </Block>
        <Block>
          <CoverageBlock />
        </Block>
        <Block>
          <NotificationPrefsBlock />
        </Block>
        <Block>
          <SaveProfileBlock />
        </Block>
        <Block>
          <QuickSearchBlock />
        </Block>
        <Block>
          <StatusBadgesBlock />
        </Block>
        <Block>
          <SyncStatusBlock />
        </Block>
        <Block>
          <AlertsBlock />
        </Block>
        <Block>
          <AssetUploadBlock />
        </Block>
        <Block>
          <PublishOptionsBlock />
        </Block>
        <Block>
          <ExportSnippetBlock />
        </Block>
        <Block>
          <ReleaseScheduleBlock />
        </Block>
        <Block>
          <HelpTabsBlock />
        </Block>
        <Block>
          <AllTokensBlock />
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
