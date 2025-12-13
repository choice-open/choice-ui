import { Avatar, Button, Input, List, Skeleton, SkeletonProvider, Textarea } from "@choice-ui/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { useState } from "react"

const meta: Meta<typeof Skeleton> = {
  title: "Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
}

export default meta

type Story = StoryObj<typeof Skeleton>

/**
 * Basic: Demonstrates the fundamental usage of Skeleton component.
 * - Toggle the loading state to see the transition effect.
 * - When loading is true, the wrapped content displays as a skeleton.
 * - When loading is false, the actual content is revealed with a smooth transition.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex flex-col gap-4">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <Skeleton loading={loading}>
          <Button variant="primary">Click me</Button>
        </Skeleton>
      </div>
    )
  },
}

/**
 * LoadingProp: Shows how to control individual Skeleton components with the `loading` prop.
 * - Each Skeleton can be controlled independently.
 * - When `loading` is true, children are hidden and replaced with a skeleton effect.
 * - Useful for granular control over different parts of the UI.
 */
export const LoadingProp: Story = {
  name: "Loading Prop",
  render: function LoadingPropStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <div className="flex flex-col gap-4">
          <div>
            <p className="text-tertiary-foreground mb-2">Button:</p>
            <Skeleton loading={loading}>
              <Button variant="primary">Click me</Button>
            </Skeleton>
          </div>

          <div>
            <p className="text-tertiary-foreground mb-2">Input:</p>
            <Skeleton loading={loading}>
              <Input placeholder="Enter text..." />
            </Skeleton>
          </div>

          <div>
            <p className="text-tertiary-foreground mb-2">Avatar:</p>
            <Skeleton loading={loading}>
              <Avatar name="John Doe" />
            </Skeleton>
          </div>

          <div>
            <p className="text-tertiary-foreground mb-2">Card:</p>
            <Skeleton loading={loading}>
              <div className="w-64 rounded-lg p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
                <p className="text-secondary-foreground">Card content goes here</p>
              </div>
            </Skeleton>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * SkeletonProviderUsage: Demonstrates unified loading control with SkeletonProvider.
 * - Wrap multiple Skeleton components with SkeletonProvider.
 * - All nested Skeletons inherit the loading state from the provider.
 * - Individual Skeleton `loading` props take precedence over provider.
 * - Ideal for page-level or section-level loading states.
 */
export const SkeletonProviderUsage: Story = {
  name: "SkeletonProvider",
  render: function SkeletonProviderStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <SkeletonProvider loading={loading}>
          <div className="flex flex-col gap-4">
            <p className="text-tertiary-foreground">
              All components below are controlled by SkeletonProvider:
            </p>

            <div className="flex gap-2">
              <Skeleton>
                <Button variant="primary">Button 1</Button>
              </Skeleton>
              <Skeleton>
                <Button variant="secondary">Button 2</Button>
              </Skeleton>
              <Skeleton>
                <Button variant="solid">Button 3</Button>
              </Skeleton>
            </div>

            <Skeleton>
              <div className="w-64 rounded-lg p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
                <p className="text-secondary-foreground">Card content goes here</p>
              </div>
            </Skeleton>

            <div className="flex items-center gap-3">
              <Skeleton>
                <Avatar name="John Doe" />
              </Skeleton>
              <div className="flex flex-col gap-2">
                <Skeleton>
                  <span className="text-lg font-semibold">User Name</span>
                </Skeleton>
                <Skeleton>
                  <span className="text-secondary-foreground">User description</span>
                </Skeleton>
              </div>
            </div>
          </div>
        </SkeletonProvider>
      </div>
    )
  },
}

/**
 * ProfileCard: Real-world example of a user profile card with skeleton loading.
 * - Shows a complete profile layout with avatar, name, title, and action buttons.
 * - Demonstrates how Skeleton preserves the layout structure during loading.
 * - Each element maintains its size and position for a smooth loading experience.
 */
