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
  i18n?: {
    noEmojisFoundTitle?: string
    noEmojisFoundDescription?: string
    footerPickAnEmoji?: string
    categories?: {
      frequentlyUsed: string
      smileysPeople: string
      animalsNature: string
      foodDrink: string
      travelPlaces: string
      activities: string
      objects: string
      symbols: string
      flags: string
    }
  }
}

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
  i18n = {
    noEmojisFoundTitle: "No emoji found",
    noEmojisFoundDescription:
      "You can search for an emoji by name or use the search bar to find it.",
    footerPickAnEmoji: "Pick an emoji...",
    categories: {
      frequentlyUsed: "Frequently used",
      smileysPeople: "Smileys & People",
      animalsNature: "Animals & Nature",
      foodDrink: "Food & Drink",
      travelPlaces: "Travel & Places",
      activities: "Activities",
      objects: "Objects",
      symbols: "Symbols",
      flags: "Flags",
    },
  },
}: EmojiPickerProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [hoveredEmoji, setHoveredEmoji] = useState<EmojiData | null>(null)

  // ensure columns is at least 1
  const safeColumns = Math.max(1, columns)

  const tv = emojiTv({ variant })

  // category configuration (with icons) - memoized to avoid recreation on each render
  const categoriesWithIcons = useMemo(
    () => [
      {
        id: "frequently_used",
        name: i18n.categories?.frequentlyUsed,
        icon: <EmojiFrequentlyUsed />,
      },
      { id: "smileys_people", name: i18n.categories?.smileysPeople, icon: <EmojiSmileysPeople /> },
      { id: "animals_nature", name: i18n.categories?.animalsNature, icon: <EmojiAnimalsNature /> },
      { id: "food_drink", name: i18n.categories?.foodDrink, icon: <EmojiFoodDrink /> },
      { id: "travel_places", name: i18n.categories?.travelPlaces, icon: <EmojiTravelPlaces /> },
      { id: "activities", name: i18n.categories?.activities, icon: <EmojiActivity /> },
      { id: "objects", name: i18n.categories?.objects, icon: <EmojiObjects /> },
      { id: "symbols", name: i18n.categories?.symbols, icon: <EmojiSymbols /> },
      { id: "flags", name: i18n.categories?.flags, icon: <EmojiFlags /> },
    ],
    [i18n.categories],
  )

  // data management
  const {
    categorizedData,
    categoryIndexMap,
    addToFrequentlyUsed,
    findEmojiPosition,
    findEmojiByChar,
  } = useEmojiData({
    searchQuery,
    columns: safeColumns,
    showFrequentlyUsed,
    categoryNames: i18n.categories,
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
    columns: safeColumns,
  })

  // filter categories by configuration (with icons)
  const availableCategories = useMemo(() => {
    return categoriesWithIcons.filter((category) => {
      if (category.id === "frequently_used") {
        return showFrequentlyUsed
      }
      return true
    })
  }, [categoriesWithIcons, showFrequentlyUsed])

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
    "--emoji-columns": `${safeColumns}`,
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
              <EmojiEmpty
                variant={variant}
                i18n={{
                  title: i18n.noEmojisFoundTitle,
                  description: i18n.noEmojisFoundDescription,
                }}
              />
            )}
          </ScrollArea.Content>
        </ScrollArea.Viewport>
      </ScrollArea>

      {showFooter && (
        <EmojiFooter
          hoveredEmoji={hoveredEmoji}
          selectedEmoji={value || null}
          variant={variant}
          i18n={{
            pickAnEmoji: i18n.footerPickAnEmoji,
          }}
        />
      )}

      {children}
    </div>
  )
})

export default EmojiPicker
