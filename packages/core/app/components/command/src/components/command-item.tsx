import { tcx } from "@choiceform/design-shared"
import { Kbd, type KbdKey } from "@choiceform/kbd"
import React, { forwardRef, HTMLProps, ReactNode, useEffect, useMemo, useRef } from "react"
import { useEventCallback } from "usehooks-ts"
import { GroupContext, useCommand, useCommandState, useValue } from "../hooks"
import { commandItemTv } from "../tv"
import { SELECT_EVENT } from "../utils"

export interface CommandItemProps extends Omit<HTMLProps<HTMLDivElement>, "onSelect"> {
  disabled?: boolean
  forceMount?: boolean
  keywords?: string[]
  onSelect?: (value: string) => void
  prefixElement?: ReactNode
  shortcut?: {
    keys?: ReactNode
    modifier?: KbdKey | KbdKey[] | undefined
  }
  suffixElement?: ReactNode
  value?: string
}

export const CommandItem = forwardRef<HTMLDivElement, CommandItemProps>((props, forwardedRef) => {
  const {
    className,
    disabled,
    forceMount,
    keywords,
    onSelect,
    value,
    children,
    prefixElement,
    suffixElement,
    shortcut,
    ...rest
  } = props

  const ref = useRef<HTMLDivElement | null>(null)
  const id = React.useId()
  const context = useCommand()
  const groupContext = React.useContext(GroupContext)

  const propsRef = useRef({
    disabled,
    forceMount: forceMount ?? groupContext?.forceMount,
    keywords,
    onSelect,
    value,
  })

  propsRef.current = {
    disabled,
    forceMount: forceMount ?? groupContext?.forceMount,
    keywords,
    onSelect,
    value,
  }

  // 注册item
  useEffect(() => {
    if (!propsRef.current.forceMount) {
      return context.item(id, groupContext?.id)
    }
  }, [context, groupContext?.id, id])

  const valueDeps = useMemo(() => [value, children, ref], [value, children])
  const stableKeywords = useMemo(() => keywords || [], [keywords])
  const valueRef = useValue(id, ref, valueDeps, stableKeywords)

  const store = context.store

  const selected = useCommandState((state) =>
    Boolean(state.value && state.value === valueRef?.current),
  )

  const render = useCommandState((state) =>
    propsRef.current.forceMount
      ? true
      : context.filter() === false
        ? true
        : !state.search
          ? true
          : (state.filtered.items.get(id) ?? 0) > 0,
  )

  // 处理选择事件，当用户点击或按下Enter键时触发onSelect回调
  useEffect(() => {
    const element = ref.current
    if (!element || disabled) return

    const handleSelect = () => {
      select()
      propsRef.current.onSelect?.(valueRef.current || "")
    }

    element.addEventListener(SELECT_EVENT, handleSelect)
    return () => element.removeEventListener(SELECT_EVENT, handleSelect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [render, disabled, valueRef])

  const select = () => {
    store.setState("value", valueRef.current || "", true)
  }

  const hasValidShortcut = shortcut && (shortcut.modifier || shortcut.keys)

  const handlePointerMove = useEventCallback(() => {
    if (disabled || context.getDisablePointerSelection()) return
    select()
  })

  const handleClick = useEventCallback(() => {
    if (disabled) return
    propsRef.current.onSelect?.(valueRef.current || "")
  })

  const tv = commandItemTv({
    selected,
    disabled,
    size: context.size,
    hasPrefix: !!prefixElement,
    hasSuffix: !!suffixElement,
    variant: context.variant,
  })

  if (!render) return null

  return (
    <div
      ref={(el) => {
        ref.current = el
        if (typeof forwardedRef === "function") forwardedRef(el)
        else if (forwardedRef) forwardedRef.current = el
      }}
      {...rest}
      id={id}
      className={tcx(tv.root({ className }))}
      role="option"
      aria-disabled={disabled}
      aria-selected={selected || undefined}
      data-disabled={disabled}
      data-selected={selected}
      data-value={valueRef.current}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {prefixElement && <div className={tv.icon()}>{prefixElement}</div>}

      {children}

      {hasValidShortcut && (
        <Kbd
          className={tv.shortcut()}
          keys={shortcut!.modifier}
        >
          {shortcut!.keys}
        </Kbd>
      )}

      {suffixElement && <div className={tv.icon()}>{suffixElement}</div>}
    </div>
  )
})

CommandItem.displayName = "CommandItem"
