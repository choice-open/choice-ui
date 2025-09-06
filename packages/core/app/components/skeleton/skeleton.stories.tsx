import type { Meta, StoryObj } from "@storybook/react"
import React from "react"
import { Avatar } from "../avatar"
import { Skeleton } from "./skeleton"

const meta = {
  title: "components/skeleton",
  component: Skeleton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    animation: {
      control: "select",
      options: ["pulse", "wave", false],
    },
    variant: {
      control: "select",
      options: ["text", "rectangular", "rounded", "circular"],
    },
    width: {
      control: "text",
    },
    height: {
      control: "text",
    },
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    width: 200,
    height: 20,
  },
}

export const Text: Story = {
  name: "Text Skeletons - All Variations",
  render: () => (
    <div className="space-y-8 p-4">
      <div>
        <h3 className="text-lg font-semibold mb-4">Basic Usage</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-2 text-gray-600">Original variant usage:</p>
            <Skeleton variant="text" width={200} height={16} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">New compound usage:</p>
            <Skeleton.Text width={200} height={16} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">With default dimensions:</p>
            <Skeleton.Text />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Text Content Simulation</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs mb-2 text-gray-600">Title (h1):</p>
            <Skeleton.Text width="70%" height={32} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Subtitle (h2):</p>
            <Skeleton.Text width="50%" height={24} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Paragraph text:</p>
            <Skeleton.Text width="90%" height={16} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Small text:</p>
            <Skeleton.Text width="40%" height={14} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Multi-line Text (Paragraph)</h3>
        <div className="space-y-2">
          <Skeleton.Text width="100%" height={16} />
          <Skeleton.Text width="95%" height={16} />
          <Skeleton.Text width="85%" height={16} />
          <Skeleton.Text width="60%" height={16} />
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Wrapped in Parent Elements</h3>
        <div className="space-y-4">
          <div>
            <p className="text-xs mb-2 text-gray-600">Inside h1 tag:</p>
            <h1 className="text-2xl font-bold">
              <Skeleton.Text />
            </h1>
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Inside p tag:</p>
            <p className="text-base">
              <Skeleton.Text />
            </p>
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Inside span tag:</p>
            <span className="text-sm">
              <Skeleton.Text />
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Animation Variations</h3>
        <div className="space-y-3">
          <div>
            <p className="text-xs mb-2 text-gray-600">Pulse animation (default):</p>
            <Skeleton.Text animation="pulse" width={200} height={16} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">Wave animation:</p>
            <Skeleton.Text animation="wave" width={200} height={16} />
          </div>
          
          <div>
            <p className="text-xs mb-2 text-gray-600">No animation:</p>
            <Skeleton.Text animation={false} width={200} height={16} />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Reference Comparison</h3>
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Manual div skeleton for comparison:</p>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
          <p className="text-xs text-gray-600">Skeleton.Text component:</p>
          <Skeleton.Text width={192} height={16} />
        </div>
      </div>
    </div>
  ),
}

export const Rectangular: Story = {
  args: {
    variant: "rectangular",
    width: 200,
    height: 100,
  },
}

export const Rounded: Story = {
  args: {
    variant: "rounded",
    width: 200,
    height: 100,
  },
}

export const Circular: Story = {
  args: {
    variant: "circular",
    width: 40,
    height: 40,
  },
}

export const PulseAnimation: Story = {
  args: {
    animation: "pulse",
    variant: "rectangular",
    width: 200,
    height: 100,
  },
}

export const WaveAnimation: Story = {
  args: {
    animation: "wave",
    variant: "rectangular",
    width: 200,
    height: 100,
  },
}

export const NoAnimation: Story = {
  args: {
    animation: false,
    variant: "rectangular",
    width: 200,
    height: 100,
  },
}

export const WithChildren: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Skeleton variant="circular">
        <Avatar
          className="h-10 w-10"
          name="John Doe"
        />
      </Skeleton>
      <div className="space-y-2">
        <Skeleton variant="text">
          <h3 className="text-lg font-semibold">Loading Title</h3>
        </Skeleton>
        <Skeleton variant="text">
          <p className="text-sm text-gray-500">Loading subtitle text here</p>
        </Skeleton>
      </div>
    </div>
  ),
}

export const Card: Story = {
  render: () => (
    <div className="w-64 rounded-lg border p-4 shadow-sm">
      <div className="mb-4">
        <Skeleton
          variant="rounded"
          height={150}
        />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" />
        <Skeleton
          variant="text"
          width="60%"
        />
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Skeleton
          variant="circular"
          width={24}
          height={24}
        />
        <Skeleton
          variant="text"
          width={100}
        />
      </div>
    </div>
  ),
}

