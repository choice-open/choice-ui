import { AddTiny, DeleteTiny } from "@choiceform/icons-react"
import { memo, useId } from "react"
import {
  Checkbox,
  ChipsInput,
  ContextInput,
  Description,
  ErrorMessage,
  IconButton,
  Input,
  Label,
  MdInput,
  NumericInput,
  OtpInput,
  RadioGroup,
  Range,
  SearchInput,
  Switch,
  Textarea,
  TextField,
  useForm,
} from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const FormsCollection = memo(function FormsCollection() {
  const form = useForm({
    defaultValues: {
      username: "",
      email: "",
    },
  })

  const uuid = useId()

  return (
    <CollectionSection
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
          <ErrorMessage id="error-message">Please enter a valid email address.</ErrorMessage>
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
          <TextField.Description>We&apos;ll never share with anyone else.</TextField.Description>
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
    </CollectionSection>
  )
})
