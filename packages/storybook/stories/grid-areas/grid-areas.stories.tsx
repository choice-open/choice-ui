import { Button, IconButton, Input, Label, List } from "@choice-ui/react"
import { Email, Hidden, LockSmall, RemoveTiny, Use, Visible } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react-vite"

const meta: Meta = {
  title: "Plugins/Grid Areas",
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj

/**
 * `grid-areas` is a Tailwind CSS v4 plugin that provides utilities for CSS Grid named areas.
 *
 * Features:
 * - `grid-areas-[...]`: Define grid template areas (CSS: grid-template-areas)
 * - `grid-area-[...]`: Place elements in named grid areas (CSS: grid-area)
 * - Uses `_` for spaces and `,` for row separators in arbitrary values
 *
 * Usage in tailwind.css:
 * ```css
 * @plugin "@choice-ui/react/grid-areas";
 * ```
 */

/**
 * Basic: A simple 3-column layout with header, sidebar, main content, and footer.
 */
export const Basic: Story = {
  render: () => (
    <div className="grid-areas-[header_header_header,sidebar_main_main,footer_footer_footer] h-[400px] w-96 grid-cols-[128px_1fr_1fr] grid-rows-[auto_1fr_auto] gap-4">
      <header className="grid-area-[header] bg-accent-background flex items-center justify-center rounded-lg p-4 font-semibold text-white">
        Header
      </header>
      <aside className="grid-area-[sidebar] bg-secondary-background flex items-center justify-center rounded-lg p-4">
        Sidebar
      </aside>
      <main className="grid-area-[main] bg-selected-background flex items-center justify-center rounded-lg p-4">
        Main Content
      </main>
      <footer className="grid-area-[footer] bg-secondary-background flex items-center justify-center rounded-lg p-4">
        Footer
      </footer>
    </div>
  ),
}

/**
 * Dashboard: A dashboard layout with navigation, aside panel, and content area.
 */
export const Dashboard: Story = {
  render: () => (
    <div className="grid-areas-[nav_nav_nav,aside_content_content,aside_content_content] h-[500px] grid-cols-[128px_1fr_1fr] grid-rows-[60px_1fr_1fr] gap-2">
      <nav className="grid-area-[nav] bg-accent-background flex items-center gap-4 rounded-lg p-4 text-white">
        <span className="text-lg font-bold">Dashboard</span>
        <span>Home</span>
        <span>Settings</span>
        <span>Profile</span>
      </nav>
      <aside className="grid-area-[aside] rounded-lg border p-4">
        <div className="mb-4 font-semibold">Navigation</div>
        <List className="p-0">
          <List.Content>
            <List.Item>Overview</List.Item>
            <List.Item>Analytics</List.Item>
            <List.Item>Reports</List.Item>
            <List.Item>Settings</List.Item>
          </List.Content>
        </List>
      </aside>
      <main className="grid-area-[content] rounded-lg border p-4">
        <h2 className="mb-4 text-xl font-semibold">Content Area</h2>
        <p className="text-slate-600">
          This is the main content area that spans 2 columns and 2 rows.
        </p>
      </main>
    </div>
  ),
}

/**
 * HolyGrail: The classic "Holy Grail" layout with header, left sidebar, main, right sidebar, and footer.
 */
export const HolyGrail: Story = {
  render: () => (
    <div className="grid-areas-[header_header_header,left_main_right,footer_footer_footer] h-[400px] grid-cols-[150px_1fr_150px] grid-rows-[auto_1fr_auto] gap-3">
      <header className="grid-area-[header] bg-secondary-background rounded-lg p-4 text-center font-semibold">
        Header
      </header>
      <aside className="grid-area-[left] bg-secondary-background rounded-lg p-4 text-center">
        Left
      </aside>
      <main className="grid-area-[main] bg-selected-background rounded-lg p-4 text-center">
        Main Content
      </main>
      <aside className="grid-area-[right] bg-secondary-background rounded-lg p-4 text-center">
        Right
      </aside>
      <footer className="grid-area-[footer] bg-secondary-background rounded-lg p-4 text-center font-semibold">
        Footer
      </footer>
    </div>
  ),
}

/**
 * Card: A card layout with image, title, description, and actions.
 */
export const Card: Story = {
  render: () => (
    <div className="grid-areas-[image_image,title_title,desc_desc,._actions] bg-default-background w-[300px] grid-rows-[200px_auto_1fr_auto] gap-2 overflow-hidden rounded-xl shadow-lg">
      <div className="grid-area-[image] bg-gradient-to-br from-purple-500 to-pink-500" />
      <h3 className="grid-area-[title] px-4 pt-2 text-lg font-bold">Card Title</h3>
      <p className="grid-area-[desc] text-secondary-foreground px-4 text-sm">
        This is a card description that explains what this card is about.
      </p>
      <div className="grid-area-[actions] flex justify-end gap-2 px-4 pb-4">
        <Button variant="secondary">Cancel</Button>
        <Button>Action</Button>
      </div>
    </div>
  ),
}

/**
 * Gallery: A gallery layout with featured image and thumbnails.
 */
export const Gallery: Story = {
  render: () => (
    <div className="grid-areas-[featured_featured_featured,thumb1_thumb2_thumb3] h-[420px] grid-cols-[1fr_1fr_1fr] grid-rows-[300px_100px] gap-2">
      <div className="grid-area-[featured] flex items-center justify-center rounded-lg bg-gradient-to-r from-violet-500 to-purple-500 p-4 text-2xl font-bold text-white">
        Featured Image
      </div>
      <div className="grid-area-[thumb1] bg-secondary-background flex items-center justify-center rounded-lg">
        Thumb 1
      </div>
      <div className="grid-area-[thumb2] bg-secondary-background flex items-center justify-center rounded-lg">
        Thumb 2
      </div>
      <div className="grid-area-[thumb3] bg-secondary-background flex items-center justify-center rounded-lg">
        Thumb 3
      </div>
    </div>
  ),
}

/**
 * Responsive: Shows how to use responsive breakpoints with grid-areas.
 * - On mobile: stacked layout
 * - On desktop: sidebar layout
 */
export const Responsive: Story = {
  render: () => (
    <div className="grid-areas-[header,nav,main,footer] md:grid-areas-[header_header,nav_main,footer_footer] h-[400px] grid-cols-1 grid-rows-[auto_auto_1fr_auto] gap-3 md:grid-cols-[200px_1fr] md:grid-rows-[auto_1fr_auto]">
      <header className="grid-area-[header] bg-accent-background rounded-lg p-4 text-center font-semibold text-white">
        Header
      </header>
      <nav className="grid-area-[nav] bg-secondary-background flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center">
        Navigation
      </nav>
      <main className="grid-area-[main] bg-selected-background flex flex-col items-center justify-center gap-2 rounded-lg p-4 text-center">
        Main Content
        <p className="text-sm">Resize the window to see the layout change</p>
      </main>
      <footer className="grid-area-[footer] bg-secondary-background rounded-lg p-4 text-center font-semibold">
        Footer
      </footer>
    </div>
  ),
}

/**
 * EmptyCells: Shows how to use `.` for empty cells in grid templates.
 */
export const EmptyCells: Story = {
  render: () => (
    <div className="grid-areas-[a_._b,._c_.,d_._e] grid-cols-[100px_100px_100px] grid-rows-[100px_100px_100px] gap-2">
      <div className="grid-area-[a] bg-selected-background text-accent-foreground flex items-center justify-center rounded-lg font-bold">
        A
      </div>
      <div className="grid-area-[b] bg-selected-background text-accent-foreground flex items-center justify-center rounded-lg font-bold">
        B
      </div>
      <div className="grid-area-[c] bg-selected-background text-accent-foreground flex items-center justify-center rounded-lg font-bold">
        C
      </div>
      <div className="grid-area-[d] bg-selected-background text-accent-foreground flex items-center justify-center rounded-lg font-bold">
        D
      </div>
      <div className="grid-area-[e] bg-selected-background text-accent-foreground flex items-center justify-center rounded-lg font-bold">
        E
      </div>
    </div>
  ),
}

/**
 * FormInput: A form input layout with label, icons, and input field.
 * Mimics the pattern: label spanning full width, then icon-input-icons row with gaps.
 *
 * Grid structure:
 * - Row 1: label (spans all columns)
 * - Row 2: icon-1, gap, input, gap, icon-2, gap, icon-3
 */
export const FormInput: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Single icon + input + two icons */}
      <div className="grid-areas-[._._label_label_label_label_label,icon1_._input_._icon2_._icon3] grid-cols-[1.5rem_0.5rem_1fr_0.5rem_1.5rem_0.25rem_1.5rem] grid-rows-[auto_minmax(2rem,auto)] items-center">
        <Label className="grid-area-[label]">Email Address</Label>
        <div className="grid-area-[icon1] text-secondary-foreground flex items-center justify-center">
          <Email />
        </div>
        <Input
          type="email"
          placeholder="you@example.com"
          className="grid-area-[input]"
        />
        <IconButton className="grid-area-[icon2]">
          <Visible />
        </IconButton>
        <IconButton className="grid-area-[icon3]">
          <RemoveTiny />
        </IconButton>
      </div>

      {/* Password field variant */}
      <div className="grid-areas-[._._label_label_label,icon1_._input_._icon2] grid-cols-[1.5rem_0.5rem_1fr_0.5rem_1.5rem] grid-rows-[auto_minmax(2rem,auto)] items-center">
        <Label className="grid-area-[label]">Password</Label>
        <div className="grid-area-[icon1] text-secondary-foreground flex items-center justify-center">
          <LockSmall />
        </div>
        <Input
          type="password"
          placeholder="••••••••"
          className="grid-area-[input]"
        />
        <IconButton className="grid-area-[icon2]">
          <Hidden />
        </IconButton>
      </div>

      {/* Simple input with single icon */}
      <div className="grid-areas-[._._label,icon1_._input] grid-cols-[1.5rem_0.5rem_1fr] grid-rows-[auto_minmax(2rem,auto)] items-center">
        <Label className="grid-area-[label]">Username</Label>
        <div className="grid-area-[icon1] text-secondary-foreground flex items-center justify-center">
          <Use />
        </div>
        <Input
          type="text"
          placeholder="johndoe"
          className="grid-area-[input]"
        />
      </div>
    </div>
  ),
}

