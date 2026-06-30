import { MultiSelect } from "@choice-ui/multi-select"
import { Fragment, useEffect, useRef } from "react"
import type { MultiSelectAdapterProps } from "../types"
import { BaseAdapter, filterFormProps } from "./base-adapter"

export function MultiSelectAdapter<T extends string>({
  className,
  label,
  description,
  error,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder,
  ...props
}: MultiSelectAdapterProps<T>) {
  const filteredProps = filterFormProps(props)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el || !onBlur) return

    const handler = (e: FocusEvent) => {
      if (!el.contains(e.relatedTarget as Node)) {
        onBlur()
      }
    }

    el.addEventListener("focusout", handler)

    return () => {
      el.removeEventListener("focusout", handler)
    }
  }, [onBlur])

  return (
    <BaseAdapter
      className={className}
      label={label}
      description={description}
      error={error}
      htmlFor={props.name}
    >
      <div ref={containerRef}>
        <MultiSelect
          values={value}
          onChange={(value) => onChange?.(value as T[])}
          {...filteredProps}
        >
          <MultiSelect.Trigger
            data-slot="trigger"
            placeholder={placeholder}
            getDisplayValue={(displayValue) => {
              const option = options.find((opt) => String(opt.value) === displayValue)
              return option?.label ? String(option.label) : displayValue
            }}
          />

          <MultiSelect.Content>
            {options.map((option) => (
              <Fragment key={String(option.value)}>
                {option.divider ? (
                  <MultiSelect.Divider />
                ) : option.value === undefined ? (
                  <MultiSelect.Label>{option.label}</MultiSelect.Label>
                ) : (
                  <MultiSelect.Item value={String(option.value)}>
                    <MultiSelect.Value>{option.label}</MultiSelect.Value>
                  </MultiSelect.Item>
                )}
              </Fragment>
            ))}
          </MultiSelect.Content>
        </MultiSelect>
      </div>
    </BaseAdapter>
  )
}

export const createMultiSelectAdapter = <T extends string>(
  defaultProps?: Partial<MultiSelectAdapterProps<T>>,
) => {
  const AdapterComponent = (props: MultiSelectAdapterProps<T>) => (
    <MultiSelectAdapter<T>
      {...defaultProps}
      {...props}
    />
  )

  AdapterComponent.displayName = "MultiSelectAdapter"

  return AdapterComponent
}