export const List: Story = {
  render: () => (
    <div className="w-96 space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-3"
        >
          <Skeleton
            variant="circular"
            width={40}
            height={40}
          />
          <div className="flex-1 space-y-2">
            <Skeleton
              variant="text"
              width="70%"
            />
            <Skeleton
              variant="text"
              width="50%"
            />
          </div>
        </div>
      ))}
    </div>
  ),
}

export const Form: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div>
        <Skeleton
          variant="text"
          width={60}
          height={14}
          className="mb-1"
        />
        <Skeleton
          variant="rounded"
          height={32}
        />
      </div>
      <div>
        <Skeleton
          variant="text"
          width={80}
          height={14}
          className="mb-1"
        />
        <Skeleton
          variant="rounded"
          height={80}
        />
      </div>
      <div className="flex gap-2">
        <Skeleton
          variant="rounded"
          height={32}
          width={80}
        />
        <Skeleton
          variant="rounded"
          height={32}
          width={80}
        />
      </div>
    </div>
  ),
}

export const DataTable: Story = {
  render: () => (
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="p-2 text-left">
              <Skeleton
                variant="text"
                width={80}
              />
            </th>
            <th className="p-2 text-left">
              <Skeleton
                variant="text"
                width={100}
              />
            </th>
            <th className="p-2 text-left">
              <Skeleton
                variant="text"
                width={60}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 5 }).map((_, i) => (
            <tr
              key={i}
              className="border-b"
            >
              <td className="p-2">
                <Skeleton
                  variant="text"
                  width="90%"
                />
              </td>
              <td className="p-2">
                <Skeleton
                  variant="text"
                  width="70%"
                />
              </td>
              <td className="p-2">
                <Skeleton
                  variant="text"
                  width="80%"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ),
}

// ==============================================
// COMPOUND COMPONENT EXAMPLES
// ==============================================

export const CompoundBasic: Story = {
  name: "Compound Components - Basic Usage",
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-600">Individual Components</h3>
        <div className="space-y-3">
          <Skeleton.Text
            width={200}
            height={16}
          />
          <Skeleton.Rounded
            width={150}
            height={40}
          />
          <Skeleton.Circular
            width={50}
            height={50}
          />
          <Skeleton.Rectangular
            width={300}
            height={80}
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-medium text-gray-600">With Animation Control</h3>
        <div className="flex gap-4">
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Pulse</p>
            <Skeleton.Text
              animation="pulse"
              width={120}
            />
            <Skeleton.Rounded
              animation="pulse"
              width={80}
              height={32}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">Wave</p>
            <Skeleton.Text
              animation="wave"
              width={120}
            />
            <Skeleton.Rounded
              animation="wave"
              width={80}
              height={32}
            />
          </div>
          <div className="space-y-2">
            <p className="text-xs text-gray-500">No Animation</p>
            <Skeleton.Text
              animation={false}
              width={120}
            />
            <Skeleton.Rounded
              animation={false}
              width={80}
              height={32}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

// ==============================================
// CARD LAYOUTS
// ==============================================

export const CompoundCardBasic: Story = {
  name: "Card Layout - Basic Profile",
  render: () => (
    <div className="bg-default-background w-80 rounded-lg p-4 shadow-lg">
      <div className="flex items-start gap-4">
        <Skeleton.Circular
          width={60}
          height={60}
        />
        <div className="flex-1 space-y-3">
          <div className="space-y-2">
            <Skeleton.Text
              width="75%"
              height={18}
            />
            <Skeleton.Text
              width="60%"
              height={14}
            />
          </div>
          <div className="flex gap-2">
            <Skeleton.Rounded
              width={80}
              height={32}
            />
            <Skeleton.Rounded
              height={32}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </div>
  ),
}

export const CompoundCardProduct: Story = {
  name: "Card Layout - Product Card",
  render: () => (
    <div className="bg-default-background w-72 overflow-hidden rounded-lg shadow-lg">
      <Skeleton.Rectangular
        width="100%"
        height={200}
      />
      <div className="space-y-3 p-4">
        <div className="space-y-2">
          <Skeleton.Text
            width="90%"
            height={16}
          />
          <Skeleton.Text
            width="70%"
            height={14}
          />
        </div>
        <div className="flex items-center justify-between">
          <Skeleton.Text
            width={80}
            height={20}
          />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton.Circular
                key={i}
                width={16}
                height={16}
              />
            ))}
          </div>
        </div>
        <Skeleton.Rounded
          width="100%"
          height={40}
        />
      </div>
    </div>
  ),
}

