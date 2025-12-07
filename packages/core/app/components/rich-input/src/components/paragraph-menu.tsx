import { tcx } from "@choiceform/design-shared"
import { IconButton } from "@choiceform/icon-button"
import { useEffect } from "react"
import { buttonTv, floatingMenuTv } from "../tv"
import type { CustomElement, ParagraphMenuProps } from "../types"
import { isBlockActive } from "../utils"
import { BlockButton } from "./block-button"
import { FloatingMenuContainer, MotionWrapper } from "./floating-menu-base"

export const ParagraphMenu = (props: ParagraphMenuProps) => {
  const {
    editor,
    isOpen,
    editorInView,
    portalElementId,
    refs,
    floatingStyles,
    getFloatingProps,
    paragraphOptions,
    isParagraphExpanded,
    setIsParagraphExpanded,
    placement,
    update,
  } = props

  // 当 isParagraphExpanded 变化时，强制更新位置
  useEffect(() => {
    // 使用 requestAnimationFrame 确保 DOM 已更新
    requestAnimationFrame(() => {
      update()
    })
  }, [isParagraphExpanded, update])

  if (!isOpen || !editorInView) return null

  return (
    <FloatingMenuContainer
      portalElementId={portalElementId}
      refs={refs}
      floatingStyles={floatingStyles}
      getFloatingProps={getFloatingProps}
      style={{
        width: isParagraphExpanded ? 76 : 20,
        height: isParagraphExpanded ? 76 : 20,
        zIndex: 999,
      }}
    >
      <MotionWrapper
        placement={placement}
        className={tcx(
          floatingMenuTv({
            type: "paragraph",
            expanded: isParagraphExpanded,
          }),
        )}
        onMouseDown={(e) => e.preventDefault()}
        animationType="scale"
      >
        {isParagraphExpanded ? (
          <>
            {paragraphOptions.map((item, index) => (
              <BlockButton
                key={index}
                format={item.format as keyof CustomElement}
                onClick={() => {
                  setIsParagraphExpanded(false)
                }}
              >
                {item.icon}
              </BlockButton>
            ))}
          </>
        ) : (
          <>
            {(() => {
              // Find the currently active block format
              const activeOption = paragraphOptions.find((item) =>
                isBlockActive(editor, item.format as keyof CustomElement),
              )
              // If no format is active, default to paragraph
              const optionToShow =
                activeOption || paragraphOptions.find((item) => item.format === "paragraph")

              return optionToShow ? (
                <IconButton
                  tabIndex={-1}
                  variant="dark"
                  className={tcx(
                    buttonTv({
                      variant: "icon",
                    }),
                  )}
                  onClick={() => {
                    setIsParagraphExpanded(true)
                  }}
                >
                  {optionToShow.icon}
                </IconButton>
              ) : null
            })()}
          </>
        )}
      </MotionWrapper>
    </FloatingMenuContainer>
  )
}
