"use client"

import { SiteHeader } from "@/components/site-header"
import {
  AddTiny,
  CircleCheckLargeSolid,
  DeleteTiny,
  EllipsisVerticalSmall,
  File,
  FilePicture,
  FileSound,
  FileVideo,
  RatingHeartSolid,
  RemoveSmall,
} from "@choiceform/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { memo, useId } from "react"
import { useEventCallback } from "usehooks-ts"
import {
  Table,
  Avatar,
  Badge,
  Button,
  Checkbox,
  Chip,
  ChipsInput,
  CodeBlock,
  Combobox,
  Command,
  ContextInput,
  createTimeToday,
  DateInput,
  DateRangeInput,
  Description,
  Dropdown,
  EmojiPicker,
  ErrorMessage,
  Hint,
  IconButton,
  Input,
  Kbd,
  Label,
  LinkButton,
  List,
  MdInput,
  MdRender,
  Menubar,
  Menus,
  Modal,
  MonthCalendar,
  MultiSelect,
  NumericInput,
  OtpInput,
  Pagination,
  Panel,
  ProgressBar,
  ProgressCircle,
  QuarterCalendar,
  RadioGroup,
  Range,
  ScrollArea,
  SearchInput,
  Segmented,
  Select,
  Separator,
  Skeleton,
  Stackflow,
  Switch,
  Tabs,
  Textarea,
  TextField,
  TimeInput,
  TimeRangeInput,
  ToggleButton,
  useForm,
  YearCalendar,
  PicturePreview,
} from "~/components"

const ComponentCard = memo(function ComponentCard({
  children,
  title,
  collection,
}: {
  children: React.ReactNode
  title: string
  collection?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <Link
        href={`/docs/components/${collection}/${title.toLowerCase().replaceAll(" ", "-")}`}
        className="cursor-pointer"
      >
        <div className="hover:border-disabled-background bg-default-background flex aspect-square flex-col rounded-xl border p-4 dark:border-transparent">
          <div className="pointer-events-none relative flex aspect-square flex-1 flex-col items-center justify-center [&_*]:pointer-events-none">
            {children}
          </div>
        </div>
      </Link>
      <p className="text-body-medium px-1">{title}</p>
    </div>
  )
})

const CollectionCard = memo(function CollectionCard({
  children,
  title,
  description,
}: {
  children: React.ReactNode
  title: string
  description?: string
}) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
      <div className="md col-span-full">
        <h2 className="md-h3">{title}</h2>
        {description && <p className="text-secondary-foreground md-p">{description}</p>}
      </div>
      {children}
    </div>
  )
})

