import { memo } from "react"
import { Combobox } from "../../../combobox"
import type { MentionItemProps } from "../../types"

export interface MdInputMentionProps {
  filteredItems: MentionItemProps[]
  isOpen: boolean
  onClose: () => void
  onSelect: (item: MentionItemProps) => void
  position: { x: number; y: number } | null
  query: string
  renderItem?: (item: MentionItemProps) => React.ReactNode
}

export const MdInputMention = memo(function MdInputMention({
  isOpen,
  position,
  query,
  filteredItems,
  onSelect,
  onClose,
  renderItem,
}: MdInputMentionProps) {
  const defaultRenderItem = (item: MentionItemProps) => (
    <Combobox.Value>{item.label}</Combobox.Value>
  )

  if (!isOpen || !position) {
    return null
  }

  return (
    <Combobox
      trigger="coordinate"
      position={position}
      value={query}
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      placement="bottom-start"
      autoSelection={true}
    >
      <Combobox.Content>
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <Combobox.Item
              key={item.id}
              onClick={() => onSelect(item)}
            >
              {renderItem ? renderItem(item) : defaultRenderItem(item)}
            </Combobox.Item>
          ))
        ) : (
          <div className="text-muted-foreground p-4 text-center text-sm">No results found</div>
        )}
      </Combobox.Content>
    </Combobox>
  )
})

MdInputMention.displayName = "MdInputMention"
