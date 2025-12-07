import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { memo } from "react"
import { useSlate } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import { buttonTv } from "../tv"
import type { CustomText, FormatButtonProps } from "../types"
import { isMarkActive, toggleMark } from "../utils"

export const FormatButton = memo(function FormatButton(props: FormatButtonProps) {
  const { format, children, ...rest } = props
  const editor = useSlate()
  const isActive = isMarkActive(editor, format as keyof CustomText)

  const handleOnClick = useEventCallback(() => toggleMark(editor, format as keyof CustomText))

  return (
    <IconButton
      type="button"
      tabIndex={-1}
      active={isActive}
      variant="dark"
      className={tcx(buttonTv({ variant: "icon", active: isActive }))}
      onClick={handleOnClick}
      {...rest}
    >
      {children}
    </IconButton>
  )
})
