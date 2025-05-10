import React, {
  Children,
  cloneElement,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactElement,
  ReactNode,
  useId,
  useMemo,
  useRef,
} from "react"
import { useEventCallback } from "usehooks-ts"
import { Tooltip, type TooltipProps } from "~/components/tooltip"
import { useDisableScroll } from "~/hooks"
import { mergeProps, mergeRefs, tcx } from "~/utils"
import {
  NumericInputElement,
  NumericInputMenuActionPrompt,
  NumericInputMenuTrigger,
  NumericInputVariable,
} from "./components"
import { NumericInputContext, NumericInputContextValue } from "./context"
import { useNumericInput } from "./hooks"
import { NumericInputTv } from "./tv"
import { NumericInputValue } from "./types"
import { dealWithNumericInputValue } from "./utils"

export type NumericChangeDetail = ReturnType<typeof dealWithNumericInputValue>

export interface NumericInputProps
  extends NumericInputContextValue,
    Omit<
      HTMLProps<HTMLInputElement>,
      | "value"
      | "defaultValue"
      | "onChange"
      | "children"
      | "max"
      | "min"
      | "step"
      | "disabled"
      | "id"
    > {
  className?: string
  classNames?: {
    container?: string
    input?: string
  }
  tooltip?: TooltipProps
  triggerRef?: React.RefObject<HTMLLabelElement> | ((el: HTMLLabelElement | null) => void)
  children?: ReactNode
  disabled?: boolean
  onChange?: (value: NumericInputValue, detail: NumericChangeDetail) => void
}

interface NumericInputComponent
  extends React.ForwardRefExoticComponent<
    NumericInputProps & React.RefAttributes<HTMLInputElement>
  > {
  Prefix: typeof NumericInputElement
  Suffix: typeof NumericInputElement
  Variable: typeof NumericInputVariable
  MenuTrigger: typeof NumericInputMenuTrigger
  ActionPrompt: typeof NumericInputMenuActionPrompt
}

export const NumericInputBase = forwardRef<HTMLInputElement, NumericInputProps>((props, ref) => {
  const {
    className,
    classNames,
    decimal,
    defaultValue,
    disabled,
    expression = "{value}",
    max,
    min,
    readOnly,
    required,
    shiftStep = 10,
    step = 1,
    value,
    variant = "default",
    focused = false,
    selected = false,
    tooltip,
    onChange,
    onEmpty,
    onPressEnd,
    onPressStart,
    onIsEditingChange,
    triggerRef,
    name,
    "aria-label": ariaLabel,
    "aria-describedby": ariaDescribedby,
    children,
  } = props

  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const { handlerPressed, inputProps, handlerProps } = useNumericInput({
    decimal,
    defaultValue,
    disabled,
    expression,
    max,
    min,
    readOnly,
    shiftStep,
    step,
    value,
    onChange,
    onEmpty,
    onPressEnd,
    onPressStart,
    ref: mergeRefs(inputRef, ref),
  })

  const { disableScrollProps } = useDisableScroll({ ref: inputRef })

  const handleFocus = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onIsEditingChange?.(true)
    inputProps.onFocus?.(e)
  })

  const handleBlur = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onIsEditingChange?.(false)
    inputProps.onBlur && inputProps.onBlur()
  })

  // 创建上下文值
  const contextValue = useMemo<NumericInputContextValue>(
    () => ({
      variant,

      // 状态
      value,
      defaultValue,
      disabled,
      readOnly,
      selected,
      focused,
      handlerPressed,

      // 配置
      min,
      max,
      step,
      shiftStep,
      decimal,
      expression,

      // 事件处理方法
      onChange,
      onEmpty,
      onPressStart,
      onPressEnd,
      onIsEditingChange,

      // 处理程序
      handlerProps,
    }),
    [
      variant,
      value,
      defaultValue,
      disabled,
      readOnly,
      selected,
      focused,
      handlerPressed,
      min,
      max,
      step,
      shiftStep,
      decimal,
      expression,
      onChange,
      onEmpty,
      onPressStart,
      onPressEnd,
      onIsEditingChange,
      handlerProps,
    ],
  )

  const childrenArray = Children.toArray(children)

  const prefixElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === NumericInput.Prefix,
  )

  const suffixElements = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === NumericInput.Suffix,
  )

  const variableElement = childrenArray.filter(
    (child): child is ReactElement => isValidElement(child) && child.type === NumericInput.Variable,
  )

  const actionPromptElement = childrenArray.filter(
    (child): child is ReactElement =>
      isValidElement(child) && child.type === NumericInput.ActionPrompt,
  )

  const prefixNode = prefixElements[0] || null
  const suffixNode = suffixElements[0] || null
  const variableNode = variableElement[0] || null
  const actionPromptNode = actionPromptElement[0] || null

  const styles = NumericInputTv({
    variant,
    selected: selected || handlerPressed,
    focused,
    disabled,
    prefixElement: !!prefixNode,
    suffixElement: !!suffixNode,
    variableValue: !!variableNode,
  })

  return (
    <NumericInputContext.Provider value={contextValue}>
      <label
        ref={triggerRef}
        className={tcx(styles.container(), classNames?.container, className)}
      >
        {prefixNode && cloneElement(prefixNode, { position: "prefix" })}

        <input
          {...mergeProps(inputProps, disableScrollProps)}
          id={id}
          name={name}
          onFocus={handleFocus}
          onBlur={handleBlur}
          data-1p-ignore
          autoComplete="off"
          spellCheck={false}
          required={required}
          className={tcx("[grid-area:input]", styles.input(), classNames?.input)}
          disabled={disabled}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedby}
          aria-valuemin={min}
          aria-valuemax={max}
        />

        {variableNode && cloneElement(variableNode, { hasPrefixElement: !!prefixNode })}

        {actionPromptNode && cloneElement(actionPromptNode)}

        {suffixNode && cloneElement(suffixNode, { position: "suffix" })}

        {tooltip && (
          <Tooltip {...tooltip}>
            <span
              tabIndex={-1}
              className={styles.tooltip()}
              onFocusCapture={() => {
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }}
            />
          </Tooltip>
        )}
      </label>
    </NumericInputContext.Provider>
  )
})

NumericInputBase.displayName = "NumericInput"

const PrefixComponent = (props: React.ComponentProps<typeof NumericInputElement>) => (
  <NumericInputElement {...props} />
)

const SuffixComponent = (props: React.ComponentProps<typeof NumericInputElement>) => (
  <NumericInputElement {...props} />
)

const VariableComponent = (props: React.ComponentProps<typeof NumericInputVariable>) => (
  <NumericInputVariable {...props} />
)

const ActionPromptComponent = (
  props: React.ComponentProps<typeof NumericInputMenuActionPrompt>,
) => <NumericInputMenuActionPrompt {...props} />

const MenuTrigger = NumericInputMenuTrigger

export const NumericInput = Object.assign(NumericInputBase, {
  Prefix: PrefixComponent,
  Suffix: SuffixComponent,
  Variable: VariableComponent,
  ActionPrompt: ActionPromptComponent,
  MenuTrigger,
}) as NumericInputComponent
