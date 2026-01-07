import { IconButton } from "@choice-ui/icon-button"
import { SetupPreferences } from "@choiceform/icons-react"
import { forwardRef, HTMLProps, useMemo } from "react"
import type { EffectStyle, PaintStyle, RGB, Style, TextStyle, Variable } from "../../types"
import { usePaletteColor } from "../hooks"
import { colorLibrariesItemTv } from "../tv"
import type { LibrariesDisplayType, LibrariesType } from "../../types"
import { StyleEffectItem, StylePaintItem, StyleTextItem } from "./style-items"
import {
  VariableBooleanItem,
  VariableColorItem,
  VariableEnumItem,
  VariableNumberItem,
  VariableStringItem,
} from "./variable-items"

interface LibraryItemProps extends Omit<HTMLProps<HTMLDivElement>, "onSelect"> {
  displayType: LibrariesDisplayType
  isDuplicate?: boolean
  isSelected?: boolean
  item: Variable | Style
  libraryType: LibrariesType
  onLibraryChange?: (value: { item: Variable | Style; type: LibrariesType }) => void
  onSetupPreferencesClick?: (id: string) => void
  onSwatchChange?: (value: { alpha: number; color: RGB }) => void
  setupPreferencesState$?: string | null
}

export const LibraryItem = forwardRef<HTMLDivElement, LibraryItemProps>(
  function LibraryItem(props, ref) {
    const {
      item,
      isSelected,
      isDuplicate,
      displayType,
      libraryType,
      onLibraryChange,
      onSwatchChange,
      setupPreferencesState$,
      onSetupPreferencesClick,
      ...rest
    } = props

    const variableType = useMemo(() => (item as Variable).type, [item])
    const styleType = useMemo(() => (item as Style).type, [item])

    const shouldColorPreview = useMemo(() => {
      return (
        (libraryType === "VARIABLE" && variableType === "color") ||
        (libraryType === "STYLE" && styleType === "PAINT")
      )
    }, [libraryType, variableType, styleType])

    const { paletteColor } = usePaletteColor({
      item,
      libraryType,
    })

    const styles = colorLibrariesItemTv({
      displayType,
      isDuplicate,
      libraryType,
      isSelected,
    })

    const paletteSize = useMemo(() => (displayType === "LARGE_GRID" ? 28 : 16), [displayType])

    const handleLibraryClick = () => {
      onLibraryChange?.({ type: libraryType, item })
    }

    const handleSetupPreferencesClick = () => {
      onSetupPreferencesClick?.(item.id)
    }

    return (
      <div
        ref={ref}
        className={styles.container()}
        onClick={
          displayType === "SMALL_GRID" ? () => onSwatchChange?.(paletteColor) : handleLibraryClick
        }
        {...rest}
      >
        {(() => {
          if (libraryType === "VARIABLE") {
            switch (variableType) {
              case "color":
                return (
                  <VariableColorItem
                    item={item as Variable}
                    libraryType={libraryType}
                    displayType={displayType}
                    onSwatchChange={onSwatchChange}
                    paletteSize={paletteSize}
                    isSelected={isSelected}
                    isDuplicate={isDuplicate}
                  />
                )
              case "number":
                return <VariableNumberItem />
              case "boolean":
                return <VariableBooleanItem />
              case "string":
                return <VariableStringItem />
              case "enum":
                return <VariableEnumItem />
              default:
                return null
            }
          }

          if (libraryType === "STYLE") {
            switch (styleType) {
              case "PAINT":
                return (
                  <StylePaintItem
                    item={item as PaintStyle}
                    libraryType={libraryType}
                    displayType={displayType}
                    paletteSize={paletteSize}
                    isSelected={isSelected}
                    isDuplicate={isDuplicate}
                  />
                )
              case "TEXT":
                return <StyleTextItem item={item as TextStyle} />
              case "EFFECT":
                return <StyleEffectItem item={item as EffectStyle} />
              default:
                return null
            }
          }

          return null
        })()}

        {displayType === "LIST" && (
          <div className={styles.wrapper()}>
            <span
              className={libraryType === "VARIABLE" ? styles.variableName() : styles.styleName()}
            >
              {item.name}
            </span>

            {!shouldColorPreview &&
              (() => {
                if (libraryType === "VARIABLE") {
                  return (
                    <span className={styles.variableValue()}>
                      {String((item as Variable).value)}
                    </span>
                  )
                }

                if (libraryType === "STYLE" && styleType === "TEXT") {
                  const textStyle = item as TextStyle
                  return (
                    <span className={styles.styleValue()}>
                      {` · `}
                      {textStyle.fontSize}
                      {`/`}
                      {textStyle.lineHeight.number}
                    </span>
                  )
                }

                return null
              })()}
          </div>
        )}

        {libraryType === "STYLE" && displayType === "LIST" && (
          <IconButton
            tooltip={{
              content: "Setup Preferences",
            }}
            className={styles.itemSetup()}
            onClick={(e) => {
              e.stopPropagation()
              handleSetupPreferencesClick()
            }}
          >
            <SetupPreferences />
          </IconButton>
        )}
      </div>
    )
  },
)

LibraryItem.displayName = "LibraryItem"
