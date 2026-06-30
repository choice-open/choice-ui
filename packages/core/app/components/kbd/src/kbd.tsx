import { tcx } from "@choice-ui/shared"
import { DetailedHTMLProps, HTMLAttributes, useMemo } from "react"
import { kbdTv } from "./tv"
import { KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./utils"

export interface KbdProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children?: React.ReactNode
  keys?: KbdKey | KbdKey[]
}

export const Kbd = (props: KbdProps) => {
  const { className, keys, children, ...rest } = props

  const tv = kbdTv()

  const keysToRender = typeof keys === "string" ? [keys] : Array.isArray(keys) ? keys : []

  const ariaLabel = useMemo(() => {
    if (keysToRender.length === 0) return undefined
    const labels = keysToRender.map((key) => kbdKeysLabelMap[key])
    if (children && typeof children === "string") {
      labels.push(children)
    }
    return labels.join("+")
  }, [keysToRender, children])

  const keysContent = useMemo(() => {
    return keysToRender.map((key) => (
      <abbr
        key={key}
        className={tv.abbr()}
        title={kbdKeysLabelMap[key]}
      >
        {kbdKeysMap[key]}
      </abbr>
    ))
  }, [keys, tv])

  return (
    <kbd
      {...rest}
      role="text"
      className={tcx(tv.base(), className)}
      aria-label={ariaLabel}
    >
      {keysContent}
      {children}
    </kbd>
  )
}
