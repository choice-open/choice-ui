import { Combobox } from "@choice-ui/combobox"
import React, { forwardRef, memo, useImperativeHandle } from "react"
import type { MentionItemProps } from "../types"

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
  onSelect: (mention: MentionItemProps, index: number) => void
  position: MentionMenuPosition | null
  renderSuggestion?: (item: MentionItemProps, isSelected: boolean) => React.ReactNode
  root?: HTMLElement | null
  suggestions: MentionItemProps[]
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

    // Expose keyboard handler method - same approach as MentionsWithSlate story
    useImperativeHandle(
      ref,
      () => ({
        handleKeyDown: (event: React.KeyboardEvent) => {
          if (!isOpen || suggestions.length === 0) {
            return false
          }

          // If menu is open, intercept arrow up/down and enter keys
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === "Escape"
          ) {
            event.preventDefault()
            event.stopPropagation()

            // Get menu element and dispatch keyboard event - same approach as MentionsWithSlate
            const menuElement = document.querySelector('[role="listbox"]') as HTMLElement
            if (menuElement) {
              // Directly trigger keyboard event on menu element
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
            return true
          }

          return false
        },
      }),
      [isOpen, suggestions.length],
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
                  renderSuggestion(item, false)
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
