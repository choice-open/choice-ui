import { tcx } from "@choiceform/design-shared"
import { forwardRef, memo } from "react"
import { useMdInputContext } from "../context"
import { mdInputTv } from "../tv"
import { MdInputMention } from "./extensions"

export interface MdInputContainerProps {
  children?: React.ReactNode
  className?: string
}

export const MdInputContainer = memo(
  forwardRef<HTMLDivElement, MdInputContainerProps>((props, ref) => {
    const { children, className } = props
    const { disabled, readOnly, mentionItems, mentionState } = useMdInputContext()
    const tv = mdInputTv({ disabled, readOnly })

    return (
      <div
        ref={ref}
        className={tcx(tv.content(), className)}
      >
        {children}
        {mentionItems && mentionItems.length > 0 && mentionState && (
          <MdInputMention
            isOpen={mentionState.isOpen}
            position={mentionState.position}
            query={mentionState.query}
            filteredItems={mentionState.filteredItems}
            onSelect={mentionState.handleSelect}
            onClose={mentionState.closeMentionSearch}
          />
        )}
      </div>
    )
  }),
)

MdInputContainer.displayName = "MdInputContainer"
