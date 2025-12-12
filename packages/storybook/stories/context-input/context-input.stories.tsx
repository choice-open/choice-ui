import type {
  ContextInputRef,
  ContextInputValue,
  ContextMentionElement,
  MentionItemProps,
} from "@choice-ui/react"
import {
  Avatar,
  Button,
  Checkbox,
  CodeBlock,
  ContextInput,
  IconButton,
  tcx,
} from "@choice-ui/react"
import { AddSmall, ArrowUp, ExpandSmall, Image } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useRef, useState } from "react"

const meta: Meta<typeof ContextInput> = {
  title: "Forms/ContextInput",
  component: ContextInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
}

export default meta
type Story = StoryObj<typeof ContextInput>

// Mock data for testing - 使用固定数据避免 SSR hydration 问题
const userNames = [
  "John Doe",
  "Jane Smith",
  "Alice Johnson",
  "Bob Williams",
  "Charlie Brown",
  "Diana Prince",
  "Edward Norton",
  "Fiona Apple",
  "George Lucas",
  "Helen Troy",
  "Ivan Petrov",
  "Julia Roberts",
]

const users: MentionItemProps[] = userNames.map((name, i) => ({
  id: i.toString(),
  type: "user",
  label: name,
  prefix: (
    <Avatar
      photo={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(/\s/g, "")}`}
      name={name}
      size="small"
    />
  ),
  description: `${name}'s profile`,
}))

const channelNames = [
  "general",
  "random",
  "announcements",
  "development",
  "design",
  "marketing",
  "support",
  "feedback",
  "ideas",
  "offtopic",
  "team",
  "projects",
]

const channels: MentionItemProps[] = channelNames.map((name, i) => ({
  id: i.toString(),
  type: "channel",
  label: name,
  description: `#${name} channel`,
}))

/**
 * Basic: Simple context input with user mentions using @ trigger.
 * - Type @ to search and mention users
 * - Arrow keys navigation and Enter/Tab to select
 * - Returns structured data with text and mention metadata
 * - Real-time search filtering
 *
 * ```tsx
 * const [value, setValue] = useState({ text: "", mentions: [] })
 *
 * <ContextInput
 *   value={value}
 *   placeholder="Type @ to mention someone..."
 *   triggers={[{
 *     char: "@",
 *     onSearch: async (query) => {
 *       return users.filter(user =>
 *         user.label.toLowerCase().includes(query.toLowerCase())
 *       )
 *     }
 *   }]}
 *   onChange={setValue}
 *   onMentionSelect={(mention, trigger) => {
 *     console.log("Selected:", mention, trigger)
 *   }}
 * />
 * ```
 */
export const Basic: Story = {
  render: function Basic() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Disabled: Shows context input in disabled state.
 * - All interactions are prevented
 * - Visual styling indicates disabled state
 * - Useful for read-only scenarios or conditional editing
 *
 * ```tsx
 * <ContextInput
 *   disabled
 *   value={value}
 *   placeholder="This input is disabled..."
 *   triggers={triggers}
 *   onChange={setValue}
 * />
 * ```
 */
export const Disabled: Story = {
  render: function Basic() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "Hello @alice and @bob!",
      mentions: [
        {
          item: { id: "1", label: "alice", type: "user" },
          startIndex: 6,
          endIndex: 12,
          text: "alice",
        },
        {
          item: { id: "2", label: "bob", type: "user" },
          startIndex: 17,
          endIndex: 21,
          text: "bob",
        },
      ],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          disabled
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * ReadOnly: Demonstrates the ContextInput component in readOnly mode.
 * - Prevents value changes while allowing focus and selection
 * - Maintains normal visual appearance (unlike disabled)
 * - Useful for displaying non-editable context input information
 */
export const ReadOnly: Story = {
  render: function ReadOnlyStory() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "Hello @alice and @bob!",
      mentions: [
        {
          item: { id: "1", label: "alice", type: "user" },
          startIndex: 6,
          endIndex: 12,
          text: "alice",
        },
        {
          item: { id: "2", label: "bob", type: "user" },
          startIndex: 17,
          endIndex: 21,
          text: "bob",
        },
      ],
    })

    const handleChange = (newValue: ContextInputValue) => {
      setValue(newValue)
    }

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          readOnly
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={handleChange}
        />
        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * Variants: Demonstrates different visual variants of the context input component.
 * - default: Follows the page theme dynamically (light/dark mode)
 * - light: Fixed light appearance regardless of theme
 * - dark: Fixed dark appearance regardless of theme
 * - reset: Removes variant styling, no Variant settings applied
 *
 * ```tsx
 * <ContextInput
 *   variant="default" // Adapts to current theme
 *   value={value}
 *   placeholder="Type @ to mention..."
 *   triggers={triggers}
 *   onChange={setValue}
 * />
 * ```
 */
export const Variants: Story = {
  render: function Variants() {
    const [defaultValue, setDefaultValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const [lightValue, setLightValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const [darkValue, setDarkValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const [disabled, setDisabled] = useState(false)
    return (
      <div className="flex flex-col gap-2">
        <Checkbox
          value={disabled}
          onChange={(value) => setDisabled(value)}
        >
          Disabled
        </Checkbox>
        <div className="flex flex-wrap gap-4">
          <div className="bg-default-background rounded-lg border p-4">
            <ContextInput
              disabled={disabled}
              variant="default"
              value={defaultValue}
              placeholder="Type @ to mention someone..."
              className="max-h-96 w-48"
              triggers={[
                {
                  char: "@",
                  onSearch: async (query) => {
                    return users.filter((user) =>
                      user.label.toLowerCase().includes(query.toLowerCase()),
                    )
                  },
                },
              ]}
              onChange={setDefaultValue}
              onMentionSelect={(mention, trigger) => {
                console.log("Mention selected:", mention, trigger)
              }}
            />
          </div>
          <div className="rounded-lg border bg-white p-4">
            <ContextInput
              disabled={disabled}
              variant="light"
              value={lightValue}
              placeholder="Type @ to mention someone..."
              className="max-h-96 w-48"
              triggers={[
                {
                  char: "@",
                  onSearch: async (query) => {
                    return users.filter((user) =>
                      user.label.toLowerCase().includes(query.toLowerCase()),
                    )
                  },
                },
              ]}
              onChange={setLightValue}
              onMentionSelect={(mention, trigger) => {
                console.log("Mention selected:", mention, trigger)
              }}
            />
          </div>
          <div className="rounded-lg border bg-gray-800 p-4">
            <ContextInput
              disabled={disabled}
              variant="dark"
              value={darkValue}
              placeholder="Type @ to mention someone..."
              className="max-h-96 w-48"
              triggers={[
                {
                  char: "@",
                  onSearch: async (query) => {
                    return users.filter((user) =>
                      user.label.toLowerCase().includes(query.toLowerCase()),
                    )
                  },
                },
              ]}
              onChange={setDarkValue}
            />
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Large: Context input with large size variant.
 * - Increased padding and font size
 * - Better for prominent input areas
 * - More comfortable for extended typing
 *
 * ```tsx
 * <ContextInput
 *   size="large"
 *   value={value}
 *   placeholder="Large size input..."
 *   triggers={triggers}
 *   onChange={setValue}
 * />
 * ```
 */
export const LargeSize: Story = {
  render: function LargeSize() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          size="large"
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
          <CodeBlock.Content code={value.text} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * MinHeight: Context input with custom minimum height.
 * - Set minHeight prop to control initial height
 * - Useful for ensuring consistent layout
 * - Input will grow beyond minHeight if needed
 *
 * ```tsx
 * <ContextInput
 *   minHeight={128}
 *   size="large"
 *   value={value}
 *   placeholder="Min height 128px..."
 *   triggers={triggers}
 *   onChange={setValue}
 * />
 * ```
 */
export const MinHeight: Story = {
  render: function MinHeight() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          minHeight={128}
          size="large"
          value={value}
          placeholder="Min height 128"
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
          <CodeBlock.Content code={value.text} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * WithHeader: Context input with custom header section.
 * - Header section automatically inherits size prop
 * - Useful for titles, actions, or additional controls
 * - Header content can include buttons and text
 *
 * ```tsx
 * <ContextInput value={value} onChange={setValue}>
 *   <ContextInput.Header>
 *     <h3>Header Title</h3>
 *     <IconButton>
 *       <ExpandSmall />
 *     </IconButton>
 *   </ContextInput.Header>
 * </ContextInput>
 * ```
 */
export const WithHeader: Story = {
  render: function Basic() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "Hello world, this is a sample message with header.",
      mentions: [],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          size="large"
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        >
          <ContextInput.Header>
            <h3 className="font-strong">Header</h3>
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <ExpandSmall />
            </IconButton>
          </ContextInput.Header>
        </ContextInput>

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
          <CodeBlock.Content code={value.text} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * WithFooter: Context input with custom footer section.
 * - Footer section automatically inherits size prop
 * - Ideal for action buttons, status indicators, or character counts
 * - Supports complex footer layouts
 *
 * ```tsx
 * <ContextInput value={value} onChange={setValue}>
 *   <ContextInput.Footer>
 *     <div className="flex gap-2">
 *       <IconButton><AddSmall /></IconButton>
 *       <IconButton><Image /></IconButton>
 *     </div>
 *     <span>Status text</span>
 *   </ContextInput.Footer>
 * </ContextInput>
 * ```
 */
export const WithFooter: Story = {
  render: function WithHeader() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const inputRef = useRef<HTMLDivElement>(null)

    return (
      <ContextInput
        size="large"
        ref={inputRef}
        value={value}
        placeholder="Type @ to mention someone..."
        className="max-h-96 w-80"
        triggers={[
          {
            char: "@",
            onSearch: async (query) => {
              await new Promise((resolve) => setTimeout(resolve, 10))
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
        ]}
        onChange={setValue}
        onMentionSelect={(mention, trigger) => {
          console.log("Mention selected:", mention, trigger)
        }}
      >
        <ContextInput.Footer>
          <div className="flex items-center gap-2">
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <AddSmall />
            </IconButton>
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <Image />
            </IconButton>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground">Claude Sonnet 4</span>
            <IconButton
              className="bg-accent-background text-on-accent-foreground hover:bg-accent-background rounded-full"
              tooltip={{
                content: "Expand",
              }}
            >
              <ArrowUp />
            </IconButton>
          </div>
        </ContextInput.Footer>
      </ContextInput>
    )
  },
}

/**
 * MaxLength: Context input with character limit enforcement.
 * - Set maxLength prop to limit input characters
 * - Prevents typing/pasting beyond the limit
 * - Character count display shows current/max length
 * - Visual indicator when approaching limit
 *
 * ```tsx
 * <ContextInput
 *   maxLength={100}
 *   value={value}
 *   onChange={setValue}
 * >
 *   <ContextInput.Footer>
 *     <span className={value.text.length === 100 ? "text-red-500" : ""}>
 *       {value.text.length}/100
 *     </span>
 *   </ContextInput.Footer>
 * </ContextInput>
 * ```
 */
export const MaxLength: Story = {
  render: function WithHeader() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const inputRef = useRef<HTMLDivElement>(null)

    return (
      <ContextInput
        size="large"
        maxLength={100}
        ref={inputRef}
        value={value}
        placeholder="Type @ to mention someone..."
        className="max-h-96 w-80"
        triggers={[
          {
            char: "@",
            onSearch: async (query) => {
              await new Promise((resolve) => setTimeout(resolve, 10))
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
        ]}
        onChange={setValue}
        onMentionSelect={(mention, trigger) => {
          console.log("Mention selected:", mention, trigger)
        }}
      >
        <ContextInput.Footer>
          <div className="flex items-center gap-2">
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <AddSmall />
            </IconButton>
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <Image />
            </IconButton>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={tcx(
                value.text.length === 100 ? "text-danger-foreground" : "text-secondary-foreground",
              )}
            >
              {value.text.length}/100
            </span>
          </div>
        </ContextInput.Footer>
      </ContextInput>
    )
  },
}

/**
 * MaxSuggestions: Context input with limited suggestion count.
 * - Set maxSuggestions prop to limit displayed options
 * - Useful for keeping suggestion lists manageable
 * - Search results are truncated to the specified limit
 *
 * ```tsx
 * <ContextInput
 *   maxSuggestions={3}
 *   value={value}
 *   placeholder="Max 3 suggestions"
 *   triggers={triggers}
 *   onChange={setValue}
 * />
 * ```
 */
export const MaxSuggestions: Story = {
  render: function WithHeader() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const inputRef = useRef<HTMLDivElement>(null)

    return (
      <ContextInput
        size="large"
        maxSuggestions={3}
        ref={inputRef}
        value={value}
        placeholder="Max suggestions 3"
        className="max-h-96 w-80"
        triggers={[
          {
            char: "@",
            onSearch: async (query) => {
              await new Promise((resolve) => setTimeout(resolve, 10))
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
        ]}
        onChange={setValue}
        onMentionSelect={(mention, trigger) => {
          console.log("Mention selected:", mention, trigger)
        }}
      />
    )
  },
}

/**
 * WithHeaderAndFooter: Context input with both header and footer sections.
 * - Combines header and footer functionality
 * - Both sections inherit size prop automatically
 * - Includes built-in copy and mention insert buttons
 * - Perfect for complex input scenarios
 *
 * ```tsx
 * <ContextInput value={value} onChange={setValue}>
 *   <ContextInput.Header>
 *     <h3>Title</h3>
 *     <div className="flex gap-2">
 *       <ContextInput.InsertMentionsButton />
 *       <ContextInput.CopyButton />
 *     </div>
 *   </ContextInput.Header>
 *   <ContextInput.Footer>
 *     <div>Footer content</div>
 *   </ContextInput.Footer>
 * </ContextInput>
 * ```
 */
export const WithHeaderAndFooter: Story = {
  render: function WithHeader() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })
    const inputRef = useRef<HTMLDivElement>(null)

    return (
      <ContextInput
        size="large"
        ref={inputRef}
        value={value}
        placeholder="Type @ to mention someone..."
        className="max-h-96 w-80"
        triggers={[
          {
            char: "@",
            onSearch: async (query) => {
              await new Promise((resolve) => setTimeout(resolve, 10))
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
        ]}
        onChange={setValue}
        onMentionSelect={(mention, trigger) => {
          console.log("Mention selected:", mention, trigger)
        }}
      >
        <ContextInput.Header>
          <h3>Header</h3>
          <div className="flex items-center gap-2">
            <ContextInput.InsertMentionsButton
              tooltip={{
                content: "Insert @",
              }}
              onClick={() => console.log("Insert @ clicked")}
            />
            <ContextInput.CopyButton
              tooltip={{
                content: "Copy",
              }}
              onClick={(copiedText) => {
                console.log("Copied text:", copiedText)
              }}
            />
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <ExpandSmall />
            </IconButton>
          </div>
        </ContextInput.Header>
        <ContextInput.Footer>
          <div className="flex items-center gap-2">
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <AddSmall />
            </IconButton>
            <IconButton
              tooltip={{
                content: "Expand",
              }}
            >
              <Image />
            </IconButton>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-secondary-foreground">Claude Sonnet 4</span>
            <IconButton
              className="bg-accent-background text-on-accent-foreground hover:bg-accent-background rounded-full"
              tooltip={{
                content: "Expand",
              }}
            >
              <ArrowUp />
            </IconButton>
          </div>
        </ContextInput.Footer>
      </ContextInput>
    )
  },
}

/**
 * WithPasteButton: Context input with copy button functionality.
 * - Copy button extracts text including mention placeholders
 * - Demonstrates format conversion for external use
 * - Integration with AlertDialog for confirmation
 * - Shows mention data transformation
 *
 * ```tsx
 * <ContextInput value={value} onChange={setValue}>
 *   <ContextInput.Header>
 *     <h3>Input content</h3>
 *     <ContextInput.CopyButton
 *       onClick={(copiedText) => {
 *         console.log("Copied:", copiedText)
 *       }}
 *     />
 *   </ContextInput.Header>
 * </ContextInput>
 * ```
 */
export const WithPasteButton: Story = {
  render: function WithPasteButton() {
    const mockSlateNodes = [
      {
        type: "paragraph",
        children: [
          { text: "Hello " },
          {
            type: "mention",
            mentionId: "1739416889031",
            mentionLabel: "John Doe",
            mentionType: "user",
            mentionData: {},
            children: [{ text: "" }],
          },
          { text: " and welcome!" },
        ],
      },
    ]
    const [value, setValue] = useState<ContextInputValue>({
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      mentions: [
        {
          startIndex: 6,
          endIndex: 13,
          text: "John Doe",
          item: {
            id: "1739416889031",
            type: "user",
            label: "John Doe",
          },
        },
      ],
    })

    const [copiedText, setCopiedText] = useState<string>("")

    return (
      <div className="w-full max-w-md space-y-4">
        <ContextInput
          value={value}
          placeholder="Type @ to mention someone..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        >
          <ContextInput.Header>
            <div className="flex items-center justify-between">
              <h3 className="font-strong">Input content</h3>
              <ContextInput.CopyButton
                onClick={async (copiedText) => {
                  setCopiedText(copiedText)
                }}
              />
            </div>
          </ContextInput.Header>
        </ContextInput>
      </div>
    )
  },
}

/**
 * MultipleTriggers: Context input with multiple mention triggers.
 * - Use @ to mention users and / to mention channels
 * - Different search functions for each trigger type
 * - Demonstrates versatile mention system
 * - Use arrow keys to navigate suggestions
 * - Press Enter or Tab to select
 *
 * ```tsx
 * <ContextInput
 *   value={value}
 *   placeholder="Try @ for users, / for channels..."
 *   triggers={[
 *     {
 *       char: "@",
 *       onSearch: async (query) => searchUsers(query)
 *     },
 *     {
 *       char: "/",
 *       onSearch: async (query) => searchChannels(query)
 *     }
 *   ]}
 *   onChange={setValue}
 * />
 * ```
 */
export const MultipleTriggers: Story = {
  render: function MultipleTriggers() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    return (
      <ContextInput
        className="max-h-96 w-80"
        value={value}
        placeholder="Try @ for users, / for channels..."
        triggers={[
          {
            char: "@",
            onSearch: async (query) => {
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
          {
            char: "/",
            onSearch: async (query) => {
              return channels.filter((channel) =>
                channel.label.toLowerCase().includes(query.toLowerCase()),
              )
            },
          },
        ]}
        onChange={setValue}
        onMentionSelect={(mention, trigger) => {
          console.log("Selected:", mention.label, "via", trigger)
        }}
      />
    )
  },
}

/**
 * CustomMentionPrefix: Demonstrates customizable mention prefix.
 * - Use # instead of @ for mentions display
 * - Configurable via mentionPrefix prop
 * - Supports any string as prefix (e.g., "+", "~", "#", etc.)
 * - Useful for different contexts like hashtags or custom notations
 * - Mentions will appear as `#JohnDoe` instead of `@JohnDoe`
 *
 * ```tsx
 * <ContextInput
 *   mentionPrefix="#"
 *   placeholder="Type @ to mention with # prefix..."
 *   triggers={[
 *     {
 *       char: "@",
 *       onSearch: async (query) => searchUsers(query)
 *     }
 *   ]}
 * />
 * ```
 */
export const CustomMentionPrefix: Story = {
  render: function CustomMentionPrefix() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    return (
      <div className="flex w-80 flex-col gap-4">
        <ContextInput
          value={value}
          mentionPrefix="#"
          placeholder="Type @ to mention someone with # prefix..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
          <CodeBlock.Content code={value.text} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * ClearFunctionTest: Test the clear function of the context input.
 * - Click the clear button to clear the input
 * - The input should be cleared and the value should be an empty object
 * - Demonstrates programmatic clearing of content and mentions
 *
 * ```tsx
 * const handleClear = () => {
 *   setValue({ text: "", mentions: [] })
 * }
 * ```
 */
export const ClearFunctionTest: Story = {
  render: function ClearFunctionTest() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    const handleClear = () => {
      setValue({ text: "", mentions: [] })
    }

    return (
      <div className="w-80 space-y-4">
        <Button
          variant="secondary"
          onClick={handleClear}
        >
          Clear
        </Button>

        <ContextInput
          className="max-h-96 w-80 rounded-lg border border-gray-300"
          value={value}
          placeholder="Input some content and click the clear button to test..."
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
            {
              char: "/",
              onSearch: async (query) => {
                return channels.filter((channel) =>
                  channel.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        />
      </div>
    )
  },
}

/**
 * ControlledValue: Context input with external value control.
 * - Demonstrates controlled value state management
 * - External buttons can modify input content and mentions
 * - Shows programmatic content insertion and clearing
 * - Auto-focuses editor when value changes externally (when autoFocus is enabled)
 * - Cursor always moves to end position after value changes
 * - Useful for form integration and external state management
 * - Real-time character and mention counts
 * - Preset content examples for quick testing
 * - Full bidirectional data binding
 *
 * ```tsx
 * const [value, setValue] = useState<ContextInputValue>({ text: "", mentions: [] })
 *
 * <ContextInput
 *   value={value}
 *   autoFocus
 *   onChange={setValue}
 *   triggers={triggers}
 * />
 *
 * <Button onClick={() => setValue({ text: "Hello world!", mentions: [] })}>
 *   Set Content
 * </Button>
 * ```
 */
export const ControlledValue: Story = {
  render: function ControlledValue() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    const presetValues = [
      {
        label: "Empty",
        value: { text: "", mentions: [] },
      },
      {
        label: "Simple Text",
        value: { text: "Hello, this is a simple message!", mentions: [] },
      },
      {
        label: "With Mention",
        value: {
          text: "Hello @John Doe, how are you today?",
          mentions: [
            {
              startIndex: 6,
              endIndex: 15,
              text: "@John Doe",
              item: {
                id: "1",
                type: "user" as const,
                label: "John Doe",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=john`,
              },
            },
          ],
        },
      },
      {
        label: "Multiple Mentions",
        value: {
          text: "Meeting with @Alice Smith and @Bob Johnson at 3pm in /general channel",
          mentions: [
            {
              startIndex: 13,
              endIndex: 25,
              text: "@Alice Smith",
              item: {
                id: "2",
                type: "user" as const,
                label: "Alice Smith",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=alice`,
              },
            },
            {
              startIndex: 30,
              endIndex: 42,
              text: "@Bob Johnson",
              item: {
                id: "3",
                type: "user" as const,
                label: "Bob Johnson",
                avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=bob`,
              },
            },
            {
              startIndex: 53,
              endIndex: 61,
              text: "/general",
              item: {
                id: "4",
                type: "channel" as const,
                label: "general",
                description: "General discussion channel",
              },
            },
          ],
        },
      },
    ]

    const appendText = (text: string) => {
      setValue((prev) => ({
        ...prev,
        text: prev.text + (prev.text ? " " : "") + text,
      }))
    }

    return (
      <div className="flex w-80 flex-col gap-4">
        <div className="space-y-2">
          <h4 className="font-strong">Value Control Buttons</h4>
          <div className="flex flex-wrap gap-2">
            {presetValues.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="default"
                onClick={() => setValue(preset.value)}
              >
                {preset.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-strong">Dynamic Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Great job!")}
            >
              Add &quot;Great job!&quot;
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("👍")}
            >
              Add 👍
            </Button>

            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue({
                  text: "Hello @john, check this @admin message!",
                  mentions: [
                    {
                      item: {
                        id: "john",
                        type: "user",
                        label: "John Doe",
                        metadata: {},
                      },
                      startIndex: 6,
                      endIndex: 11,
                      text: "@john",
                      context: {
                        fullContext: "Hello @john, check this @admin message!",
                        mentionText: "@john",
                      },
                    },
                    {
                      item: {
                        id: "admin",
                        type: "user",
                        label: "Admin",
                        metadata: {},
                      },
                      startIndex: 24,
                      endIndex: 30,
                      text: "@admin",
                      context: {
                        fullContext: "Hello @john, check this @admin message!",
                        mentionText: "@admin",
                      },
                    },
                  ],
                })
              }
            >
              Test Multiple @
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue({ text: "The quick brown fox jumps over the lazy dog.", mentions: [] })
              }
            >
              Sample Text
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => setValue({ text: "Hello world!", mentions: [] })}
            >
              Simple Text
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => {
                const text = "Simple text with @user at end"
                const mentionText = "@user"
                const startIndex = text.indexOf(mentionText)
                const endIndex = startIndex + mentionText.length

                setValue({
                  text: text,
                  mentions: [
                    {
                      item: {
                        id: "test",
                        type: "user",
                        label: "Test User",
                        metadata: {},
                      },
                      startIndex: startIndex,
                      endIndex: endIndex,
                      text: mentionText,
                      context: {
                        fullContext: text,
                        mentionText: mentionText,
                      },
                    },
                  ],
                })
              }}
            >
              Test End @
            </Button>
          </div>
        </div>

        <ContextInput
          value={value}
          autoFocus
          placeholder="Content is controlled externally..."
          className="max-h-96 w-80"
          triggers={[
            {
              char: "@",
              onSearch: async (query) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
            {
              char: "/",
              onSearch: async (query) => {
                return channels.filter((channel) =>
                  channel.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
          onChange={setValue}
        >
          <ContextInput.Footer>
            <div className="flex items-center gap-2">
              <span className="text-secondary-foreground text-body-small">
                Characters: {value.text.length}
              </span>
              <span className="text-secondary-foreground text-body-small">
                Mentions: {value.mentions.length}
              </span>
            </div>
            <Button
              variant="secondary"
              size="default"
              onClick={() => setValue({ text: "", mentions: [] })}
            >
              Clear All
            </Button>
          </ContextInput.Footer>
        </ContextInput>

        <CodeBlock language="json">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
        </CodeBlock>
      </div>
    )
  },
}

/**
 * CustomMentionComponent: Example showing how to use customMentionComponent for customization.
 * - Create custom Mention component with different styling
 * - Custom component has gradient background and emoji decoration
 * - Passed via `customMentionComponent` prop
 * - Receives same props as default Mention component
 * - Useful for branding or visual differentiation
 *
 * ```tsx
 * const CustomMention = (props) => {
 *   const { attributes, children, element, mentionPrefix } = props
 *   return (
 *     <span {...attributes} contentEditable={false} className="custom-styles">
 *       {children}
 *       {mentionPrefix}{element.mentionLabel}
 *     </span>
 *   )
 * }
 *
 * <ContextInput customMentionComponent={CustomMention} />
 * ```
 */
export const CustomMentionComponent: Story = {
  render: function CustomMentionComponent() {
    const [value, setValue] = useState<ContextInputValue>({
      text: "",
      mentions: [],
    })

    const CustomMention: React.FC<React.ComponentProps<typeof ContextInput.Mention>> = (props) => {
      const { attributes, children, element, mentionPrefix = "@" } = props
      const mentionElement = element as unknown as ContextMentionElement

      return (
        <span
          {...attributes}
          contentEditable={false}
          className={tcx(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
            "bg-gradient-to-r from-purple-500 to-pink-500 text-white",
            "border border-white/20 shadow-sm",
          )}
        >
          {children}
          <span className="text-white/80">{mentionElement.mentionPrefix || mentionPrefix}</span>
          <span className="font-semibold">{mentionElement.mentionLabel}</span>
          <span className="ml-1 text-white/60">✨</span>
        </span>
      )
    }

    return (
      <ContextInput
        value={value}
        onChange={setValue}
        placeholder="Try typing @john to see custom mention styling..."
        className="w-80"
        customMentionComponent={CustomMention}
        triggers={[
          {
            char: "@",
            onSearch: async (query: string) => {
              return users.filter((user) => user.label.toLowerCase().includes(query.toLowerCase()))
            },
          },
        ]}
      />
    )
  },
}

/**
 * ImperativeFocus: Demonstrates how to programmatically focus the input using ref.
 * - Use ref to get access to the focus method
 * - Call ref.current.focus() to focus the input from outside
 * - Useful for keyboard shortcuts or external button triggers
 *
 * ```tsx
 * const inputRef = useRef<ContextInputRef>(null)
 *
 * <ContextInput ref={inputRef} />
 *
 * <Button onClick={() => inputRef.current?.focus()}>
 *   Focus Input
 * </Button>
 * ```
 */
export const ImperativeFocus: Story = {
  render: function ImperativeFocus() {
    const inputRef = useRef<ContextInputRef>(null)

    const handleFocusClick = () => {
      inputRef.current?.focus()
    }

    return (
      <div className="flex w-80 flex-col gap-4">
        <Button
          variant="secondary"
          size="default"
          onClick={handleFocusClick}
        >
          Focus Input
        </Button>

        <ContextInput
          ref={inputRef}
          placeholder="This input can be focused programmatically..."
          triggers={[
            {
              char: "@",
              onSearch: async (query: string) => {
                return users.filter((user) =>
                  user.label.toLowerCase().includes(query.toLowerCase()),
                )
              },
            },
          ]}
        />
      </div>
    )
  },
}