export const CompoundCardArticle: Story = {
  name: "Card Layout - Article Card",
  render: () => (
    <div className="bg-default-background max-w-md overflow-hidden rounded-lg shadow-lg">
      <Skeleton.Rectangular
        width="100%"
        height={180}
      />
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Skeleton.Text
            width="95%"
            height={18}
          />
          <Skeleton.Text
            width="85%"
            height={18}
          />
          <Skeleton.Text
            width="60%"
            height={18}
          />
        </div>
        <div className="space-y-2">
          <Skeleton.Text
            width="100%"
            height={14}
          />
          <Skeleton.Text
            width="100%"
            height={14}
          />
          <Skeleton.Text
            width="80%"
            height={14}
          />
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Skeleton.Circular
              width={32}
              height={32}
            />
            <div className="space-y-1">
              <Skeleton.Text
                width={80}
                height={12}
              />
              <Skeleton.Text
                width={60}
                height={10}
              />
            </div>
          </div>
          <Skeleton.Text
            width={60}
            height={12}
          />
        </div>
      </div>
    </div>
  ),
}

export const CompoundCardDashboard: Story = {
  name: "Card Layout - Dashboard Stats",
  render: () => (
    <div className="grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-default-background rounded-lg p-4 shadow-lg"
        >
          <div className="mb-4 flex items-center justify-between">
            <Skeleton.Text
              width={100}
              height={14}
            />
            <Skeleton.Circular
              width={32}
              height={32}
            />
          </div>
          <div className="space-y-2">
            <Skeleton.Text
              width={120}
              height={24}
            />
            <Skeleton.Text
              width={80}
              height={12}
            />
          </div>
          <div className="mt-4">
            <Skeleton.Rectangular
              width="100%"
              height={60}
            />
          </div>
        </div>
      ))}
    </div>
  ),
}

// ==============================================
// TABLE LAYOUTS
// ==============================================

export const CompoundTableBasic: Story = {
  name: "Table Layout - Basic Data Table",
  render: () => (
    <div className="bg-default-background w-full max-w-4xl overflow-hidden rounded-lg shadow-lg">
      {/* Table Header */}
      <div className="bg-secondary-background border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton.Text
            width={150}
            height={18}
          />
          <div className="flex gap-2">
            <Skeleton.Rounded
              width={80}
              height={32}
            />
            <Skeleton.Rounded
              width={60}
              height={32}
            />
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="divide-y">
        <div className="bg-gray-25 px-6 py-3">
          <div className="grid grid-cols-5 gap-4">
            <Skeleton.Text
              width={80}
              height={14}
            />
            <Skeleton.Text
              width={100}
              height={14}
            />
            <Skeleton.Text
              width={90}
              height={14}
            />
            <Skeleton.Text
              width={70}
              height={14}
            />
            <Skeleton.Text
              width={60}
              height={14}
            />
          </div>
        </div>

        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="px-6 py-4"
          >
            <div className="grid grid-cols-5 items-center gap-4">
              <div className="flex items-center gap-3">
                <Skeleton.Circular
                  width={32}
                  height={32}
                />
                <Skeleton.Text
                  width={100}
                  height={14}
                />
              </div>
              <Skeleton.Text
                width="80%"
                height={14}
              />
              <Skeleton.Text
                width={60}
                height={14}
              />
              <Skeleton.Rounded
                width={80}
                height={24}
              />
              <div className="flex gap-1">
                <Skeleton.Circular
                  width={24}
                  height={24}
                />
                <Skeleton.Circular
                  width={24}
                  height={24}
                />
                <Skeleton.Circular
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Footer */}
      <div className="bg-secondary-background border-t px-6 py-4">
        <div className="flex items-center justify-between">
          <Skeleton.Text
            width={120}
            height={14}
          />
          <div className="flex items-center gap-2">
            <Skeleton.Text
              width={80}
              height={14}
            />
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton.Circular
                  key={i}
                  width={32}
                  height={32}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}

