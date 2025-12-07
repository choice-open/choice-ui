import type { CustomElement, CustomText } from "@choiceform/design-system";
import {
  Button,
  CodeBlock,
  MdRender,
  RichInput,
  slateToMarkdown,
} from "@choiceform/design-system";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Descendant } from "slate";

// Basic rich text editor with formatting capabilities
export default {
  component: RichInput,
  title: "Forms/RichInput",
  tags: ["autodocs", "new"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    isEditing: {
      control: "boolean",
      description: "Whether the editor is in editing mode",
    },
    enterFormatting: {
      control: "boolean",
      description: "Enable formatting toolbar",
    },
    readOnly: {
      control: "boolean",
      description: "Make the editor read-only",
    },
    i18n: {
      control: "object",
      description: "Internationalization configuration for UI text",
    },
  },
} as Meta<typeof RichInput>;

const Template = () => {
  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "A line of text in a paragraph." }],
    } as CustomElement,
  ];
  const [value, setValue] = useState<Descendant[]>(initialValue);
  return (
    <RichInput
      value={value}
      onChange={setValue}
      enterFormatting={true}
      minHeight={120}
      className="max-h-96 w-96 border"
    />
  );
};

export const Standard: StoryObj<typeof RichInput> = {
  args: {},
  render: () => Template(),
};

/**
 * MinHeight example showing custom minimum height with ScrollArea integration
 */
export const MinHeight: StoryObj<typeof RichInput> = {
  render: function MinHeightTemplate() {
    const initialValue: Descendant[] = [
      {
        type: "paragraph",
        children: [
          {
            text: "This editor has a minimum height of 200px and uses ScrollArea for scrolling.",
          },
        ],
      } as CustomElement,
    ];
    const [value, setValue] = useState<Descendant[]>(initialValue);
    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        minHeight={200}
        className="max-h-96 w-80 border"
      />
    );
  },
};

/**
 * Internationalization example with Chinese text
 */
export const WithI18n: StoryObj<typeof RichInput> = {
  render: function I18nTemplate() {
    const initialValue: Descendant[] = [
      {
        type: "paragraph",
        children: [
          {
            text: "This editor demonstrates i18n support. Try adding a link to see localized text.",
          },
        ],
      } as CustomElement,
    ];
    const [value, setValue] = useState<Descendant[]>(initialValue);

    // Custom Chinese i18n configuration
    const chineseI18n = {
      url: {
        placeholder: "请输入链接地址",
        doneButton: "完成",
      },
    };

    return (
      <RichInput
        value={value}
        onChange={setValue}
        enterFormatting={true}
        i18n={chineseI18n}
        minHeight={200}
        className="max-h-96 w-80 border"
      />
    );
  },
};

/**
 * ControlledValue: Rich input with external value control.
 * - Demonstrates controlled value state management with Slate.js content
 * - External buttons can modify input content with rich text formatting
 * - Shows programmatic content insertion with bold, italic, and links
 * - Auto-focuses editor when value changes externally (when autoFocus is enabled)
 * - Cursor always moves to end position after value changes
 * - Useful for form integration and external state management
 *
 * ```tsx
 * const [value, setValue] = useState<Descendant[]>([...])
 *
 * <RichInput
 *   value={value}
 *   autoFocus
 *   onChange={setValue}
 *   enterFormatting={true}
 * />
 *
 * <Button onClick={() => setValue([{ type: "paragraph", children: [{ text: "New content!" }] }])}>
 *   Set Content
 * </Button>
 * ```
 */
