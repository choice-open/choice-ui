import React, {
  Children,
  cloneElement,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode,
  useId,
  useMemo,
  useRef,
  useState,
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
  children?: ReactNode
  className?: string
  classNames?: {
    container?: string
    input?: string
  }
  disabled?: boolean
  id?: string
  onChange?: (value: NumericInputValue, detail: NumericChangeDetail) => void
  tooltip?: TooltipProps
  triggerRef?: React.RefObject<HTMLDivElement> | ((el: HTMLDivElement | null) => void)
}

interface NumericInputComponent
  extends React.ForwardRefExoticComponent<
    NumericInputProps & React.RefAttributes<HTMLInputElement>
  > {
  ActionPrompt: typeof NumericInputMenuActionPrompt
  MenuTrigger: typeof NumericInputMenuTrigger
  Prefix: typeof NumericInputElement
  Suffix: typeof NumericInputElement
  Variable: typeof NumericInputVariable
}

export const NumericInputBase = forwardRef<HTMLInputElement, NumericInputProps>((props, ref) => {
  const {
    id,
    className,
    classNames,
    decimal,
    defaultValue,
    disabled,
    expression = "{value}",
    max,
    min,
    placeholder,
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

  const inputRef = useRef<HTMLInputElement>(null)

  const { handlerPressed, inputProps, handlerProps } = useNumericInput({
    decimal,
    defaultValue,
    disabled,
    expression,
    max,
    min,
    placeholder,
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

  const [isFocused, setIsFocused] = useState(false)

  const handleFocus = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onIsEditingChange?.(true)
    setIsFocused(true)
    inputProps.onFocus?.(e)
  })

  const handleBlur = useEventCallback((e: React.FocusEvent<HTMLInputElement>) => {
    onIsEditingChange?.(false)
    setIsFocused(false)
    inputProps.onBlur?.()
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

  // 合并递归查找，提升性能
  const { prefix, suffix, variable, actionPrompt } = useMemo(() => {
    const result: {
      actionPrompt: React.ReactElement[]
      prefix: React.ReactElement[]
      suffix: React.ReactElement[]
      variable: React.ReactElement[]
    } = { prefix: [], suffix: [], variable: [], actionPrompt: [] }
    function findAll(children: ReactNode) {
      Children.forEach(children, (child) => {
        if (isValidElement(child)) {
          switch (child.type) {
            case NumericInput.Prefix:
              result.prefix.push(child)
              break
            case NumericInput.Suffix:
              result.suffix.push(child)
              break
            case NumericInput.Variable:
              result.variable.push(child)
              break
            case NumericInput.ActionPrompt:
              result.actionPrompt.push(child)
              break
          }
          if (child.props && child.props.children) {
            findAll(child.props.children)
          }
        }
      })
    }
    findAll(children)
    return result
  }, [children])

  const prefixNode = prefix[0] || null
  const suffixNode = suffix[0] || null
  const variableNode = variable[0] || null
  const actionPromptNode = actionPrompt[0] || null

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
      <div
        ref={triggerRef}
        className={tcx(styles.container(), classNames?.container, className)}
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        {prefixNode && cloneElement(prefixNode, { position: "prefix" })}

        <input
          {...mergeProps(inputProps, disableScrollProps)}
          name={name}
          id={id}
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
          placeholder={placeholder}
        />

        {variableNode && cloneElement(variableNode, { hasPrefixElement: !!prefixNode })}

        {actionPromptNode && cloneElement(actionPromptNode)}

        {suffixNode && cloneElement(suffixNode, { position: "suffix" })}

        {tooltip && !isFocused && (
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
      </div>
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
