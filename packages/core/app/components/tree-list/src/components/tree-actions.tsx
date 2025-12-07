import { tcx } from "@choiceform/design-shared"
import { LockSmall, Visible } from "@choiceform/icons-react"
import { useMemo } from "react"

interface TreeActionsProps {
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  isHovering: boolean
  isRenaming: boolean
}

export const TreeActions = ({
  isRenaming,
  isHovering,
  handleMouseEnter,
  handleMouseLeave,
}: TreeActionsProps) => {
  const controlButtonsBgClassNames = useMemo(
    () =>
      tcx(
        "sticky right-3 flex h-6 items-center justify-end gap-2 overflow-hidden",
        isRenaming ? "opacity-0" : isHovering ? "opacity-100" : "opacity-0",
      ),
    [isRenaming, isHovering],
  )

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center gap-1 px-2">
      <div className="h-8 flex-1" />
      <div
        className={controlButtonsBgClassNames}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button className="pointer-events-auto">
          <LockSmall />
        </button>
        <button className="pointer-events-auto">
          <Visible />
        </button>
      </div>
    </div>
  )
}