export const ControlledValue: StoryObj<typeof RichInput> = {
  render: function ControlledValue() {
    const [value, setValue] = useState<Descendant[]>([
      { type: "paragraph", children: [{ text: "" }] } as CustomElement,
    ]);

    const presetValues = [
      {
        label: "Empty",
        value: [
          {
            type: "paragraph",
            children: [{ text: "" } as CustomText],
          } as CustomElement,
        ],
      },
      {
        label: "Simple Text",
        value: [
          {
            type: "paragraph",
            children: [
              {
                text: "Hello, this is a simple rich text message!",
              } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Bold Text",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "This text contains " } as CustomText,
              { text: "bold formatting", bold: true } as CustomText,
              { text: " for emphasis." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Multiple Formats",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "Rich text with " } as CustomText,
              { text: "bold", bold: true } as CustomText,
              { text: ", " } as CustomText,
              { text: "italic", italic: true } as CustomText,
              { text: ", and " } as CustomText,
              { text: "underlined", underlined: true } as CustomText,
              { text: " formatting." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "With Link",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "Check out this " } as CustomText,
              {
                text: "example link",
                link: "https://example.com",
              } as CustomText,
              { text: " in the text." } as CustomText,
            ],
          } as CustomElement,
        ],
      },
      {
        label: "Multi-paragraph",
        value: [
          {
            type: "paragraph",
            children: [
              { text: "First paragraph with some content." } as CustomText,
            ],
          } as CustomElement,
          {
            type: "paragraph",
            children: [
              { text: "Second paragraph with " } as CustomText,
              { text: "bold", bold: true } as CustomText,
              { text: " and " } as CustomText,
              { text: "italic", italic: true } as CustomText,
              { text: " text." } as CustomText,
            ],
          } as CustomElement,
          {
            type: "paragraph",
            children: [{ text: "Third paragraph to finish." } as CustomText],
          } as CustomElement,
        ],
      },
    ];

    const appendText = (
      text: string,
      formatting?: Record<string, boolean | string>
    ) => {
      setValue((prev) => {
        const lastNode = prev[prev.length - 1] as CustomElement;
        if (lastNode && lastNode.type === "paragraph") {
          const currentText = lastNode.children
            ?.map((child) => (child as CustomText).text || "")
            .join("");

          return [
            ...prev.slice(0, -1),
            {
              ...lastNode,
              children: [
                ...(lastNode.children || []),
                {
                  text: currentText ? ` ${text}` : text,
                  ...formatting,
                } as CustomText,
              ],
            } as CustomElement,
          ];
        }
        return [
          ...prev,
          {
            type: "paragraph",
            children: [{ text, ...formatting } as CustomText],
          } as CustomElement,
        ];
      });
    };

    const getWordCount = (value: Descendant[]) => {
      const text = value
        .map(
          (node) =>
            (node as CustomElement).children
              ?.map((child) => (child as CustomText).text || "")
              .join("") || ""
        )
        .join(" ")
        .trim();
      return text ? text.split(/\s+/).length : 0;
    };

    const getCharacterCount = (value: Descendant[]) => {
      return value
        .map(
          (node) =>
            (node as CustomElement).children
              ?.map((child) => (child as CustomText).text || "")
              .join("") || ""
        )
        .join("").length;
    };

    const getFormattingCount = (value: Descendant[]) => {
      let count = 0;
      value.forEach((node) => {
        const element = node as CustomElement;
        if (element.children) {
          element.children.forEach((child) => {
            const text = child as CustomText;
            if (
              text.bold ||
              text.italic ||
              text.underline ||
              text.strikethrough
            ) {
              count++;
            }
          });
        }
      });
      return count;
    };

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-strong">Value Control Buttons</h4>
          <div className="flex flex-wrap gap-2">
            {presetValues.map((preset) => (
              <Button
                key={preset.label}
                variant="secondary"
                size="default"
                onClick={() => setValue(preset.value as Descendant[])}
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
              onClick={() => appendText("Bold text", { bold: true })}
            >
              Add Bold
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() => appendText("Italic text", { italic: true })}
            >
              Add Italic
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                appendText("Link text", { link: "https://example.com" })
              }
            >
              Add Link
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [{ text: faker.lorem.sentence() } as CustomText],
                  } as CustomElement,
                ])
              }
            >
              Random Text
            </Button>
          </div>
        </div>

        <RichInput
          value={value}
          autoFocus
          autoMoveToEnd
          placeholder="Content is controlled externally..."
          className="max-h-96 w-80 rounded-lg border"
          enterFormatting={true}
          minHeight={120}
          onChange={setValue}
        />

        <div className="bg-secondary-background rounded-xl p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-strong">Statistics</span>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [{ text: "" } as CustomText],
                  } as CustomElement,
                ])
              }
            >
              Clear All
            </Button>
          </div>
          <div className="text-body-small flex items-center gap-4">
            <span className="text-secondary-foreground">
              Characters: {getCharacterCount(value)}
            </span>
            <span className="text-secondary-foreground">
              Words: {getWordCount(value)}
            </span>
            <span className="text-secondary-foreground">
              Formatted: {getFormattingCount(value)}
            </span>
          </div>
        </div>

        <CodeBlock language="tsx">
          <CodeBlock.Content code={JSON.stringify(value, null, 2)} />
        </CodeBlock>

        <div className="bg-secondary-background rounded-xl p-4">
          <p className="font-strong mb-2">Controlled Value Features:</p>
          <ul className="text-secondary-foreground text-body-small space-y-1">
            <li>• External buttons control rich text content</li>
            <li>• Programmatic formatting insertion (bold, italic, links)</li>
            <li>• Real-time character, word, and formatting counts</li>
            <li>• Preset rich text content examples</li>
            <li>• Full bidirectional data binding with Slate.js</li>
            <li>
              • <strong>Auto-focus:</strong> Editor auto-focuses when autoFocus
              is enabled
            </li>
            <li>
              • <strong>Cursor positioning:</strong> Always moves to end after
              value changes
            </li>
            <li>• Support for multi-paragraph content structures</li>
          </ul>
        </div>
      </div>
    );
  },
};

