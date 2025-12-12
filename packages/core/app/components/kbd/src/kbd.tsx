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

  const keysContent = useMemo(() => {
    const keysToRender = typeof keys === "string" ? [keys] : Array.isArray(keys) ? keys : []

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
      className={tcx(tv.base(), className)}
    >
      {keysContent}
      {children && <span>{children}</span>}
    </kbd>
  )
}
