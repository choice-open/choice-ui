import { Button, EmojiData, EmojiPicker, emojis, Popover, Select } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

const meta: Meta<typeof EmojiPicker> = {
  title: "Pickers/EmojiPicker",
  component: EmojiPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof EmojiPicker>

/**
 * Basic emoji picker implementation.
 *
 * Features:
 * - Category browsing and search
 * - Automatic frequently used emoji tracking
 * - Virtualized scrolling for performance
 * - Support for dark/light themes
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              Selected emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-secondary-foreground">Please select an emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
        />
      </div>
    )
  },
}

/**
 * Visual variants of the emoji picker.
 *
 * Variants:
 * - **default**: Follows the page theme dynamically (light/dark mode)
 * - **light**: Fixed light appearance regardless of theme
 * - **dark**: Fixed dark appearance regardless of theme
 */
export const Variants: Story = {
  render: function VariantsStory() {
    const [variant, setVariant] = useState<"default" | "light" | "dark">("dark")
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <Select
          value={variant}
          onChange={(value) => setVariant(value as "default" | "light" | "dark")}
        >
          <Select.Trigger>
            <Select.Value>{variant}</Select.Value>
          </Select.Trigger>
          <Select.Content>
            <Select.Item value="default">Default</Select.Item>
            <Select.Item value="light">Light</Select.Item>
            <Select.Item value="dark">Dark</Select.Item>
          </Select.Content>
        </Select>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant={variant}
        />
      </div>
    )
  },
}

/**
 * Emoji picker with `showFrequentlyUsed={false}`.
 *
 * ### When to Use
 * - Privacy-sensitive applications
 * - Single-use emoji selection (no need to track habits)
 * - Simplified UI without history tracking
 *
 * ### Behavior
 * - No "Frequently used" category displayed
 * - Category navigation excludes frequently used icon
 * - Emoji selections are not saved to local storage
 */
export const WithoutFrequentlyUsed: Story = {
  render: function WithoutFrequentlyUsedStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              Selected emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-secondary-foreground">Please select an emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
          showFrequentlyUsed={false}
        />
      </div>
    )
  },
}

/**
 * Multiple independent emoji pickers on the same page.
 *
 * ### Key Points
 * - Each picker has its own state (`emoji1`, `emoji2`)
 * - Each picker has its own open state (`open1`, `open2`)
 * - Combined with `Popover` for dropdown behavior
 * - Auto-close popover after selection
 *
 * ### Popover Integration
 * - Use `Popover.Header` with custom styling to match picker variant
 * - Set `className="overflow-hidden"` on Popover for clean edges
 * - Set `className="p-0"` on `Popover.Content` to remove padding
 */
export const MultipleControlled: Story = {
  render: function MultipleControlledStory() {
    const [open1, setOpen1] = useState(false)
    const [open2, setOpen2] = useState(false)
    const [emoji1, setEmoji1] = useState<EmojiData | null>(null)
    const [emoji2, setEmoji2] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-secondary-foreground">
            Picker 1: {emoji1?.emoji || "Not selected"} | Picker 2:{" "}
            {emoji2?.emoji || "Not selected"}
          </p>
        </div>

        <div className="flex gap-4">
          <Popover
            draggable
            open={open1}
            onOpenChange={setOpen1}
            placement="bottom-start"
            className="overflow-hidden"
          >
            <Popover.Trigger>
              <Button active={open1}>{emoji1?.emoji || "😀"} Picker 1</Button>
            </Popover.Trigger>

            <Popover.Header title="Emoji Picker 1" />

            <Popover.Content className="p-0">
              <EmojiPicker
                value={emoji1}
                onChange={(emoji) => {
                  setEmoji1(emoji)
                  setOpen1(false)
                }}
                height={350}
                variant="light"
              />
            </Popover.Content>
          </Popover>

          <Popover
            draggable
            open={open2}
            onOpenChange={setOpen2}
            placement="bottom-end"
            className="overflow-hidden"
          >
            <Popover.Trigger>
              <Button active={open2}>{emoji2?.emoji || "🎉"} Picker 2</Button>
            </Popover.Trigger>

            <Popover.Header
              title="Emoji Picker 2"
              className="bg-menu-background border-menu-boundary text-white"
              closeButtonProps={{
                variant: "dark",
              }}
            />

            <Popover.Content className="p-0">
              <EmojiPicker
                value={emoji2}
                onChange={(emoji) => {
                  setEmoji2(emoji)
                  setOpen2(false)
                }}
                height={350}
                variant="dark"
              />
            </Popover.Content>
          </Popover>
        </div>
      </div>
    )
  },
}

