import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { memo } from "react"
import { useSlate } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import { buttonTv } from "../tv"
import type { BlockButtonProps, CustomElement } from "../types"
import { isBlockActive, toggleBlock } from "../utils"

export const BlockButton = memo(function BlockButton({
  format,
  children,
  onClick,
  ...rest
}: BlockButtonProps) {
  const editor = useSlate()
  const isActive = isBlockActive(editor, format as keyof CustomElement)

  const handleOnClick = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    toggleBlock(editor, format as keyof CustomElement)
    onClick?.(e)
  })

  return (
    <IconButton
      tabIndex={-1}
      variant="dark"
      active={isActive}
      className={tcx(buttonTv({ variant: "icon", active: isActive }))}
      onClick={handleOnClick}
      {...rest}
    >
      {children}
    </IconButton>
  )
})