export const CompoundTableCompact: Story = {
  name: "Table Layout - Compact List",
  render: () => (
    <div className="bg-default-background w-full max-w-2xl overflow-hidden rounded-lg shadow-lg">
      <div className="bg-secondary-background border-b px-4 py-3">
        <Skeleton.Text
          width={180}
          height={16}
        />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="hover:bg-gray-25 flex items-center justify-between px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <Skeleton.Circular
                width={28}
                height={28}
              />
              <div className="space-y-1">
                <Skeleton.Text
                  width={140}
                  height={14}
                />
                <Skeleton.Text
                  width={100}
                  height={12}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Skeleton.Rounded
                width={60}
                height={20}
              />
              <Skeleton.Circular
                width={20}
                height={20}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

// ==============================================
// LIST LAYOUTS
// ==============================================

export const CompoundListContacts: Story = {
  name: "List Layout - Contact List",
  render: () => (
    <div className="bg-default-background w-full max-w-md overflow-hidden rounded-lg shadow-lg">
      <div className="bg-secondary-background border-b px-4 py-3">
        <Skeleton.Text
          width={100}
          height={16}
        />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-4 py-4"
          >
            <Skeleton.Circular
              width={48}
              height={48}
            />
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <Skeleton.Text
                  width={120}
                  height={16}
                />
                <Skeleton.Text
                  width={40}
                  height={12}
                />
              </div>
              <Skeleton.Text
                width="90%"
                height={14}
              />
              <div className="flex items-center gap-2">
                <Skeleton.Circular
                  width={16}
                  height={16}
                />
                <Skeleton.Text
                  width={80}
                  height={12}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
}

export const CompoundListMessages: Story = {
  name: "List Layout - Message Thread",
  render: () => (
    <div className="bg-default-background w-full max-w-lg overflow-hidden rounded-lg shadow-lg">
      <div className="bg-secondary-background flex items-center gap-3 border-b px-4 py-3">
        <Skeleton.Circular
          width={40}
          height={40}
        />
        <div className="space-y-1">
          <Skeleton.Text
            width={120}
            height={16}
          />
          <Skeleton.Text
            width={80}
            height={12}
          />
        </div>
      </div>
      <div className="max-h-96 space-y-4 overflow-hidden p-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={`flex gap-3 ${i % 3 === 0 ? "flex-row-reverse" : ""}`}
          >
            <Skeleton.Circular
              width={32}
              height={32}
            />
            <div
              className={`max-w-xs space-y-2 ${i % 3 === 0 ? "items-end" : "items-start"} flex flex-col`}
            >
              <Skeleton.Rounded
                width={i % 3 === 0 ? "180px" : "220px"}
                height={Math.random() > 0.5 ? "60px" : "40px"}
              />
              <Skeleton.Text
                width={60}
                height={10}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-secondary-background border-t px-4 py-3">
        <div className="flex items-center gap-2">
          <Skeleton.Rounded
            width="100%"
            height={40}
          />
          <Skeleton.Circular
            width={40}
            height={40}
          />
        </div>
      </div>
    </div>
  ),
}

export const CompoundListFeed: Story = {
  name: "List Layout - Social Feed",
  render: () => (
    <div className="w-full max-w-md space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-default-background overflow-hidden rounded-lg shadow-lg"
        >
          {/* Post Header */}
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Skeleton.Circular
                width={40}
                height={40}
              />
              <div className="space-y-1">
                <Skeleton.Text
                  width={100}
                  height={14}
                />
                <Skeleton.Text
                  width={80}
                  height={12}
                />
              </div>
            </div>
            <Skeleton.Circular
              width={24}
              height={24}
            />
          </div>

          {/* Post Content */}
          <div className="space-y-2 px-4 pb-3">
            <Skeleton.Text
              width="95%"
              height={14}
            />
            <Skeleton.Text
              width="80%"
              height={14}
            />
            {Math.random() > 0.5 && (
              <Skeleton.Text
                width="60%"
                height={14}
              />
            )}
          </div>

          {/* Post Image (sometimes) */}
          {i % 2 === 0 && (
            <Skeleton.Rectangular
              width="100%"
              height={200}
            />
          )}

          {/* Post Actions */}
          <div className="border-t border-gray-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Skeleton.Circular
                    width={20}
                    height={20}
                  />
                  <Skeleton.Text
                    width={30}
                    height={12}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton.Circular
                    width={20}
                    height={20}
                  />
                  <Skeleton.Text
                    width={20}
                    height={12}
                  />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton.Circular
                    width={20}
                    height={20}
                  />
                  <Skeleton.Text
                    width={25}
                    height={12}
                  />
                </div>
              </div>
              <Skeleton.Circular
                width={20}
                height={20}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  ),
}

export const CompoundListNavigation: Story = {
  name: "List Layout - Navigation Menu",
  render: () => (
    <div className="bg-default-background w-64 overflow-hidden rounded-lg shadow-lg">
      <div className="bg-secondary-background border-b px-4 py-3">
        <Skeleton.Text
          width={100}
          height={16}
        />
      </div>
      <div className="py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2 ${i === 2 ? "border-r-2 border-blue-500 bg-blue-50" : ""}`}
          >
            <Skeleton.Circular
              width={20}
              height={20}
            />
            <div className="flex flex-1 items-center justify-between">
              <Skeleton.Text
                width={100}
                height={14}
              />
              {Math.random() > 0.7 && (
                <Skeleton.Circular
                  width={16}
                  height={16}
                />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-secondary-background border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <Skeleton.Circular
            width={32}
            height={32}
          />
          <div className="space-y-1">
            <Skeleton.Text
              width={80}
              height={12}
            />
            <Skeleton.Text
              width={60}
              height={10}
            />
          </div>
        </div>
      </div>
    </div>
  ),
}
