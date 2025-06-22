import type { Meta, StoryObj } from "@storybook/react"
import React, { useState } from "react"
import { Button } from "../button"
import { Popover } from "../popover"
import { EmojiPicker } from "./emoji-picker"
import { EmojiData } from "./hooks"
import { emojis } from "./utils"

const meta: Meta<typeof EmojiPicker> = {
  title: "Pickers/EmojiPicker",
  component: EmojiPicker,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof EmojiPicker>

/**
 * Basic: 基本的 Emoji 选择器实现
 *
 * 功能特性：
 * - 分类浏览和搜索
 * - 常用 emoji 自动记录
 * - 虚拟化滚动性能优化
 * - 支持 dark/light 主题
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-lg">
              选中的 emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-gray-500">请选择一个 emoji</div>
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
 * Light Theme: 浅色主题的 Emoji 选择器
 */
export const LightTheme: Story = {
  render: function LightThemeStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-lg">
              选中的 emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-gray-500">请选择一个 emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="light"
        />
      </div>
    )
  },
}

/**
 * Without Frequently Used: 禁用常用 Emoji 功能
 *
 * 功能特性：
 * - 禁用常用 emoji 记录功能
 * - 不显示 Frequently used 分类
 * - 分类导航中不包含 Frequently used 选项
 * - 选择 emoji 时不会记录到本地存储
 */
export const WithoutFrequentlyUsed: Story = {
  render: function WithoutFrequentlyUsedStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">禁用常用 Emoji 功能</h3>
          {selectedEmoji ? (
            <div className="text-lg">
              选中的 emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-gray-500">请选择一个 emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
          showFrequentlyUsed={false}
        />

        <div className="max-w-md text-center text-sm text-gray-500">
          <p>这个示例展示了禁用常用功能：</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• 不显示 &ldquo;Frequently used&rdquo; 分类</li>
            <li>• 分类导航中没有常用 emoji 图标</li>
            <li>• 选择 emoji 时不会记录到本地存储</li>
            <li>• 适用于不需要记录用户使用习惯的场景</li>
          </ul>
        </div>
      </div>
    )
  },
}

/**
 * Controlled with Popover: 外部受控的 Emoji 选择器，放置在 Popover 中
 *
 * 功能特性：
 * - 外部状态管理选中的 emoji
 * - Popover 容器提供浮层体验
 * - 点击 emoji 后自动关闭 popover
 * - 显示当前选中的 emoji 在触发按钮上
 */
export const ControlledWithPopover: Story = {
  render: function ControlledWithPopoverStory() {
    const [open, setOpen] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    const handleEmojiSelect = (emoji: EmojiData) => {
      setSelectedEmoji(emoji)
      setOpen(false) // 选择后关闭 popover
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-lg">
              当前选中: {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">未选择 emoji</div>
          )}
        </div>

        <Popover
          open={open}
          onOpenChange={setOpen}
          placement="bottom-start"
        >
          <Popover.Trigger>
            <Button active={open}>{selectedEmoji?.emoji || "😀"} 选择 Emoji</Button>
          </Popover.Trigger>

          <Popover.Header title="选择 Emoji" />

          <Popover.Content className="p-0">
            <EmojiPicker
              value={selectedEmoji}
              onChange={handleEmojiSelect}
              height={400}
              variant="dark"
            />
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}

/**
 * Multiple Controlled: 多个受控的 Emoji 选择器示例
 *
 * 展示如何在同一个页面中使用多个独立的 emoji 选择器
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
          <h3 className="mb-2 text-lg font-medium">多个 Emoji 选择器</h3>
          <p className="text-gray-500">
            选择器 1: {emoji1?.emoji || "未选择"} | 选择器 2: {emoji2?.emoji || "未选择"}
          </p>
        </div>

        <div className="flex gap-4">
          <Popover
            open={open1}
            onOpenChange={setOpen1}
            placement="bottom-start"
          >
            <Popover.Trigger>
              <Button active={open1}>{emoji1?.emoji || "😀"} 选择器 1</Button>
            </Popover.Trigger>

            <Popover.Header title="Emoji 选择器 1" />

            <Popover.Content className="p-0">
              <EmojiPicker
                value={emoji1}
                onChange={(emoji) => {
                  setEmoji1(emoji)
                  setOpen1(false)
                }}
                height={350}
                variant="dark"
              />
            </Popover.Content>
          </Popover>

          <Popover
            open={open2}
            onOpenChange={setOpen2}
            placement="bottom-end"
          >
            <Popover.Trigger>
              <Button active={open2}>{emoji2?.emoji || "🎉"} 选择器 2</Button>
            </Popover.Trigger>

            <Popover.Header title="Emoji 选择器 2" />

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
 * Draggable Popover: 可拖拽的 Emoji 选择器 Popover
 *
 * 功能特性：
 * - 用户可以拖拽 popover 位置
 * - 记住位置功能
 * - 更大的选择区域
 */
export const DraggablePopover: Story = {
  render: function DraggablePopoverStory() {
    const [open, setOpen] = useState(false)
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null)

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-gray-500">可拖拽的 Emoji 选择器</p>
          {selectedEmoji ? (
            <div className="text-lg">
              {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">未选择 emoji</div>
          )}
        </div>

        <Popover
          open={open}
          onOpenChange={setOpen}
          draggable
          rememberPosition
          placement="bottom-start"
        >
          <Popover.Trigger>
            <Button active={open}>{selectedEmoji?.emoji || "🎯"} 可拖拽选择器</Button>
          </Popover.Trigger>

          <Popover.Header title="拖拽我！选择 Emoji" />

          <Popover.Content className="p-0">
            <EmojiPicker
              value={selectedEmoji}
              onChange={(emoji) => {
                setSelectedEmoji(emoji)
                setOpen(false)
              }}
              height={450}
              columns={10}
              variant="dark"
            />
          </Popover.Content>
        </Popover>
      </div>
    )
  },
}

