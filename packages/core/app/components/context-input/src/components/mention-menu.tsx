import { Combobox } from "@choice-ui/combobox"
import React, { forwardRef, memo, useId, useImperativeHandle, useRef, useState } from "react"
import type { ContextMentionItemProps } from "../types"

// Focus management disabled config - as constant to avoid creating new object on each render
const FOCUS_MANAGER_PROPS = {
  initialFocus: -1,
  returnFocus: false,
  modal: false,
  guards: false,
} as const

// Coordinate position type
export interface MentionMenuPosition {
  x: number
  y: number
}

// MentionMenu ref interface
export interface MentionMenuRef {
  handleKeyDown: (event: React.KeyboardEvent) => boolean
}

// Mentions menu component - uses Combobox coordinate mode
interface MentionMenuProps {
  isOpen: boolean
  loading: boolean
  onClose: () => void
  onSelect: (mention: ContextMentionItemProps, index: number) => void
  position: MentionMenuPosition | null
  renderSuggestion?: (item: ContextMentionItemProps, isSelected: boolean) => React.ReactNode
  root?: HTMLElement | null
  suggestions: ContextMentionItemProps[]
  disabled?: boolean
}

export const MentionMenu = memo(
  forwardRef<MentionMenuRef, MentionMenuProps>(function MentionMenu(props, ref) {
    const {
      isOpen,
      loading,
      position,
      onSelect,
      renderSuggestion,
      suggestions,
      onClose,
      root,
      disabled = false,
    } = props

    const instanceId = useId()
    const [activeIndex, setActiveIndex] = useState(0)

    const getListboxElement = () => {
      const portalRoot = document.getElementById(`mention-menu-portal-${instanceId}`)
      if (portalRoot) {
        return portalRoot.querySelector('[role="listbox"]') as HTMLElement
      }
      return document.querySelector('[role="listbox"]') as HTMLElement
    }

    // Expose keyboard handler method - same approach as MentionsWithSlate story
    useImperativeHandle(
      ref,
      () => ({
        handleKeyDown: (event: React.KeyboardEvent) => {
          if (!isOpen || suggestions.length === 0) {
            return false
          }

          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === "Escape"
          ) {
            event.preventDefault()
            event.stopPropagation()

            const menuElement = getListboxElement()
            if (menuElement) {
              const keyEvent = new KeyboardEvent("keydown", {
                key: event.key,
                code: event.code || event.key,
                ctrlKey: event.ctrlKey,
                shiftKey: event.shiftKey,
                altKey: event.altKey,
                metaKey: event.metaKey,
                bubbles: true,
                cancelable: true,
              })
              menuElement.dispatchEvent(keyEvent)
            }

            if (event.key === "ArrowDown") {
              setActiveIndex((prev) => (prev + 1) % suggestions.length)
            } else if (event.key === "ArrowUp") {
              setActiveIndex((prev) => (prev === 0 ? suggestions.length - 1 : prev - 1))
            }
            return true
          }

          return false
        },
      }),
      [isOpen, suggestions.length, instanceId],
    )

    return loading || disabled ? null : (
      <Combobox
        trigger="coordinate"
        position={position}
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        placement="bottom-start"
        autoSelection={true}
        value=""
        onChange={() => {}}
        portalId={`mention-menu-portal-${instanceId}`}
        root={root}
        focusManagerProps={FOCUS_MANAGER_PROPS}
      >
        {suggestions.length > 0 && (
          <Combobox.Content>
            {suggestions.map((item, index) => (
              <Combobox.Item
                key={item.id}
                onClick={() => onSelect(item, index)}
                prefixElement={item.prefix}
              >
                {renderSuggestion ? (
                  renderSuggestion(item, index === activeIndex)
                ) : (
                  <Combobox.Value>{item.label}</Combobox.Value>
                )}
              </Combobox.Item>
            ))}
          </Combobox.Content>
        )}
      </Combobox>
    )
  }),
)

MentionMenu.displayName = "MentionMenu"
