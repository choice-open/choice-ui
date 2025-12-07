import {
  Button,
  EmojiData,
  EmojiPicker,
  emojis,
  Popover,
  Select,
} from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";

const meta: Meta<typeof EmojiPicker> = {
  title: "Pickers/EmojiPicker",
  component: EmojiPicker,
  parameters: {
    layout: "centered",
  },
  tags: ["beta", "autodocs"],
};

export default meta;

type Story = StoryObj<typeof EmojiPicker>;

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
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              Selected emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-gray-500">Please select an emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
        />
      </div>
    );
  },
};

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
    const [variant, setVariant] = useState<"default" | "light" | "dark">(
      "dark"
    );
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);

    return (
      <div className="flex flex-col gap-4">
        <Select
          value={variant}
          onChange={(value) =>
            setVariant(value as "default" | "light" | "dark")
          }
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
    );
  },
};

/**
 * Emoji picker without frequently used feature.
 *
 * Features:
 * - Disabled frequently used emoji tracking
 * - No "Frequently used" category shown
 * - Category navigation excludes frequently used option
 * - Emoji selections are not saved to local storage
 */
export const WithoutFrequentlyUsed: Story = {
  render: function WithoutFrequentlyUsedStory() {
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);

    return (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h3 className="text-body-large-strong mb-2">
            Frequently Used Feature Disabled
          </h3>
          {selectedEmoji ? (
            <div className="text-body-large">
              Selected emoji: {selectedEmoji.emoji} ({selectedEmoji.name})
            </div>
          ) : (
            <div className="text-gray-500">Please select an emoji</div>
          )}
        </div>

        <EmojiPicker
          value={selectedEmoji}
          onChange={setSelectedEmoji}
          height={384}
          variant="dark"
          showFrequentlyUsed={false}
        />

        <div className="text-body-small max-w-md text-center text-gray-500">
          <p>This example shows disabled frequently used feature:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• No &quot;Frequently used&quot; category displayed</li>
            <li>• Category navigation has no frequently used icon</li>
            <li>• Emoji selections are not saved to local storage</li>
            <li>
              • Suitable for scenarios where user habits tracking is not needed
            </li>
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * Controlled emoji picker inside a popover.
 *
 * Features:
 * - External state management for selected emoji
 * - Popover container provides floating layer experience
 * - Auto-closes popover after emoji selection
 * - Shows current selected emoji in trigger button
 */
export const ControlledWithPopover: Story = {
  render: function ControlledWithPopoverStory() {
    const [open, setOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);

    const handleEmojiSelect = (emoji: EmojiData) => {
      setSelectedEmoji(emoji);
      setOpen(false); // 选择后关闭 popover
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          {selectedEmoji ? (
            <div className="text-body-large">
              Current selection: {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">No emoji selected</div>
          )}
        </div>

        <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
          <Popover.Trigger>
            <Button active={open}>
              {selectedEmoji?.emoji || "😀"} Select Emoji
            </Button>
          </Popover.Trigger>

          <Popover.Header title="Select Emoji" />

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
    );
  },
};

/**
 * Multiple controlled emoji pickers.
 *
 * Shows how to use multiple independent emoji pickers on the same page.
 */
export const MultipleControlled: Story = {
  render: function MultipleControlledStory() {
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [emoji1, setEmoji1] = useState<EmojiData | null>(null);
    const [emoji2, setEmoji2] = useState<EmojiData | null>(null);

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="text-body-large-strong mb-2">
            Multiple Emoji Pickers
          </h3>
          <p className="text-gray-500">
            Picker 1: {emoji1?.emoji || "Not selected"} | Picker 2:{" "}
            {emoji2?.emoji || "Not selected"}
          </p>
        </div>

        <div className="flex gap-4">
          <Popover
            open={open1}
            onOpenChange={setOpen1}
            placement="bottom-start"
          >
            <Popover.Trigger>
              <Button active={open1}>{emoji1?.emoji || "😀"} Picker 1</Button>
            </Popover.Trigger>

            <Popover.Header title="Emoji Picker 1" />

            <Popover.Content className="p-0">
              <EmojiPicker
                value={emoji1}
                onChange={(emoji) => {
                  setEmoji1(emoji);
                  setOpen1(false);
                }}
                height={350}
                variant="dark"
              />
            </Popover.Content>
          </Popover>

          <Popover open={open2} onOpenChange={setOpen2} placement="bottom-end">
            <Popover.Trigger>
              <Button active={open2}>{emoji2?.emoji || "🎉"} Picker 2</Button>
            </Popover.Trigger>

            <Popover.Header title="Emoji Picker 2" />

            <Popover.Content className="p-0">
              <EmojiPicker
                value={emoji2}
                onChange={(emoji) => {
                  setEmoji2(emoji);
                  setOpen2(false);
                }}
                height={350}
                variant="dark"
              />
            </Popover.Content>
          </Popover>
        </div>
      </div>
    );
  },
};

/**
 * Draggable emoji picker popover.
 *
 * Features:
 * - Users can drag the popover position
 * - Remember position feature
 * - Larger selection area
 */
export const DraggablePopover: Story = {
  render: function DraggablePopoverStory() {
    const [open, setOpen] = useState(false);
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(null);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <p className="mb-2 text-gray-500">Draggable Emoji Picker</p>
          {selectedEmoji ? (
            <div className="text-body-large">
              {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">No emoji selected</div>
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
            <Button active={open}>
              {selectedEmoji?.emoji || "🎯"} Draggable Picker
            </Button>
          </Popover.Trigger>

          <Popover.Header title="Drag me! Select Emoji" />

          <Popover.Content className="p-0">
            <EmojiPicker
              value={selectedEmoji}
              onChange={(emoji) => {
                setSelectedEmoji(emoji);
                setOpen(false);
              }}
              height={450}
              columns={10}
              variant="dark"
            />
          </Popover.Content>
        </Popover>
      </div>
    );
  },
};

/**
 * External value control example.
 *
 * Shows how to set and reset emoji picker value through external controls.
 */
export const ExternalValueControl: Story = {
  render: function ExternalValueControlStory() {
    const [open, setOpen] = useState(false);
    // Default select an emoji (smiley face) - using real data
    const [selectedEmoji, setSelectedEmoji] = useState<EmojiData | null>(
      emojis.find((e) => e.emoji === "😀") || null
    );
    const [recentEmojis, setRecentEmojis] = useState<EmojiData[]>([]);

    // When emoji is selected, record to recently used
    const handleEmojiSelect = (emoji: EmojiData) => {
      setSelectedEmoji(emoji);

      // Add to recently used, avoid duplicates
      setRecentEmojis((prev) => {
        const filtered = prev.filter((e) => e.id !== emoji.id);
        return [emoji, ...filtered].slice(0, 5); // Keep only the last 5
      });

      setOpen(false);
    };

    // Find real data based on emoji character
    const findEmojiByChar = (emojiChar: string): EmojiData | null => {
      return emojis.find((e) => e.emoji === emojiChar) || null;
    };

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="text-center">
          <h3 className="text-body-large-strong mb-2">
            External Value Control
          </h3>
          {selectedEmoji ? (
            <div className="text-body-large">
              Current selection: {selectedEmoji.emoji} {selectedEmoji.name}
            </div>
          ) : (
            <div className="text-gray-500">No emoji selected</div>
          )}
        </div>

        {/* 最近使用的 emoji 快速选择 */}
        {recentEmojis.length > 0 && (
          <div className="text-center">
            <p className="text-body-small mb-2 text-gray-500">Recently used:</p>
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
                  setSelectedEmoji(null);
                  setRecentEmojis([]);
                }}
                title="Clear all"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* 预设的一些常用 emoji 用于快速切换 */}
        <div className="text-center">
          <p className="text-body-small mb-2 text-gray-500">Quick select:</p>
          <div className="flex justify-center gap-2">
            {[
              "😀", // Grinning Face
              "🎉", // Party Popper
              "❤️️", // Red Heart - 使用正确的格式
              "👍", // Thumbs Up
              "🔥", // Fire
            ]
              .map((emojiChar) => {
                const emojiData = findEmojiByChar(emojiChar);
                if (!emojiData) return null;

                return (
                  <Button
                    key={emojiData.id}
                    variant="secondary"
                    onClick={() => setSelectedEmoji(emojiData)}
                    title={emojiData.name}
                  >
                    {emojiData.emoji}
                  </Button>
                );
              })
              .filter(Boolean)}
          </div>
        </div>

        <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
          <Popover.Trigger>
            <Button active={open}>
              {selectedEmoji?.emoji || "🎨"} Open Picker
            </Button>
          </Popover.Trigger>

          <Popover.Header title="Emoji Picker" />

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
        <div className="text-body-small max-w-md text-center text-gray-500">
          <p>This example shows external value control:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• Default selected emoji (😀)</li>
            <li>• Can switch preset emojis via quick select buttons</li>
            <li>
              • Selected emojis are automatically recorded to recently used list
            </li>
            <li>
              • When setting value externally, picker auto-scrolls to position
            </li>
            <li>• Supports clearing current selection and history</li>
          </ul>
        </div>
      </div>
    );
  },
};