/**
 * Internationalization (i18n) support for the emoji picker.
 *
 * ### Supported Languages
 * - English (default)
 * - Chinese (中文)
 * - Japanese (日本語)
 * - Korean (한국어)
 * - Spanish (Español)
 * - And more...
 *
 * ### Customizable Text
 * - `searchPlaceholder`: Search input placeholder
 * - `i18n.noEmojisFoundTitle`: Empty state title
 * - `i18n.noEmojisFoundDescription`: Empty state description
 * - `i18n.footerPickAnEmoji`: Footer placeholder text
 * - `i18n.categories.*`: Category names (9 categories)
 */
export const Internationalization: Story = {
  render: function InternationalizationStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)
    const [locale, setLocale] = useState<"en" | "zh" | "ja" | "ko" | "es">("en")

    const i18nConfig = {
      en: {
        searchPlaceholder: "Search emoji...",
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
      zh: {
        searchPlaceholder: "搜索表情...",
        noEmojisFoundTitle: "未找到表情",
        noEmojisFoundDescription: "您可以通过名称搜索表情符号，或使用搜索栏查找。",
        footerPickAnEmoji: "选择一个表情...",
        categories: {
          frequentlyUsed: "常用",
          smileysPeople: "笑脸与人物",
          animalsNature: "动物与自然",
          foodDrink: "食物与饮料",
          travelPlaces: "旅行与地点",
          activities: "活动",
          objects: "物品",
          symbols: "符号",
          flags: "旗帜",
        },
      },
      ja: {
        searchPlaceholder: "絵文字を検索...",
        noEmojisFoundTitle: "絵文字が見つかりません",
        noEmojisFoundDescription: "名前で絵文字を検索するか、検索バーを使用してください。",
        footerPickAnEmoji: "絵文字を選択...",
        categories: {
          frequentlyUsed: "よく使う",
          smileysPeople: "スマイリーと人物",
          animalsNature: "動物と自然",
          foodDrink: "食べ物と飲み物",
          travelPlaces: "旅行と場所",
          activities: "アクティビティ",
          objects: "オブジェクト",
          symbols: "記号",
          flags: "旗",
        },
      },
      ko: {
        searchPlaceholder: "이모지 검색...",
        noEmojisFoundTitle: "이모지를 찾을 수 없습니다",
        noEmojisFoundDescription: "이름으로 이모지를 검색하거나 검색창을 사용하세요.",
        footerPickAnEmoji: "이모지 선택...",
        categories: {
          frequentlyUsed: "자주 사용",
          smileysPeople: "스마일 & 사람",
          animalsNature: "동물 & 자연",
          foodDrink: "음식 & 음료",
          travelPlaces: "여행 & 장소",
          activities: "활동",
          objects: "사물",
          symbols: "기호",
          flags: "깃발",
        },
      },
      es: {
        searchPlaceholder: "Buscar emoji...",
        noEmojisFoundTitle: "No se encontró emoji",
        noEmojisFoundDescription:
          "Puedes buscar un emoji por nombre o usar la barra de búsqueda.",
        footerPickAnEmoji: "Elige un emoji...",
        categories: {
          frequentlyUsed: "Frecuentes",
          smileysPeople: "Caras y personas",
          animalsNature: "Animales y naturaleza",
          foodDrink: "Comida y bebida",
          travelPlaces: "Viajes y lugares",
          activities: "Actividades",
          objects: "Objetos",
          symbols: "Símbolos",
          flags: "Banderas",
        },
      },
    }

    const currentI18n = i18nConfig[locale]

    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-secondary-foreground">Language:</span>
          <Select
            value={locale}
            onChange={(value) => setLocale(value as typeof locale)}
          >
            <Select.Trigger className="w-40">
              <Select.Value>
                {locale === "en"
                  ? "English"
                  : locale === "zh"
                    ? "中文"
                    : locale === "ja"
                      ? "日本語"
                      : locale === "ko"
                        ? "한국어"
                        : "Español"}
              </Select.Value>
            </Select.Trigger>
            <Select.Content>
              <Select.Item value="en">English</Select.Item>
              <Select.Item value="zh">中文</Select.Item>
              <Select.Item value="ja">日本語</Select.Item>
              <Select.Item value="ko">한국어</Select.Item>
              <Select.Item value="es">Español</Select.Item>
            </Select.Content>
          </Select>
        </div>

        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              {locale === "zh"
                ? "已选择："
                : locale === "ja"
                  ? "選択済み："
                  : locale === "ko"
                    ? "선택됨: "
                    : locale === "es"
                      ? "Seleccionado: "
                      : "Selected: "}
              {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-secondary-foreground">{currentI18n.footerPickAnEmoji}</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
          searchPlaceholder={currentI18n.searchPlaceholder}
          i18n={{
            noEmojisFoundTitle: currentI18n.noEmojisFoundTitle,
            noEmojisFoundDescription: currentI18n.noEmojisFoundDescription,
            footerPickAnEmoji: currentI18n.footerPickAnEmoji,
            categories: currentI18n.categories,
          }}
        />
      </div>
    )
  },
}

