import { tcx } from "@choice-ui/shared"
import { ComponentProps } from "react"
import { panelRowLabelTv } from "../tv"

type Props = {
  label: string
} & Omit<ComponentProps<"div">, "label">

export const PanelRowLabel = (props: Props) => {
  const { className, label, ...rest } = props
  return (
    <div
      className={tcx(panelRowLabelTv(), className)}
      {...rest}
    >
      {label}
    </div>
  )
}
