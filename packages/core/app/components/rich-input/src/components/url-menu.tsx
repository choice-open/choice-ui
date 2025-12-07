import { tcx } from "@choiceform/design-shared"
import { FieldTypeUrl } from "@choiceform/icons-react"
import { LinkButton } from "@choiceform/link-button"
import { memo } from "react"
import { floatingMenuTv } from "../tv"
import { UrlMenuProps } from "../types"
import { FloatingMenuContainer } from "./floating-menu-base"

export const UrlMenu = memo(function UrlMenu(props: UrlMenuProps) {
  const {
    isOpen,
    editorInView,
    portalElementId,
    refs,
    floatingStyles,
    getFloatingProps,
    charactersUrl,
  } = props

  if (!isOpen || !editorInView) return null

  return (
    <FloatingMenuContainer
      portalElementId={portalElementId}
      refs={refs}
      floatingStyles={floatingStyles}
      getFloatingProps={getFloatingProps}
    >
      <div className={tcx(floatingMenuTv({ type: "url" }))}>
        <FieldTypeUrl className="text-white" />
        <LinkButton
          href={charactersUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-white"
          onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <span className="max-w-64 truncate"> {charactersUrl}</span>
        </LinkButton>
      </div>
    </FloatingMenuContainer>
  )
})