/**
 * CompositeUsage: Demonstrates the new composite component API.
 * - Shows the flexible RichInput.Viewport and RichInput.Editable structure
 * - Allows for custom layouts and styling of individual parts
 * - Maintains full functionality while providing greater control
 * - Backwards compatible with the simple usage pattern
 *
 * ```tsx
 * <RichInput value={value} onChange={setValue}>
 *   <RichInput.Viewport>
 *     <RichInput.Editable />
 *   </RichInput.Viewport>
 * </RichInput>
 * ```
 */
export const CompositeUsage: StoryObj<typeof RichInput> = {
  render: function CompositeUsage() {
    const [value, setValue] = useState<Descendant[]>([
      {
        type: "paragraph",
        children: [
          {
            text: "This demonstrates the new composite API structure!",
          } as CustomText,
        ],
      } as CustomElement,
    ]);

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h4 className="font-strong">Composite Component Usage</h4>
          <p className="text-secondary-foreground text-body-small">
            This example uses the new RichInput.Viewport and RichInput.Editable
            structure
          </p>
        </div>

        <RichInput
          value={value}
          onChange={setValue}
          enterFormatting={true}
          minHeight={120}
          autoFocus
          className="rounded-lg border"
        >
          <RichInput.Viewport className="custom-viewport">
            <RichInput.Editable className="custom-editable" />
          </RichInput.Viewport>
        </RichInput>

        <div className="space-y-2">
          <h4 className="font-strong">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [
                      { text: "Welcome to the " } as CustomText,
                      { text: "new composite API", bold: true } as CustomText,
                      { text: "!" } as CustomText,
                    ],
                  } as CustomElement,
                ])
              }
            >
              Set Welcome Text
            </Button>
            <Button
              variant="secondary"
              size="default"
              onClick={() =>
                setValue([
                  {
                    type: "paragraph",
                    children: [{ text: "" } as CustomText],
                  } as CustomElement,
                ])
              }
            >
              Clear
            </Button>
          </div>
        </div>

        <div className="bg-secondary-background rounded-xl p-4">
          <p className="font-strong mb-2">New Composite API Benefits:</p>
          <ul className="text-secondary-foreground text-body-small space-y-1">
            <li>• Greater flexibility in component composition</li>
            <li>• Custom styling of Viewport and Editable separately</li>
            <li>• Maintains full rich text editing capabilities</li>
            <li>• Backwards compatible with simple usage</li>
            <li>• Context-based state management</li>
            <li>• Easier to integrate with custom layouts</li>
          </ul>
        </div>
      </div>
    );
  },
};

// Story demonstrating keyboard shortcuts
export const KeyboardShortcuts: StoryObj<typeof RichInput> = {
  args: {
    enterFormatting: true,
    placeholder: "Try keyboard shortcuts here...",
    value: [
      {
        type: "h1",
        children: [{ text: "Keyboard Shortcuts Demo" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "h2",
        children: [{ text: "Available Shortcuts:" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "h3",
        children: [{ text: "Text Formatting" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " } as CustomText,
          { text: "Bold", bold: true } as CustomText,
          { text: ": ⌘/Ctrl + B" } as CustomText,
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " } as CustomText,
          { text: "Italic", italic: true } as CustomText,
          { text: ": ⌘/Ctrl + I" } as CustomText,
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " } as CustomText,
          { text: "Underline", underlined: true } as CustomText,
          { text: ": ⌘/Ctrl + U" } as CustomText,
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "• " } as CustomText,
          { text: "Strikethrough", strikethrough: true } as CustomText,
          { text: ": ⌘/Ctrl + Shift + S" } as CustomText,
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "" } as CustomText],
      } as CustomElement,
      {
        type: "h3",
        children: [{ text: "Block Formatting" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• Code Block: ⌘/Ctrl + /" } as CustomText],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• Heading 1-6: ⌘/Ctrl + 1-6" } as CustomText],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "• Block Quote: ⌘/Ctrl + Shift + >" } as CustomText],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "" } as CustomText],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          {
            text: "Try selecting text and using the shortcuts above!",
          } as CustomText,
        ],
      } as CustomElement,
    ],
  },
  render: function KeyboardShortcutsStory(args) {
    const [value, setValue] = useState<Descendant[]>(args.value);

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h3 className="text-body-large font-strong">
            Rich Input with Keyboard Shortcuts
          </h3>
          <p className="text-secondary-foreground">
            Focus the editor below and try the keyboard shortcuts
          </p>
        </div>

        <RichInput
          {...args}
          value={value}
          onChange={setValue}
          className="min-h-96"
        />

        <div className="bg-secondary-background rounded-lg border p-3">
          <p className="text-secondary-foreground text-body-small">
            <strong>Tip:</strong> Press ESC to close the paragraph menu if
            it&apos;s open
          </p>
        </div>
      </div>
    );
  },
};

