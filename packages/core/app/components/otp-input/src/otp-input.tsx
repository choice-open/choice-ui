import { tcx } from "@choice-ui/shared"
import { OTPInput, type SlotProps, type RenderProps } from "input-otp"
import { createContext, useContext, useMemo, type ComponentProps, type ReactNode } from "react"
import { otpInputTv } from "./tv"

type OTPInputVariant = "default" | "light" | "dark"

interface OTPInputContextValue {
  styles: ReturnType<typeof otpInputTv>
  slotProps: SlotProps[]
  variant: OTPInputVariant
  disabled: boolean
  isInvalid: boolean
}

const OTPInputCtx = createContext<OTPInputContextValue>({
  styles: otpInputTv({}),
  slotProps: [],
  variant: "default",
  disabled: false,
  isInvalid: false,
})

export interface OTPInputRootProps extends Omit<
  ComponentProps<typeof OTPInput>,
  "disabled" | "containerClassName" | "render"
> {
  variant?: OTPInputVariant
  disabled?: boolean
  isInvalid?: boolean
  inputClassName?: string
  children: ReactNode
}

function OTPInputRoot({
  className,
  inputClassName,
  variant = "default",
  disabled = false,
  isInvalid = false,
  children,
  ...props
}: OTPInputRootProps) {
  const tv = useMemo(
    () => otpInputTv({ variant, disabled, isInvalid }),
    [variant, disabled, isInvalid],
  )

  return (
    <OTPInput
      className={tv.input({ className: inputClassName })}
      containerClassName={tv.base({ className })}
      spellCheck={false}
      autoComplete="off"
      data-disabled={disabled || undefined}
      data-invalid={isInvalid || undefined}
      data-slot="otp-input"
      disabled={disabled}
      render={({ slots: slotProps }: RenderProps) => (
        <OTPInputCtx.Provider value={{ styles: tv, slotProps, variant, disabled, isInvalid }}>
          {children}
        </OTPInputCtx.Provider>
      )}
      {...props}
    />
  )
}

export interface OTPInputGroupProps extends ComponentProps<"div"> {}

function OTPInputGroup({ className, ...props }: OTPInputGroupProps) {
  const { styles } = useContext(OTPInputCtx)

  return (
    <div
      className={styles?.group?.({ className })}
      data-slot="otp-input-group"
      {...props}
    />
  )
}

export interface OTPInputSlotProps extends ComponentProps<"div"> {
  index: number
}

function OTPInputSlot({ className, index, ...props }: OTPInputSlotProps) {
  const { styles, slotProps, variant, disabled, isInvalid } = useContext(OTPInputCtx)
  const { char, hasFakeCaret, isActive } = slotProps?.[index] ?? {}

  const slotStyles = otpInputTv({
    variant,
    selected: isActive,
    disabled,
    isInvalid,
  })

  return (
    <div
      {...props}
      className={tcx(styles?.slot?.({ className }), slotStyles?.slot?.())}
      data-active={isActive || undefined}
      data-disabled={disabled || undefined}
      data-filled={!!char || undefined}
      data-invalid={isInvalid || undefined}
      data-slot="otp-input-slot"
    >
      {char ? (
        <div
          className={styles?.slotValue?.()}
          data-slot="otp-input-slot-value"
        >
          {char}
        </div>
      ) : null}
      {hasFakeCaret && isActive ? (
        <div
          className={tcx(styles?.caret?.(), "otp-input__caret")}
          data-slot="otp-input-caret"
        />
      ) : null}
    </div>
  )
}

export interface OTPInputSeparatorProps extends ComponentProps<"div"> {}

function OTPInputSeparator({ className, children, ...props }: OTPInputSeparatorProps) {
  const { styles } = useContext(OTPInputCtx)

  return (
    <div
      className={styles?.separator?.({ className })}
      data-slot="otp-input-separator"
      {...props}
    >
      {children ?? <span>-</span>}
    </div>
  )
}

export const OtpInput = Object.assign(OTPInputRoot, {
  Group: OTPInputGroup,
  Slot: OTPInputSlot,
  Separator: OTPInputSeparator,
})