export const ProfileCard: Story = {
  name: "Profile Card",
  render: function ProfileCardStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex w-80 flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <div className="rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Skeleton loading={loading}>
              <Avatar
                className="size-16"
                name="John Doe"
              />
            </Skeleton>
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton loading={loading}>
                <span className="text-lg font-semibold">John Doe</span>
              </Skeleton>
              <Skeleton loading={loading}>
                <span className="text-secondary-foreground">Software Engineer</span>
              </Skeleton>
              <Skeleton loading={loading}>
                <span className="text-tertiary-foreground">San Francisco, CA</span>
              </Skeleton>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Skeleton loading={loading}>
              <Button
                variant="primary"
                className="flex-1"
              >
                Follow
              </Button>
            </Skeleton>
            <Skeleton loading={loading}>
              <Button
                variant="secondary"
                className="flex-1"
              >
                Message
              </Button>
            </Skeleton>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * FormLayout: Demonstrates skeleton loading for form elements.
 * - Shows a typical form with text inputs and a textarea.
 * - Skeleton maintains form field dimensions during loading.
 * - Action buttons are also wrapped for a complete loading experience.
 */
export const FormLayout: Story = {
  name: "Form Layout",
  render: function FormLayoutStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex w-80 flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block font-medium">Name</label>
            <Skeleton loading={loading}>
              <Input placeholder="Enter your name" />
            </Skeleton>
          </div>
          <div>
            <label className="mb-1 block font-medium">Email</label>
            <Skeleton loading={loading}>
              <Input
                type="email"
                placeholder="Enter your email"
              />
            </Skeleton>
          </div>
          <div>
            <label className="mb-1 block font-medium">Message</label>
            <Skeleton loading={loading}>
              <Textarea
                placeholder="Enter your message"
                minRows={4}
                maxRows={8}
              />
            </Skeleton>
          </div>
          <div className="flex gap-2">
            <Skeleton loading={loading}>
              <Button variant="primary">Submit</Button>
            </Skeleton>
            <Skeleton loading={loading}>
              <Button variant="secondary">Cancel</Button>
            </Skeleton>
          </div>
        </div>
      </div>
    )
  },
}

/**
 * ListItems: Shows skeleton loading for list-based layouts.
 * - Each List.Item is wrapped with Skeleton individually.
 * - Maintains consistent item heights and spacing during loading.
 * - Ideal for data-driven lists, feeds, or navigation menus.
 */
export const ListItems: Story = {
  name: "List Items",
  render: function ListItemsStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex w-96 flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <List>
          <List.Content>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton
                key={i}
                loading={loading}
              >
                <List.Item
                  as="div"
                  prefixElement={
                    <Avatar
                      name={`User ${i + 1}`}
                      size="small"
                    />
                  }
                  suffixElement={
                    <Button
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Action
                    </Button>
                  }
                >
                  <List.Value>List item description</List.Value>
                </List.Item>
              </Skeleton>
            ))}
          </List.Content>
        </List>
      </div>
    )
  },
}

/**
 * TransitionEffect: Demonstrates the smooth transition animation.
 * - Shows how Skeleton transitions smoothly between loading and loaded states.
 * - Both entering (content → skeleton) and leaving (skeleton → content) have transitions.
 * - The transition is powered by CSS transitions on background, border, and opacity.
 */
export const TransitionEffect: Story = {
  name: "Transition Effect",
  render: function TransitionEffectStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setLoading(!loading)}
            className="self-start"
          >
            Toggle Loading
          </Button>
          <span className="text-secondary-foreground">
            Current: <strong>{loading ? "Loading" : "Loaded"}</strong>
          </span>
        </div>

        <p className="text-tertiary-foreground">
          Click the button and observe the smooth transition in both directions:
        </p>

        <div className="flex flex-wrap gap-4">
          <Skeleton loading={loading}>
            <Button variant="primary">Primary Button</Button>
          </Skeleton>

          <Skeleton loading={loading}>
            <Button variant="secondary">Secondary Button</Button>
          </Skeleton>

          <Skeleton loading={loading}>
            <Avatar
              name="Test User"
              className="size-10"
            />
          </Skeleton>

          <Skeleton loading={loading}>
            <div className="rounded-lg border px-4 py-2">
              <span className="">Card Content</span>
            </div>
          </Skeleton>
        </div>
      </div>
    )
  },
}

/**
 * MixedContent: Shows a complex layout combining multiple component types.
 * - Demonstrates how SkeletonProvider can control a diverse set of elements.
 * - Includes headings, paragraphs, buttons, and cards.
 * - Represents a typical page section with mixed content types.
 */
export const MixedContent: Story = {
  name: "Mixed Content",
  render: function MixedContentStory() {
    const [loading, setLoading] = useState(true)

    return (
      <div className="flex w-96 flex-col gap-6">
        <Button
          onClick={() => setLoading(!loading)}
          className="self-start"
        >
          {loading ? "Show Content" : "Show Loading"}
        </Button>

        <SkeletonProvider loading={loading}>
          <div className="flex flex-col gap-4">
            <Skeleton>
              <h2 className="text-heading-large">Page Title</h2>
            </Skeleton>

            <Skeleton>
              <p className="text-body-medium text-secondary-foreground">
                This is a page description that explains the content below.
              </p>
            </Skeleton>

            <Skeleton>
              <div className="flex gap-2">
                <Button variant="primary">Primary Action</Button>
                <Button variant="secondary">Secondary Action</Button>
              </div>
            </Skeleton>

            <Skeleton>
              <div className="rounded-lg border p-4">
                <h3 className="text-heading-small mb-2">Card Section</h3>
                <p className="text-body-medium text-secondary-foreground">
                  Card content with detailed information.
                </p>
              </div>
            </Skeleton>
          </div>
        </SkeletonProvider>
      </div>
    )
  },
}
