import { Chip, ChipProps } from "@choice-ui/chip"
import { mergeRefs, tcx } from "@choice-ui/shared"
import { ChevronDownSmall } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, memo, ReactNode, useCallback, useMemo, useRef } from "react"
import { multiSelectTriggerTv } from "../tv"

export interface MultiSelectTriggerProps extends Omit<HTMLProps<HTMLDivElement>, "title" | "size"> {
  children?: ReactNode
  disabled?: boolean
  getDisplayValue?: (value: string) => string
  maxChips?: number
  onRemove?: (value: string) => void
  open?: boolean
  placeholder?: string
  readOnly?: boolean
  renderChip?: (props: {
    disabled?: boolean
    displayValue: string
    index: number
    onRemove?: (e: React.MouseEvent<HTMLButtonElement>) => void
    value: string
  }) => ReactNode
  size?: "default" | "large"
  suffixElement?: ReactNode
  valueDisabledMap?: Record<string, boolean>
  values?: string[]
  variant?: ChipProps["variant"]
}

export const MultiSelectTrigger = memo(
  forwardRef<HTMLDivElement, MultiSelectTriggerProps>((props, ref) => {
    const {
      children,
      className,
      disabled = false,
      getDisplayValue,
      maxChips = 32,
      onRemove,
      placeholder = "Select options",
      readOnly = false,
      renderChip,
      size = "default",
      suffixElement = <ChevronDownSmall />,
      values = [],
      open = false,
      variant = "default",
      valueDisabledMap = {},
      ...rest
    } = props

    const containerRef = useRef<HTMLDivElement>(null)

    const style = multiSelectTriggerTv({
      size,
      disabled,
      hasValues: values.length > 0,
      open,
    })

    const displayValues = values.slice(0, maxChips)
    const remainingCount = values.length - maxChips
    const hasValues = values.length > 0

    const handleContainerClick = useCallback(
      (e: React.MouseEvent) => {
        // 检查是否点击了删除按钮或其子元素
        const target = e.target as HTMLElement
        if (
          target.closest("[data-remove-button]") ||
          target.closest('button[aria-label*="Remove"]')
        ) {
          return
        }

        if (!disabled) {
          containerRef.current?.focus()
        }
      },
      [disabled],
    )

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (readOnly) return

        if (e.key === "Backspace" && values.length > 0) {
          const lastValue = values[values.length - 1]
          if (lastValue) {
            onRemove?.(lastValue)
          }
        }
      },
      [values, onRemove, readOnly],
    )

    const renderChips = useMemo(() => {
      if (!hasValues) return null

      return (
        <div className={style.chips()}>
          {displayValues.map((value, index) => {
            const chipDisabled = !!valueDisabledMap[value] || disabled
            const handleRemove =
              !chipDisabled && !readOnly && onRemove
                ? (e: React.MouseEvent<HTMLElement>) => {
                    e.stopPropagation()
                    onRemove(value)
                  }
                : undefined

            const displayValue = getDisplayValue ? getDisplayValue(value) : value
            const chipSize = size === "large" ? "medium" : "default"

            // 如果提供了自定义渲染函数，使用它
            if (renderChip) {
              return (
                <div key={`${value}-${index}`}>
                  {renderChip({
                    value,
                    index,
                    displayValue,
                    onRemove: handleRemove,
                    disabled: chipDisabled,
                  })}
                </div>
              )
            }

            // 否则使用默认的 Chip 组件
            return (
              <Chip
                key={`${value}-${index}`}
                size={chipSize}
                variant={variant}
                disabled={chipDisabled}
                onRemove={handleRemove}
                className="bg-default-background shadow-xxs border-none dark:bg-gray-900"
              >
                {displayValue}
              </Chip>
            )
          })}

          {remainingCount > 0 && (
            <Chip
              size={size === "large" ? "medium" : "default"}
              variant="rest"
              disabled={disabled}
              className="text-secondary-foreground"
            >
              +{remainingCount}
            </Chip>
          )}
        </div>
      )
    }, [
      hasValues,
      displayValues,
      remainingCount,
      size,
      disabled,
      readOnly,
      onRemove,
      getDisplayValue,
      style,
      renderChip,
      variant,
      valueDisabledMap,
    ])

    const renderPlaceholder = useMemo(() => {
      if (hasValues) return null

      return <span className={style.placeholder()}>{placeholder}</span>
    }, [hasValues, placeholder, style])

    return (
      <div
        ref={mergeRefs(ref, containerRef)}
        className={tcx(style.root(), className)}
        tabIndex={disabled ? -1 : 0}
        onClick={handleContainerClick}
        onKeyDown={handleKeyDown}
        aria-disabled={disabled}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={false}
        {...rest}
      >
        <div
          className={style.content()}
          onClick={(e) => {
            // 阻止 chips 内部的点击事件冒泡到容器
            const target = e.target as HTMLElement
            if (
              target.closest("[data-remove-button]") ||
              target.closest('button[aria-label*="Remove"]')
            ) {
              e.stopPropagation()
            }
          }}
        >
          {renderChips}
          {renderPlaceholder}
        </div>

        {suffixElement && <span className={style.suffix()}>{suffixElement}</span>}
      </div>
    )
  }),
)

MultiSelectTrigger.displayName = "MultiSelectTrigger"