// Story demonstrating Markdown export functionality
export const MarkdownExport: StoryObj<typeof RichInput> = {
  args: {
    enterFormatting: true,
    placeholder: "Type something and see the markdown output...",
    value: [
      {
        type: "h1",
        children: [{ text: "Markdown Export Demo" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "This story demonstrates the " } as CustomText,
          { text: "Slate to Markdown", bold: true } as CustomText,
          { text: " conversion functionality." } as CustomText,
        ],
      } as unknown as CustomElement,
      {
        type: "h2",
        children: [{ text: "Features" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "bulleted_list",
        children: [
          {
            type: "list_item",
            children: [
              { text: "Convert " } as CustomText,
              { text: "bold", bold: true } as CustomText,
              { text: ", " } as CustomText,
              { text: "italic", italic: true } as CustomText,
              { text: ", and " } as CustomText,
              { text: "underlined", underlined: true } as CustomText,
              { text: " text" } as CustomText,
            ],
          } as unknown as CustomElement,
          {
            type: "list_item",
            children: [
              { text: "Support for " } as CustomText,
              { text: "code blocks", code: true } as CustomText,
              { text: " and " } as CustomText,
              { text: "strikethrough", strikethrough: true } as CustomText,
            ],
          } as unknown as CustomElement,
          {
            type: "list_item",
            children: [
              { text: "Handle " } as CustomText,
              { text: "links", link: "https://example.com" } as CustomText,
              { text: " properly" } as CustomText,
            ],
          } as unknown as CustomElement,
        ],
      } as unknown as CustomElement,
      {
        type: "h3",
        children: [{ text: "Code Example" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "code",
        children: [
          {
            text: "const markdown = slateToMarkdown(value);\nconsole.log(markdown);",
          } as unknown as CustomText,
        ],
      } as unknown as CustomElement,
      {
        type: "block_quote",
        children: [
          {
            type: "paragraph",
            children: [{ text: "This is a blockquote example" } as CustomText],
          } as unknown as CustomElement,
        ],
      } as unknown as CustomElement,
      {
        type: "h3",
        children: [{ text: "Task List" } as CustomText],
      } as unknown as CustomElement,
      {
        type: "check_list",
        children: [
          {
            type: "check_item",
            checked: true,
            children: [{ text: "Completed task" } as CustomText],
          } as unknown as CustomElement,
          {
            type: "check_item",
            checked: false,
            children: [{ text: "Pending task" } as CustomText],
          } as unknown as CustomElement,
        ],
      } as unknown as CustomElement,
    ],
  },
  render: function MarkdownExportStory(args) {
    const [value, setValue] = useState<Descendant[]>(args.value);
    const [showMarkdown, setShowMarkdown] = useState(false);

    const markdown = slateToMarkdown(value);

    return (
      <div className="w-[800px] space-y-4">
        <div className="space-y-2">
          <h3 className="text-body-large font-strong">
            Rich Input with Markdown Export
          </h3>
          <p className="text-secondary-foreground">
            Edit the content and toggle to see the markdown output
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={showMarkdown ? "secondary" : "primary"}
            size="default"
            onClick={() => setShowMarkdown(false)}
          >
            Editor
          </Button>
          <Button
            variant={showMarkdown ? "primary" : "secondary"}
            size="default"
            onClick={() => setShowMarkdown(true)}
          >
            Markdown Output
          </Button>
        </div>

        {!showMarkdown ? (
          <RichInput
            {...args}
            value={value}
            onChange={setValue}
            className="min-h-[400px] rounded-lg border"
          />
        ) : (
          <div className="space-y-4">
            <div className="bg-secondary-background rounded-lg border p-4">
              <h4 className="text-body-medium font-strong mb-2">
                Markdown Output:
              </h4>
              <MdRender content={markdown} />
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="text-body-medium font-strong mb-2">
                Raw Markdown Text:
              </h4>
              <pre className="text-body-small bg-tertiary-background rounded p-3 font-mono whitespace-pre-wrap">
                {markdown}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-info-background border-info-border rounded-lg border p-3">
          <p className="text-info-foreground text-body-small">
            <strong>Usage:</strong> Import {"`slateToMarkdown`"} from{" "}
            {"`./utils`"} and pass your Slate value to convert it to Markdown
            format.
          </p>
        </div>
      </div>
    );
  },
};
