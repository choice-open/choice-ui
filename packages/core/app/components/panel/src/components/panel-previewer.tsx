import { tcx } from "@choice-ui/shared"
import { ComponentProps } from "react"
import { panelPreviewerTv } from "../tv"

type Props = ComponentProps<"div">

export const PanelPreviewer = ({ className, ...rest }: Props) => {
  return (
    <div
      className={tcx(panelPreviewerTv(), className)}
      {...rest}
    />
  )
}
