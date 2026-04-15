import { Range } from "@choice-ui/range"
import { useEffect, useRef } from "react"
import type { RangeAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

export function RangeAdapter<T extends number>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  onFocus,
  ...props
}: RangeAdapterProps<T>) {
  const { ...filteredProps } = filterFormProps(props)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sliderRef.current
    if (!el) return

    const blurHandler = () => onBlur?.()
    const focusHandler = () => onFocus?.()

    el.addEventListener("focusout", blurHandler)
    el.addEventListener("focusin", focusHandler)

    return () => {
      el.removeEventListener("focusout", blurHandler)
      el.removeEventListener("focusin", focusHandler)
    }
  }, [onBlur, onFocus])

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      legendMode={true}
    >
      <div className="flex items-center gap-2">
        <div ref={sliderRef}>
          <Range
            value={value}
            onChange={(inputValue) => onChange(inputValue as T)}
            {...filteredProps}
          />
        </div>
        <div className="flex-1 text-right">{value}</div>
      </div>
    </BaseAdapter>
  )
}

export const createRangeAdapter = <T extends number>(
  defaultProps?: Partial<RangeAdapterProps<T>>,
) => {
  const AdapterComponent = (props: RangeAdapterProps<T>) => (
    <RangeAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "RangeAdapter"

  return AdapterComponent
}
