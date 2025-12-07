import {
  Avatar,
  Button,
  Input,
  List,
  Skeleton,
  SkeletonProvider,
} from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta = {
  title: "components/skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    loading: {
      control: "boolean",
    },
    variant: {
      control: "select",
      options: ["text", "rectangular", "rounded", "circular"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

const DefaultExample = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <Skeleton loading={loading}>
        <Button>Click me</Button>
      </Skeleton>
    </div>
  );
};

export const Default: Story = {
  render: () => <DefaultExample />,
};

const LoadingPropExample = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs text-gray-600">
            Button wrapped with Skeleton:
          </p>
          <Skeleton loading={loading}>
            <Button variant="primary">Click me</Button>
          </Skeleton>
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-600">
            Card wrapped with Skeleton:
          </p>
          <Skeleton loading={loading}>
            <div className="w-64 rounded-lg border p-4 shadow-sm">
              <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
              <p className="text-sm text-gray-600">Card content goes here</p>
            </div>
          </Skeleton>
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-600">
            Input wrapped with Skeleton:
          </p>
          <Skeleton loading={loading}>
            <Input placeholder="Enter text..." />
          </Skeleton>
        </div>

        <div>
          <p className="mb-2 text-xs text-gray-600">
            Avatar wrapped with Skeleton:
          </p>
          <Skeleton loading={loading}>
            <Avatar className="h-10 w-10" name="John Doe" />
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export const LoadingProp: Story = {
  name: "Loading Prop",
  render: () => <LoadingPropExample />,
};

const SkeletonProviderExample = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>

      <SkeletonProvider loading={loading}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs text-gray-600">
              Multiple components controlled by SkeletonProvider:
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
          </div>

          <div>
            <Skeleton>
              <div className="w-64 rounded-lg border p-4 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
                <p className="text-sm text-gray-600">Card content goes here</p>
              </div>
            </Skeleton>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton>
              <Avatar className="h-10 w-10" name="John Doe" />
            </Skeleton>
            <div className="space-y-2">
              <Skeleton>
                <h3 className="text-lg font-semibold">User Name</h3>
              </Skeleton>
              <Skeleton>
                <p className="text-sm text-gray-500">User description</p>
              </Skeleton>
            </div>
          </div>
        </div>
      </SkeletonProvider>
    </div>
  );
};

export const SkeletonProviderStory: Story = {
  name: "SkeletonProvider",
  render: () => <SkeletonProviderExample />,
};

const ButtonExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <p className="mb-2 text-xs text-gray-600">Primary button:</p>
          <Skeleton loading={loading}>
            <Button variant="primary">Primary Button</Button>
          </Skeleton>
        </div>
        <div>
          <p className="mb-2 text-xs text-gray-600">Secondary button:</p>
          <Skeleton loading={loading}>
            <Button variant="secondary">Secondary Button</Button>
          </Skeleton>
        </div>
        <div>
          <p className="mb-2 text-xs text-gray-600">Destructive button:</p>
          <Skeleton loading={loading}>
            <Button variant="destructive">Delete</Button>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export const ButtonExample: Story = {
  name: "Button Wrapped",
  render: () => <ButtonExampleComponent />,
};

const CardExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <Skeleton loading={loading}>
        <div className="w-64 rounded-lg border p-4 shadow-sm">
          <h3 className="mb-2 text-lg font-semibold">Card Title</h3>
          <p className="mb-4 text-sm text-gray-600">
            This is a card with some content that will be shown as skeleton when
            loading.
          </p>
          <div className="flex gap-2">
            <Button variant="primary">Action</Button>
            <Button variant="secondary">Cancel</Button>
          </div>
        </div>
      </Skeleton>
    </div>
  );
};

export const CardExample: Story = {
  name: "Card Wrapped",
  render: () => <CardExampleComponent />,
};

const FormExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-80 space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <Skeleton loading={loading}>
            <Input placeholder="Enter your name" />
          </Skeleton>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <Skeleton loading={loading}>
            <Input type="email" placeholder="Enter your email" />
          </Skeleton>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <Skeleton loading={loading}>
            <textarea
              className="w-full rounded-md border p-2"
              placeholder="Enter your message"
              rows={4}
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
  );
};

export const FormExample: Story = {
  name: "Form Wrapped",
  render: () => <FormExampleComponent />,
};

const ProfileExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-80 space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <div className="rounded-lg border p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <Skeleton loading={loading}>
            <Avatar className="h-16 w-16" name="John Doe" />
          </Skeleton>
          <div className="flex-1 space-y-2">
            <Skeleton loading={loading}>
              <h3 className="text-lg font-semibold">John Doe</h3>
            </Skeleton>
            <Skeleton loading={loading}>
              <p className="text-sm text-gray-600">Software Engineer</p>
            </Skeleton>
            <Skeleton loading={loading}>
              <p className="text-xs text-gray-500">San Francisco, CA</p>
            </Skeleton>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <Skeleton loading={loading}>
            <Button variant="primary" className="flex-1">
              Follow
            </Button>
          </Skeleton>
          <Skeleton loading={loading}>
            <Button variant="secondary" className="flex-1">
              Message
            </Button>
          </Skeleton>
        </div>
      </div>
    </div>
  );
};

export const ProfileExample: Story = {
  name: "Profile Card",
  render: () => <ProfileExampleComponent />,
};

/**
 * List component with each List.Item wrapped with Skeleton
 */
const ListExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-96 space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <List>
        <List.Content>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} loading={loading}>
              <List.Item
                as="div"
                prefixElement={<Avatar name={`User ${i + 1}`} />}
                suffixElement={
                  <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
                    Action
                  </Button>
                }
              >
                <List.Value>Description text here</List.Value>
              </List.Item>
            </Skeleton>
          ))}
        </List.Content>
      </List>
    </div>
  );
};

export const ListExample: Story = {
  name: "List Items",
  render: () => <ListExampleComponent />,
};

const MixedExampleComponent = () => {
  const [loading, setLoading] = useState(true);

  return (
    <div className="w-96 space-y-6 p-4">
      <div className="flex items-center gap-2">
        <Button onClick={() => setLoading(!loading)}>
          {loading ? "Show Content" : "Show Loading"}
        </Button>
      </div>
      <SkeletonProvider loading={loading}>
        <div className="space-y-4">
          <Skeleton>
            <h2 className="text-heading-large">Page Title</h2>
          </Skeleton>
          <Skeleton>
            <p className="text-body-medium">Page description goes here</p>
          </Skeleton>
          <Skeleton>
            <div className="flex gap-2">
              <Button variant="primary">Primary Action</Button>
              <Button variant="secondary">Secondary Action</Button>
            </div>
          </Skeleton>
          <Skeleton>
            <div className="rounded-lg border p-4">
              <h3 className="text-heading-small mb-2">Card Title</h3>
              <p className="text-body-medium">Card content</p>
            </div>
          </Skeleton>
        </div>
      </SkeletonProvider>
    </div>
  );
};

export const MixedExample: Story = {
  name: "Mixed Components",
  render: () => <MixedExampleComponent />,
};