/**
 * External Value Control: 外部值控制示例
 *
 * 展示如何通过外部控制来设置和重置 emoji 选择器的值
 */
export const ExternalValueControl: Story = {
  render: function ExternalValueControlStory() {
    const [open, setOpen] = useState(false)
    // 默认选择一个 emoji (笑脸) - 使用真实数据
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(
      emojis.find((e) => e.emoji === "😀") || null,
    )
    const [recentEmojis, setRecentEmojis] = useState<EmojiData[]>([])

    // 当 emoji 被选择时，记录到最近使用
    const handleEmojiSelect = (emoji: EmojiData) => {
      setSelectedEmoji(emoji)

      // 添加到最近使用，避免重复
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e.id !== emoji.id)
        return [emoji, ...filtered].slice(0, 5) // 只保留最近 5 个
      })

      setOpen(false)
    }

    // 根据emoji字符查找真实数据
    const findEmojiByChar = (emojiChar: string): EmojiData | null => {
      return emojis.find((e) => e.emoji === emojiChar) || null
    }

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">外部值控制</h3>
          {selectedEmoji ? (
            <div className="text-lg">
              当前选中: {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">未选择 emoji</div>
          )}
        </div>

        {/* 最近使用的 emoji 快速选择 */}
        {recentEmojis.length > 0 && (
          <div className="text-center">
            <p className="mb-2 text-sm text-gray-500">最近使用：</p>
            <div className="flex justify-center gap-2">
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
                title="清除所有"
              >
                清除
              </Button>
            </div>
          </div>
        )}

        {/* 预设的一些常用 emoji 用于快速切换 */}
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-500">快速选择：</p>
          <div className="flex justify-center gap-2">
            {[
              "😀", // Grinning Face
              "🎉", // Party Popper
              "❤️️", // Red Heart - 使用正确的格式
              "👍", // Thumbs Up
              "🔥", // Fire
            ]
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
        </div>

        <Popover
          open={open}
          onOpenChange={setOpen}
          placement="bottom-start"
        >
          <Popover.Trigger>
            <Button active={open}>{selectedEmoji?.emoji || "🎨"} 打开选择器</Button>
          </Popover.Trigger>

          <Popover.Header title="Emoji 选择器" />

          <Popover.Content className="p-0">
            <EmojiPicker
              value={selectedEmoji}
              onChange={handleEmojiSelect}
              height={400}
              variant="dark"
            />
          </Popover.Content>
        </Popover>

        {/* 说明文字 */}
        <div className="max-w-md text-center text-sm text-gray-500">
          <p>这个示例展示了外部值控制：</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• 默认选择了一个 emoji (😀)</li>
            <li>• 可以通过快速选择按钮切换预设的 emoji</li>
            <li>• 选择的 emoji 会自动记录到最近使用列表</li>
            <li>• 外部设置值时，选择器会自动滚动到对应位置</li>
            <li>• 支持清除当前选择和历史记录</li>
          </ul>
        </div>
      </div>
    )
  },
}
