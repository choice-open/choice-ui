import { tcx } from "@choiceform/design-shared"
import { ComponentProps } from "react"

type Props = {
  label: string
} & Omit<ComponentProps<"div">, "label">

export const PanelRowLabel = (props: Props) => {
  const { className, label, ...rest } = props
  return (
    <div
      className={tcx(
        "text-secondary-foreground cursor-default truncate select-none [grid-area:label]",
        className,
      )}
      {...rest}
    >
      {label}
    </div>
  )
}
