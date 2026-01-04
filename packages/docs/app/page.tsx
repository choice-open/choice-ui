"use client"

import {
  ButtonsCollection,
  CollectionsCollection,
  DataDisplayCollection,
  DateAndTimeCollection,
  FormsCollection,
  LayoutsCollection,
  NavigationCollection,
  OverlaysCollection,
  PickersCollection,
} from "@/components/components-collection"
import CtaSection from "@/components/cta-section"
import FaqSection from "@/components/faq-section"
import Footer from "@/components/footer"
import { SiteHeader } from "@/components/site-header"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEventCallback } from "usehooks-ts"
import { Badge, Button, CodeBlock, Select, Separator } from "~/components"

export default function Home() {
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
            <h1 className="mx-auto max-w-3xl text-[34px] leading-[40px] font-semibold tracking-[-.022em] md:text-[56px] md:leading-[64px] md:tracking-[-.028em] lg:text-[80px] lg:leading-[88px] lg:tracking-[-.035em]">
              No Frills, <br />
              Just Performance
            </h1>

            <p className="text-secondary-foreground text-body-large mx-auto max-w-2xl">
              Zero unnecessary animations. Zero wasted milliseconds. Every interaction responds
              instantly—because professional tools shouldn&apos;t make you wait.
            </p>

            <div className="mt-4 flex items-center justify-center whitespace-nowrap md:mt-7 md:gap-1.5">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="size-5"
                >
                  <path
                    fill="#23B2E7"
                    d="M16.444 6.834a14 14 0 0 0-.644-.205q.055-.226.1-.444c.487-2.393.168-4.321-.92-4.956-1.043-.609-2.75.026-4.473 1.543q-.248.219-.498.462-.165-.16-.331-.31C7.872 1.304 6.06.62 4.974 1.257c-1.042.61-1.35 2.422-.912 4.69q.063.33.148.67-.385.11-.74.236C1.352 7.599 0 8.769 0 9.983c0 1.254 1.452 2.511 3.657 3.274q.262.09.54.171-.09.37-.156.722c-.418 2.229-.092 3.998.948 4.605 1.074.626 2.876-.018 4.63-1.57q.209-.183.418-.388.27.264.54.499c1.7 1.48 3.38 2.077 4.418 1.468 1.072-.628 1.421-2.529.969-4.841a12 12 0 0 0-.12-.541q.19-.057.371-.118C18.508 12.496 20 11.254 20 9.983c0-1.218-1.396-2.397-3.556-3.149m-.497 5.61q-.165.055-.336.106a20 20 0 0 0-1.013-2.563c.399-.87.727-1.72.973-2.525q.308.09.595.19c1.85.644 2.98 1.597 2.98 2.331 0 .782-1.22 1.797-3.2 2.46Zm-.822 1.646c.2 1.023.229 1.948.096 2.67-.119.65-.358 1.083-.654 1.256-.63.37-1.979-.11-3.432-1.376q-.25-.218-.503-.463a20 20 0 0 0 1.676-2.154c.967-.086 1.88-.228 2.709-.422q.06.25.108.49Zm-8.307 3.863c-.615.22-1.106.226-1.402.053-.631-.368-.893-1.789-.536-3.695q.062-.327.146-.671c.82.183 1.726.315 2.696.394a21 21 0 0 0 1.716 2.146q-.19.187-.38.355c-.777.686-1.554 1.173-2.24 1.418m-2.885-5.514c-.975-.337-1.78-.775-2.332-1.254-.496-.43-.747-.856-.747-1.202 0-.737 1.086-1.676 2.897-2.315q.33-.116.688-.22c.25.824.579 1.685.975 2.556a21 21 0 0 0-.987 2.591 11 11 0 0 1-.494-.156m.968-6.659c-.376-1.943-.127-3.409.501-3.776.67-.392 2.15.166 3.709 1.567q.15.135.3.28a21 21 0 0 0-1.704 2.133 21 21 0 0 0-2.669.42q-.078-.318-.137-.624m8.627 2.155a28 28 0 0 0-.609-1.012c.639.082 1.25.19 1.824.323a19 19 0 0 1-.64 1.742 30 30 0 0 0-.575-1.053M10.009 4.47c.395.432.79.914 1.178 1.437a25 25 0 0 0-2.364 0q.584-.78 1.186-1.437M6.47 7.94a26 26 0 0 0-.565 1.046 19 19 0 0 1-.635-1.75c.57-.13 1.179-.235 1.813-.315q-.315.497-.613 1.019m.631 5.165a18 18 0 0 1-1.843-.3c.177-.577.394-1.176.648-1.786A26 26 0 0 0 7.1 13.106Zm2.933 2.452c-.405-.442-.809-.93-1.203-1.457a30 30 0 0 0 2.377-.004c-.39.535-.782 1.025-1.174 1.461m4.078-4.57q.403.927.672 1.78c-.58.134-1.206.242-1.866.322a31 31 0 0 0 1.194-2.101Zm-1.32.641a28 28 0 0 1-.96 1.566q-.892.065-1.831.065-.935 0-1.81-.058a24.4 24.4 0 0 1-1.83-3.198 24 24 0 0 1 1.82-3.193 24 24 0 0 1 3.646 0 28.5 28.5 0 0 1 1.826 3.18 26 26 0 0 1-.861 1.638m1.762-9.651c.67.39.93 1.966.51 4.032q-.04.198-.09.402a20 20 0 0 0-2.674-.427 20 20 0 0 0-1.69-2.134q.23-.225.46-.427c1.476-1.3 2.856-1.813 3.484-1.446M10 8.176c.986 0 1.786.81 1.786 1.807 0 .998-.8 1.806-1.786 1.806a1.796 1.796 0 0 1-1.786-1.806c0-.998.8-1.807 1.786-1.807"
                  />
                </svg>
                <span className="text-body-large-strong flex items-center gap-1">
                  <span className="text-secondary-foreground">Built for</span>
                  <span className="">React</span>
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
                />
              </svg>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  className="size-5"
                >
                  <path
                    fill="#23B2E7"
                    fillRule="evenodd"
                    d="M10 5Q6 5 5 8.334q1.5-1.668 3.5-1.25c.76.158 1.305.618 1.906 1.127C11.386 9.041 12.522 10 15 10q4 0 5-3.333-1.5 1.667-3.5 1.25c-.76-.159-1.305-.619-1.906-1.128C13.614 5.96 12.479 5 10 5m-5 5q-4 0-5 3.334 1.5-1.668 3.5-1.25c.76.158 1.305.618 1.906 1.127C6.386 14.041 7.521 15 10 15q4 0 5-3.333-1.5 1.667-3.5 1.25c-.76-.159-1.305-.619-1.906-1.128C8.614 10.96 7.478 10 5 10"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-body-large-strong flex items-center gap-1">
                  <span className="text-secondary-foreground">Styled with</span>
                  <span className="">TailwindCSS</span>
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
              <Button
                size="large"
                onClick={handleGetStarted}
              >
                Get Started
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 pt-8">
              <div className="text-center">
                <p className="text-heading-large">60+</p>
                <p className="text-secondary-foreground">Components</p>
              </div>
              <Separator
                orientation="vertical"
                className="h-8"
              />
              <div className="text-center">
                <p className="text-heading-large">100+</p>
                <p className="text-secondary-foreground">Design Tokens</p>
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
            <ButtonsCollection />

            <CollectionsCollection />

            <FormsCollection />

            <DateAndTimeCollection />

            <NavigationCollection />

            <OverlaysCollection />

            <LayoutsCollection />

            <DataDisplayCollection />

            <PickersCollection />
          </div>

          <FaqSection />
          <CtaSection />
        </div>
      </main>
    </>
  )
}
