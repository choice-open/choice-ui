import { Slot } from "@choiceform/slot"
import { forwardRef, memo } from "react"
import { useDialogContext } from "../dialog-context"

interface DialogTriggerProps {
  children: React.ReactNode
}

export const DialogTrigger = memo(
  forwardRef<HTMLButtonElement, DialogTriggerProps>((props, ref) => {
    const { children, ...rest } = props
    const { setOpen } = useDialogContext()

    const handleClick = () => {
      setOpen(true)
    }

    return (
      <Slot
        ref={ref}
        onClick={handleClick}
        {...rest}
      >
        {children}
      </Slot>
    )
  }),
)

DialogTrigger.displayName = "DialogTrigger"
