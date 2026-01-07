import { tcx } from "@choice-ui/shared"
import { forwardRef, useMemo } from "react"
import { useEventCallback } from "usehooks-ts"
import { ColorSwatch } from "../color-swatch"
import { translation } from "../contents"
import type { RGB, RGBA } from "../types/colors"
import type { LibrariesType } from "../types/libraries"
import type { Style } from "../types/style"
import type { Variable } from "../types/variable"
import { fillInputTv } from "./tv"

export interface VariableItemProps {
  active?: boolean
  className?: string
  classNames?: {
    container?: string
    content?: string
    wrapper?: string
  }
  disabled?: boolean
  label?: string
  libraries?: { item: Variable | Style; type: LibrariesType }
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
  onPickerClick?: () => void
  selected?: boolean
}

export const VariableItem = forwardRef<HTMLDivElement, VariableItemProps>(
  function VariableItem(props, ref) {
    const {
      className,
      classNames,
      libraries,
      active,
      disabled,
      selected,
      onClick,
      onPickerClick,
      label = translation.input.VARIABLE,
    } = props

    const handleContainerClick = useEventCallback((e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation()
      onClick?.(e)
    })

    const handleWrapperClick = useEventCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onPickerClick?.()
    })

    const selectedVariable = useMemo(() => {
      if (!libraries) return null
      if (libraries.type === "VARIABLE" && "value" in libraries.item) {
        return libraries.item
      }
      return null
    }, [libraries])

    const selectedStyle = useMemo(() => {
      if (!libraries) return null
      if (libraries.type === "STYLE" && "fills" in libraries.item) {
        return libraries.item
      }
      return null
    }, [libraries])

    const color = useMemo(() => {
      if (!libraries) return { r: 250, g: 250, b: 250 }
      if (libraries.type === "VARIABLE") {
        return selectedVariable?.value as RGB
      }

      const firstFill = selectedStyle?.fills?.[0]
      if (firstFill && firstFill.type === "SOLID") {
        return firstFill.color
      }

      return null
    }, [libraries, selectedVariable, selectedStyle])

    const alpha = useMemo(() => {
      if (!libraries) return 1
      if (libraries.type === "VARIABLE") {
        return (selectedVariable?.value as RGBA).a ?? 1
      }

      const firstFill = selectedStyle?.fills?.[0]
      if (firstFill) {
        // return firstFill.opacity ?? 1
      }

      return 1
    }, [libraries, selectedVariable, selectedStyle])

    const styles = fillInputTv({
      type: "VARIABLE",
      variantType: libraries?.type,
      selected,
      active,
      disabled,
      alpha: false,
      empty: !libraries,
    })

    return (
      <div
        ref={ref}
        className={tcx(styles.root(), classNames?.container, className)}
        onClick={handleContainerClick}
      >
        <div
          className={styles.wrapper()}
          onClick={handleWrapperClick}
        >
          <ColorSwatch
            className={styles.swatch()}
            color={color ?? undefined}
            alpha={alpha}
            type={libraries?.type}
          />

          <div className={tcx(styles.content(), classNames?.content)}>
            <span className={styles.label()}>{libraries?.item.name ?? label}</span>
          </div>
        </div>
      </div>
    )
  },
)

VariableItem.displayName = "VariableItem"
