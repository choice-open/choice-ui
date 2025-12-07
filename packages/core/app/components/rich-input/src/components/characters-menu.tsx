import { Button } from "@choiceform/button"
import { tcx } from "@choiceform/design-shared"
import { FieldTypeUrl, RemoveTiny } from "@choiceform/icons-react"
import { TextField } from "@choiceform/text-field"
import { memo } from "react"
import { Editor } from "slate"
import { useSlate } from "slate-react"
import { useEventCallback } from "usehooks-ts"
import { buttonTv, floatingMenuTv } from "../tv"
import type { CharactersMenuProps, UrlInputProps } from "../types"
import { FloatingMenuContainer, MotionWrapper } from "./floating-menu-base"
import { FormatButton } from "./format-button"

const UrlInput = ({
  charactersUrl,
  onChangeUrl,
  onAddUrl,
  onRemoveUrl,
  isOpen,
  i18n,
}: UrlInputProps) => (
  <div className={tcx(floatingMenuTv({ type: "url", expanded: isOpen }))}>
    <TextField
      variant="dark"
      placeholder={i18n.url.placeholder}
      autoFocus
      value={charactersUrl}
      onChange={onChangeUrl}
    >
      {charactersUrl !== "" && (
        <TextField.Suffix>
          <button
            tabIndex={-1}
            type="button"
            className={tcx(buttonTv({ variant: "removeUrl" }))}
            onClick={onRemoveUrl}
          >
            <RemoveTiny />
          </button>
        </TextField.Suffix>
      )}
    </TextField>
    <Button
      variant="dark"
      tabIndex={-1}
      onClick={onAddUrl}
    >
      {i18n.url.doneButton}
    </Button>
  </div>
)

export const CharactersMenu = memo(function CharactersMenu(props: CharactersMenuProps) {
  const {
    isOpen,
    editorInView,
    portalElementId,
    refs,
    floatingStyles,
    x,
    y,
    getFloatingProps,
    charactersOptions,
    switchUrlInput,
    setSwitchUrlInput,
    charactersUrl,
    setCharactersUrl,
    setIsCharactersStyleOpen,
    placement,
    i18n,
  } = props

  const editor = useSlate()

  const handleOnChangeUrl = useEventCallback((value: string) => {
    setCharactersUrl(value)
  })

  const handleAddUrl = useEventCallback(() => {
    Editor.addMark(editor, "link", charactersUrl)
    setSwitchUrlInput(false)
    setIsCharactersStyleOpen(false)
    setCharactersUrl("")
  })

  const handleRemoveUrl = useEventCallback(() => {
    setCharactersUrl("")
    Editor.removeMark(editor, "link")
    setSwitchUrlInput(false)
    setIsCharactersStyleOpen(false)
  })

  const handleSwitchUrlInput = useEventCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setSwitchUrlInput(true)
  })

  if ((!isOpen && !switchUrlInput) || !editorInView) return null

  return (
    <FloatingMenuContainer
      portalElementId={portalElementId}
      refs={refs}
      floatingStyles={floatingStyles}
      getFloatingProps={getFloatingProps}
      style={{
        transform: `translate(${x}px, ${y}px)`,
      }}
      onMouseDown={(e) => {
        if (!switchUrlInput) {
          e.preventDefault()
        }
      }}
    >
      {switchUrlInput ? (
        <UrlInput
          charactersUrl={charactersUrl}
          onChangeUrl={handleOnChangeUrl}
          onAddUrl={handleAddUrl}
          onRemoveUrl={handleRemoveUrl}
          isOpen={isOpen}
          i18n={i18n}
        />
      ) : (
        <MotionWrapper
          placement={placement}
          className={tcx(floatingMenuTv({ type: "characters", expanded: isOpen }))}
        >
          {charactersOptions.map((item, index) => (
            <FormatButton
              key={index}
              format={item.format as keyof import("../types").CustomText}
            >
              {item.icon}
            </FormatButton>
          ))}
          <FormatButton
            tabIndex={-1}
            onClick={handleSwitchUrlInput}
            onMouseDown={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <FieldTypeUrl />
          </FormatButton>
        </MotionWrapper>
      )}
    </FloatingMenuContainer>
  )
})
