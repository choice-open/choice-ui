import {
  CodeBlock,
  NumericInput as NI,
  useForm,
} from "@choiceform/design-system";
import { FillWidth } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react";
import { useId, useState } from "react";

const meta: Meta = {
  title: "Forms/Form/Adapters",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj;

/**
 * When is validation performed?
 * It's up to you! The <Field /> component accepts some callbacks as props such as onChange or onBlur.
 * Those callbacks are passed the current value of the field, as well as the fieldAPI object, so that you can perform the validation.
 * If you find a validation error, simply return the error message as string and it will be available in field.state.meta.errors.
 */
export const Input: Story = {
  render: function BasicRender() {
    const uuid = useId();
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name={`username-${uuid}`}
            validators={{
              onChange: ({ value }) => {
                if ((value as string).length < 3) {
                  return "Username must be at least 3 characters";
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                name={field.name}
                label={<div className="text-red-500">onChange validation</div>}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Field
            name={`email-${uuid}`}
            validators={{
              onBlur: ({ value }) => {
                if ((value as string).length < 3) {
                  return "Email must be at least 3 characters";
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
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Textarea adapter
 */
export const Textarea: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        message: "",
        bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="message"
            validators={{
              onChange: ({ value }) => {
                if ((value as string).length > 100) {
                  return "Message must be less than 100 characters";
                }
              },
            }}
          >
            {(field) => (
              <form.Textarea
                name={field.name}
                label="Textarea"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter message"
                minRows={4}
                maxRows={8}
                description={`${(field.state.value as string).length}/100 characters`}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Field
            name="bio"
            validators={{
              onChange: ({ value }) => {
                if ((value as string).length > 200) {
                  return "Message must be less than 100 characters";
                }
              },
            }}
          >
            {(field) => (
              <form.Textarea
                name={field.name}
                label="Bio"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter bio"
                rows={4}
                maxRows={8}
                minRows={4}
                resize="handle"
                description={`${(field.state.value as string).length}/200 characters`}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Select adapter
 */
export const Select: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        role: "admin",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => {
                if (value !== "admin") {
                  return "Role must be admin";
                }
              },
            }}
          >
            {(field) => (
              <form.Select
                name={field.name}
                label="Select"
                matchTriggerWidth
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Select role"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                ]}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * MultiSelect adapter
 */
export const MultiSelect: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        roles: ["admin", "user"],
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="roles"
            validators={{
              onChange: ({ value }) => {
                if ((value as string[]).length < 1) {
                  return "You must select at least one role";
                }
              },
            }}
          >
            {(field) => (
              <form.MultiSelect
                name={field.name}
                label="MultiSelect"
                matchTriggerWidth
                value={field.state.value as string[]}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Select roles"
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                  { divider: true },
                  { label: "Manager", value: "manager" },
                  { label: "Viewer", value: "viewer" },
                ]}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Checkbox adapter
 */
export const Checkbox: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        isAdmin: true,
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="isAdmin"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "You must be an admin";
                }
              },
            }}
          >
            {(field) => (
              <form.Checkbox
                name={field.name}
                label="Admin"
                value={field.state.value as boolean}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * RadioGroup adapter
 */
export const RadioGroup: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        role: "admin",
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => {
                if (value !== "admin") {
                  return "Role must be admin";
                }
              },
            }}
          >
            {(field) => (
              <form.RadioGroup
                name={field.name}
                label="Role"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                options={[
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                ]}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Switch adapter
 */
export const Switch: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        isAdmin: true,
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="isAdmin"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return "You must be an admin";
                }
              },
            }}
          >
            {(field) => (
              <form.Switch
                name={field.name}
                label="Admin"
                value={field.state.value as boolean}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Range adapter
 */
export const Range: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        age: 18,
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) => {
                if ((value as number) < 18) {
                  return "You must be at least 18 years old";
                }
              },
            }}
          >
            {(field) => (
              <form.Range
                label="Age"
                value={field.state.value as number}
                min={0}
                max={100}
                step={1}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * NumericInput adapter
 */
export const NumericInput: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        age: 18,
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) => {
                if ((value as number) < 18) {
                  return "You must be at least 18 years old";
                } else if ((value as number) > 60) {
                  return "You must be less than 60 years old";
                }
              },
            }}
          >
            {(field) => (
              <form.NumericInput
                name={field.name}
                label="Age"
                value={field.state.value as number}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter age"
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              >
                <NI.Prefix>
                  <FillWidth />
                </NI.Prefix>
              </form.NumericInput>
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};

/**
 * Segmented adapter
 */
export const Segmented: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        role: "admin" as const,
      },
      onSubmit: async ({ value }) => {
        setResult(JSON.stringify(value, null, 2));
      },
    });

    return (
      <>
        <form
          className="w-80 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="role"
            validators={{
              onChange: ({ value }) => {
                if (value !== "admin") {
                  return "Role must be admin";
                }
              },
            }}
          >
            {(field) => (
              <form.Segmented
                name={field.name}
                label="Segmented"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                options={[
                  { content: "Admin", value: "admin" },
                  { content: "User", value: "user" },
                  { content: "Guest", value: "guest" },
                ]}
                error={
                  <em role="alert">{field.state.meta.errors.join(", ")}</em>
                }
              />
            )}
          </form.Field>

          <form.Button type="submit">Submit Form</form.Button>
        </form>

        <div className="bg-secondary-background mt-4 w-80 rounded-xl p-4">
          <strong>Form Result:</strong>
          <CodeBlock language="json">
            <CodeBlock.Content code={result} />
          </CodeBlock>
        </div>
      </>
    );
  },
};