/**
 * [TEST] CSSKeywords: Demonstrates CSS keyword utilities including revert-layer.
 * These are useful for resetting or inheriting grid-template-areas values.
 */
export const CSSKeywords: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="mb-4 text-sm text-gray-600">
        The plugin supports all CSS global keywords for grid-areas and grid-area:
        <code className="ml-2 rounded bg-gray-100 px-2 py-1 text-xs">
          none | inherit | initial | revert | revert-layer | unset
        </code>
      </div>

      {/* Parent with grid-areas, child overrides */}
      <div className="space-y-2">
        <h3 className="font-semibold">grid-areas-none</h3>
        <div className="grid-areas-none rounded-lg bg-gray-100 p-4">
          <div className="rounded bg-blue-200 p-2">
            No grid template areas defined (grid-template-areas: none)
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">grid-area-auto</h3>
        <div className="grid-areas-[a_b,c_d] grid-cols-[1fr_1fr] grid-rows-[100px_100px] gap-2">
          <div className="grid-area-[a] flex items-center justify-center rounded bg-emerald-200 p-2">
            A
          </div>
          <div className="grid-area-auto flex items-center justify-center rounded bg-amber-200 p-2">
            Auto (placed automatically)
          </div>
          <div className="grid-area-[c] flex items-center justify-center rounded bg-emerald-200 p-2">
            C
          </div>
          <div className="grid-area-[d] flex items-center justify-center rounded bg-emerald-200 p-2">
            D
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Available keyword utilities</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>grid-areas-*:</strong>
            <ul className="mt-1 list-inside list-disc text-gray-600">
              <li>grid-areas-none</li>
              <li>grid-areas-inherit</li>
              <li>grid-areas-initial</li>
              <li>grid-areas-revert</li>
              <li>grid-areas-revert-layer</li>
              <li>grid-areas-unset</li>
            </ul>
          </div>
          <div>
            <strong>grid-area-*:</strong>
            <ul className="mt-1 list-inside list-disc text-gray-600">
              <li>grid-area-auto</li>
              <li>grid-area-inherit</li>
              <li>grid-area-initial</li>
              <li>grid-area-revert</li>
              <li>grid-area-revert-layer</li>
              <li>grid-area-unset</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
}
