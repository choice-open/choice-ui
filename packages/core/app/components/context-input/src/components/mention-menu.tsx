import { Combobox } from "@choiceform/combobox"
import React, { forwardRef, memo, useImperativeHandle } from "react"
import { contextInputTv } from "../tv"
import type { MentionItem } from "../types"

// 坐标位置类型
export interface MentionMenuPosition {
  x: number
  y: number
}

// MentionMenu 的 ref 接口
export interface MentionMenuRef {
  handleKeyDown: (event: React.KeyboardEvent) => boolean
}

// Mentions 菜单组件 - 使用 Combobox 的坐标模式
interface MentionMenuProps {
  isOpen: boolean
  loading: boolean
  onClose: () => void
  onSelect: (mention: MentionItem, index: number) => void
  position: MentionMenuPosition | null
  renderSuggestion?: (item: MentionItem, isSelected: boolean) => React.ReactNode
  root?: HTMLElement | null
  suggestions: MentionItem[]
}

export const MentionMenu = memo(
  forwardRef<MentionMenuRef, MentionMenuProps>(function MentionMenu(props, ref) {
    const { isOpen, loading, position, onSelect, renderSuggestion, suggestions, onClose, root } =
      props

    const tv = contextInputTv()

    // 暴露键盘处理方法 - 使用与 MentionsWithSlate story 相同的方式
    useImperativeHandle(
      ref,
      () => ({
        handleKeyDown: (event: React.KeyboardEvent) => {
          if (!isOpen || suggestions.length === 0) {
            return false
          }

          // 如果菜单打开，拦截上下箭头和回车键
          if (
            event.key === "ArrowDown" ||
            event.key === "ArrowUp" ||
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === "Escape"
          ) {
            event.preventDefault()
            event.stopPropagation()

            // 获取菜单元素并分发键盘事件 - 与 MentionsWithSlate 相同的方式
            const menuElement = document.querySelector('[role="listbox"]') as HTMLElement
            if (menuElement) {
              // 直接在菜单元素上触发键盘事件
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

    return loading ? null : (
      <Combobox
        trigger="coordinate"
        position={position}
        open={isOpen}
        onOpenChange={(open) => !open && onClose()}
        placement="bottom-start"
        autoSelection={true}
        value=""
        onChange={() => {}} // 不需要处理值变化
        root={root}
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
