import {
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  Command,
  commandScore,
  Dialog,
  Dropdown,
  IconButton,
  Input,
  Kbd,
  Label,
  useCommandState,
} from "@choice-ui/react"
import {
  ChevronLeftSmall,
  ColorAlpha,
  ColorOpacity,
  ColorTypeGradient,
  ColorTypeSolid,
  File,
  Folder,
  SearchSmall,
  Settings,
  UserSmall,
} from "@choiceform/icons-react"
import { faker } from "@faker-js/faker"
import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useEffect, useRef, useState } from "react"

const meta: Meta<typeof Command> = {
  title: "Collections/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
\`Command\` is a comprehensive command palette component that provides an intuitive way to navigate, search, and execute actions within your application.

**Key Features:**
- **Fast Search**: Fuzzy search with smart ranking and keyboard shortcuts
- **Flexible Structure**: Groups, separators, and custom content
- **Accessibility**: Full keyboard navigation with ARIA support
- **Dialog Mode**: Can be rendered in a modal dialog for overlay usage
- **Customizable**: Styled with Tailwind Variants for easy theming
- **Performance**: Optimized for large datasets with virtual scrolling support

**Usage Patterns:**
- Command palettes for application actions
- Search interfaces with categorized results
- Navigation menus with search functionality
- Quick access panels for tools and options

**Keyboard Navigation:**
- \`ArrowUp/ArrowDown\`: Navigate items
- \`Ctrl+N/Ctrl+P\`: Vim-style navigation (optional)
- \`Enter\`: Select current item
- \`Home/End\`: Jump to first/last item
- \`Alt+ArrowUp/ArrowDown\`: Navigate by groups
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof Command>

/**
 * **Basic Command Menu**
 *
 * A simple command menu with search functionality and basic items.
 * Demonstrates the core structure with input, list, and items.
 *
 * ```tsx
 * <Command>
 *   <Command.Input placeholder="Type a command..." />
 *   <Command.List>
 *     <Command.Item>Action 1</Command.Item>
 *     <Command.Item>Action 2</Command.Item>
 *   </Command.List>
 * </Command>
 * ```
 */
export const Basic: Story = {
  render: function Basic() {
    return (
      <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
        <Command.Input placeholder="Type a command or search..." />
        <Command.List>
          <Command.Item>Calendar</Command.Item>
          <Command.Item>Search Emoji</Command.Item>
          <Command.Item>Calculator</Command.Item>
          <Command.Item>Settings</Command.Item>
          <Command.Item>Profile</Command.Item>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **With Prefix and Suffix**
 *
 * Shows how to use prefix and suffix elements in a command item.
 *
 */
export const WithPrefixAndSuffix: Story = {
  render: function WithPrefixAndSuffix() {
    return (
      <Command
        loop
        className="w-96 overflow-hidden rounded-xl shadow-lg"
      >
        <Command.Input placeholder="Search commands..." />
        <Command.List>
          <Command.Item
            prefixElement={<ColorAlpha />}
            suffixElement={<Badge className="mr-1">New</Badge>}
          >
            <Command.Value>Photoshop</Command.Value>
          </Command.Item>
          <Command.Item prefixElement={<ColorOpacity />}>
            <Command.Value>Illustrator</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={<ColorTypeGradient />}
            suffixElement={<Badge className="mr-1">New</Badge>}
          >
            <Command.Value>Lightroom</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={<ColorTypeSolid />}
            suffixElement={<Badge className="mr-1">New</Badge>}
          >
            <Command.Value>InDesign</Command.Value>
          </Command.Item>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **With Shortcut**
 *
 * Shows how to use a shortcut in a command item.
 *
 * ```tsx
 * <Command.Item shortcut={{ keys: "F", modifier: "command" }}>
 *   <Command.Value>Photoshop</Command.Value>
 * </Command.Item>
 * ```
 *
 */
export const WithShortcut: Story = {
  render: function WithShortcut() {
    return (
      <Command
        loop
        className="w-96 overflow-hidden rounded-xl shadow-lg"
      >
        <Command.Input placeholder="Search commands..." />
        <Command.List>
          <Command.Item
            prefixElement={<ColorAlpha />}
            shortcut={{ keys: "P", modifier: "command" }}
          >
            <Command.Value>Photoshop</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={<ColorOpacity />}
            shortcut={{ keys: "I", modifier: "command" }}
          >
            <Command.Value>Illustrator</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={<ColorTypeGradient />}
            shortcut={{ keys: "L", modifier: "command" }}
          >
            <Command.Value>Lightroom</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={<ColorTypeSolid />}
            shortcut={{ keys: "D", modifier: "command" }}
          >
            <Command.Value>InDesign</Command.Value>
          </Command.Item>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **Grouped Commands**
 *
 * Organizes commands into logical groups with headings and separators.
 * Perfect for categorizing different types of actions or content.
 *
 */
export const WithGroups: Story = {
  render: () => (
    <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
      <Command.Input placeholder="Search commands..." />
      <Command.List>
        <Command.Group heading="Suggestions">
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-red-300 text-red-700">
                <SearchSmall />
              </div>
            }
          >
            <Command.Value>Search</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-blue-300 text-blue-700">
                <File />
              </div>
            }
          >
            <Command.Value>New File</Command.Value>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Settings">
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-green-300 text-green-700">
                <UserSmall />
              </div>
            }
          >
            <Command.Value>Profile</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-yellow-300 text-yellow-700">
                <Settings />
              </div>
            }
          >
            <Command.Value>Settings</Command.Value>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Files">
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-purple-300 text-purple-700">
                <Folder />
              </div>
            }
          >
            <Command.Value>Documents</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-pink-300 text-pink-700">
                <Folder />
              </div>
            }
          >
            <Command.Value>Downloads</Command.Value>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  ),
}

export const Large: Story = {
  render: () => (
    <Command
      loop
      size="large"
      className="w-xl overflow-hidden rounded-xl shadow-lg"
    >
      <Command.Input
        variant="reset"
        className="mx-0 mb-0 rounded-none before:border-none"
        placeholder="Search commands..."
      />
      <Command.Divider alwaysRender />
      <Command.List className="h-64">
        <Command.Empty>
          <div className="py-6 text-center">
            <p>No results found.</p>
            <p className="text-secondary-foreground mt-1">Try adjusting your search terms.</p>
          </div>
        </Command.Empty>
        <Command.Group heading="Suggestions">
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-red-300 text-red-700">
                <SearchSmall />
              </div>
            }
            shortcut={{ keys: "F", modifier: "command" }}
          >
            <Command.Value>Search</Command.Value>
          </Command.Item>
          <Command.Item
            prefixElement={
              <div className="flex size-5 items-center justify-center rounded-md bg-blue-300 text-blue-700">
                <File />
              </div>
            }
            shortcut={{ keys: "N", modifier: "command" }}
          >
            <Command.Value>New File</Command.Value>
          </Command.Item>
        </Command.Group>

        <Command.Group heading="Settings">
          <Command.Item>
            <Command.Value>Profile</Command.Value>
          </Command.Item>
          <Command.Item>
            <Command.Value>Settings</Command.Value>
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  ),
}

/**
 * **With Empty State**
 *
 * Shows an empty state when no results match the search query.
 * Essential for providing user feedback during search operations.
 *
 * ```tsx
 * <Command>
 *   <Command.Input />
 *   <Command.List>
 *     <Command.Empty>No results found.</Command.Empty>
 *     <Command.Item>...</Command.Item>
 *   </Command.List>
 * </Command>
 * ```
 */
export const WithEmptyState: Story = {
  render: () => (
    <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
      <Command.Input placeholder="Try searching for 'xyz'..." />
      <Command.List className="h-48">
        <Command.Empty>
          <SearchSmall className="mx-auto mb-2 h-8 w-8" />
          <p>No results found.</p>
          <p className="mt-1">Try adjusting your search terms.</p>
        </Command.Empty>
        <Command.Group heading="Quick Actions">
          <Command.Item>Create New File</Command.Item>
          <Command.Item>Open Settings</Command.Item>
          <Command.Item>View Profile</Command.Item>
        </Command.Group>
      </Command.List>
    </Command>
  ),
}

/**
 * **Dialog Mode**
 *
 * Command palette in a modal dialog, perfect for global command interfaces.
 * Triggered by keyboard shortcuts and provides full-screen command access.
 *
 * ```tsx
 * const [open, setOpen] = useState(false)
 *
 * <Command.Dialog open={open} onOpenChange={setOpen}>
 *   <Command.Input />
 *   <Command.List>
 *     <Command.Item>...</Command.Item>
 *   </Command.List>
 * </Command.Dialog>
 * ```
 */

const commandOptions = [
  {
    label: "Files",
    items: Array.from({ length: 100 }, (_, i) => ({
      icon: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
      label: faker.music.songName(),
      value: i.toString(),
    })),
  },
  {
    label: "Settings",
    items: Array.from({ length: 100 }, (_, j) => ({
      icon: `https://api.dicebear.com/7.x/avataaars/svg?seed=${j + 4}`,
      label: faker.music.songName(),
      value: (j + 4).toString(),
    })),
  },
]

