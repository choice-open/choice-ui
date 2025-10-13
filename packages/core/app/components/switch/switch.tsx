import { motion } from "framer-motion"
import { forwardRef, HTMLProps, useId, ReactNode, memo } from "react"
import { tcx } from "~/utils"
import { switchTv } from "./tv"

// Switch Label 子组件
export interface SwitchLabelProps {
  children: ReactNode
  className?: string
}

export const SwitchLabel = memo(function SwitchLabel({ children, className }: SwitchLabelProps) {
  return <span className={className}>{children}</span>
})

SwitchLabel.displayName = "Switch.Label"

export interface SwitchProps
  extends Omit<HTMLProps<HTMLInputElement>, "size" | "value" | "onChange" | "children"> {
  children?: ReactNode
  className?: string
  focused?: boolean
  label?: string
  onChange: (value: boolean) => void
  size?: "small" | "medium"
  value: boolean
  variant?: "default" | "accent" | "outline" // 保持向后兼容性
}

interface SwitchStyle extends React.CSSProperties {
  "--switch-height": string
  "--switch-width": string
  "--thumb-height": string
  "--thumb-margin": string
  "--thumb-translate": string
  "--thumb-width": string
}

const switch_sizes = {
  small: {
    style: {
      "--switch-height": "12px",
      "--thumb-height": "9px",
      "--thumb-width": "14px",
      "--thumb-margin": "0.5px",
      "--switch-width": "26px",
    },
  },
  medium: {
    style: {
      "--switch-height": "16px",
      "--thumb-height": "13px",
      "--thumb-width": "21px",
      "--thumb-margin": "0.5px",
      "--switch-width": "36px",
    },
  },
} as const

const SwitchBase = forwardRef<HTMLInputElement, SwitchProps>(function Switch(props, ref) {
  const {
    value,
    onChange,
    label,
    children,
    disabled,
    size = "medium",
    variant = "default",
    className,
    focused,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    ...rest
  } = props

  const internalId = useId()
  const descriptionId = useId()

  const styles = switchTv({ size, variant, disabled, checked: value, focused })

  const style = {
    "--thumb-translate":
      "calc(var(--switch-width) - var(--thumb-width) - var(--thumb-margin) * 4 - 1px)",
    ...switch_sizes[size].style,
  } as SwitchStyle

  // 自动将字符串类型的 children 包装成 SwitchLabel，或使用 label prop（向后兼容）
  const renderLabel = () => {
    if (children) {
      if (typeof children === "string" || typeof children === "number") {
        return (
          <span id={descriptionId}>
            <SwitchLabel>{children}</SwitchLabel>
          </span>
        )
      }
      return <span id={descriptionId}>{children}</span>
    }
    if (label) {
      return <span id={descriptionId}>{label}</span>
    }
    return null
  }

  const labelContent = renderLabel()
  const hasLabel = children || label

  return (
    <label
      className={tcx(styles.root(), className)}
      htmlFor={props.id || internalId}
    >
      <span className="sr-only">{value ? "Enabled" : "Disabled"}</span>
      <input
        ref={ref}
        className={styles.input()}
        type="checkbox"
        id={props.id || internalId}
        checked={value}
        disabled={disabled}
        onChange={(e) => {
          onChange(e.target.checked)
        }}
        aria-label={ariaLabel || (typeof children === "string" ? children : label?.toString())}
        aria-describedby={ariaDescribedby || (hasLabel ? descriptionId : undefined)}
        aria-checked={value}
        {...rest}
      />
      <div
        className={styles.track()}
        style={style}
      >
        <motion.div
          className={styles.thumb()}
          initial={false}
          animate={{ x: value ? "var(--thumb-translate)" : 0 }}
          transition={{ duration: 0.1 }}
          aria-hidden="true"
        />
      </div>

      {labelContent}
    </label>
  )
})

const MemoizedSwitch = memo(SwitchBase) as unknown as SwitchType

interface SwitchType {
  (props: SwitchProps & { ref?: React.Ref<HTMLInputElement> }): JSX.Element
  Label: typeof SwitchLabel
  displayName?: string
}

export const Switch = MemoizedSwitch as SwitchType
Switch.Label = SwitchLabel
Switch.displayName = "Switch"
