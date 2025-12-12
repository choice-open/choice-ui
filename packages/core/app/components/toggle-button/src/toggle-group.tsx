import { tcx } from "@choice-ui/shared"
import {
  forwardRef,
  HTMLProps,
  memo,
  ReactNode,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { ToggleGroupContext, useToggleGroupContext } from "./context"
import { ToggleButton, ToggleButtonProps } from "./toggle-button"
import { toggleGroupTv } from "./tv"

export interface ToggleGroupProps extends Omit<
  HTMLProps<HTMLDivElement>,
  "value" | "onChange" | "defaultValue"
> {
  children?: ReactNode
  defaultValue?: string[]
  disabled?: boolean
  loopFocus?: boolean
  multiple?: boolean
  onChange?: (value: string[]) => void
  orientation?: "horizontal" | "vertical"
  readOnly?: boolean
  value?: string[]
}

type ToggleGroupItemProps = Omit<ToggleButtonProps, "value" | "onChange"> & {
  value: string
}

const ToggleGroupItem = memo(
  forwardRef<HTMLInputElement, ToggleGroupItemProps>(function ToggleGroupItem(props, ref) {
    const { value: itemValue, className, disabled, children, ...rest } = props
    const {
      value: groupValue,
      onChange,
      disabled: groupDisabled,
      readOnly: groupReadOnly,
      multiple,
    } = useToggleGroupContext()

    const isPressed = multiple ? groupValue.includes(itemValue) : groupValue[0] === itemValue

    const handleChange = useEventCallback((checked: boolean) => {
      if (groupReadOnly) return

      if (multiple) {
        const newValue = checked
          ? [...groupValue, itemValue]
          : groupValue.filter((v) => v !== itemValue)
        onChange(newValue)
      } else {
        onChange(checked ? [itemValue] : [])
      }
    })

    return (
      <ToggleButton
        value={isPressed}
        active={isPressed}
        disabled={disabled || groupDisabled}
        readOnly={groupReadOnly}
        onChange={handleChange}
        className={className}
        {...rest}
        ref={ref}
      >
        {children}
      </ToggleButton>
    )
  }),
)

ToggleGroupItem.displayName = "ToggleGroup.Item"

const ToggleGroupBase = forwardRef<HTMLDivElement, ToggleGroupProps>(
  function ToggleGroup(props, ref) {
    const {
      className,
      children,
      defaultValue,
      value: controlledValue,
      onChange,
      disabled = false,
      readOnly = false,
      multiple = false,
      orientation = "horizontal",
      loopFocus = true,
      ...rest
    } = props

    const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(defaultValue || [])
    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : uncontrolledValue

    const handleChange = useEventCallback((newValue: string[]) => {
      if (readOnly) return
      if (!isControlled) {
        setUncontrolledValue(newValue)
      }
      onChange?.(newValue)
    })

    const contextValue = useMemo(
      () => ({
        value,
        onChange: handleChange,
        disabled,
        readOnly,
        multiple,
        orientation,
        loopFocus,
      }),
      [value, handleChange, disabled, readOnly, multiple, orientation, loopFocus],
    )

    const containerRef = useRef<HTMLDivElement | null>(null)

    const getItems = useCallback(() => {
      if (!containerRef.current) return []
      return Array.from(
        containerRef.current.querySelectorAll<HTMLInputElement>('input[type="checkbox"]'),
      )
    }, [])

    const handleKeyDown = useEventCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
      if (readOnly || disabled) return

      const items = getItems()
      if (items.length === 0) return

      const currentIndex = items.findIndex((item) => item === document.activeElement)
      if (currentIndex === -1) return

      let nextIndex = currentIndex

      if (orientation === "horizontal") {
        if (e.key === "ArrowLeft") {
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : loopFocus ? items.length - 1 : currentIndex
          e.preventDefault()
        } else if (e.key === "ArrowRight") {
          nextIndex =
            currentIndex < items.length - 1 ? currentIndex + 1 : loopFocus ? 0 : currentIndex
          e.preventDefault()
        }
      } else {
        if (e.key === "ArrowUp") {
          nextIndex =
            currentIndex > 0 ? currentIndex - 1 : loopFocus ? items.length - 1 : currentIndex
          e.preventDefault()
        } else if (e.key === "ArrowDown") {
          nextIndex =
            currentIndex < items.length - 1 ? currentIndex + 1 : loopFocus ? 0 : currentIndex
          e.preventDefault()
        }
      }

      if (nextIndex !== currentIndex) {
        items[nextIndex]?.focus()
      }
    })

    const tv = toggleGroupTv({
      orientation,
      disabled,
      multiple,
    })

    const setRefs = useCallback(
      (node: HTMLDivElement | null) => {
        containerRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref && "current" in ref) {
          ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }
      },
      [ref],
    )

    return (
      <ToggleGroupContext.Provider value={contextValue}>
        <div
          ref={setRefs}
          className={tcx(tv.root(), className)}
          role="group"
          data-orientation={orientation}
          data-disabled={disabled ? "" : undefined}
          data-multiple={multiple ? "" : undefined}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {children}
        </div>
      </ToggleGroupContext.Provider>
    )
  },
)

const MemoizedToggleGroup = memo(ToggleGroupBase) as unknown as ToggleGroupType

interface ToggleGroupType {
  (props: ToggleGroupProps & { ref?: React.Ref<HTMLDivElement> }): JSX.Element
  Item: typeof ToggleGroupItem
  displayName?: string
}

export const ToggleGroup = MemoizedToggleGroup as ToggleGroupType

ToggleGroup.Item = ToggleGroupItem
ToggleGroup.displayName = "ToggleGroup"