/**
 * Control emoji picker value from external components.
 *
 * ### Features Demonstrated
 * - Set default value on mount using `emojis.find()`
 * - Quick select buttons to change value externally
 * - Custom "recently used" list managed in parent state
 * - Clear selection and history
 *
 * ### Using `emojis` Array
 * ```tsx
 * import { emojis } from "@choice-ui/react"
 *
 * // Find emoji by character
 * const emoji = emojis.find((e) => e.emoji === "😀")
 *
 * // Set as initial value
 * const [selected, setSelected] = useState(emoji || null)
 * ```
 */
export const ExternalValueControl: Story = {
  render: function ExternalValueControlStory() {
    const [open, setOpen] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(
      emojis.find((e) => e.emoji === "😀") || null,
    )
    const [recentEmojis, setRecentEmojis] = useState<EmojiData[]>([])

    const handleEmojiSelect = (emoji: EmojiData) => {
      setSelectedEmoji(emoji)
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e.id !== emoji.id)
        return [emoji, ...filtered].slice(0, 5)
      })
      setOpen(false)
    }

    const findEmojiByChar = (emojiChar: string): EmojiData | null => {
      return emojis.find((e) => e.emoji === emojiChar) || null
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              Current: {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-secondary-foreground">No emoji selected</div>
          )}
        </div>

        {/* Recently used */}
        {recentEmojis.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground">Recent:</span>
            {recentEmojis.map((emoji) => (
              <Button
                key={emoji.id}
                variant="secondary"
                onClick={() => setSelectedEmoji(emoji)}
                title={emoji.name}
              >
                {emoji.emoji}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => {
                setSelectedEmoji(null)
                setRecentEmojis([])
              }}
            >
              Clear
            </Button>
          </div>
        )}

        {/* Quick select */}
        <div className="flex items-center gap-2">
          <span className="text-secondary-foreground">Quick:</span>
          {["😀", "🎉", "❤️️", "👍", "🔥"]
            .map((emojiChar) => {
              const emojiData = findEmojiByChar(emojiChar)
              if (!emojiData) return null
              return (
                <Button
                  key={emojiData.id}
                  variant="secondary"
                  onClick={() => setSelectedEmoji(emojiData)}
                  title={emojiData.name}
                >
                  {emojiData.emoji}
                </Button>
              )
            })
            .filter(Boolean)}
        </div>

        <Popover
          draggable
          open={open}
          onOpenChange={setOpen}
          placement="bottom-start"
          className="overflow-hidden"
        >
          <Popover.Trigger>
            <Button active={open}>{selectedEmoji?.emoji || "🎨"} Open Picker</Button>
          </Popover.Trigger>
          <Popover.Header title="Emoji Picker" />
          <Popover.Content className="p-0">
            <EmojiPicker
              value={selectedEmoji}
              onChange={handleEmojiSelect}
              height={400}
              variant="light"
            />
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}
