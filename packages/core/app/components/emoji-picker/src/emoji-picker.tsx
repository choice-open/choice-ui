import {
  EmojiActivity,
  EmojiAnimalsNature,
  EmojiFlags,
  EmojiFoodDrink,
  EmojiFrequentlyUsed,
  EmojiObjects,
  EmojiSmileysPeople,
  EmojiSymbols,
  EmojiTravelPlaces,
} from "@choiceform/icons-react"
import { ScrollArea } from "@choice-ui/scroll-area"
import { SearchInput } from "@choice-ui/search-input"
import { Segmented } from "@choice-ui/segmented"
import React, { memo, useMemo, useState } from "react"
import { useEventCallback } from "usehooks-ts"
import { EmojiCategoryHeader, EmojiEmpty, EmojiFooter, EmojiItem } from "./components"
import type { EmojiCategory, EmojiData } from "./hooks"
import { useEmojiData, useEmojiScroll } from "./hooks"
import { emojiTv } from "./tv"

export interface EmojiPickerProps {
  children?: React.ReactNode
  className?: string
  columns?: number
  height?: number
  onChange?: (emoji: EmojiData) => void
  searchPlaceholder?: string
  showCategories?: boolean
  showFrequentlyUsed?: boolean
  showSearch?: boolean
  showFooter?: boolean
  value?: EmojiData | null
  variant?: "default" | "dark" | "light"
}

// category configuration (with icons)
const categoriesWithIcons = [
  { id: "frequently_used", name: "Frequently used", icon: <EmojiFrequentlyUsed /> },
  { id: "smileys_people", name: "Smileys & People", icon: <EmojiSmileysPeople /> },
  { id: "animals_nature", name: "Animals & Nature", icon: <EmojiAnimalsNature /> },
  { id: "food_drink", name: "Food & Drink", icon: <EmojiFoodDrink /> },
  { id: "travel_places", name: "Travel & Places", icon: <EmojiTravelPlaces /> },
  { id: "activities", name: "Activities", icon: <EmojiActivity /> },
  { id: "objects", name: "Objects", icon: <EmojiObjects /> },
  { id: "symbols", name: "Symbols", icon: <EmojiSymbols /> },
  { id: "flags", name: "Flags", icon: <EmojiFlags /> },
] as const

export const EmojiPicker = memo(function EmojiPicker({
  value,
  onChange,
  className,
  searchPlaceholder = "Search emoji...",
  height = 384,
  columns = 8,
  showCategories = true,
  showFrequentlyUsed = true,
  showSearch = true,
  showFooter = true,
  children,
  variant = "dark",
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredEmoji, setHoveredEmoji] = useState<EmojiData | null>(null)

  const tv = emojiTv({ variant })

  // data management
  const {
    categorizedData,
    categoryIndexMap,
    addToFrequentlyUsed,
    findEmojiPosition,
    findEmojiByChar,
  } = useEmojiData({
    searchQuery,
    columns,
    showFrequentlyUsed,
  })

  // scroll management
  const {
    scrollRef,
    virtualizer,
    currentVisibleCategory,
    contentStyle,
    scrollToCategory,
    markInternalUpdate,
    PADDING,
  } = useEmojiScroll({
    categorizedData,
    categoryIndexMap,
    findEmojiPosition,
    searchQuery,
    value,
    columns,
  })

  // filter categories by configuration (with icons)
  const availableCategories = useMemo(() => {
    return categoriesWithIcons.filter((category) => {
      if (category.id === "frequently_used") {
        return showFrequentlyUsed
      }
      return true
    })
  }, [showFrequentlyUsed])

  // handle emoji select
  const handleEmojiSelect = useEventCallback((emoji: EmojiData) => {
    // mark as internal update, avoid triggering auto scroll
    markInternalUpdate()
    addToFrequentlyUsed(emoji.id)
    onChange?.(emoji)
  })

  // handle emoji hover
  const handleEmojiHover = useEventCallback((emoji: EmojiData | null) => {
    if (!showFooter) return
    setHoveredEmoji(emoji)
  })

  // handle category click (only scroll to position)
  const handleCategoryClick = useEventCallback((category: EmojiCategory) => {
    scrollToCategory(category)
  })

  const rootStyle = {
    "--emoji-height": `${height}px`,
    "--emoji-padding": `${PADDING}px`,
    "--emoji-columns": `${columns}`,
  } as React.CSSProperties

  return (
    <div
      className={tv.container({ className })}
      style={rootStyle}
    >
      {(showSearch || showCategories) && (
        <div className={tv.header()}>
          {showSearch && (
            <SearchInput
              autoFocus
              variant={variant}
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(value: string) => setSearchQuery(value)}
            />
          )}

          {showCategories && (
            <Segmented
              variant={variant}
              value={searchQuery.trim() ? undefined : currentVisibleCategory}
              onChange={(value: string) => handleCategoryClick(value as EmojiCategory)}
            >
              {availableCategories.map((category) => (
                <Segmented.Item
                  key={category.id}
                  value={category.id}
                  tooltip={{
                    content: category.name,
                    placement: "top",
                  }}
                >
                  {category.icon}
                </Segmented.Item>
              ))}
            </Segmented>
          )}
        </div>
      )}

      <ScrollArea
        variant={variant}
        className={tv.scroll()}
        hoverBoundary="none"
      >
        <ScrollArea.Viewport
          ref={scrollRef}
          className="h-full"
        >
          <ScrollArea.Content
            className={tv.content()}
            style={contentStyle}
          >
            {categorizedData.length > 0 ? (
              virtualizer.getVirtualItems().map((virtualItem) => {
                const item = categorizedData[virtualItem.index]
                if (!item) return null

                if (item.type === "header") {
                  return (
                    <EmojiCategoryHeader
                      title={item.title}
                      variant={variant}
                      key={virtualItem.key}
                      data-index={virtualItem.index}
                      ref={virtualizer.measureElement}
                      style={{
                        height: `${virtualItem.size}px`,
                        transform: `translateY(${virtualItem.start + PADDING}px)`,
                      }}
                    />
                  )
                }

                // emoji row
                const style = {
                  height: `${virtualItem.size}px`,
                  transform: `translateY(${virtualItem.start + PADDING}px)`,
                }

                return (
                  <div
                    key={virtualItem.key}
                    data-index={virtualItem.index}
                    ref={virtualizer.measureElement}
                    className={tv.row()}
                    style={style}
                  >
                    {item.emojis.map((emoji) => {
                      const isSelected = value?.id === emoji.id
                      return (
                        <EmojiItem
                          key={emoji.id}
                          emoji={emoji}
                          onSelect={handleEmojiSelect}
                          onHover={handleEmojiHover}
                          selected={isSelected}
                          variant={variant}
                        />
                      )
                    })}
                  </div>
                )
              })
            ) : (
              <EmojiEmpty variant={variant} />
            )}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>

      {showFooter && (
        <EmojiFooter
          hoveredEmoji={hoveredEmoji}
          selectedEmoji={value || null}
          variant={variant}
        />
      )}

      {children}
    </div>
  )
})

export default EmojiPicker
