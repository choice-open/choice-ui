import type { Meta, StoryObj } from "@storybook/react"
import { tcx } from "./tcx"

const meta = {
  title: "Utils/tcx (twMerge)",
  parameters: {
    layout: "centered",
  },
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const TestComponent = ({ className }: { className: string }) => (
  <div className={className}>
    <pre className="rounded bg-gray-100 p-2 text-xs dark:bg-gray-800">{className}</pre>
  </div>
)

export const BasicMerging: Story = {
  render: () => {
    const testCases = [
      {
        title: "Simple class merging",
        input: ["text-red-500", "text-blue-500"],
        expected: "text-blue-500",
      },
      {
        title: "Padding override",
        input: ["p-4", "px-8"],
        expected: "p-4 px-8",
      },
      {
        title: "Complete padding override",
        input: ["p-4", "p-8"],
        expected: "p-8",
      },
      {
        title: "Custom typography tokens",
        input: ["text-body-small", "text-body-large"],
        expected: "text-body-large",
      },
      {
        title: "Mixed typography and color",
        input: ["text-body-medium text-red-500", "text-blue-500"],
        expected: "text-body-medium text-blue-500",
      },
      {
        title: "Complex merge with multiple utilities",
        input: ["bg-white p-4 text-sm text-gray-600", "bg-gray-100 px-6 text-lg text-gray-900"],
        expected: "bg-gray-100 p-4 px-6 text-lg text-gray-900",
      },
      {
        title: "Conditional classes with undefined",
        input: ["flex items-center", undefined, "gap-2"],
        expected: "flex items-center gap-2",
      },
      {
        title: "Boolean conditions",
        input: ["base-class", true && "active-class", false && "inactive-class"],
        expected: "base-class active-class",
      },
    ]

    return (
      <div className="min-w-[600px] space-y-6">
        <h2 className="text-heading-medium font-bold">tcx twMerge Tests</h2>
        {testCases.map((testCase, index) => {
          const result = tcx(...testCase.input)
          const isCorrect = result === testCase.expected

          return (
            <div
              key={index}
              className="border-border-neutral space-y-2 rounded-lg border p-4"
            >
              <h3 className="text-body-medium-strong">{testCase.title}</h3>
              <div className="text-body-small space-y-1">
                <div>
                  <span className="text-text-secondary">Input: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {JSON.stringify(testCase.input)}
                  </code>
                </div>
                <div>
                  <span className="text-text-secondary">Expected: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {testCase.expected}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Result: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {result}
                  </code>
                  <span className={isCorrect ? "text-xs text-green-600" : "text-xs text-red-600"}>
                    {isCorrect ? "✓ PASS" : "✗ FAIL"}
                  </span>
                </div>
              </div>
              <div className="mt-3 rounded bg-gray-50 p-3 dark:bg-gray-900">
                <div className="text-text-secondary mb-1 text-xs">Preview:</div>
                <TestComponent className={result} />
              </div>
            </div>
          )
        })}
      </div>
    )
  },
}

export const CustomTypographyTokens: Story = {
  render: () => {
    const typographyTests = [
      {
        title: "Body text sizes",
        tests: [
          ["text-body-small", "text-body-medium"],
          ["text-body-medium", "text-body-large"],
          ["text-body-small-strong", "text-body-large-strong"],
        ],
      },
      {
        title: "Heading sizes",
        tests: [
          ["text-heading-small", "text-heading-medium"],
          ["text-heading-medium", "text-heading-large"],
          ["text-heading-large", "text-heading-display"],
        ],
      },
      {
        title: "Typography doesn't conflict with colors",
        tests: [
          ["text-body-medium text-red-500", "text-blue-600"],
          ["text-heading-large text-gray-900", "text-green-500"],
        ],
      },
    ]

    return (
      <div className="min-w-[600px] space-y-8">
        <h2 className="text-heading-medium font-bold">Custom Typography Token Tests</h2>
        {typographyTests.map((group, groupIndex) => (
          <div
            key={groupIndex}
            className="space-y-4"
          >
            <h3 className="text-body-large-strong">{group.title}</h3>
            {group.tests.map((test, testIndex) => {
              const result = tcx(...test)
              return (
                <div
                  key={testIndex}
                  className="border-border-neutral rounded-lg border p-3"
                >
                  <div className="text-body-small space-y-1">
                    <div>
                      <span className="text-text-secondary">Input: </span>
                      <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                        {test.join(", ")}
                      </code>
                    </div>
                    <div>
                      <span className="text-text-secondary">Output: </span>
                      <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                        {result}
                      </code>
                    </div>
                  </div>
                  <div className="mt-2 rounded bg-gray-50 p-2 dark:bg-gray-900">
                    <div className={result}>Sample Text</div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  },
}

export const InteractivePlayground: Story = {
  render: () => {
    const examples = [
      "p-4 p-8",
      "bg-red-500 bg-blue-500",
      "text-sm text-lg font-bold",
      "flex flex-col items-center justify-center",
      "text-body-small text-body-large text-red-500",
      "rounded-lg rounded-xl border border-2",
      "w-full max-w-md min-w-0",
      "hover:bg-gray-100 hover:bg-gray-200",
    ]

    return (
      <div className="min-w-[600px] space-y-6">
        <h2 className="text-heading-medium font-bold">Interactive Playground</h2>
        <div className="border-border-neutral rounded-lg border p-4">
          <p className="text-body-small text-text-secondary mb-4">
            Click on examples to see how tcx merges Tailwind classes
          </p>
          <div className="grid gap-3">
            {examples.map((example, index) => {
              const classes = example.split(" ")
              const firstHalf = classes.slice(0, Math.ceil(classes.length / 2))
              const secondHalf = classes.slice(Math.ceil(classes.length / 2))
              const result = tcx(firstHalf.join(" "), secondHalf.join(" "))

              return (
                <div
                  key={index}
                  className="space-y-2 rounded-lg bg-gray-50 p-3 dark:bg-gray-900"
                >
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded bg-blue-100 px-2 py-1 dark:bg-blue-900">
                      {firstHalf.join(" ")}
                    </span>
                    <span className="text-text-secondary">+</span>
                    <span className="rounded bg-green-100 px-2 py-1 dark:bg-green-900">
                      {secondHalf.join(" ")}
                    </span>
                    <span className="text-text-secondary">=</span>
                    <span className="rounded bg-purple-100 px-2 py-1 font-medium dark:bg-purple-900">
                      {result}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  },
}

export const EdgeCases: Story = {
  render: () => {
    const edgeCases = [
      {
        title: "Empty strings and falsy values",
        input: ["", null, undefined, false, "flex", 0],
        expected: "flex",
      },
      {
        title: "Duplicate classes",
        input: ["flex flex flex", "items-center items-center"],
        expected: "flex items-center",
      },
      {
        title: "Arbitrary values",
        input: ["p-[10px]", "p-[20px]"],
        expected: "p-[20px]",
      },
      {
        title: "Important modifier",
        input: ["!text-red-500", "text-blue-500"],
        expected: "!text-red-500 text-blue-500",
      },
      {
        title: "Responsive prefixes",
        input: ["sm:p-4 md:p-6", "lg:p-8"],
        expected: "sm:p-4 md:p-6 lg:p-8",
      },
      {
        title: "Dark mode prefixes",
        input: ["dark:bg-gray-800", "dark:bg-gray-900"],
        expected: "dark:bg-gray-900",
      },
    ]

    return (
      <div className="min-w-[600px] space-y-6">
        <h2 className="text-heading-medium font-bold">Edge Cases</h2>
        {edgeCases.map((testCase, index) => {
          const result = tcx(...testCase.input)
          const isCorrect = result === testCase.expected

          return (
            <div
              key={index}
              className="border-border-neutral rounded-lg border p-4"
            >
              <h3 className="text-body-medium-strong mb-2">{testCase.title}</h3>
              <div className="text-body-small space-y-1">
                <div>
                  <span className="text-text-secondary">Input: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {JSON.stringify(testCase.input)}
                  </code>
                </div>
                <div>
                  <span className="text-text-secondary">Expected: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {testCase.expected}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Result: </span>
                  <code className="rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-800">
                    {result}
                  </code>
                  <span className={isCorrect ? "text-xs text-green-600" : "text-xs text-red-600"}>
                    {isCorrect ? "✓ PASS" : "✗ FAIL"}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  },
}