export const DialogMode: Story = {
  render: function DialogStory() {
    const commandRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState("")
    const [entered, setEntered] = useState("")

    useEffect(() => {
      if (open) {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 200)
      }
    }, [open])

    useEffect(() => {
      const down = (e: KeyboardEvent) => {
        if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          setOpen((open) => !open)
        }
      }

      document.addEventListener("keydown", down)
      return () => document.removeEventListener("keydown", down)
    }, [])

    useEffect(() => {
      if (entered) {
        setOpen(false)
      }
    }, [entered])

    return (
      <div>
        <Button
          onClick={() => setOpen(true)}
          variant="secondary"
        >
          {commandOptions
            .find((group) => group.items.some((item) => item.value === entered))
            ?.items.find((item) => item.value === entered)?.label || "Open Command Palette"}
          <Kbd keys="command">J</Kbd>
        </Button>

        <Dialog
          open={open}
          onOpenChange={setOpen}
          outsidePress={true}
          className="overflow-hidden"
          transitionStylesProps={{
            duration: 200,
          }}
        >
          <Dialog.Content className="w-xl overflow-hidden">
            <Command
              loop
              size="large"
              ref={commandRef}
              value={selected}
              onChange={setSelected}
            >
              <Command.Input
                ref={inputRef}
                variant="reset"
                className="mx-0 mb-0 rounded-none before:border-none"
                placeholder="Search commands..."
              />
              <Command.Divider alwaysRender />
              <Command.List className="h-64">
                <Command.Empty>
                  <p>No results found.</p>
                  <p className="mt-1">Try adjusting your search terms.</p>
                </Command.Empty>
                {commandOptions.map((group, index) => (
                  <Command.Group
                    key={`${group.label}-${index}`}
                    heading={group.label}
                  >
                    {group.items.map((item, index) => (
                      <Command.Item
                        key={`${item.value}-${index}`}
                        value={item.value}
                        onSelect={() => {
                          setSelected(item.value)
                          setEntered(item.value)
                        }}
                        prefixElement={
                          <Avatar
                            photo={item.icon}
                            name={item.label}
                          />
                        }
                      >
                        <Command.Value>{item.label}</Command.Value>
                      </Command.Item>
                    ))}
                  </Command.Group>
                ))}
              </Command.List>
            </Command>
          </Dialog.Content>
        </Dialog>
      </div>
    )
  },
}

