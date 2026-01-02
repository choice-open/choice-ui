import { Description } from "@choice-ui/description"
import { ErrorMessage } from "@choice-ui/error-message"
import { Label } from "@choice-ui/label"
import { tcx } from "@choice-ui/shared"
import { ReactNode } from "react"
import { FormTv } from "../tv"

/**
 * Base Adapter component
 * Provides a unified form field layout and style
 */
export interface BaseAdapterProps {
  children: ReactNode
  className?: string
  description?: string | ReactNode
  error?: string | ReactNode
  htmlFor?: string
  label?: string | ReactNode
  legendMode?: boolean // Whether to use legend mode (for radio/checkbox groups)
}

export function BaseAdapter({
  className,
  label,
  description,
  error,
  children,
  htmlFor,
  legendMode = false,
}: BaseAdapterProps) {
  const tv = FormTv()

  return (
    <fieldset className={tcx(tv.field(), className)}>
      {label && (
        <Label
          as={legendMode ? "legend" : "label"}
          htmlFor={legendMode ? undefined : htmlFor}
          className={legendMode ? "mb-2" : undefined}
        >
          {label}
        </Label>
      )}
      {children}
      {typeof description === "string" ? (
        <Description id={`${htmlFor}-description`}>{description}</Description>
      ) : (
        description
      )}
      {typeof error === "string" ? (
        <ErrorMessage id={`${htmlFor}-error`}>{error}</ErrorMessage>
      ) : (
        error
      )}
    </fieldset>
  )
}

/**
 * Utility function to filter form specific properties
 */
export function filterFormProps<T extends Record<string, unknown>>(
  props: T,
): Omit<
  T,
  | "label"
  | "description"
  | "error"
  | "onBlurAsync"
  | "onBlurAsyncDebounceMs"
  | "onChangeAsync"
  | "onChangeAsyncDebounceMs"
  | "onFocusAsync"
  | "onFocusAsyncDebounceMs"
  | "size"
> {
  const {
    label,
    description,
    error,
    onBlurAsync,
    onBlurAsyncDebounceMs,
    onChangeAsync,
    onChangeAsyncDebounceMs,
    onFocusAsync,
    onFocusAsyncDebounceMs,
    size,
    ...filteredProps
  } = props

  return filteredProps
}
