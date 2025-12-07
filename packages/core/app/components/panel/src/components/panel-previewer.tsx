import { tcx } from "@choiceform/design-shared"
import { ComponentProps } from "react"

type Props = ComponentProps<"div">

export const PanelPreviewer = ({ className, ...rest }: Props) => {
  return (
    <div
      className={tcx(
        "bg-secondary-background text-secondary-foreground relative mx-4 my-2 flex h-32 flex-col items-center justify-center rounded-xl",
        className,
      )}
      {...rest}
    />
  )
}
