import { tcx } from "@choiceform/design-shared"
import { DetailedHTMLProps, HTMLAttributes, useMemo } from "react"
import { kbdTv } from "./tv"
import { KbdKey, kbdKeysLabelMap, kbdKeysMap } from "./utils"

export interface KbdProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  children?: React.ReactNode
  keys?: KbdKey | KbdKey[]
}

export const Kbd = (props: KbdProps) => {
  const { className, keys, children, ...rest } = props

  const style = kbdTv()

  const keysContent = useMemo(() => {
    const keysToRender = typeof keys === "string" ? [keys] : Array.isArray(keys) ? keys : []

    return keysToRender.map((key) => (
      <abbr
        key={key}
        className={style.abbr()}
        title={kbdKeysLabelMap[key]}
      >
        {kbdKeysMap[key]}
      </abbr>
    ))
  }, [keys, style])

  return (
    <kbd
      {...rest}
      className={tcx(style.base(), className)}
    >
      {keysContent}
      {children && <span>{children}</span>}
    </kbd>
  )
}