export const DarkMode: Story = {
  render: function DarkModeStory() {
    return (
      <Command
        loop
        variant="dark"
        className="w-96 overflow-hidden rounded-xl shadow-lg"
      >
        <Command.Input placeholder="Search commands..." />

        <Command.List>
          <Command.Empty>
            <p>No results found.</p>
            <p className="mt-1">Try adjusting your search terms.</p>
          </Command.Empty>

          <Command.Group heading="Files">
            <Command.Item
              prefixElement={<ColorAlpha />}
              suffixElement={<Badge className="mr-1 bg-transparent">New</Badge>}
            >
              <Command.Value>Photoshop</Command.Value>
            </Command.Item>
            <Command.Item prefixElement={<ColorOpacity />}>
              <Command.Value>Illustrator</Command.Value>
            </Command.Item>
            <Command.Item
              prefixElement={<ColorTypeGradient />}
              suffixElement={<Badge className="mr-1 bg-transparent">New</Badge>}
            >
              <Command.Value>Lightroom</Command.Value>
            </Command.Item>
            <Command.Item
              prefixElement={<ColorTypeSolid />}
              suffixElement={<Badge className="mr-1 bg-transparent">New</Badge>}
            >
              <Command.Value>InDesign</Command.Value>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **Disabled Command**
 *
 * Shows a disabled command with a disabled item.
 * Useful for providing user feedback during search operations.
 *
 * ```tsx
 * <Command>
 *   <Command.Input />
 *   <Command.List>
 *     <Command.Item disabled>...</Command.Item>
 *   </Command.List>
 * </Command>
 * ```
 */
export const DisabledCommand: Story = {
  render: function DisabledCommandStory() {
    return (
      <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
        <Command.Input placeholder="Search commands..." />
        <Command.List className="h-48">
          <Command.Group heading="Quick Actions">
            <Command.Item>Create New File</Command.Item>
            <Command.Item>Open Settings</Command.Item>
            <Command.Item disabled>View Profile (Disabled)</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **Controlled State**
 *
 * Demonstrates controlled command state with external value management.
 * Useful for programmatic control and integration with other components.
 *
 * ```tsx
 * const [value, setValue] = useState("")
 *
 * <Command value={value} onChange={setValue}>
 *   <Command.Input />
 *   <Command.List>
 *     <Command.Item value="item1">Item 1</Command.Item>
 *   </Command.List>
 * </Command>
 * ```
 */
export const ControlledState: Story = {
  render: function ControlledStory() {
    const [value, setValue] = useState("profile")
    const [search, setSearch] = useState("")

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p>
            <strong>Selected:</strong> {value || "None"}
          </p>
          <p>
            <strong>Search:</strong> {search || "None"}
          </p>
        </div>

        <Command
          value={value}
          onChange={setValue}
          className="w-96 overflow-hidden rounded-xl shadow-lg"
        >
          <Command.Input
            placeholder="Search commands..."
            value={search}
            onChange={setSearch}
          />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Account">
              <Command.Item value="profile">
                <UserSmall className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Command.Item>
              <Command.Item value="settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Actions">
              <Command.Item value="search">
                <SearchSmall className="mr-2 h-4 w-4" />
                <span>Search</span>
              </Command.Item>
              <Command.Item value="files">
                <File className="mr-2 h-4 w-4" />
                <span>Files</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **With Custom Filtering**
 *
 * Shows custom filtering logic and disabled filtering for manual control.
 * Useful when you need to implement custom search algorithms or server-side filtering.
 *
 * ```tsx
 * const customFilter = (value, search) => {
 *   return search.length > 0 ? value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0 : 1
 * }
 *
 * <Command filter={customFilter}>
 *   <Command.Input />
 *   <Command.List>...</Command.List>
 * </Command>
 * ```
 */
export const WithCustomFiltering: Story = {
  render: function CustomFilterStory() {
    const [search, setSearch] = useState("")

    // Custom filter that prioritizes exact matches
    const customFilter = (value: string, search: string) => {
      if (!search) return 1
      const normalizedValue = value.toLowerCase()
      const normalizedSearch = search.toLowerCase()

      if (normalizedValue === normalizedSearch) return 1
      if (normalizedValue.startsWith(normalizedSearch)) return 0.9
      if (normalizedValue.includes(normalizedSearch)) return 0.7
      return 0
    }

    const items = [
      { value: "search", label: "Search", icon: SearchSmall },
      { value: "settings", label: "Settings", icon: Settings },
      { value: "user", label: "User Profile", icon: UserSmall },
      { value: "file", label: "File Manager", icon: File },
      { value: "folder", label: "Folder Structure", icon: Folder },
    ]

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p>
            <strong>Custom Filter:</strong> Prioritizes exact matches, then prefix matches
          </p>
          <p>
            <strong>Current Search:</strong> &quot;{search}&quot;
          </p>
        </div>

        <Command
          filter={customFilter}
          className="w-96 overflow-hidden rounded-xl shadow-lg"
        >
          <Command.Input
            placeholder="Try 'user' or 'set'..."
            value={search}
            onChange={setSearch}
          />
          <Command.List>
            <Command.Empty>No matches found.</Command.Empty>
            <Command.Group heading="Actions">
              {items.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.label}
                  prefixElement={<item.icon />}
                  suffixElement={
                    <span className="text-secondary-foreground mr-1">{item.value}</span>
                  }
                >
                  <Command.Value>{item.label}</Command.Value>
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Interactive Keyboard Navigation**
 *
 * A comprehensive demonstration of cmdk's keyboard navigation system with real-time feedback.
 * This interactive story shows all keyboard shortcuts and provides visual feedback for each action.
 *
 * **Keyboard Shortcuts:**
 *
 * Basic Navigation:
 * - ↑↓ - Navigate between items
 * - Enter - Select current item
 * - Home - Jump to first item
 * - End - Jump to last item
 *
 * Vim Bindings (toggleable):
 * - Ctrl+J - Next item
 * - Ctrl+K - Previous item
 * - Ctrl+N - Next item
 * - Ctrl+P - Previous item
 *
 * Advanced Navigation:
 * - Alt+↑↓ - Jump between groups
 * - Cmd+↑↓ (Mac) - Jump to first/last item
 * - Loop navigation - When enabled, circular navigation at boundaries (↑ at top goes to bottom)
 *
 * **Features:**
 * - IME Support: Proper handling of CJK input methods without triggering shortcuts
 * - Visual Feedback: Real-time activity monitor showing triggered shortcuts
 *
 * **Usage Tips:**
 * - Focus the input first to activate keyboard navigation
 * - Use Alt+↑↓ to quickly jump between different sections
 * - Toggle vim bindings for familiar Ctrl+J/K/N/P shortcuts
 * - Enable loop navigation for circular item navigation
 *
 * ```tsx
 * <Command vimBindings={true} loop={true}>
 *   <Command.Input />
 *   <Command.List>
 *     <Command.Group heading="Files">
 *       <Command.Item>New File</Command.Item>
 *     </Command.Group>
 *   </Command.List>
 * </Command>
 * ```
 */
export const KeyboardNavigation: Story = {
  render: function InteractiveKeyboardDemo() {
    const [vimBindings, setVimBindings] = useState(true)
    const [loop, setLoop] = useState(true)
    const [selectedValue, setSelectedValue] = useState("")
    const [lastAction, setLastAction] = useState<{
      action: string
      key: string
      timestamp: string
    } | null>(null)
    const [keyLog, setKeyLog] = useState<
      Array<{
        action: string
        key: string
        timestamp: string
      }>
    >([])

    const logKeyAction = (key: string, action: string) => {
      const timestamp = new Date().toLocaleTimeString()
      setLastAction({ action, key, timestamp })
      setKeyLog((prev) => [...prev.slice(-5), { key, action, timestamp }])
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
      // Log different types of key actions
      switch (e.key) {
        case "ArrowDown":
          if (e.metaKey) logKeyAction("Cmd+↓", "Jump to last item")
          else if (e.altKey) logKeyAction("Alt+↓", "Next group")
          else logKeyAction("↓", "Next item")
          break
        case "ArrowUp":
          if (e.metaKey) logKeyAction("Cmd+↑", "Jump to first item")
          else if (e.altKey) logKeyAction("Alt+↑", "Previous group")
          else logKeyAction("↑", "Previous item")
          break
        case "j":
          if (vimBindings && e.ctrlKey) logKeyAction("Ctrl+J", "Vim: Next item")
          break
        case "k":
          if (vimBindings && e.ctrlKey) logKeyAction("Ctrl+K", "Vim: Previous item")
          break
        case "n":
          if (vimBindings && e.ctrlKey) logKeyAction("Ctrl+N", "Vim: Next item")
          break
        case "p":
          if (vimBindings && e.ctrlKey) logKeyAction("Ctrl+P", "Vim: Previous item")
          break
        case "Home":
          logKeyAction("Home", "Jump to first item")
          break
        case "End":
          logKeyAction("End", "Jump to last item")
          break
        case "Enter":
          logKeyAction("Enter", `Select: ${selectedValue}`)
          break
      }
    }

    return (
      <div className="flex w-96 flex-col gap-6">
        {/* Control Panel */}
        <div className="flex flex-wrap gap-4 rounded-xl border p-4">
          <Checkbox
            value={vimBindings}
            onChange={(v) => setVimBindings(v)}
          >
            Enable Vim Bindings (Ctrl+J/K/N/P)
          </Checkbox>
          <Checkbox
            value={loop}
            onChange={(v) => setLoop(v)}
          >
            Enable Loop Navigation
          </Checkbox>
        </div>

        {/* Interactive Command Component */}

        <Command
          className="w-96 overflow-hidden rounded-xl shadow-lg"
          vimBindings={vimBindings}
          loop={loop}
          value={selectedValue}
          onChange={setSelectedValue}
          onKeyDown={handleKeyDown}
        >
          <Command.Input placeholder="Focus here and try the keyboard shortcuts above..." />
          <Command.List className="h-64">
            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="File Operations">
              <Command.Item value="new-file">
                <File className="mr-2 h-4 w-4" />
                <span>New File</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  N
                </Kbd>
              </Command.Item>
              <Command.Item value="open-file">
                <File className="mr-2 h-4 w-4" />
                <span>Open File</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  O
                </Kbd>
              </Command.Item>
              <Command.Item value="save-file">
                <File className="mr-2 h-4 w-4" />
                <span>Save File</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  S
                </Kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Search & Navigation">
              <Command.Item value="search-files">
                <SearchSmall className="mr-2 h-4 w-4" />
                <span>Search Files</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  F
                </Kbd>
              </Command.Item>
              <Command.Item value="go-to-line">
                <SearchSmall className="mr-2 h-4 w-4" />
                <span>Go to Line</span>
                <Kbd
                  keys="ctrl"
                  className="text-secondary-foreground ml-auto"
                >
                  G
                </Kbd>
              </Command.Item>
              <Command.Item value="find-replace">
                <SearchSmall className="mr-2 h-4 w-4" />
                <span>Find & Replace</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  H
                </Kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="User & Settings">
              <Command.Item value="user-profile">
                <UserSmall className="mr-2 h-4 w-4" />
                <span>User Profile</span>
              </Command.Item>
              <Command.Item value="preferences">
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  ,
                </Kbd>
              </Command.Item>
              <Command.Item value="shortcuts">
                <Settings className="mr-2 h-4 w-4" />
                <span>Keyboard Shortcuts</span>
                <Kbd
                  keys="command"
                  className="text-secondary-foreground ml-auto"
                >
                  K
                </Kbd>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Appearance">
              <Command.Item value="theme-light">
                <Settings className="mr-2 h-4 w-4" />
                <span>Light Theme</span>
              </Command.Item>
              <Command.Item value="theme-dark">
                <Settings className="mr-2 h-4 w-4" />
                <span>Dark Theme</span>
              </Command.Item>
              <Command.Item value="theme-auto">
                <Settings className="mr-2 h-4 w-4" />
                <span>Auto Theme</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <Command.Footer>
            <div className="text-secondary-foreground flex items-center justify-between">
              <span>
                Selected: <strong>{selectedValue || "None"}</strong>
              </span>
              <span>Try all keyboard shortcuts! 🎹</span>
            </div>
          </Command.Footer>
        </Command>
      </div>
    )
  },
}

/**
 * **Large Dataset**
 *
 * Performance test with a large number of items to demonstrate
 * efficient rendering and search capabilities.
 *
 * ```tsx
 * <Command>
 *   <Command.Input />
 *   <Command.List>
 *     {largeItemList.map(item => (
 *       <Command.Item key={item.id} value={item.name}>
 *         {item.name}
 *       </Command.Item>
 *     ))}
 *   </Command.List>
 * </Command>
 * ```
 */
export const LargeDataset: Story = {
  render: () => {
    // Generate a large dataset
    const items = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      name: `Item ${i + 1}`,
      category: i < 33 ? "Files" : i < 66 ? "Actions" : "Settings",
      description: `Description for item ${i + 1}`,
    }))

    const categories = ["Files", "Actions", "Settings"]

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p>
            <strong>Dataset Size:</strong> {items.length} items across {categories.length}{" "}
            categories
          </p>
          <p>
            <strong>Performance:</strong> Try searching to see fast filtering in action
          </p>
        </div>

        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Search 100 items..." />
          <Command.List className="max-h-64">
            <Command.Empty>No results found in {items.length} items.</Command.Empty>
            {categories.map((category) => (
              <Command.Group
                key={category}
                heading={category}
              >
                {items
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <Command.Item
                      key={item.id}
                      value={`${item.name} ${item.description}`}
                    >
                      <div className="flex flex-col items-start">
                        <span>{item.name}</span>
                        <span className="text-secondary-foreground">{item.description}</span>
                      </div>
                    </Command.Item>
                  ))}
              </Command.Group>
            ))}
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Complex Items**
 *
 * Demonstrates rich item content with metadata, badges, and custom layouts.
 * Perfect for file browsers, user selectors, or detailed action lists.
 *
 * ```tsx
 * <Command.Item value="complex-item">
 *   <div className="flex items-center justify-between w-full">
 *     <div className="flex items-center">
 *       <Icon />
 *       <div>
 *         <div>Title</div>
 *         <div className=" text-secondary-foreground">Subtitle</div>
 *       </div>
 *     </div>
 *     <Badge>New</Badge>
 *   </div>
 * </Command.Item>
 * ```
 */
export const ComplexItems: Story = {
  render: function ComplexItems() {
    const commandOptions = [
      {
        label: "Recent Files",
        group: [
          {
            label: "Project",
            value: "project-readme",
            description: "Modified 2 hours ago • 1.2 KB",
            prefixElement: <File />,
            suffixElement: <Badge>MD</Badge>,
          },
          {
            label: "Config",
            value: "config-file",
            description: "Modified yesterday • 0.8 KB",
            prefixElement: <Settings />,
          },
          {
            label: "README",
            value: "readme-file",
            description: "Modified 2 hours ago • 1.2 KB",
            prefixElement: <File />,
            suffixElement: <Badge>MD</Badge>,
          },
        ],
      },
      {
        label: "Team Members",
        group: [
          {
            label: "John Doe",
            value: "john-doe",
            description: "Senior Developer • Online",
            prefixElement: <UserSmall />,
            suffixElement: <Badge>Online</Badge>,
          },
          {
            label: "Jane Smith",
            value: "jane-smith",
            description: "UI/UX Designer • Away",
            prefixElement: <UserSmall />,
            suffixElement: <Badge>Away</Badge>,
          },
        ],
      },
    ]
    return (
      <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
        <Command.Input placeholder="Search files and users..." />
        <Command.List>
          <Command.Empty>No results found.</Command.Empty>
          {commandOptions.map((option) => (
            <Command.Group
              key={option.label}
              heading={option.label}
            >
              {option.group.map((item) => (
                <Command.Item
                  key={item.value}
                  value={item.value}
                >
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-center gap-1">
                      {item.prefixElement}
                      <div className="flex-1">{item.label}</div>
                      {item.suffixElement}
                    </div>
                    <div className="text-secondary-foreground">{item.description}</div>
                  </div>
                </Command.Item>
              ))}
            </Command.Group>
          ))}
        </Command.List>
      </Command>
    )
  },
}

/**
 * **With Footer**
 *
 * Demonstrates the Command.Footer component for displaying additional
 * information, shortcuts, or action hints at the bottom of the command menu.
 *
 * ```tsx
 * <Command>
 *   <Command.Input />
 *   <Command.List>...</Command.List>
 *   <Command.Footer>...</Command.Footer>
 * </Command>
 * ```
 */
export const WithFooter: Story = {
  render: function WithFooter() {
    const [open, setOpen] = useState(false)
    const [selectedCommand, setSelectedCommand] = useState("")
    const [selectedDropdown, setSelectedDropdown] = useState("")
    const commandRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
      if (!open) {
        commandRef.current?.focus()
      }
    }, [open])

    const commandOptions = [
      {
        label: "Actions",
        group: [
          {
            label: "New File",
            value: "new-file",
          },
          {
            label: "Open Folder",
            value: "open-folder",
          },
          {
            label: "Search Files",
            value: "search-files",
          },
        ],
      },
      {
        label: "Settings",
        group: [
          {
            label: "Preferences",
            value: "preferences",
          },
          {
            label: "Keyboard Shortcuts",
            value: "keyboard-shortcuts",
          },
          {
            label: "Theme",
            value: "theme",
          },
        ],
      },
    ]

    const dropdownOptions = [
      {
        label: "Open Application",
        value: "open-application",
      },
      {
        label: "Show in Finder",
        value: "show-in-finder",
      },
      {
        label: "Show Info in Finder",
        value: "show-info-in-finder",
      },
      {
        label: "Add to Favorites",
        value: "add-to-favorites",
      },
    ]

    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1 rounded-xl border p-4">
          <strong className="text-secondary-foreground">Selected:</strong>
          <div className="flex items-center gap-2">
            <span>Command: </span>
            {selectedCommand && (
              <Badge>
                <span>{selectedCommand}</span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span>Dropdown: </span>
            {selectedDropdown && <Badge>{selectedDropdown}</Badge>}
          </div>
        </div>

        <Command
          ref={commandRef}
          loop
          className="w-96 overflow-hidden rounded-xl shadow-lg"
          onChange={setSelectedCommand}
          onKeyDown={(e) => {
            // Handle global Command shortcuts
            if (e.key === "i" && e.metaKey) {
              e.preventDefault()
              setOpen((prev) => !prev)
              return
            }
          }}
        >
          <Command.Input placeholder="Search commands..." />
          <Command.List className="h-64">
            <Command.Empty>No results found.</Command.Empty>
            {commandOptions.map((option) => (
              <Command.Group
                key={option.label}
                heading={option.label}
              >
                {option.group.map((item) => (
                  <Command.Item
                    key={item.value}
                    value={item.value}
                    onSelect={() => setSelectedCommand(item.value)}
                  >
                    {item.label}
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>
          <Command.Footer>
            <span className="text-secondary-foreground px-2">Choiceform</span>
            <Dropdown
              open={open}
              onOpenChange={setOpen}
              placement="top-end"
            >
              <Dropdown.Trigger asChild>
                <Button variant="ghost">
                  Actions{" "}
                  <Kbd
                    keys="command"
                    className="text-secondary-foreground"
                  >
                    I
                  </Kbd>
                </Button>
              </Dropdown.Trigger>
              <Dropdown.Content>
                {dropdownOptions.map((option) => (
                  <Dropdown.Item
                    key={option.value}
                    onClick={() => setSelectedDropdown(option.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSelectedDropdown(option.value)
                        setOpen(false)
                      }
                    }}
                  >
                    <Dropdown.Value>{option.label}</Dropdown.Value>
                  </Dropdown.Item>
                ))}
              </Dropdown.Content>
            </Dropdown>
          </Command.Footer>
        </Command>
      </div>
    )
  },
}

/**
 * **Core Mechanism: Store & State Management**
 *
 * Demonstrates the centralized state management system that powers cmdk.
 * Shows how search, selection, and filtering states are managed centrally.
 *
 * **Key Features:**
 * - Centralized state store with subscribe/emit pattern
 * - Real-time state synchronization across components
 * - Optimized updates with value comparison guards
 * - Async scheduling to prevent infinite loops
 *
 * **How it works:**
 * The store uses a centralized state with subscribe/emit pattern. Each component subscribes to state changes and re-renders only when necessary.
 *
 * **Try it:**
 * - Type in the input to see search query and filtered count change
 * - Use arrow keys to navigate - watch selectedItemId update
 * - Press Enter to select - watch value update
 * - Filter items - watch visible groups change
 *
 * ```tsx
 * // Access specific state values using selectors
 * const search = useCommandState((state) => state.search)
 * const value = useCommandState((state) => state.value)
 * const filteredCount = useCommandState((state) => state.filtered.count)
 * const filteredGroups = useCommandState((state) => state.filtered.groups)
 *
 * // State structure:
 * // { search, value, selectedItemId, filtered: { count, items, groups } }
 * ```
 */
export const CoreMechanismStore: Story = {
  render: function StoreMechanismDemo() {
    const listRef = React.useRef<HTMLDivElement>(null)

    function StateMonitor() {
      const search = useCommandState((state) => state.search)
      const value = useCommandState((state) => state.value)
      const selectedItemId = useCommandState((state) => state.selectedItemId)
      const filteredCount = useCommandState((state) => state.filtered.count)
      const filteredGroups = useCommandState((state) => state.filtered.groups)

      // Use useRef to track update count, avoid triggering re-renders
      const updateCountRef = React.useRef(0)
      const prevStateRef = React.useRef({
        search: "",
        value: "",
        selectedItemId: "",
        filteredCount: 0,
        filteredGroupsStr: "",
      })

      // Convert Set to string for comparison
      const filteredGroupsStr = Array.from(filteredGroups).sort().join(",")

      // Query DOM to get visible group headings for better display
      const [visibleGroupNames, setVisibleGroupNames] = React.useState<string[]>([])

      React.useLayoutEffect(() => {
        if (!listRef.current || filteredGroups.size === 0) {
          setVisibleGroupNames([])
          return
        }
        const names: string[] = []
        // Find all visible groups (elements with role="group")
        const groupElements = listRef.current.querySelectorAll('[role="group"]')
        groupElements.forEach((groupEl) => {
          // Group heading is in the sibling element before the group element
          let sibling = groupEl.previousElementSibling
          while (sibling) {
            // Find element containing heading (usually a div with specific class)
            const headingText = sibling.textContent?.trim()
            if (headingText && headingText.length > 0 && headingText.length < 50) {
              names.push(headingText)
              break
            }
            sibling = sibling.previousElementSibling
          }
        })
        setVisibleGroupNames(names)
      }, [filteredGroups.size, filteredGroupsStr])

      // Check if state has actually changed
      const currentState = {
        search,
        value,
        selectedItemId: selectedItemId || "",
        filteredCount,
        filteredGroupsStr,
      }

      const hasChanged =
        prevStateRef.current.search !== currentState.search ||
        prevStateRef.current.value !== currentState.value ||
        prevStateRef.current.selectedItemId !== currentState.selectedItemId ||
        prevStateRef.current.filteredCount !== currentState.filteredCount ||
        prevStateRef.current.filteredGroupsStr !== currentState.filteredGroupsStr

      if (hasChanged) {
        updateCountRef.current += 1
        prevStateRef.current = currentState
      }

      return (
        <div className="flex flex-col gap-2">
          <h3 className="font-strong mb-3">Internal State Monitor</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <strong>Search Query:</strong> &quot;{search}&quot;
            </div>
            <div>
              <strong>Selected Value:</strong> &quot;{value || "(none)"}&quot;
            </div>
            <div>
              <strong>Selected Item ID:</strong> {selectedItemId || "(none)"}
            </div>
            <div>
              <strong>Filtered Count:</strong> {filteredCount}
            </div>
            <div>
              <strong>Update Count:</strong> {updateCountRef.current}
            </div>
            <div className="col-span-2">
              <strong>Visible Groups:</strong>{" "}
              {visibleGroupNames.length > 0 ? (
                <span>[{visibleGroupNames.join(", ")}]</span>
              ) : filteredGroups.size > 0 ? (
                <span>
                  <span className="text-secondary-foreground">[{filteredGroupsStr}]</span>{" "}
                  <span className="text-secondary-foreground text-xs">
                    (React useId() generated IDs)
                  </span>
                </span>
              ) : (
                <span>[none]</span>
              )}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="flex w-96 flex-col gap-6">
        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Type to see state changes..." />
          <Command.List ref={listRef}>
            <Command.Empty>No results found.</Command.Empty>
            <Command.Group heading="Files">
              <Command.Item value="new-file">
                <File className="mr-2 h-4 w-4" />
                <span>New File</span>
              </Command.Item>
              <Command.Item value="open-file">
                <File className="mr-2 h-4 w-4" />
                <span>Open File</span>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Actions">
              <Command.Item value="search-files">
                <SearchSmall className="mr-2 h-4 w-4" />
                <span>Search Files</span>
              </Command.Item>
              <Command.Item value="settings">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Command.Item>
            </Command.Group>
          </Command.List>

          <Command.Footer className="h-auto px-4 py-2">
            <StateMonitor />
          </Command.Footer>
        </Command>
      </div>
    )
  },
}

/**
 * **Core Mechanism: Value Registration System**
 *
 * Demonstrates how Command.Item and Command.Group automatically extract and register values
 * using the useValue hook internally. Shows value extraction from props, children, and DOM content.
 *
 * **Key Features:**
 * - Automatic value extraction from content or props
 * - Real-time registration without dependency arrays
 * - Keyword aliases for enhanced search matching
 * - DOM attribute synchronization (data-value) for CSS selectors
 *
 * **How it works:**
 * - Command.Item and Command.Group internally call useValue() hook
 * - useValue() runs on every render (no deps array) to keep values synchronized
 * - It extracts value from: 1) value prop, 2) children text content, 3) DOM textContent
 * - Values are registered with the global store for search and filtering
 * - DOM elements get a data-value attribute for CSS selector targeting
 *
 * **Internal implementation:**
 * ```tsx
 * // Inside Command.Item component:
 * const valueDeps = useMemo(() => [value, children, ref], [value, children])
 * const valueRef = useValue(id, ref, valueDeps, keywords)
 * ```
 *
 * **Usage:**
 * ```tsx
 * // You don't need to call useValue directly - it's used internally:
 * <Command.Item value="explicit-value">Content</Command.Item>
 * <Command.Item>Content from children</Command.Item>
 * <Command.Item value="file" keywords={["doc", "document"]}>File</Command.Item>
 * ```
 */
export const CoreMechanismValueRegistration: Story = {
  render: function ValueRegistrationDemo() {
    const [itemCount, setItemCount] = useState(3)
    const [dynamicContent, setDynamicContent] = useState("Dynamic Content")

    return (
      <div className="flex w-96 flex-col gap-6">
        <div className="flex flex-col gap-2 rounded-lg border p-4">
          <div className="flex gap-4">
            <Button onClick={() => setItemCount((prev) => Math.max(1, prev - 1))}>
              Remove Item
            </Button>
            <Button onClick={() => setItemCount((prev) => prev + 1)}>Add Item</Button>
            <span className="flex items-center">Items: {itemCount}</span>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Dynamic Content:</Label>
            <Input
              value={dynamicContent}
              onChange={(value) => setDynamicContent(value)}
            />
          </div>
        </div>

        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Search to see value matching..." />
          <Command.List className="h-40">
            <Command.Empty>No matches found.</Command.Empty>
            <Command.Group heading="Value from Props">
              <div className="text-secondary-foreground mb-2 text-xs">
                Items with explicit value prop - value is extracted from prop
              </div>
              {Array.from({ length: itemCount }, (_, i) => (
                <Command.Item
                  key={i}
                  value={`dynamic-item-${i + 1} item ${i + 1} test`}
                >
                  <File className="mr-2 h-4 w-4" />
                  <span>Dynamic Item {i + 1}</span>
                </Command.Item>
              ))}
            </Command.Group>
            <Command.Group heading="Value from Children">
              <div className="text-secondary-foreground mb-2 text-xs">
                Items without value prop - value is extracted from children text content
              </div>
              <Command.Item>
                <File className="mr-2 h-4 w-4" />
                <span>{dynamicContent}</span>
              </Command.Item>
              <Command.Item>
                <File className="mr-2 h-4 w-4" />
                <span>Static Content Item</span>
              </Command.Item>
            </Command.Group>
            <Command.Group heading="With Keyword Aliases">
              <div className="text-secondary-foreground mb-2 text-xs">
                Items with keywords - search matches both value and keywords
              </div>
              <Command.Item
                value="javascript-file"
                keywords={["js", "script", "code"]}
              >
                <File className="mr-2 h-4 w-4" />
                <span>app.js</span>
                <span className="text-secondary-foreground ml-auto">Try: js, script</span>
              </Command.Item>
              <Command.Item
                value="stylesheet-file"
                keywords={["css", "style", "design"]}
              >
                <File className="mr-2 h-4 w-4" />
                <span>styles.css</span>
                <span className="text-secondary-foreground ml-auto">Try: css, style</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Core Mechanism: Async Scheduling System**
 *
 * Demonstrates the scheduling system that prevents infinite loops and optimizes updates.
 * Command uses `useScheduleLayoutEffect` to batch operations and execute them in the next layout effect cycle.
 *
 * **Why scheduling is needed:**
 * - Prevents infinite loops: When operations trigger state changes that trigger more operations
 * - Batches updates: Multiple operations scheduled with the same ID are deduplicated
 * - Optimizes DOM updates: All operations execute together in one layout effect cycle
 * - Breaks recursive cycles: Defers execution to avoid synchronous recursion
 *
 * **How it works:**
 * - `schedule(id, callback)` stores callbacks in a Map keyed by ID
 * - Operations with the same ID replace previous ones (deduplication)
 * - All scheduled callbacks execute together in the next `useIsomorphicLayoutEffect`
 * - After execution, the Map is cleared
 *
 * **Common scheduling priorities:**
 * - Priority 1: `selectFirstItem()` - High priority, runs first
 * - Priority 2: `sort()` + `store.emit()` - Value registration
 * - Priority 3: `filterItems()` + `sort()` - Item mount/unmount
 * - Priority 4: `filterItems()` - Item removal
 * - Priority 5: `scrollIntoView()` - Scroll operations
 * - Priority 7: `updateSelection()` - Selection updates
 *
 * **What happens when you type:**
 * 1. Search state updates synchronously
 * 2. `schedule(1, selectFirstItem)` - Queued
 * 3. `filterItems()` - Runs immediately
 * 4. `sort()` - Runs immediately
 * 5. All scheduled operations execute in next layout effect
 *
 * **What happens when item mounts:**
 * 1. Item registers with store
 * 2. `schedule(3, filterItems + sort)` - Queued
 * 3. If no value selected, `selectFirstItem()` runs
 * 4. All operations batch together in layout effect
 *
 * **Benefits:**
 * - Prevents infinite loops from recursive updates
 * - Batches multiple operations into one DOM update cycle
 * - Deduplicates operations with same priority ID
 * - Optimizes performance by reducing layout thrashing
 *
 * ```tsx
 * // Operations are scheduled and batched:
 * schedule(1, selectFirstItem)    // High priority
 * schedule(5, scrollIntoView)      // Medium priority
 * schedule(7, updateSelection)    // Low priority
 * // All execute together in next layout effect
 * ```
 */
export const CoreMechanismAsyncScheduling: Story = {
  render: function AsyncSchedulingDemo() {
    return (
      <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
        <Command.Input placeholder="Type to see scheduling in action..." />
        <Command.List className="h-40">
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Test Items">
            <Command.Item value="search-item">
              <SearchSmall className="mr-2 h-4 w-4" />
              <span>Search Item</span>
            </Command.Item>
            <Command.Item value="file-item">
              <File className="mr-2 h-4 w-4" />
              <span>File Item</span>
            </Command.Item>
            <Command.Item value="settings-item">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings Item</span>
            </Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    )
  },
}

/**
 * **Core Mechanism: Fuzzy Search Algorithm**
 *
 * Shows the sophisticated scoring algorithm that powers cmdk's search functionality.
 * Demonstrates how different match types get different scores and priorities.
 *
 * **Key Features:**
 * - Fuzzy matching with smart scoring
 * - Prefix matches score higher than substring matches
 * - Case-sensitive bonus scoring
 * - Keyword alias support
 * - Real-time score visualization
 *
 * ```tsx
 * const score = commandScore(value, search, keywords)
 * // Returns 0-1 score based on match quality
 * ```
 */
export const CoreMechanismFuzzySearch: Story = {
  render: function FuzzySearchDemo() {
    const [search, setSearch] = useState("")
    const [scores, setScores] = useState<
      Array<{
        item: string
        keywords?: string[]
        score: number
        value: string
      }>
    >([])

    const testItems = [
      { value: "New File", keywords: ["create", "add"] },
      { value: "Open File", keywords: ["load", "import"] },
      { value: "Save File", keywords: ["export", "write"] },
      { value: "Search Files", keywords: ["find", "locate"] },
      { value: "User Profile", keywords: ["account", "settings"] },
      { value: "System Settings", keywords: ["config", "preferences"] },
      { value: "JavaScript File", keywords: ["js", "script"] },
      { value: "CSS Stylesheet", keywords: ["css", "style"] },
    ]

    React.useEffect(() => {
      const newScores = testItems
        .map((item) => ({
          item: item.value,
          value: item.value,
          score: search ? commandScore(item.value, search, item.keywords) : 1,
          keywords: item.keywords,
        }))
        .sort((a, b) => b.score - a.score)

      setScores(newScores)
    }, [search])

    return (
      <div className="flex w-96 flex-col gap-6">
        <div className="rounded-xl border p-4">
          <h3 className="font-strong mb-3">Search Score Visualization</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-strong">Search Query:</span>
              <code className="bg-background rounded px-2 py-1">{search || "(empty)"}</code>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {scores.map((item, i) => (
                <div
                  key={item.item}
                  className="flex items-center justify-between py-1"
                >
                  <span className="flex-1">{item.item}</span>
                  <div className="flex items-center gap-2">
                    {item.keywords && (
                      <span className="text-secondary-foreground">
                        [{item.keywords.join(", ")}]
                      </span>
                    )}
                    <div className="flex items-center gap-1">
                      <div className="h-1 w-16 rounded bg-gray-200">
                        <div
                          className="h-full rounded bg-gradient-to-r from-red-400 to-green-400"
                          style={{ width: `${item.score * 100}%` }}
                        />
                      </div>
                      <span className="w-12 font-mono">{item.score.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 rounded-xl border p-4">
          <div>
            <h4 className="font-strong mb-2">🎯 Score Legend</h4>
            <div className="space-y-1">
              <div>1.0 - Exact match</div>
              <div>0.9 - Prefix match</div>
              <div>0.8 - Word boundary</div>
              <div>0.7 - Keyword match</div>
              <div>0.6 - Substring match</div>
              <div>0.5 - Fuzzy match</div>
              <div>0.0 - No match</div>
            </div>
          </div>
          <div>
            <h4 className="font-strong mb-2">💡 Try These Searches</h4>
            <div className="flex flex-wrap gap-1">
              {["file", "js", "user", "set", "css", "new", "search"].map((term) => (
                <Chip
                  key={term}
                  onClick={() => setSearch(term)}
                >
                  {term}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input
            placeholder="Type to see live scoring..."
            value={search}
            onChange={setSearch}
          />
          <Command.List>
            <Command.Empty>No matches found.</Command.Empty>
            <Command.Group heading="Live Search Results">
              {scores
                .filter((item) => item.score > 0)
                .map((item) => (
                  <Command.Item
                    key={item.item}
                    value={item.value}
                  >
                    <File className="mr-2 h-4 w-4" />
                    <span>{item.item}</span>
                    <span className="text-secondary-foreground ml-auto">
                      {item.score.toFixed(2)}
                    </span>
                  </Command.Item>
                ))}
            </Command.Group>
          </Command.List>
        </Command>

        <div className="text-secondary-foreground">
          💡 <strong>How it works:</strong> The scoring algorithm evaluates match quality using
          multiple criteria and assigns higher scores to better matches, enabling intelligent
          ranking.
        </div>
      </div>
    )
  },
}

/**
 * **Example: Nested Items / Pages**
 *
 * Demonstrates navigation between different "pages" of items using state management.
 * Shows how to implement drill-down navigation where selecting one item shows a deeper set of items.
 *
 * **Key Features:**
 * - Page stack management with state
 * - Escape/Backspace to go back to previous page
 * - Conditional rendering based on current page
 * - Dynamic page navigation
 *
 * ```tsx
 * const [pages, setPages] = useState([])
 * const page = pages[pages.length - 1]
 *
 * // Navigate deeper
 * <Command.Item onSelect={() => setPages([...pages, 'projects'])}>
 *   Search projects…
 * </Command.Item>
 * ```
 */
export const NestedItems: Story = {
  render: function NestedItemsExample() {
    const [search, setSearch] = useState("")
    const [pages, setPages] = useState<string[]>([])
    const page = pages[pages.length - 1]

    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Navigation Guide:</div>
          <ul className="space-y-1">
            <li>• Select items to navigate deeper into subcategories</li>
            <li>
              • <Kbd keys="escape" /> or <Kbd keys="backspace" /> (when search is empty) to go back
            </li>
            <li>• Current path: {pages.length === 0 ? "Home" : pages.join(" > ")}</li>
          </ul>
        </div>

        <Command
          className="w-96 overflow-hidden rounded-xl shadow-lg"
          onKeyDown={(e) => {
            // Escape goes to previous page
            // Backspace goes to previous page when search is empty
            if (e.key === "Escape" || (e.key === "Backspace" && !search)) {
              e.preventDefault()
              setPages((pages) => pages.slice(0, -1))
            }
          }}
        >
          <Command.Input
            placeholder={page ? `Search in ${page}...` : "Type a command or search..."}
            value={search}
            onChange={setSearch}
            variant="reset"
            className="mb-0"
            prefixElement={
              page && (
                <IconButton
                  variant="secondary"
                  onClick={() => setPages((pages) => pages.slice(0, -1))}
                >
                  <ChevronLeftSmall />
                </IconButton>
              )
            }
          />
          <Command.Divider />
          <Command.List>
            <Command.Empty>No results found.</Command.Empty>

            {/* Root level */}
            {!page && (
              <>
                <Command.Group heading="Categories">
                  <Command.Item onSelect={() => setPages([...pages, "projects"])}>
                    <Folder className="mr-2 h-4 w-4" />
                    <span>Search projects…</span>
                  </Command.Item>
                  <Command.Item onSelect={() => setPages([...pages, "teams"])}>
                    <UserSmall className="mr-2 h-4 w-4" />
                    <span>Join a team…</span>
                  </Command.Item>
                  <Command.Item onSelect={() => setPages([...pages, "settings"])}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>App settings…</span>
                  </Command.Item>
                </Command.Group>
              </>
            )}

            {/* Projects page */}
            {page === "projects" && (
              <>
                <Command.Group heading="Recent Projects">
                  <Command.Item value="project-a">
                    <File className="mr-2 h-4 w-4" />
                    <span>Design System</span>
                  </Command.Item>
                  <Command.Item value="project-b">
                    <File className="mr-2 h-4 w-4" />
                    <span>Marketing Website</span>
                  </Command.Item>
                  <Command.Item value="project-c">
                    <File className="mr-2 h-4 w-4" />
                    <span>Mobile App</span>
                  </Command.Item>
                </Command.Group>
              </>
            )}

            {/* Teams page */}
            {page === "teams" && (
              <>
                <Command.Group heading="Available Teams">
                  <Command.Item value="team-design">
                    <UserSmall className="mr-2 h-4 w-4" />
                    <span>Design Team</span>
                  </Command.Item>
                  <Command.Item value="team-engineering">
                    <UserSmall className="mr-2 h-4 w-4" />
                    <span>Engineering Team</span>
                  </Command.Item>
                  <Command.Item value="team-product">
                    <UserSmall className="mr-2 h-4 w-4" />
                    <span>Product Team</span>
                  </Command.Item>
                </Command.Group>
              </>
            )}

            {/* Settings page */}
            {page === "settings" && (
              <>
                <Command.Group heading="Preferences">
                  <Command.Item value="theme-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Theme Settings</span>
                  </Command.Item>
                  <Command.Item value="notification-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </Command.Item>
                  <Command.Item value="account-settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account</span>
                  </Command.Item>
                </Command.Group>
              </>
            )}
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Example: Conditional Sub-Items**
 *
 * Shows how to conditionally render sub-items that only appear when searching.
 * Useful for revealing detailed actions only when the user is actively searching.
 *
 * **Key Features:**
 * - Sub-items only visible during search
 * - Custom SubItem component using useCommandState
 * - Progressive disclosure pattern
 * - Search-driven UI expansion
 *
 * ```tsx
 * const SubItem = (props) => {
 *   const search = useCommandState((state) => state.search)
 *   if (!search) return null
 *   return <Command.Item {...props} />
 * }
 * ```
 */
export const ConditionalSubItems: Story = {
  render: function ConditionalSubItemsExample() {
    // Custom SubItem component that only shows when searching
    const SubItem = ({ children, ...props }: { children: React.ReactNode; value?: string }) => {
      const search = useCommandState((state) => state.search)
      if (!search) return null
      return <Command.Item {...props}>{children}</Command.Item>
    }

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Search Behavior:</div>
          <ul className="space-y-1">
            <li>
              • <strong>Normal view:</strong> Shows only main items
            </li>
            <li>
              • <strong>When searching:</strong> Sub-items become visible
            </li>
            <li>
              • Try searching for &quot;theme&quot;, &quot;dark&quot;, or &quot;notification&quot;
              to see sub-items appear
            </li>
          </ul>
        </div>

        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Start typing to reveal sub-items..." />
          <Command.List className="h-64">
            <Command.Empty>No results found.</Command.Empty>

            <Command.Group heading="Appearance">
              <Command.Item
                value="change-theme"
                prefixElement={<Settings />}
              >
                <Command.Value>Change theme…</Command.Value>
              </Command.Item>
              <SubItem value="change-theme-dark">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-gray-800" />
                  <Command.Value>Change theme to dark</Command.Value>
                </div>
              </SubItem>
              <SubItem value="change-theme-light">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full border bg-white" />
                  <Command.Value>Change theme to light</Command.Value>
                </div>
              </SubItem>
              <SubItem value="change-theme-auto">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-gradient-to-r from-gray-800 to-white" />
                  <Command.Value>Change theme to auto</Command.Value>
                </div>
              </SubItem>
            </Command.Group>

            <Command.Group heading="Notifications">
              <Command.Item
                value="notification-settings"
                prefixElement={<Settings />}
              >
                <Command.Value>Notification settings…</Command.Value>
              </Command.Item>
              <SubItem value="enable-notifications">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                  <Command.Value>Enable all notifications</Command.Value>
                </div>
              </SubItem>
              <SubItem value="disable-notifications">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                  <Command.Value>Disable all notifications</Command.Value>
                </div>
              </SubItem>
              <SubItem value="notification-schedule">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                  <Command.Value>Set notification schedule</Command.Value>
                </div>
              </SubItem>
            </Command.Group>

            <Command.Group heading="Privacy">
              <Command.Item
                value="privacy-settings"
                prefixElement={<Settings />}
              >
                <Command.Value>Privacy settings…</Command.Value>
              </Command.Item>
              <SubItem value="clear-data">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-orange-500" />
                  <Command.Value>Clear browsing data</Command.Value>
                </div>
              </SubItem>
              <SubItem value="manage-cookies">
                <div className="ml-6 flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-purple-500" />
                  <Command.Value>Manage cookies</Command.Value>
                </div>
              </SubItem>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Example: Asynchronous Results**
 *
 * Demonstrates loading data asynchronously and displaying results as they become available.
 * Shows proper loading states and handles dynamic content updates.
 *
 * **Key Features:**
 * - Async data fetching simulation
 * - Loading states with Command.Loading
 * - Dynamic item rendering
 * - Automatic filtering and sorting
 *
 * ```tsx
 * const [loading, setLoading] = useState(false)
 * const [items, setItems] = useState([])
 *
 * useEffect(() => {
 *   async function fetchData() {
 *     setLoading(true)
 *     const data = await api.get('/items')
 *     setItems(data)
 *     setLoading(false)
 *   }
 *   fetchData()
 * }, [])
 * ```
 */
export const AsyncResults: Story = {
  render: function AsyncResultsExample() {
    const [loading, setLoading] = useState(false)
    const [items, setItems] = useState<string[]>([])
    const [error, setError] = useState<string | null>(null)

    // Simulate async data fetching
    const fetchItems = async () => {
      setLoading(true)
      setError(null)
      setItems([])

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 2000))

        // Simulate random data
        const mockItems = [
          "Apple",
          "Banana",
          "Cherry",
          "Date",
          "Elderberry",
          "Fig",
          "Grape",
          "Honeydew",
          "Kiwi",
          "Lemon",
          "Mango",
          "Nectarine",
          "Orange",
          "Papaya",
          "Quince",
          "Raspberry",
          "Strawberry",
          "Tangerine",
          "Ugli",
          "Vanilla",
        ]

        // Randomly select 8-12 items
        const selectedItems = mockItems
          .sort(() => Math.random() - 0.5)
          .slice(0, Math.floor(Math.random() * 5) + 8)

        setItems(selectedItems)
      } catch (err) {
        setError("Failed to load items")
      } finally {
        setLoading(false)
      }
    }

    useEffect(() => {
      fetchItems()
    }, [])

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="flex items-center justify-between rounded-xl border p-4">
          <div className="">
            <div className="font-strong">Async Data Loading</div>
            <div className="text-secondary-foreground">
              Status: {loading ? "Loading..." : error ? "Error" : `${items.length} items loaded`}
            </div>
          </div>
          <Button
            onClick={fetchItems}
            disabled={loading}
          >
            {loading ? "Loading..." : "Refresh Data"}
          </Button>
        </div>

        <Command className="w-96 overflow-hidden rounded-xl shadow-lg">
          <Command.Input placeholder="Search items..." />
          <Command.List className="h-64">
            {loading && (
              <Command.Loading>
                <Command.Value>Fetching fresh data...</Command.Value>
              </Command.Loading>
            )}

            {error && (
              <Command.Empty>
                <Command.Value>Error: {error}</Command.Value>
              </Command.Empty>
            )}

            {!loading && !error && items.length === 0 && (
              <Command.Empty>No items available.</Command.Empty>
            )}

            {!loading && !error && (
              <Command.Group heading={`Fresh Items (${items.length})`}>
                {items.map((item) => (
                  <Command.Item
                    key={`fruit-${item}`}
                    value={item}
                  >
                    <Command.Value>{item}</Command.Value>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
        </Command>
      </div>
    )
  },
}

/**
 * **Example: Command with Tabs Filter**
 *
 * Demonstrates how to use Command.Tabs for quick filtering of items by category.
 * The first tab is always "All" to show all items, followed by category-specific filters.
 *
 * **Key Features:**
 * - Tab-based filtering system
 * - "All" tab shows all items
 * - Category-specific filtering
 * - Preserves search functionality within filters
 * - Integrated with Command's existing filtering system
 *
 * ```tsx
 * <Command.Tabs value={activeTab} onChange={setActiveTab}>
 *   <Tabs.Item value="all">All</Tabs.Item>
 *   <Tabs.Item value="files">Files</Tabs.Item>
 *   <Tabs.Item value="actions">Actions</Tabs.Item>
 * </Command.Tabs>
 * ```
 */
export const WithTabs: Story = {
  render: function WithTabsExample() {
    const [activeTab, setActiveTab] = useState("all")
    const [searchValue, setSearchValue] = useState("")

    // Mock data with categories
    const allItems = [
      {
        id: "new-file",
        label: "New File",
        category: "files",
        icon: <File className="h-4 w-4" />,
        keywords: ["create", "document"],
      },
      {
        id: "open-file",
        label: "Open File",
        category: "files",
        icon: <File className="h-4 w-4" />,
        keywords: ["browse", "open"],
      },
      {
        id: "save-file",
        label: "Save File",
        category: "files",
        icon: <File className="h-4 w-4" />,
        keywords: ["save", "store"],
      },
      {
        id: "search-files",
        label: "Search Files",
        category: "actions",
        icon: <SearchSmall className="h-4 w-4" />,
        keywords: ["find", "search"],
      },
      {
        id: "settings",
        label: "Settings",
        category: "actions",
        icon: <Settings className="h-4 w-4" />,
        keywords: ["preferences", "config"],
      },
      {
        id: "user-profile",
        label: "User Profile",
        category: "actions",
        icon: <UserSmall className="h-4 w-4" />,
        keywords: ["account", "user"],
      },
      {
        id: "new-folder",
        label: "New Folder",
        category: "files",
        icon: <Folder className="h-4 w-4" />,
        keywords: ["directory", "create"],
      },
      {
        id: "share-file",
        label: "Share File",
        category: "actions",
        icon: <File className="h-4 w-4" />,
        keywords: ["share", "send"],
      },
      {
        id: "export-data",
        label: "Export Data",
        category: "actions",
        icon: <File className="h-4 w-4" />,
        keywords: ["export", "download"],
      },
    ]

    // Filter items based on active tab
    const filteredItems =
      activeTab === "all" ? allItems : allItems.filter((item) => item.category === activeTab)

    // Group items by category for display
    const groupedItems = filteredItems.reduce(
      (acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
      },
      {} as Record<string, typeof allItems>,
    )

    const categoryLabels = {
      files: "Files",
      actions: "Actions",
    }

    return (
      <div className="flex w-96 flex-col gap-4">
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Tabbed Filtering:</div>
          <ul className="space-y-1">
            <li>• Use tabs to quickly filter items by category</li>
            <li>• &quot;All&quot; tab shows all items across categories</li>
            <li>• Search works within the selected tab filter</li>
            <li>• Use left and right arrow keys to cycle through tabs</li>
            <li>
              • Currently showing:{" "}
              <strong>
                {activeTab === "all"
                  ? "All Items"
                  : categoryLabels[activeTab as keyof typeof categoryLabels] || activeTab}
              </strong>
            </li>
            <li>
              • Items visible: <strong>{filteredItems.length}</strong>
            </li>
          </ul>
        </div>

        <Command
          loop
          className="w-96 overflow-hidden rounded-xl shadow-lg"
          onKeyDown={(e) => {
            // Cycle through tabs with left/right arrow keys
            if (e.key === "ArrowLeft") {
              setActiveTab(
                activeTab === "all" ? "actions" : activeTab === "actions" ? "files" : "all",
              )
            } else if (e.key === "ArrowRight") {
              setActiveTab(
                activeTab === "all" ? "files" : activeTab === "files" ? "actions" : "all",
              )
            }
          }}
        >
          <Command.Input
            placeholder={`Search ${activeTab === "all" ? "all items" : activeTab}...`}
            value={searchValue}
            onChange={setSearchValue}
          />
          <Command.Tabs
            value={activeTab}
            onChange={setActiveTab}
          >
            <Command.TabItem value="all">All ({allItems.length})</Command.TabItem>
            <Command.TabItem value="files">
              Files ({allItems.filter((i) => i.category === "files").length})
            </Command.TabItem>
            <Command.TabItem value="actions">
              Actions ({allItems.filter((i) => i.category === "actions").length})
            </Command.TabItem>
          </Command.Tabs>

          <Command.List className="h-64">
            <Command.Empty>No {activeTab === "all" ? "items" : activeTab} found.</Command.Empty>

            {Object.entries(groupedItems).map(([category, items]) => (
              <Command.Group
                key={category}
                heading={categoryLabels[category as keyof typeof categoryLabels] || category}
              >
                {items.map((item) => (
                  <Command.Item
                    key={item.id}
                    value={item.id}
                    keywords={item.keywords}
                    prefixElement={item.icon}
                  >
                    <Command.Value>{item.label}</Command.Value>
                  </Command.Item>
                ))}
              </Command.Group>
            ))}
          </Command.List>

          <Command.Footer>
            <div className="text-secondary-foreground">
              {activeTab === "all" ? "Showing all categories" : `Filtered by: ${activeTab}`}
            </div>
            <div className="text-secondary-foreground">{filteredItems.length} items</div>
          </Command.Footer>
        </Command>
      </div>
    )
  },
}