export default function Home() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  })

  const uuid = useId()

  const router = useRouter()

  const handleGetStarted = useEventCallback(() => {
    router.push("/docs/guide/installation")
  })

  const handleBrowseComponents = useEventCallback(() => {
    router.push("/docs/components")
  })

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-center justify-center py-24">
        <div className="col-span-2 mx-auto w-full max-w-[80rem] min-w-0 flex-1 items-start space-y-16 px-4">
          {/* Hero Section */}
          <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
            <Badge variant="brand">Built for React + Tailwind CSS v4</Badge>
            <h1 className="text-heading-display mx-auto max-w-3xl">No Frills, Just Performance</h1>

            <p className="text-secondary-foreground text-body-large mx-auto max-w-2xl">
              Zero unnecessary animations. Zero wasted milliseconds. Every interaction responds
              instantly—because professional tools shouldn&apos;t make you wait.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button
                size="large"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>

              <Button
                variant="secondary"
                size="large"
                onClick={handleBrowseComponents}
              >
                Browse Components
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-center whitespace-nowrap md:mt-7 md:gap-1.5">
              <div className="flex items-center gap-1.5 xl:gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="size-5"
                >
                  <path
                    fill="#23B2E7"
                    d="M16.444 6.834a14 14 0 0 0-.644-.205q.055-.226.1-.444c.487-2.393.168-4.321-.92-4.956-1.043-.609-2.75.026-4.473 1.543q-.248.219-.498.462-.165-.16-.331-.31C7.872 1.304 6.06.62 4.974 1.257c-1.042.61-1.35 2.422-.912 4.69q.063.33.148.67-.385.11-.74.236C1.352 7.599 0 8.769 0 9.983c0 1.254 1.452 2.511 3.657 3.274q.262.09.54.171-.09.37-.156.722c-.418 2.229-.092 3.998.948 4.605 1.074.626 2.876-.018 4.63-1.57q.209-.183.418-.388.27.264.54.499c1.7 1.48 3.38 2.077 4.418 1.468 1.072-.628 1.421-2.529.969-4.841a12 12 0 0 0-.12-.541q.19-.057.371-.118C18.508 12.496 20 11.254 20 9.983c0-1.218-1.396-2.397-3.556-3.149m-.497 5.61q-.165.055-.336.106a20 20 0 0 0-1.013-2.563c.399-.87.727-1.72.973-2.525q.308.09.595.19c1.85.644 2.98 1.597 2.98 2.331 0 .782-1.22 1.797-3.2 2.46Zm-.822 1.646c.2 1.023.229 1.948.096 2.67-.119.65-.358 1.083-.654 1.256-.63.37-1.979-.11-3.432-1.376q-.25-.218-.503-.463a20 20 0 0 0 1.676-2.154c.967-.086 1.88-.228 2.709-.422q.06.25.108.49Zm-8.307 3.863c-.615.22-1.106.226-1.402.053-.631-.368-.893-1.789-.536-3.695q.062-.327.146-.671c.82.183 1.726.315 2.696.394a21 21 0 0 0 1.716 2.146q-.19.187-.38.355c-.777.686-1.554 1.173-2.24 1.418m-2.885-5.514c-.975-.337-1.78-.775-2.332-1.254-.496-.43-.747-.856-.747-1.202 0-.737 1.086-1.676 2.897-2.315q.33-.116.688-.22c.25.824.579 1.685.975 2.556a21 21 0 0 0-.987 2.591 11 11 0 0 1-.494-.156m.968-6.659c-.376-1.943-.127-3.409.501-3.776.67-.392 2.15.166 3.709 1.567q.15.135.3.28a21 21 0 0 0-1.704 2.133 21 21 0 0 0-2.669.42q-.078-.318-.137-.624m8.627 2.155a28 28 0 0 0-.609-1.012c.639.082 1.25.19 1.824.323a19 19 0 0 1-.64 1.742 30 30 0 0 0-.575-1.053M10.009 4.47c.395.432.79.914 1.178 1.437a25 25 0 0 0-2.364 0q.584-.78 1.186-1.437M6.47 7.94a26 26 0 0 0-.565 1.046 19 19 0 0 1-.635-1.75c.57-.13 1.179-.235 1.813-.315q-.315.497-.613 1.019m.631 5.165a18 18 0 0 1-1.843-.3c.177-.577.394-1.176.648-1.786A26 26 0 0 0 7.1 13.106Zm2.933 2.452c-.405-.442-.809-.93-1.203-1.457a30 30 0 0 0 2.377-.004c-.39.535-.782 1.025-1.174 1.461m4.078-4.57q.403.927.672 1.78c-.58.134-1.206.242-1.866.322a31 31 0 0 0 1.194-2.101Zm-1.32.641a28 28 0 0 1-.96 1.566q-.892.065-1.831.065-.935 0-1.81-.058a24.4 24.4 0 0 1-1.83-3.198 24 24 0 0 1 1.82-3.193 24 24 0 0 1 3.646 0 28.5 28.5 0 0 1 1.826 3.18 26 26 0 0 1-.861 1.638m1.762-9.651c.67.39.93 1.966.51 4.032q-.04.198-.09.402a20 20 0 0 0-2.674-.427 20 20 0 0 0-1.69-2.134q.23-.225.46-.427c1.476-1.3 2.856-1.813 3.484-1.446M10 8.176c.986 0 1.786.81 1.786 1.807 0 .998-.8 1.806-1.786 1.806a1.796 1.796 0 0 1-1.786-1.806c0-.998.8-1.807 1.786-1.807"
                  ></path>
                </svg>
                <span className="text-ln-paragraph-sm text-ln-gray-600 xl:text-ln-paragraph-md">
                  Built for
                  <span className="text-ln-gray-800 font-medium">React</span>
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
                className="text-ln-gray-300 size-5"
              >
                <path
                  fill="currentColor"
                  d="M10.003 11.108a1.183 1.183 0 0 1-1.176-1.176c0-.644.532-1.176 1.176-1.176s1.176.532 1.176 1.176-.532 1.176-1.176 1.176"
                ></path>
              </svg>
              <div className="flex items-center gap-1.5 xl:gap-2.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="size-5"
                >
                  <path
                    fill="#23B2E7"
                    fill-rule="evenodd"
                    d="M10 5Q6 5 5 8.334q1.5-1.668 3.5-1.25c.76.158 1.305.618 1.906 1.127C11.386 9.041 12.522 10 15 10q4 0 5-3.333-1.5 1.667-3.5 1.25c-.76-.159-1.305-.619-1.906-1.128C13.614 5.96 12.479 5 10 5m-5 5q-4 0-5 3.334 1.5-1.668 3.5-1.25c.76.158 1.305.618 1.906 1.127C6.386 14.041 7.521 15 10 15q4 0 5-3.333-1.5 1.667-3.5 1.25c-.76-.159-1.305-.619-1.906-1.128C8.614 10.96 7.478 10 5 10"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                <span className="text-ln-paragraph-sm text-ln-gray-600 xl:text-ln-paragraph-md">
                  <span className="text-ln-gray-800 font-medium">TailwindCSS</span>
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-heading-large">60+</p>
                <p className="text-secondary-foreground text-sm">Components</p>
              </div>
              <Separator
                orientation="vertical"
                className="h-8"
              />
              <div className="text-center">
                <p className="text-heading-large">100+</p>
                <p className="text-secondary-foreground text-sm">Design Tokens</p>
              </div>
            </div>
          </div>

          {/* Why Choice UI Section */}
          <div className="space-y-8">
            <div className="text-center">
              <Badge className="mb-4">Why Choice UI</Badge>
              <h2 className="text-heading-large">Performance is the feature</h2>
              <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
                We stripped away everything that slows you down. No decorative animations, no
                transition delays—just components that respond the instant you interact.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="text-brand-foreground flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">Instant Response</h3>
                <p className="text-secondary-foreground text-body-medium">
                  No transition delays, no loading spinners for local operations. Click a button,
                  see the result—immediately.
                </p>
              </div>

              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="bg-success-background text-success-foreground flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">Zero Animation Bloat</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Animations are opt-in, never forced. Your dropdowns open instantly, your modals
                  appear immediately.
                </p>
              </div>

              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="bg-warning-background text-warning-foreground flex h-10 w-10 items-center justify-center rounded-lg">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">Independent Packages</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Every component ships as its own npm package. Install only what you need—no
                  bloated bundles.
                </p>
              </div>

              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900 dark:text-cyan-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">Keyboard-First</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Every component works without a mouse. Arrow keys, Tab, Enter, Escape—power users
                  never have to reach for the trackpad.
                </p>
              </div>

              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900 dark:text-violet-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">Minimal Re-renders</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Surgical state updates mean only what changes actually re-renders. Your complex
                  forms stay snappy.
                </p>
              </div>

              <div className="bg-secondary-background space-y-3 rounded-xl p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                </div>
                <h3 className="text-body-large-strong">No Runtime Overhead</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Tailwind CSS v4 compiles away. No CSS-in-JS runtime, no style recalculation on
                  every render. Just static CSS.
                </p>
              </div>
            </div>
          </div>

          {/* What's Inside Section */}
          <div className="bg-secondary-background -mx-4 space-y-8 rounded-2xl px-4 py-12 sm:px-8">
            <div className="text-center">
              <Badge
                variant="success"
                className="mb-4"
              >
                What&apos;s Inside
              </Badge>
              <h2 className="text-heading-large">Built for speed, designed to last</h2>
              <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
                60+ production-ready components. Zero compromises on performance.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              <div className="bg-primary-background flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                <p className="text-accent-foreground text-heading-display">60+</p>
                <p className="text-secondary-foreground text-body-large">Components</p>
              </div>
              <div className="bg-primary-background flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                <p className="text-success-foreground text-heading-display">100%</p>
                <p className="text-secondary-foreground text-body-large">TypeScript</p>
              </div>
              <div className="bg-primary-background flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                <p className="text-warning-foreground text-heading-display">A11y</p>
                <p className="text-secondary-foreground text-body-large">Accessible</p>
              </div>
              <div className="bg-primary-background flex flex-col items-center gap-2 rounded-xl p-4 text-center">
                <p className="text-danger-foreground text-heading-display">SSR</p>
                <p className="text-secondary-foreground text-body-large">Ready</p>
              </div>
              <div className="bg-primary-background col-span-2 flex flex-col items-center gap-2 rounded-xl p-4 text-center sm:col-span-1">
                <p className="text-component-foreground text-heading-display">V4</p>
                <p className="text-secondary-foreground text-body-large">Tailwind CSS</p>
              </div>
            </div>
          </div>

          {/* Code Preview Section */}
          <div className="space-y-8">
            <div className="text-center">
              <Badge
                variant="brand"
                className="mb-4"
              >
                Developer Experience
              </Badge>
              <h2 className="text-heading-large">Clean APIs, no magic</h2>
              <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
                Predictable compound components. What you write is what runs—no hidden transforms,
                no abstraction layers.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Code Example */}
              <div className="space-y-4">
                <h3 className="text-body-large-strong">Composable by design</h3>
                <CodeBlock
                  language="tsx"
                  className="text-sm"
                >
                  <CodeBlock.Content>
                    {`import { Select } from '@choice-ui/react'

function Example() {
  return (
    <Select value={value} onChange={setValue}>
      <Select.Trigger placeholder="Select option" />
      <Select.Content>
        <Select.Label>Fruits</Select.Label>
        <Select.Item value="apple">Apple</Select.Item>
        <Select.Item value="banana">Banana</Select.Item>
        <Select.Item value="orange">Orange</Select.Item>
      </Select.Content>
    </Select>
  )
}`}
                  </CodeBlock.Content>
                </CodeBlock>
              </div>

              {/* Live Preview */}
              <div className="space-y-4">
                <h3 className="text-body-large-strong">Live preview</h3>
                <div className="bg-secondary-background flex min-h-[280px] items-center justify-center rounded-xl p-8">
                  <Select>
                    <Select.Trigger>Select...</Select.Trigger>
                    <Select.Content>
                      <Select.Label>Fruits</Select.Label>
                      <Select.Item value="apple">Apple</Select.Item>
                      <Select.Item value="banana">Banana</Select.Item>
                      <Select.Item value="orange">Orange</Select.Item>
                      <Select.Divider />
                      <Select.Label>Vegetables</Select.Label>
                      <Select.Item value="carrot">Carrot</Select.Item>
                      <Select.Item value="broccoli">Broccoli</Select.Item>
                    </Select.Content>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Components Section */}
          <div className="space-y-2 text-center">
            <Badge
              variant="warning"
              className="mb-4"
            >
              Component Library
            </Badge>
            <h2 className="text-heading-large">All Components</h2>
            <p className="text-secondary-foreground text-body-large mx-auto max-w-xl">
              Production-ready components organized by category. From buttons to complex data
              tables.
            </p>
          </div>

          <div className="flex flex-col gap-y-8">
            <CollectionCard
              title="Buttons"
              description="Interactive elements for triggering actions, toggling states, and making selections."
            >
              <ComponentCard
                title="Button"
                collection="buttons"
              >
                <Button>Button</Button>
              </ComponentCard>
              <ComponentCard
                title="Icon Button"
                collection="buttons"
              >
                <IconButton aria-label="Icon button">
                  <RemoveSmall />
                </IconButton>
              </ComponentCard>
              <ComponentCard
                title="Link Button"
                collection="buttons"
              >
                <LinkButton>Link Button</LinkButton>
              </ComponentCard>

              <ComponentCard
                title="Toggle Button"
                collection="buttons"
              >
                <ToggleButton
                  value={true}
                  onChange={() => {}}
                  aria-label="Toggle button"
                  variant="highlight"
                >
                  <RatingHeartSolid />
                </ToggleButton>
              </ComponentCard>

              <ComponentCard
                title="Segmented"
                collection="buttons"
              >
                <Segmented
                  value={"photo"}
                  onChange={() => {}}
                >
                  <Segmented.Item
                    value="photo"
                    className="px-2"
                  >
                    Photo
                  </Segmented.Item>
                  <Segmented.Item
                    value="video"
                    className="px-2"
                  >
                    Video
                  </Segmented.Item>
                  <Segmented.Item
                    value="audio"
                    className="px-2"
                  >
                    Audio
                  </Segmented.Item>
                </Segmented>
              </ComponentCard>

              <ComponentCard
                title="Chip"
                collection="buttons"
              >
                <Chip>Chip</Chip>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Collections"
              description="Components for displaying and selecting from lists of options, including dropdowns, menus, and searchable lists."
            >
              <ComponentCard
                title="Combobox"
                collection="collections"
              >
                <Combobox>
                  <Combobox.Trigger placeholder="Search fruits..." />
                  <Combobox.Content>
                    <Combobox.Item>
                      <Combobox.Value>Item 1</Combobox.Value>
                    </Combobox.Item>
                  </Combobox.Content>
                </Combobox>
              </ComponentCard>

              <ComponentCard
                title="Command"
                collection="collections"
              >
                <Command className="scale-75 overflow-hidden rounded-xl shadow-lg">
                  <Command.Input placeholder="Type a command or search..." />
                  <Command.List>
                    <Command.Item prefixElement={<File />}>File</Command.Item>
                    <Command.Item prefixElement={<FilePicture />}>Picture</Command.Item>
                    <Command.Item prefixElement={<FileVideo />}>Video</Command.Item>
                    <Command.Item prefixElement={<FileSound />}>Audio</Command.Item>
                  </Command.List>
                </Command>
              </ComponentCard>

              <ComponentCard
                title="Context Menu"
                collection="collections"
              >
                <div className="bg-secondary-background text-secondary-foreground mt-6 mb-auto rounded-lg border border-dashed p-4">
                  Right click me to open context menu
                </div>
                <Menus
                  className="!z-2 scale-75"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                  }}
                >
                  <Menus.Item>
                    <Menus.Value>Item 1</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>Item 2</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>Item 3</Menus.Value>
                  </Menus.Item>
                  <Menus.Divider />
                  <Menus.Item>
                    <Menus.Value>Item 4</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>Item 5</Menus.Value>
                  </Menus.Item>
                </Menus>
              </ComponentCard>

              <ComponentCard
                title="Dropdown"
                collection="collections"
              >
                <Dropdown>
                  <Dropdown.Trigger>Open Dropdown</Dropdown.Trigger>

                  <Dropdown.Content>
                    <Dropdown.Item>Item 1</Dropdown.Item>
                    <Dropdown.Item>Item 2</Dropdown.Item>
                    <Dropdown.Item>Item 3</Dropdown.Item>
                  </Dropdown.Content>
                </Dropdown>
              </ComponentCard>

              <ComponentCard
                title="List"
                collection="collections"
              >
                <List className="w-full">
                  <List.Content>
                    <List.Item>
                      <List.Value>Home</List.Value>
                    </List.Item>
                    <List.SubTrigger
                      id="docs"
                      defaultOpen
                    >
                      <List.Value>Documents</List.Value>
                    </List.SubTrigger>
                    <List.Content parentId="docs">
                      <List.Item>
                        <List.Value>Getting Started</List.Value>
                      </List.Item>
                      <List.Item>
                        <List.Value>Components</List.Value>
                      </List.Item>
                      <List.Item>
                        <List.Value>API Reference</List.Value>
                      </List.Item>
                    </List.Content>
                    <List.Item>
                      <List.Value>Settings</List.Value>
                    </List.Item>
                  </List.Content>
                </List>
              </ComponentCard>

              <ComponentCard
                title="Menuar"
                collection="collections"
              >
                <Menubar className="rounded-lg border p-1">
                  <Menubar.Item>
                    <Menubar.Trigger>File</Menubar.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Item>
                        <Dropdown.Value>New</Dropdown.Value>
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Menubar.Item>

                  <Menubar.Item>
                    <Menubar.Trigger>Edit</Menubar.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Item>
                        <Dropdown.Value>Cut</Dropdown.Value>
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Menubar.Item>

                  <Menubar.Item>
                    <Menubar.Trigger>View</Menubar.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Item>
                        <Dropdown.Value>Zoom In</Dropdown.Value>
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Menubar.Item>

                  <Menubar.Divider />

                  <Menubar.Item>
                    <Menubar.Trigger className="w-6 justify-center px-0">
                      <EllipsisVerticalSmall />
                    </Menubar.Trigger>
                    <Dropdown.Content>
                      <Dropdown.Item>
                        <Dropdown.Value>Print</Dropdown.Value>
                      </Dropdown.Item>
                    </Dropdown.Content>
                  </Menubar.Item>
                </Menubar>
              </ComponentCard>

              <ComponentCard
                title="Multi Select"
                collection="collections"
              >
                <MultiSelect
                  values={["option-1", "option-2"]}
                  onChange={() => {}}
                >
                  <MultiSelect.Trigger
                    placeholder="Select options..."
                    getDisplayValue={(value) => value}
                  />
                  <MultiSelect.Content>
                    <MultiSelect.Label>Available Options</MultiSelect.Label>
                    <MultiSelect.Item value="option-1">Option 1</MultiSelect.Item>
                    <MultiSelect.Item value="option-2">Option 2</MultiSelect.Item>
                    <MultiSelect.Item value="option-3">Option 3</MultiSelect.Item>
                  </MultiSelect.Content>
                </MultiSelect>
              </ComponentCard>

              <ComponentCard
                title="Select"
                collection="collections"
              >
                <Select>
                  <Select.Trigger>Select</Select.Trigger>
                  <Select.Content>
                    <Select.Item value="option-1">Option 1</Select.Item>
                    <Select.Item value="option-2">Option 2</Select.Item>
                    <Select.Item value="option-3">Option 3</Select.Item>
                  </Select.Content>
                </Select>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Forms"
              description="Input components for collecting and validating user data, from text fields to complex form controls."
            >
              <ComponentCard
                title="Checkbox"
                collection="forms"
              >
                <div className="flex flex-col gap-2">
                  <Checkbox
                    value={false}
                    onChange={() => {}}
                  >
                    <Checkbox.Label>False</Checkbox.Label>
                  </Checkbox>
                  <Checkbox
                    value={true}
                    variant="accent"
                    onChange={() => {}}
                  >
                    <Checkbox.Label>True</Checkbox.Label>
                  </Checkbox>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Radio"
                collection="forms"
              >
                <RadioGroup
                  value="option-1"
                  onChange={() => {}}
                  variant="accent"
                >
                  <RadioGroup.Item value="option-1">Option 1</RadioGroup.Item>
                  <RadioGroup.Item value="option-2">Option 2</RadioGroup.Item>
                  <RadioGroup.Item value="option-3">Option 3</RadioGroup.Item>
                </RadioGroup>
              </ComponentCard>

              <ComponentCard
                title="Input"
                collection="forms"
              >
                <Input
                  className="w-full"
                  placeholder="Enter your email"
                />
              </ComponentCard>

              <ComponentCard
                title="Textarea"
                collection="forms"
              >
                <Textarea
                  className="w-full"
                  placeholder="Enter your message"
                />
              </ComponentCard>

              <ComponentCard
                title="Chips Input"
                collection="forms"
              >
                <ChipsInput
                  placeholder="Enter your message"
                  className="w-full"
                  value={["option-1", "option-2"]}
                  onChange={() => {}}
                />
              </ComponentCard>

              <ComponentCard
                title="Numeric Input"
                collection="forms"
              >
                <NumericInput
                  className="w-full"
                  value={10}
                  onChange={() => {}}
                  classNames={{
                    input: "px-2",
                  }}
                >
                  <NumericInput.Prefix
                    type="action"
                    className="mr-px"
                  >
                    <IconButton className="rounded-r-none">
                      <DeleteTiny />
                    </IconButton>
                  </NumericInput.Prefix>
                  <NumericInput.Suffix
                    type="action"
                    className="ml-px"
                  >
                    <IconButton className="rounded-l-none">
                      <AddTiny />
                    </IconButton>
                  </NumericInput.Suffix>
                </NumericInput>
              </ComponentCard>

              <ComponentCard
                title="Search Input"
                collection="forms"
              >
                <SearchInput
                  className="w-full"
                  placeholder="Enter your search"
                  value="Search"
                  onChange={() => {}}
                />
              </ComponentCard>

              <ComponentCard
                title="Range"
                collection="forms"
              >
                <Range
                  className="w-full"
                  value={50}
                  min={0}
                  max={100}
                  step={1}
                  onChange={() => {}}
                  trackSize={{
                    width: "auto",
                  }}
                />
              </ComponentCard>

              <ComponentCard
                title="Switch"
                collection="forms"
              >
                <div className="flex gap-2">
                  <Switch
                    variant="accent"
                    value={false}
                    onChange={() => {}}
                  />
                  <Switch
                    variant="accent"
                    value={true}
                    onChange={() => {}}
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Otp Input"
                collection="forms"
              >
                <OtpInput
                  maxLength={4}
                  value="1"
                >
                  <OtpInput.Group>
                    <OtpInput.Slot index={0} />
                    <OtpInput.Slot index={1} />
                  </OtpInput.Group>
                  <OtpInput.Separator />
                  <OtpInput.Group>
                    <OtpInput.Slot index={2} />
                    <OtpInput.Slot index={4} />
                  </OtpInput.Group>
                </OtpInput>
              </ComponentCard>

              <ComponentCard
                title="Label"
                collection="forms"
              >
                <div className="flex w-full flex-col gap-2">
                  <Label
                    htmlFor="label"
                    required
                  >
                    Email
                  </Label>
                  <Input
                    id="label"
                    placeholder="Enter your email"
                  />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Description"
                collection="forms"
              >
                <div className="flex w-full flex-col gap-2">
                  <Input
                    id="description"
                    placeholder="Enter your email"
                  />
                  <Description id="description">
                    We&apos;ll never share your email with anyone else.
                  </Description>
                </div>
              </ComponentCard>

              <ComponentCard
                title="ErrorMessage"
                collection="forms"
              >
                <div className="flex w-full flex-col gap-2">
                  <Input
                    id="error-message"
                    placeholder="Enter your email"
                  />
                  <ErrorMessage id="error-message">
                    Please enter a valid email address.
                  </ErrorMessage>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Text Field"
                collection="forms"
              >
                <TextField
                  value="John Doe"
                  onChange={() => {}}
                  className="w-full"
                >
                  <TextField.Label required>Your Name</TextField.Label>
                  <TextField.Description>
                    We&apos;ll never share with anyone else.
                  </TextField.Description>
                </TextField>
              </ComponentCard>

              <ComponentCard
                title="Context Input"
                collection="forms"
              >
                <ContextInput
                  value={{
                    text: "Hello, @John Doe!",
                    mentions: [
                      {
                        startIndex: 7,
                        endIndex: 16,
                        text: "@John Doe",
                        item: {
                          id: "1",
                          type: "user",
                          label: "John Doe",
                        },
                      },
                    ],
                  }}
                  onChange={() => {}}
                  placeholder="Type @ to mention someone..."
                  className="w-full"
                />
              </ComponentCard>
              <ComponentCard
                title="Md Input"
                collection="forms"
              >
                <MdInput
                  className="w-full"
                  value="### Hello, world!\n\n**Bold text** and *italic text*\n\n- List item 1\n- List item 2"
                  onChange={() => {}}
                >
                  <MdInput.Header>
                    <MdInput.Tabs />
                  </MdInput.Header>
                  <MdInput.Container>
                    <MdInput.Editor placeholder="Enter markdown..." />
                    <MdInput.Render />
                  </MdInput.Container>
                </MdInput>
              </ComponentCard>

              <ComponentCard
                title="Form"
                collection="forms"
              >
                <form
                  className="w-full space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                  }}
                >
                  <form.Field
                    name={`username-${uuid}`}
                    validators={{
                      onChange: ({ value }) => {
                        if (!value || (value as string).length < 3) {
                          return "Username must be at least 3 characters"
                        }
                      },
                    }}
                  >
                    {(field) => (
                      <form.Input
                        name={field.name}
                        label="Username"
                        value={field.state.value as string}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Enter username"
                        error={field.state.meta.errors.join(", ")}
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name={`email-${uuid}`}
                    validators={{
                      onBlur: ({ value }) => {
                        if (!value || (value as string).length < 3) {
                          return "Email must be at least 3 characters"
                        }
                      },
                    }}
                  >
                    {(field) => (
                      <form.Input
                        name={field.name}
                        label="onBlur validation"
                        value={field.state.value as string}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Enter email"
                        error={field.state.meta.errors.join(", ")}
                      />
                    )}
                  </form.Field>

                  <form.Button type="submit">Submit</form.Button>
                </form>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Date & Time"
              description="Specialized inputs and calendars for selecting dates, times, and date ranges."
            >
              <ComponentCard
                title="Date Input"
                collection="date-and-time"
              >
                <DateInput
                  value={new Date("2026-01-01")}
                  onChange={() => {}}
                />
              </ComponentCard>
              <ComponentCard
                title="Date Range Input"
                collection="date-and-time"
              >
                <Panel.Row
                  type="two-input-two-icon"
                  className="w-[120%] scale-90 px-0"
                >
                  <DateRangeInput
                    startValue={new Date("2026-01-01")}
                    endValue={new Date("2026-01-02")}
                  />
                </Panel.Row>
              </ComponentCard>

              <ComponentCard
                title="Month Calendar"
                collection="date-and-time"
              >
                <MonthCalendar
                  className="absolute top-0 w-full bg-transparent"
                  value={new Date("2026-01-01")}
                  onChange={() => {}}
                  showOutsideDays={false}
                />
              </ComponentCard>

              <ComponentCard
                title="Time Input"
                collection="date-and-time"
              >
                <TimeInput
                  value={createTimeToday(12, 0)}
                  onChange={() => {}}
                />
              </ComponentCard>

              <ComponentCard
                title="Time Range Input"
                collection="date-and-time"
              >
                <Panel.Row
                  type="two-input-two-icon"
                  className="w-[120%] scale-90 px-0"
                >
                  <TimeRangeInput
                    startValue={createTimeToday(12, 0)}
                    endValue={createTimeToday(14, 0)}
                    onStartChange={() => {}}
                    onEndChange={() => {}}
                  />
                </Panel.Row>
              </ComponentCard>

              <ComponentCard
                title="Time Calendar"
                collection="date-and-time"
              >
                <Menus className="!z-2 scale-75">
                  <Menus.Item>
                    <Menus.Value>12:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>13:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>14:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>15:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>16:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>17:00</Menus.Value>
                  </Menus.Item>
                  <Menus.Item>
                    <Menus.Value>18:00</Menus.Value>
                  </Menus.Item>
                </Menus>
              </ComponentCard>

              <ComponentCard
                title="Quarter Calendar"
                collection="date-and-time"
              >
                <QuarterCalendar
                  className="w-full bg-transparent"
                  value={{
                    quarter: 1,
                    year: 2026,
                    label: "Q1 2026",
                    months: ["January", "February", "March"],
                  }}
                  onChange={() => {}}
                />
              </ComponentCard>

              <ComponentCard
                title="Year Calendar"
                collection="date-and-time"
              >
                <YearCalendar
                  className="w-full bg-transparent"
                  value={new Date(2026, 0, 1)}
                  onChange={() => {}}
                />
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Navigation"
              description="Components for moving between views, pages, and content sections within an application."
            >
              <ComponentCard
                title="Tabs"
                collection="navigation"
              >
                <Tabs
                  value="home"
                  onChange={() => {}}
                >
                  <Tabs.Item value="home">Home</Tabs.Item>
                  <Tabs.Item value="settings">Settings</Tabs.Item>
                  <Tabs.Item value="analytics">Analytics</Tabs.Item>
                </Tabs>
              </ComponentCard>

              <ComponentCard
                title="Pagination"
                collection="navigation"
              >
                <Pagination
                  currentPage={1}
                  totalItems={100}
                  itemsPerPage={10}
                  onPageChange={() => {}}
                  onItemsPerPageChange={() => {}}
                >
                  <Pagination.Navigation />
                </Pagination>
              </ComponentCard>

              <ComponentCard
                title="Stackflow"
                collection="navigation"
              >
                <Stackflow
                  className="w-full rounded-xl border"
                  defaultId="page1"
                >
                  {/* Fixed header - does not scroll with page content */}
                  <Stackflow.Prefix>
                    <div className="flex items-center justify-between border-b p-3">
                      <Button variant="secondary">←</Button>
                      <span className="font-strong">Page 1</span>
                      <Button variant="primary">→</Button>
                    </div>
                  </Stackflow.Prefix>

                  {/* Page 1 */}
                  <Stackflow.Item id="page1">
                    <div className="p-4">
                      <h3 className="font-strong mb-2">Page 1</h3>
                      <p className="text-secondary-foreground">
                        Click &quot;Next&quot; to navigate to Page 2.
                      </p>
                    </div>
                  </Stackflow.Item>

                  {/* Page 2 */}
                  <Stackflow.Item id="page2">
                    <div className="p-4">
                      <h3 className="font-strong mb-2">Page 2</h3>
                      <p className="text-secondary-foreground">
                        Click &quot;Back&quot; to return, or &quot;Next&quot; to continue.
                      </p>
                    </div>
                  </Stackflow.Item>

                  {/* Page 3 */}
                  <Stackflow.Item id="page3">
                    <div className="p-4">
                      <h3 className="font-strong mb-2">Page 3</h3>
                      <p className="text-secondary-foreground">
                        This is the last page. Click &quot;Back&quot; to return.
                      </p>
                    </div>
                  </Stackflow.Item>
                </Stackflow>
              </ComponentCard>

              <h2 className="md-h3 col-span-full mb-0">Feedback</h2>
              <ComponentCard
                title="Avatar"
                collection="feedback"
              >
                <div className="flex gap-2">
                  <Avatar
                    photo="https://github.com/shadcn.png"
                    name="John Doe"
                  />
                  <Avatar name="John Doe" />
                </div>
              </ComponentCard>

              <ComponentCard
                title="Badge"
                collection="feedback"
              >
                <div className="flex gap-2">
                  <Badge>Badge</Badge>
                  <Badge variant="brand">Badge</Badge>
                  <Badge variant="success">Badge</Badge>
                  <Badge variant="warning">Badge</Badge>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Hint"
                collection="feedback"
              >
                <Hint>
                  <Hint.Content>Hint</Hint.Content>
                </Hint>
              </ComponentCard>

              <ComponentCard
                title="Progress Bar"
                collection="feedback"
              >
                <ProgressBar
                  value={50}
                  showValue
                >
                  <ProgressBar.Label>Progress</ProgressBar.Label>
                  <ProgressBar.Track>
                    <ProgressBar.Connects />
                  </ProgressBar.Track>
                </ProgressBar>
              </ComponentCard>

              <ComponentCard
                title="Progress Circle"
                collection="feedback"
              >
                <ProgressCircle value={50}>
                  <ProgressCircle.Value />
                </ProgressCircle>
              </ComponentCard>

              <ComponentCard
                title="Skeleton"
                collection="feedback"
              >
                <div className="flex w-full flex-col items-start gap-2">
                  <Skeleton loading>
                    <p>Quisquam, quos.</p>
                  </Skeleton>

                  <Skeleton loading>
                    <Input
                      placeholder="Enter text..."
                      className="w-full"
                    />
                  </Skeleton>
                  <Skeleton loading>
                    <Button variant="primary">Click me</Button>
                  </Skeleton>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Toast"
                collection="feedback"
              >
                <div className="bg-menu-background grid grid-cols-[1fr_auto] rounded-lg text-white">
                  <div className="grid min-h-14 grid-cols-[1.5rem_1fr] gap-x-2 px-2 py-3">
                    <div className="row-span-2 flex h-6 w-6 shrink-0 items-center justify-center self-center">
                      <CircleCheckLargeSolid className="text-success-foreground" />
                    </div>
                    <p className="text-body-medium-strong">Success</p>
                    <p className="text-body-medium opacity-70">The operation was successful.</p>
                  </div>
                  <div className="border-menu-boundary flex items-center justify-center self-stretch border-l px-2">
                    Close
                  </div>
                </div>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Overlays"
              description="Floating UI elements like modals, dialogs, popovers, and tooltips that appear above the main content."
            >
              <ComponentCard
                title="Alert Dialog"
                collection="overlays"
              >
                <Modal className="absolute w-[180%] max-w-none scale-55">
                  <Modal.Header
                    title="Delete User"
                    onClose={() => {}}
                    className="border-none"
                  />
                  <Modal.Content className="flex flex-col gap-4 p-4">
                    This action cannot be undone. Are you sure you want to delete this item?
                  </Modal.Content>
                  <Modal.Footer className="justify-end border-none">
                    <Button variant="secondary">Cancel</Button>
                    <Button variant="destructive">Delete</Button>
                  </Modal.Footer>
                </Modal>
              </ComponentCard>

              <ComponentCard
                title="Dialog"
                collection="overlays"
              >
                <Modal className="absolute w-[180%] max-w-none scale-55">
                  <Modal.Header
                    title="Create a new user"
                    onClose={() => {}}
                  />
                  <Modal.Content className="flex flex-col gap-4 p-4">
                    <Modal.Input
                      label="Username"
                      placeholder="Enter username"
                    />
                    <Modal.Textarea
                      label="Description"
                      placeholder="Enter description"
                    />
                  </Modal.Content>
                  <Modal.Footer className="justify-end">
                    <Button variant="secondary">Cancel</Button>
                    <Button>Save</Button>
                  </Modal.Footer>
                </Modal>
              </ComponentCard>

              <ComponentCard
                title="Popover"
                collection="overlays"
              >
                <div className="relative mt-12 mb-auto scale-75">
                  <Button>Click me</Button>
                  <Modal className="absolute top-8 left-1/2 -translate-x-1/2">
                    <Modal.Header
                      title="Popover Title"
                      onClose={() => {}}
                    />
                    <Modal.Content className="flex w-64 flex-col gap-4 p-4">
                      This is a popover content. It will be displayed when the button is clicked.
                    </Modal.Content>
                  </Modal>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Tooltip"
                collection="overlays"
              >
                <div className="relative">
                  <Button>Hover me</Button>
                  <div className="bg-menu-background absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-white shadow-md">
                    <div className="bg-menu-background absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
                    Tooltip
                  </div>
                </div>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Layouts"
              description="Structural components for organizing and arranging content, including scroll areas, splitters, and grids."
            >
              <ComponentCard
                title="Scroll Area"
                collection="layouts"
              >
                <ScrollArea
                  className="bg-secondary-background absolute h-full w-full overflow-hidden rounded-lg"
                  type="always"
                >
                  <ScrollArea.Viewport>
                    <ScrollArea.Content>
                      <div className="flex flex-col gap-4 p-4">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar
                          risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit
                          risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies
                          sapien.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar
                          risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit
                          risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies
                          sapien.
                        </p>
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar
                          risus non risus hendrerit venenatis. Pellentesque sit amet hendrerit
                          risus, sed porttitor quam. Morbi accumsan cursus enim, sed ultricies
                          sapien.
                        </p>
                      </div>
                    </ScrollArea.Content>
                  </ScrollArea.Viewport>
                </ScrollArea>
              </ComponentCard>

              <ComponentCard
                title="Separator"
                collection="layouts"
              >
                <Separator className="w-full">OR</Separator>
              </ComponentCard>

              <ComponentCard
                title="Splitter"
                collection="layouts"
              >
                <div className="bg-secondary-background grid size-full grid-cols-2 grid-rows-2 rounded-lg">
                  <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-1 flex items-center justify-center border-b-2 p-4">
                    1
                  </div>
                  <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-2 flex items-center justify-center border-l-2 p-4">
                    2
                  </div>
                  <div className="bg-primary-background text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-4">
                    3
                  </div>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Virtualized Grid"
                collection="layouts"
              >
                <div className="bg-secondary-background grid size-full grid-cols-4 grid-rows-4 rounded-lg p-1">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <div
                      key={index}
                      className="text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-1"
                    >
                      <div className="bg-default-background flex h-full w-full items-center justify-center rounded-md">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Data Display"
              description="Components for presenting information, including tables, code blocks, and rich text rendering."
            >
              <ComponentCard
                title="Code Block"
                collection="data-display"
              >
                <CodeBlock
                  language="tsx"
                  className="absolute w-[180%] scale-55"
                >
                  <CodeBlock.Content>
                    {`
import React from 'react';

function TodoItem({ todo, onToggle }) {
  return (
    <li className="todo-item">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span>{todo.text}</span>
    </li>
  );
}`}
                  </CodeBlock.Content>
                </CodeBlock>
              </ComponentCard>

              <ComponentCard
                title="Md Render"
                collection="data-display"
              >
                <MdRender className="absolute w-[200%] scale-50">
                  {`
# Hello, world!

## Lorem ipsum
Lorem ipsum, dolor sit amet consectetur adipisicing elit. Possimus quasi dolorem, cum ratione accusantium vitae commodi minima dolorum beatae, adipisci odio!

- List item 1
- List item 2
- List item 3

1. List item 1
2. List item 2
3. List item 3
`}
                </MdRender>
              </ComponentCard>

              <ComponentCard
                title="Kbd"
                collection="data-display"
              >
                <div className="flex gap-2">
                  <Kbd keys="command">K</Kbd>
                  <Kbd keys="shift">S</Kbd>
                  <Kbd keys="option">O</Kbd>
                  <Kbd keys="ctrl">C</Kbd>
                </div>
              </ComponentCard>

              <ComponentCard
                title="Table"
                collection="data-display"
              >
                <Table
                  data={Array.from({ length: 11 }).map((_, index) => ({
                    id: index,
                    name: `User ${index}`,
                    email: `user${index}@example.com`,
                    role: "Admin",
                    status: "active" as "active" | "inactive" | "pending",
                  }))}
                  getRowKey={(user) => user.id}
                  selectable
                  height={400}
                  className="absolute w-[200%] scale-55"
                >
                  <Table.Header>
                    <Table.Column
                      id="name"
                      width={64}
                    >
                      <Table.Value>Name</Table.Value>
                    </Table.Column>
                    <Table.Column id="email">
                      <Table.Value>Email</Table.Value>
                    </Table.Column>
                    <Table.Column
                      id="role"
                      width={64}
                    >
                      <Table.Value>Role</Table.Value>
                    </Table.Column>
                    <Table.Column
                      id="status"
                      width={100}
                    >
                      <Table.Value>Status</Table.Value>
                    </Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {(
                      user: {
                        id: number
                        name: string
                        email: string
                        role: string
                        status: "active" | "inactive" | "pending"
                      },
                      index: number,
                    ) => (
                      <Table.Row
                        rowKey={user.id}
                        index={index}
                      >
                        <Table.Cell columnId="name">
                          <Table.Value>{user.name}</Table.Value>
                        </Table.Cell>
                        <Table.Cell columnId="email">
                          <Table.Value>{user.email}</Table.Value>
                        </Table.Cell>
                        <Table.Cell columnId="role">
                          <Table.Value>{user.role}</Table.Value>
                        </Table.Cell>
                        <Table.Cell columnId="status">
                          <Badge
                            variant={
                              user.status === "active"
                                ? "success"
                                : user.status === "inactive"
                                  ? "error"
                                  : "warning"
                            }
                          >
                            {user.status}
                          </Badge>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </Table.Body>
                </Table>
              </ComponentCard>

              <ComponentCard
                title="Picture Preview"
                collection="data-display"
              >
                <PicturePreview
                  className="rounded-lg"
                  control={{
                    show: "always",
                  }}
                  src="https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Picture Preview"
                />
              </ComponentCard>
            </CollectionCard>

            <CollectionCard
              title="Pickers"
              description="Specialized selection components like emoji pickers and color pickers for choosing from visual options."
            >
              <ComponentCard
                title="Emoji Picker"
                collection="pickers"
              >
                <EmojiPicker
                  showSearch={false}
                  showCategories={false}
                  className="absolute scale-50 rounded-lg"
                  height={360}
                />
              </ComponentCard>
            </CollectionCard>
          </div>

          {/* FAQ Section */}
          <div className="space-y-8">
            <div className="text-center">
              <Badge className="mb-4">FAQ</Badge>
              <h2 className="text-heading-large">Frequently asked questions</h2>
              <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
                Everything you need to know about Choice UI.
              </p>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">Why no animations by default?</h3>
                <p className="text-secondary-foreground text-body-medium">
                  For desktop productivity tools, animations are friction. When you click a
                  dropdown, you want to see options instantly—not watch them slide in over 200ms. We
                  optimized for perceived speed and professional workflows.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">
                  Can I add animations if I want them?
                </h3>
                <p className="text-secondary-foreground text-body-medium">
                  Yes! Animations are opt-in through CSS or className props. You have full control.
                  We just don&apos;t force them on you—because we believe default should mean fast.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">
                  What frameworks does Choice UI support?
                </h3>
                <p className="text-secondary-foreground text-body-medium">
                  Choice UI is built for React 18+ and works seamlessly with Next.js, Vite, and
                  other React-based frameworks. Components are fully compatible with Server
                  Components and support SSR out of the box.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">
                  Which version of Tailwind CSS is required?
                </h3>
                <p className="text-secondary-foreground text-body-medium">
                  Choice UI is built for Tailwind CSS v4 and takes full advantage of its CSS
                  variables and native theming capabilities. Tailwind v3 is not supported.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">Is Choice UI accessible?</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Yes! All components follow WAI-ARIA guidelines and support keyboard navigation,
                  screen readers, and proper focus management. We continuously test with assistive
                  technologies.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">Can I customize the design tokens?</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Absolutely. Choice UI uses a comprehensive design token system that you can
                  override in your CSS. Change colors, spacing, typography, shadows, and more to
                  match your brand.
                </p>
              </div>

              <div className="bg-secondary-background rounded-xl p-6">
                <h3 className="text-body-large-strong mb-2">Is Choice UI free to use?</h3>
                <p className="text-secondary-foreground text-body-medium">
                  Yes, Choice UI is completely free and open source under the MIT license. You can
                  use it in personal and commercial projects without any restrictions.
                </p>
              </div>
            </div>
          </div>

          {/* Community Section */}
          <div className="space-y-8">
            <div className="text-center">
              <Badge
                variant="brand"
                className="mb-4"
              >
                Community
              </Badge>
              <h2 className="text-heading-large">Join the community</h2>
              <p className="text-secondary-foreground text-body-large mx-auto mt-2 max-w-xl">
                Connect with other developers, get help, and stay updated.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* GitHub */}
              <Link
                href="https://github.com/user/choice-ui"
                target="_blank"
                className="bg-secondary-background hover:border-brand-foreground group flex flex-col items-center gap-4 rounded-xl border border-transparent p-8 text-center transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body-large-strong group-hover:text-brand-foreground transition-colors">
                    GitHub
                  </h3>
                  <p className="text-secondary-foreground text-sm">Star, fork, and contribute</p>
                </div>
              </Link>

              {/* Twitter */}
              <Link
                href="https://twitter.com"
                target="_blank"
                className="bg-secondary-background hover:border-brand-foreground group flex flex-col items-center gap-4 rounded-xl border border-transparent p-8 text-center transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-600 dark:bg-sky-900 dark:text-sky-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body-large-strong group-hover:text-brand-foreground transition-colors">
                    Twitter
                  </h3>
                  <p className="text-secondary-foreground text-sm">Follow for updates</p>
                </div>
              </Link>

              {/* Discord */}
              <Link
                href="https://discord.com"
                target="_blank"
                className="bg-secondary-background hover:border-brand-foreground group flex flex-col items-center gap-4 rounded-xl border border-transparent p-8 text-center transition-colors"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-400">
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-body-large-strong group-hover:text-brand-foreground transition-colors">
                    Discord
                  </h3>
                  <p className="text-secondary-foreground text-sm">Chat with the community</p>
                </div>
              </Link>
            </div>
          </div>

          {/* CTA Section */}
          <div className="-mx-4 space-y-6 rounded-2xl px-4 py-12 text-center sm:px-8">
            <h2 className="text-heading-large">Stop waiting on your UI</h2>
            <p className="text-secondary-foreground text-body-large mx-auto max-w-xl opacity-80">
              Build interfaces that respond as fast as you think. No animations to wait for, no
              transitions to endure.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
              <Link href="/docs/guide/installation">
                <Button
                  size="large"
                  variant="secondary"
                >
                  Get Started
                </Button>
              </Link>
              <Link
                href="https://github.com/user/choice-ui"
                target="_blank"
              >
                <Button
                  size="large"
                  variant="ghost"
                  className="text-brand-foreground hover:bg-brand-foreground/10"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                  View on GitHub
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto max-w-[80rem] px-4 py-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {/* Brand */}
            <div className="col-span-2 space-y-4 md:col-span-1">
              <h3 className="text-body-large-strong">Choice UI</h3>
              <p className="text-secondary-foreground text-sm">
                A professional React component library for desktop applications.
              </p>
            </div>

            {/* Documentation */}
            <div className="space-y-4">
              <h4 className="text-body-medium-strong">Documentation</h4>
              <ul className="text-secondary-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="/docs/guide/installation"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Installation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/components"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Components
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/guide/theming"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Theming
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/guide/design-tokens"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Design Tokens
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-4">
              <h4 className="text-body-medium-strong">Resources</h4>
              <ul className="text-secondary-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="https://github.com/user/choice-ui"
                    target="_blank"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    GitHub
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/user/choice-ui/releases"
                    target="_blank"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Releases
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://github.com/user/choice-ui/issues"
                    target="_blank"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Issues
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div className="space-y-4">
              <h4 className="text-body-medium-strong">Community</h4>
              <ul className="text-secondary-foreground space-y-2 text-sm">
                <li>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://discord.com"
                    target="_blank"
                    className="hover:text-primary-foreground transition-colors"
                  >
                    Discord
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
            <p className="text-secondary-foreground text-sm">
              © {new Date().getFullYear()} Choice UI. All rights reserved.
            </p>
            <div className="text-secondary-foreground flex items-center gap-4 text-sm">
              <span>Built with</span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#61DAFB]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.098 2.21-.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z" />
                </svg>
                React
              </span>
              <span>+</span>
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 text-[#06B6D4]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z" />
                </svg>
                Tailwind CSS
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
