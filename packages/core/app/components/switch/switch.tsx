import { motion } from "framer-motion"
import { forwardRef, HTMLProps, useId } from "react"
import { tcx } from "~/utils"
import { switchTv } from "./tv"

export interface SwitchProps
  extends Omit<HTMLProps<HTMLInputElement>, "size" | "value" | "onChange"> {
  className?: string
  focused?: boolean
  onChange: (value: boolean) => void
  size?: "small" | "medium"
  value: boolean
  variant?: "default" | "accent" | "outline"
}

interface SwitchStyle extends React.CSSProperties {
  "--switch-height": string
  "--switch-width": string
  "--thumb-margin": string
  "--thumb-size": string
  "--thumb-translate": string
}

const switch_sizes = {
  small: {
    style: {
      "--switch-height": "12px",
      "--thumb-size": "8px",
      "--thumb-margin": "1px",
      "--switch-width": "20px",
    },
  },
  medium: {
    style: {
      "--switch-height": "16px",
      "--thumb-size": "12px",
      "--thumb-margin": "1px",
      "--switch-width": "28px",
    },
  },
} as const

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(props, ref) {
  const {
    value,
    onChange,
    label,
    disabled,
    size = "medium",
    variant = "default",
    className,
    focused,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props

  const id = useId()
  const descriptionId = useId()

  const styles = switchTv({ size, variant, disabled, checked: value, focused })

  const style = {
    "--thumb-translate": "calc(var(--switch-width) - var(--thumb-size) - var(--thumb-margin) * 4)",
    ...switch_sizes[size].style,
  } as SwitchStyle

  return (
    <label
      className={tcx(styles.root(), className)}
      htmlFor={id}
    >
      <span className="sr-only">{value ? "Enabled" : "Disabled"}</span>
      <input
        ref={ref}
        className={styles.input()}
        type="checkbox"
        id={id}
        checked={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
        aria-label={ariaLabel || label?.toString()}
        aria-describedby={ariaDescribedby || (label ? descriptionId : undefined)}
        aria-checked={value}
        {...rest}
      />
      <div
        className={styles.track()}
        style={style}
      >
        <motion.div
          className={styles.thumb()}
          initial={{ x: 0 }}
          animate={{ x: value ? "var(--thumb-translate)" : 0 }}
          transition={{ duration: 0.1 }}
          aria-hidden="true"
        />
      </div>

      {label && <span id={descriptionId}>{label}</span>}
    </label>
  )
})

Switch.displayName = "Switch"
