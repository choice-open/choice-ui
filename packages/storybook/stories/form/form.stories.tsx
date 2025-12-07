import {
  Badge,
  Button,
  CodeBlock,
  IconButton,
  Label,
  LinkButton,
  Tabs,
  tcx,
  useForm,
} from "@choiceform/design-system";
import { TrashSmall } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react";
import type { AnyFieldApi } from "@tanstack/react-form";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { ReactNode, useEffect, useState } from "react";
import { z } from "zod";

const meta: Meta = {
  title: "Forms/Form/Examples",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj;

/**
 * Basic form example with Input and Select fields using TanStack Form
 */
export const Basic: Story = {
  render: function BasicRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
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
          <form.Field name="username">
            {(field) => (
              <form.Input
                name={field.name}
                label="Username"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                name={field.name}
                label="Email"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
              />
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <form.Select
                name={field.name}
                label="Role"
                value={field.state.value as string}
                onChange={field.handleChange}
                options={[
                  { label: "Select Role" },
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                  { divider: true },
                  { label: "Other", value: "other" },
                ]}
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
 * Form example with description
 * 1. description is a string
 * 2. description is a ReactNode
 */
export const WithDescription: Story = {
  render: function WithDescriptionRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
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
          <form.Field name="username">
            {(field) => (
              <form.Input
                name={field.name}
                label="Username"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
                description="Username is required"
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                name={field.name}
                label="Email"
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                description={
                  <>
                    <span>Email is required</span>{" "}
                    <LinkButton className="float-right">Learn more</LinkButton>
                  </>
                }
              />
            )}
          </form.Field>

          <form.Field name="role">
            {(field) => (
              <form.Select
                name={field.name}
                label="Role"
                value={field.state.value as string}
                onChange={field.handleChange}
                options={[
                  { label: "Select Role" },
                  { label: "Admin", value: "admin" },
                  { label: "User", value: "user" },
                  { label: "Guest", value: "guest" },
                  { divider: true },
                  { label: "Other", value: "other" },
                ]}
                description="Role is required"
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
 * Form with validation rules and error handling
 */
export const WithValidation: Story = {
  render: function WithValidationRender() {
    const [result, setResult] = useState<string>("");

    const form = useForm({
      defaultValues: {
        password: "",
        confirmPassword: "",
        age: "",
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
            name="password"
            validators={{
              onChange: ({ value }) => {
                if ((value as string).length < 6) {
                  return "Password must be at least 6 characters";
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Password"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="password"
                placeholder="Enter password"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Field
            name="confirmPassword"
            validators={{
              onChange: ({ value }) => {
                if (value !== form.state.values.password) {
                  return "Passwords do not match";
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Confirm Password"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="password"
                placeholder="Confirm password"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Field
            name="age"
            validators={{
              onChange: ({ value }) => {
                const age = parseInt(value as string);
                if (isNaN(age) || age < 1) {
                  return "Please enter a valid age";
                }
                if (age < 18 || age > 80) {
                  return "Must be 18 or older and less than 80";
                }
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Age"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="number"
                placeholder="Enter age"
                error={field.state.meta.errors.join(", ")}
              />
            )}
          </form.Field>

          <form.Button type="submit">Create Account</form.Button>
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
 * Form with Zod schema validation
 */
export const WithSchemaValidation: Story = {
  render: function WithSchemaValidationRender() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    // Define constraint constants
    const NAME_MIN_LENGTH = 2;
    const AGE_MIN_VALUE = 18;
    const AGE_MAX_VALUE = 100;
    const BIO_MAX_LENGTH = 200;

    // Define Zod schema
    const userSchema = z.object({
      name: z
        .string()
        .min(
          NAME_MIN_LENGTH,
          `Name must be at least ${NAME_MIN_LENGTH} characters`
        )
        .refine((value) => value.length > 0, "Name is required"),
      email: z.email("Please enter a valid email address"),
      age: z
        .number()
        .min(AGE_MIN_VALUE, `Must be at least ${AGE_MIN_VALUE} years old`)
        .max(AGE_MAX_VALUE, `Age must be less than ${AGE_MAX_VALUE}`),
      website: z
        .url("Please enter a valid website")
        .optional()
        .or(z.literal("")),
      bio: z
        .string()
        .max(
          BIO_MAX_LENGTH,
          `Bio must be less than ${BIO_MAX_LENGTH} characters`
        )
        .optional(),
    });

    const form = useForm({
      defaultValues: {
        name: "",
        email: "",
        age: 18,
        website: "",
        bio: "",
      },
      validators: {
        // Use Zod schema for overall validation
        onChange: userSchema,
        onBlur: userSchema,
      },
      onSubmit: async ({ value }) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
          // Here you can call API to submit data
          await new Promise((resolve) => setTimeout(resolve, 1000));
          setSubmitResult("Form submitted successfully!");
          console.log("Submitted data:", value);
        } catch (error) {
          setSubmitResult("Form submission failed, please try again");
        } finally {
          setIsSubmitting(false);
        }
      },
    });

    return (
      <div className="w-80">
        <h3 className="text-body-large-strong">Schema Validation</h3>
        <p className="text-secondary-foreground mt-2">
          Use Zod Schema to validate the form, support complex validation rules
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="mt-4 space-y-4"
        >
          <form.Field name="name">
            {(field) => (
              <form.Input
                label="Name"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter name"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="email">
            {(field) => (
              <form.Input
                label="Email"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="age">
            {(field) => (
              <form.Input
                label="Age"
                name={field.name}
                value={String(field.state.value)}
                onChange={(value) => field.handleChange(parseInt(value) || 0)}
                onBlur={field.handleBlur}
                type="number"
                placeholder="Enter age"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="website">
            {(field) => (
              <form.Input
                label="Website"
                name={field.name}
                value={field.state.value as string}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="url"
                placeholder="https://example.com"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field name="bio">
            {(field) => (
              <>
                <form.Textarea
                  label="Bio"
                  name={field.name}
                  value={field.state.value as string}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter bio"
                  error={formatErrors(field.state.meta.errors).join(", ")}
                  description={`${(field.state.value as string).length}/${BIO_MAX_LENGTH} characters`}
                />
              </>
            )}
          </form.Field>

          <form.Button
            type="submit"
            disabled={isSubmitting || !form.state.canSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </form.Button>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "mt-4 rounded-xl p-4",
              submitResult.includes("success")
                ? "bg-success-background text-success-foreground"
                : "bg-danger-background text-danger-foreground"
            )}
          >
            {submitResult}
          </div>
        )}

        <div className="bg-secondary-background mt-4 grid grid-cols-[auto_1fr] place-items-start gap-2 rounded-xl p-4">
          <div className="font-strong col-span-2">Form state:</div>
          <span>Can submit:</span>{" "}
          <Badge>{form.state.canSubmit ? "Yes" : "No"}</Badge>
          <span>Is dirty:</span>{" "}
          <Badge>{form.state.isDirty ? "Yes" : "No"}</Badge>
          <span>Validating:</span>{" "}
          <Badge>{form.state.isValidating ? "Yes" : "No"}</Badge>
          <span>Submitting:</span>{" "}
          <Badge>{form.state.isSubmitting ? "Yes" : "No"}</Badge>
          <span>Valid:</span> <Badge>{form.state.isValid ? "Yes" : "No"}</Badge>
        </div>
      </div>
    );
  },
};

// FieldInfo component for displaying field validation information
function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? <em>Validating...</em> : null}
    </>
  );
}

/**
 * Form with TanStack Query integration
 */
export const QueryIntegration: Story = {
  decorators: [
    (Story) => {
      const queryClient = new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      });
      return (
        <QueryClientProvider client={queryClient}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
  render: function QueryIntegrationRender() {
    // Mock database class
    class MockUserDB {
      private data: { email: string; firstName: string; lastName: string };

      constructor() {
        this.data = {
          firstName: "Wester",
          lastName: "Xi",
          email: "wester@gmail.com",
        };
      }

      async getData(): Promise<{
        email: string;
        firstName: string;
        lastName: string;
      }> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return { ...this.data };
      }

      async saveUser(value: {
        email: string;
        firstName: string;
        lastName: string;
      }): Promise<{ email: string; firstName: string; lastName: string }> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate server validation error
        if (value.firstName.includes("error")) {
          throw new Error("Server error: name cannot contain 'error'");
        }

        this.data = value;
        return value;
      }
    }

    // Mock database instance
    const mockDB = new MockUserDB();

    const [submitResult, setSubmitResult] = useState<string | null>(null);

    // Use TanStack Query to fetch data
    const {
      data: userData,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ["userData"],
      queryFn: async () => {
        const result = await mockDB.getData();
        return result;
      },
      staleTime: 5000, // Data is considered fresh within 5 seconds
    });

    // Use TanStack Query mutation for data updates
    const saveUserMutation = useMutation({
      mutationFn: async (value: {
        email: string;
        firstName: string;
        lastName: string;
      }) => {
        return await mockDB.saveUser(value);
      },
      onSuccess: (data) => {
        setSubmitResult(
          `User information saved successfully! Name: ${data.firstName} ${data.lastName}`
        );
      },
      onError: (error: Error) => {
        setSubmitResult(`Save failed: ${error.message}`);
      },
    });

    const form = useForm({
      defaultValues: {
        firstName: userData?.firstName ?? "",
        lastName: userData?.lastName ?? "",
        email: userData?.email ?? "",
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);

        try {
          // Use mutation to save data
          await saveUserMutation.mutateAsync(
            value as { email: string; firstName: string; lastName: string }
          );

          // Refetch data to ensure synchronization
          await refetch();

          // Reset form
          form.reset();
        } catch (error) {
          // Error is already handled in mutation's onError
          console.error("Form submission error:", error);
        }
      },
    });

    // When data is loaded, update form default values
    useEffect(() => {
      if (userData) {
        form.setFieldValue("firstName", userData.firstName);
        form.setFieldValue("lastName", userData.lastName);
        form.setFieldValue("email", userData.email);
      }
    }, [userData, form]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-default-foreground text-body-large">
            Loading user data...
          </div>
        </div>
      );
    }

    return (
      <div className="w-80 space-y-4">
        <div>
          <h3 className="text-body-large-strong">
            TanStack Query Integration Example
          </h3>
          <p className="text-secondary-foreground">
            Demonstrate the integration of the form with TanStack Query,
            supporting data acquisition, update, and re-validation
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <form.Field
            name="firstName"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                return !stringValue
                  ? "Name cannot be empty"
                  : stringValue.length < 2
                    ? "Name must be at least 2 characters"
                    : undefined;
              },
              onChangeAsyncDebounceMs: 500,
              onChangeAsync: async ({ value }) => {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                const stringValue = String(value || "");
                return (
                  stringValue.includes("error") && "Name cannot contain 'error'"
                );
              },
            }}
          >
            {(field) => (
              <form.Input
                name={field.name}
                required
                label="First Name"
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter your first name"
                error={<FieldInfo field={field} />}
              />
            )}
          </form.Field>

          <form.Field
            name="lastName"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                return !stringValue
                  ? "Last name cannot be empty"
                  : stringValue.length < 2
                    ? "Last name must be at least 2 characters"
                    : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                name={field.name}
                required
                label="Last Name"
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter your last name"
                error={<FieldInfo field={field} />}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                if (!stringValue) return "Email cannot be empty";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(stringValue)
                  ? "Please enter a valid email address"
                  : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                required
                name={field.name}
                label="Email"
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter your email address"
                error={<FieldInfo field={field} />}
              />
            )}
          </form.Field>

          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || saveUserMutation.isPending}
            >
              {saveUserMutation.isPending ? "Saving..." : "Save User"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Reset Form
            </form.Button>
          </div>

          {submitResult && (
            <div
              className={`rounded-xl p-4 ${
                submitResult.includes("success")
                  ? "bg-success-background text-success-foreground"
                  : "bg-danger-background text-danger-foreground"
              }`}
            >
              {submitResult}
            </div>
          )}
        </form>

        <div className="bg-secondary-background space-y-2 rounded-xl p-4">
          <div className="font-strong">Status Information:</div>
          <div className="grid grid-cols-2 gap-2">
            <div>Form can submit: {form.state.canSubmit ? "Yes" : "No"}</div>
            <div>Form submitting: {form.state.isSubmitting ? "Yes" : "No"}</div>
            <div>Data loading: {isLoading ? "Yes" : "No"}</div>
            <div>Saving: {saveUserMutation.isPending ? "Yes" : "No"}</div>
          </div>
        </div>

        <div className="bg-info-background rounded-xl p-4">
          <div className="font-strong">Current Data:</div>
          <pre className="mt-2">{JSON.stringify(userData, null, 2)}</pre>
        </div>
      </div>
    );
  },
};

/**
 * Form with async initial values
 */
export const WithAsyncInitialValues: Story = {
  render: function WithAsyncInitialValuesRender() {
    // Mock API service
    class UserAPIService {
      private users = [
        {
          id: 1,
          name: "John Smith",
          email: "john@example.com",
          age: 28,
          department: "Engineering",
        },
        {
          id: 2,
          name: "Jane Doe",
          email: "jane@example.com",
          age: 32,
          department: "Product",
        },
        {
          id: 3,
          name: "Bob Johnson",
          email: "bob@example.com",
          age: 25,
          department: "Design",
        },
      ];

      async getUserById(id: number): Promise<{
        age: number;
        department: string;
        email: string;
        id: number;
        name: string;
      }> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate occasional network errors
        if (Math.random() < 0.1) {
          throw new Error("Network error: Unable to fetch user information");
        }

        const user = this.users.find((u) => u.id === id);
        if (!user) {
          throw new Error(`用户 ID ${id} 不存在`);
        }

        return { ...user };
      }

      async updateUser(
        id: number,
        data: Partial<{
          age: number;
          department: string;
          email: string;
          name: string;
        }>
      ): Promise<{
        age: number;
        department: string;
        email: string;
        id: number;
        name: string;
      }> {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const userIndex = this.users.findIndex((u) => u.id === id);
        if (userIndex === -1) {
          throw new Error(`用户 ID ${id} 不存在`);
        }

        this.users[userIndex] = { ...this.users[userIndex], ...data };
        return { ...this.users[userIndex] };
      }
    }

    const userAPI = new UserAPIService();

    const [selectedUserId, setSelectedUserId] = useState<number>(1);
    const [submitResult, setSubmitResult] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [initialData, setInitialData] = useState<{
      age: number;
      department: string;
      email: string;
      name: string;
    } | null>(null);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    // Async load initial values
    const loadInitialValues = async (userId: number) => {
      setIsInitialLoading(true);
      setLoadError(null);
      setSubmitResult(null);
      setInitialData(null);

      try {
        const userData = await userAPI.getUserById(userId);

        // Set initial data, this will trigger form re-render
        setInitialData({
          name: userData.name,
          email: userData.email,
          age: userData.age,
          department: userData.department,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Load failed";
        setLoadError(errorMessage);
      } finally {
        setIsInitialLoading(false);
      }
    };

    // Only create form when initial data is available
    const form = useForm({
      defaultValues: initialData || {
        name: "",
        email: "",
        age: 0,
        department: "",
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        try {
          const result = await userAPI.updateUser(
            selectedUserId,
            value as {
              age: number;
              department: string;
              email: string;
              name: string;
            }
          );
          setSubmitResult(
            `User information updated successfully! Name: ${result.name}`
          );
        } catch (error) {
          setSubmitResult(
            `Update failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    });

    // Load data on initialization
    useEffect(() => {
      loadInitialValues(selectedUserId);
    }, [selectedUserId]);

    // When initial data changes, update form values
    useEffect(() => {
      if (initialData) {
        form.setFieldValue("name", initialData.name);
        form.setFieldValue("email", initialData.email);
        form.setFieldValue("age", initialData.age);
        form.setFieldValue("department", initialData.department);
      }
    }, [initialData, form]);

    const handleUserChange = (userId: number) => {
      setSelectedUserId(userId);
    };

    const handleReload = () => {
      loadInitialValues(selectedUserId);
    };

    return (
      <div className="w-full max-w-md space-y-4">
        <div className="w-80">
          <h3 className="font-strong">Async Initial Values Example</h3>
          <p className="text-secondary-foreground">
            Demonstrate how to asynchronously load the initial values of the
            form, commonly used in editing existing data scenarios
          </p>
        </div>

        {/* 用户选择器 */}
        <div className="flex w-80 flex-col gap-2 rounded-xl border p-4">
          <Label>Select user to edit:</Label>
          <Tabs
            value={selectedUserId.toString()}
            onChange={(value) => handleUserChange(Number(value))}
          >
            <Tabs.Item value="1">User 1</Tabs.Item>
            <Tabs.Item value="2">User 2</Tabs.Item>
            <Tabs.Item value="3">User 3</Tabs.Item>
          </Tabs>
        </div>

        {/* 加载状态 */}
        {isInitialLoading && (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="text-body-large">Loading user data...</div>
              <div className="text-secondary-foreground mt-2">Please wait</div>
            </div>
          </div>
        )}

        {/* 加载错误 */}
        {loadError && (
          <div className="p-4">
            <div className="text-danger-foreground">
              <div className="font-strong">Load failed</div>
              <div className="mt-1">{loadError}</div>
            </div>
            <Button onClick={handleReload} className="mt-2">
              Reload
            </Button>
          </div>
        )}

        {/* 表单内容 */}
        {!isInitialLoading && !loadError && initialData && (
          <form
            key={`form-${selectedUserId}`}
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="w-80 space-y-4"
          >
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "");
                  return !stringValue
                    ? "Name cannot be empty"
                    : stringValue.length < 2
                      ? "Name must be at least 2 characters"
                      : undefined;
                },
              }}
            >
              {(field) => (
                <form.Input
                  name={field.name}
                  label="Name"
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter your name"
                  error={formatErrors(field.state.meta.errors).join(", ")}
                />
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "");
                  if (!stringValue) return "Email cannot be empty";
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  return !emailRegex.test(stringValue)
                    ? "Please enter a valid email address"
                    : undefined;
                },
              }}
            >
              {(field) => (
                <form.Input
                  label="Email"
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  type="email"
                  placeholder="Enter your email address"
                  error={formatErrors(field.state.meta.errors).join(", ")}
                />
              )}
            </form.Field>

            <form.Field
              name="age"
              validators={{
                onChange: ({ value }) => {
                  const numValue = Number(value);
                  if (isNaN(numValue) || numValue <= 0)
                    return "Please enter a valid age";
                  if (numValue < 18) return "Age must be greater than 18";
                  if (numValue > 100) return "Age must be less than 100";
                  return undefined;
                },
              }}
            >
              {(field) => (
                <form.NumericInput
                  label="Age"
                  name={field.name}
                  value={field.state.value as number}
                  onChange={(value) => field.handleChange(value)}
                  onBlur={field.handleBlur}
                  type="number"
                  placeholder="Enter your age"
                  error={formatErrors(field.state.meta.errors).join(", ")}
                />
              )}
            </form.Field>

            <form.Field
              name="department"
              validators={{
                onChange: ({ value }) => {
                  const stringValue = String(value || "");
                  return !stringValue
                    ? "Department cannot be empty"
                    : undefined;
                },
              }}
            >
              {(field) => (
                <form.Select
                  label="Department"
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  options={[
                    { label: "Engineering", value: "Engineering" },
                    { label: "Product", value: "Product" },
                    { label: "Design", value: "Design" },
                    { label: "Marketing", value: "Marketing" },
                    { label: "Human Resources", value: "Human Resources" },
                  ]}
                  error={formatErrors(field.state.meta.errors).join(", ")}
                />
              )}
            </form.Field>

            <div className="flex gap-2">
              <form.Button
                type="submit"
                disabled={!form.state.canSubmit || form.state.isSubmitting}
              >
                {form.state.isSubmitting ? "Updating..." : "Update user"}
              </form.Button>

              <form.Button
                type="button"
                variant="secondary"
                onClick={handleReload}
              >
                Reload
              </form.Button>
            </div>
          </form>
        )}

        {submitResult && (
          <div
            className={tcx(
              "w-80 rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 表单状态信息 */}
        {!isInitialLoading && !loadError && (
          <div className="bg-secondary-background w-80 space-y-2 rounded p-4">
            <div className="font-strong">Form state:</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Can submit: {form.state.canSubmit ? "Yes" : "No"}</div>
              <div>Is dirty: {form.state.isDirty ? "Yes" : "No"}</div>
              <div>Submitting: {form.state.isSubmitting ? "Yes" : "No"}</div>
              <div>Valid: {form.state.isValid ? "Yes" : "No"}</div>
            </div>
          </div>
        )}
      </div>
    );
  },
};

/**
 * Form with array fields
 */
export const WithArrayFields: Story = {
  render: function WithArrayFieldsRender() {
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    const form = useForm({
      defaultValues: {
        name: "",
        skills: [] as string[],
        hobbies: [
          { name: "", description: "", yearsOfExperience: 0 },
        ] as Array<{
          description: string;
          name: string;
          yearsOfExperience: number;
        }>,
        contacts: [
          { type: "email", value: "", isPrimary: true },
          { type: "phone", value: "", isPrimary: false },
        ] as Array<{
          isPrimary: boolean;
          type: string;
          value: string;
        }>,
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        try {
          // 模拟提交延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Form submitted:", value);
          const formData = value as {
            contacts: Array<{
              isPrimary: boolean;
              type: string;
              value: string;
            }>;
            hobbies: Array<{
              description: string;
              name: string;
              yearsOfExperience: number;
            }>;
            name: string;
            skills: string[];
          };
          setSubmitResult(
            `Form submitted successfully! ${formData.skills.length} skills, ${formData.hobbies.length} hobbies, ${formData.contacts.length} contacts`
          );
        } catch (error) {
          setSubmitResult(
            `Submit failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    });

    return (
      <div className="w-80 space-y-6">
        <div className="flex w-80 flex-col gap-2">
          <h3 className="font-strong">Array Form Example</h3>
          <p className="text-secondary-foreground">
            Demonstrate how to handle array-type form fields, including simple
            arrays and object arrays
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* 基本字段 */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                return !stringValue ? "Name cannot be empty" : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Name"
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter your name"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          {/* 简单数组 - 技能列表 */}
          <form.Field name="skills" mode="array">
            {(skillsField) => (
              <fieldset className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Skills List</Label>
                  <Button
                    onClick={() => {
                      skillsField.pushValue("" as never);
                    }}
                  >
                    Add skill
                  </Button>
                </div>

                <div className="space-y-2">
                  {(skillsField.state.value as string[]).length === 0 ? (
                    <div className="text-secondary-foreground">
                      No skills, click &quot;Add skill&quot; button to add
                    </div>
                  ) : (
                    (skillsField.state.value as string[]).map((_, index) => (
                      <form.Field
                        key={index}
                        name={`skills[${index}]`}
                        validators={{
                          onChange: ({ value }) => {
                            const stringValue = String(value || "");
                            return !stringValue
                              ? "Skill cannot be empty"
                              : undefined;
                          },
                        }}
                      >
                        {(skillField) => (
                          <div className="grid grid-cols-[1fr_auto] gap-2">
                            <form.Input
                              name={skillField.name}
                              value={String(skillField.state.value || "")}
                              onChange={skillField.handleChange}
                              onBlur={skillField.handleBlur}
                              placeholder={`Skill ${index + 1}`}
                              className="flex-1"
                            />
                            <IconButton
                              onClick={() => skillsField.removeValue(index)}
                            >
                              <TrashSmall />
                            </IconButton>
                            {skillField.state.meta.errors.length > 0 && (
                              <div className="text-danger-foreground col-span-2">
                                {formatErrors(
                                  skillField.state.meta.errors
                                ).join(", ")}
                              </div>
                            )}
                          </div>
                        )}
                      </form.Field>
                    ))
                  )}
                </div>
              </fieldset>
            )}
          </form.Field>

          {/* 对象数组 - 爱好列表 */}
          <form.Field name="hobbies" mode="array">
            {(hobbiesField) => (
              <fieldset className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label>Hobbies List</Label>
                  <Button
                    onClick={() => {
                      hobbiesField.pushValue({
                        name: "",
                        description: "",
                        yearsOfExperience: 0,
                      } as never);
                    }}
                  >
                    Add hobby
                  </Button>
                </div>

                <div className="space-y-4">
                  {(
                    hobbiesField.state.value as Array<{
                      description: string;
                      name: string;
                      yearsOfExperience: number;
                    }>
                  ).length === 0 ? (
                    <div className="text-secondary-foreground">
                      No hobbies, click &quot;Add hobby&quot; button to add
                    </div>
                  ) : (
                    (
                      hobbiesField.state.value as Array<{
                        description: string;
                        name: string;
                        yearsOfExperience: number;
                      }>
                    ).map((_, index) => (
                      <div key={index} className="rounded-xl border p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <Label>Hobby {index + 1}</Label>
                          <IconButton
                            onClick={() => hobbiesField.removeValue(index)}
                          >
                            <TrashSmall />
                          </IconButton>
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                          <form.Field
                            name={`hobbies[${index}].name`}
                            validators={{
                              onChange: ({ value }) => {
                                const stringValue = String(value || "");
                                return !stringValue
                                  ? "爱好名称不能为空"
                                  : undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <form.Input
                                label="Name"
                                name={field.name}
                                value={String(field.state.value || "")}
                                onChange={field.handleChange}
                                onBlur={field.handleBlur}
                                placeholder="e.g. Basketball, Reading"
                                error={formatErrors(
                                  field.state.meta.errors
                                ).join(", ")}
                              />
                            )}
                          </form.Field>

                          <form.Field
                            name={`hobbies[${index}].yearsOfExperience`}
                            validators={{
                              onChange: ({ value }) => {
                                const numValue = Number(value);
                                if (isNaN(numValue) || numValue < 0)
                                  return "Please enter a valid number";
                                return undefined;
                              },
                            }}
                          >
                            {(field) => (
                              <form.NumericInput
                                label="Years of experience"
                                name={field.name}
                                value={Number(field.state.value || 0)}
                                onChange={(value) =>
                                  field.handleChange(value || 0)
                                }
                                onBlur={field.handleBlur}
                                placeholder="0"
                                error={formatErrors(
                                  field.state.meta.errors
                                ).join(", ")}
                              />
                            )}
                          </form.Field>

                          <form.Field name={`hobbies[${index}].description`}>
                            {(field) => (
                              <form.Textarea
                                className="col-span-2"
                                label="Description"
                                name={field.name}
                                value={String(field.state.value || "")}
                                onChange={(value) => field.handleChange(value)}
                                onBlur={field.handleBlur}
                                placeholder="Describe your hobby..."
                                rows={4}
                                error={formatErrors(
                                  field.state.meta.errors
                                ).join(", ")}
                              />
                            )}
                          </form.Field>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </fieldset>
            )}
          </form.Field>

          {/* 复杂对象数组 - 联系方式 */}
          <form.Field name="contacts" mode="array">
            {(contactsField) => (
              <fieldset className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <Label>Contacts List</Label>
                  <Button
                    onClick={() => {
                      contactsField.pushValue({
                        type: "email",
                        value: "",
                        isPrimary: false,
                      } as never);
                    }}
                  >
                    Add contact
                  </Button>
                </div>

                <div className="space-y-3">
                  {(
                    contactsField.state.value as Array<{
                      isPrimary: boolean;
                      type: string;
                      value: string;
                    }>
                  ).map((_, index) => (
                    <div key={index} className="rounded-xl border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Contact {index + 1}</Label>
                        <IconButton
                          onClick={() => contactsField.removeValue(index)}
                        >
                          <TrashSmall />
                        </IconButton>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <form.Field name={`contacts[${index}].type`}>
                          {(field) => (
                            <form.Select
                              label="Type"
                              name={field.name}
                              value={String(field.state.value || "")}
                              onChange={field.handleChange}
                              onBlur={field.handleBlur}
                              options={[
                                { label: "Email", value: "email" },
                                { label: "Phone", value: "phone" },
                                { label: "Wechat", value: "wechat" },
                                { label: "QQ", value: "qq" },
                              ]}
                              error={formatErrors(field.state.meta.errors).join(
                                ", "
                              )}
                            />
                          )}
                        </form.Field>

                        <form.Field
                          name={`contacts[${index}].value`}
                          validators={{
                            onChange: ({ value }) => {
                              const stringValue = String(value || "");
                              return !stringValue
                                ? "Contact value cannot be empty"
                                : undefined;
                            },
                          }}
                        >
                          {(field) => (
                            <form.Input
                              label="Value"
                              name={field.name}
                              value={String(field.state.value || "")}
                              onChange={field.handleChange}
                              onBlur={field.handleBlur}
                              placeholder="Enter contact value"
                              error={formatErrors(field.state.meta.errors).join(
                                ", "
                              )}
                            />
                          )}
                        </form.Field>

                        <form.Field name={`contacts[${index}].isPrimary`}>
                          {(field) => (
                            <form.Checkbox
                              className="col-span-2"
                              label="Is primary"
                              name={field.name}
                              value={Boolean(field.state.value)}
                              onChange={(value) => field.handleChange(value)}
                              onBlur={field.handleBlur}
                            />
                          )}
                        </form.Field>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>
            )}
          </form.Field>

          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Submitting..." : "Submit form"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Reset form
            </form.Button>
          </div>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 表单状态和数据预览 */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Form status:</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Can submit: {form.state.canSubmit ? "Yes" : "No"}</div>
              <div>Is dirty: {form.state.isDirty ? "Yes" : "No"}</div>
              <div>Is submitting: {form.state.isSubmitting ? "Yes" : "No"}</div>
              <div>Is valid: {form.state.isValid ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Current form data:</div>
            <pre className="overflow-auto">
              {JSON.stringify(form.state.values, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Form with linked fields
 */
export const WithLinkedFields: Story = {
  render: function WithLinkedFieldsRender() {
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        newEmail: "",
        confirmNewEmail: "",
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        try {
          // 模拟提交延迟
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Form submitted:", value);
          setSubmitResult("User registered successfully!");
        } catch (error) {
          setSubmitResult(
            `Register failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    });

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h3 className="font-strong">Linked fields example</h3>
          <p className="text-secondary-foreground">
            Demonstrates how to link two fields, when one field value changes,
            the validation of the other field will be re-run
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* 基本字段 */}
          <form.Field
            name="username"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                if (!stringValue) return "Username cannot be empty";
                if (stringValue.length < 3)
                  return "Username must be at least 3 characters";
                return undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Username"
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder="Enter username"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          {/* 邮箱字段 */}
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                if (!stringValue) return "Email cannot be empty";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(stringValue)
                  ? "Please enter a valid email address"
                  : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Email"
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <div className="rounded-xl border p-4">
            <h4 className="text-warning-foreground font-strong mb-2">
              Password validation example
            </h4>
            <p className="text-warning-foreground mb-3">
              Try this flow: 1) input confirm password → 2) modify password →
              confirm password will be automatically re-validated
            </p>

            {/* 密码字段 */}
            <div className="space-y-4">
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    const stringValue = String(value || "");
                    if (!stringValue) return "Password cannot be empty";
                    if (stringValue.length < 6)
                      return "Password must be at least 6 characters";
                    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(stringValue)) {
                      return "Password must contain uppercase and lowercase letters and numbers";
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Password"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="Enter password"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                    description="Password must be at least 6 characters, contain uppercase and lowercase letters and numbers"
                  />
                )}
              </form.Field>

              {/* 确认密码字段 - 关联到密码字段 */}
              <form.Field
                name="confirmPassword"
                validators={{
                  onChangeListenTo: ["password"], // 监听密码字段的变化
                  onChange: ({ value, fieldApi }) => {
                    const stringValue = String(value || "");
                    const password = String(
                      fieldApi.form.getFieldValue("password") || ""
                    );

                    if (!stringValue) return "Confirm password cannot be empty";
                    if (stringValue !== password)
                      return "The two passwords entered are inconsistent";

                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Confirm password"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="Enter password again"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                    description={
                      field.state.meta.errors.length === 0 &&
                      String(field.state.value) && (
                        <div className="text-success-foreground">
                          ✓ Password matched
                        </div>
                      )
                    }
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <h4 className="text-accent-foreground font-strong mb-2">
              Email validation example
            </h4>
            <p className="text-accent-foreground mb-3">
              Demonstrates a more complex linking scenario: the new email cannot
              be the same as the current email, and the confirm new email must
              match
            </p>

            <div className="space-y-4">
              {/* 新邮箱字段 */}
              <form.Field
                name="newEmail"
                validators={{
                  onChangeListenTo: ["email"], // 监听原邮箱字段
                  onChange: ({ value, fieldApi }) => {
                    const stringValue = String(value || "");
                    const currentEmail = String(
                      fieldApi.form.getFieldValue("email") || ""
                    );

                    if (!stringValue) return undefined; // 新邮箱可以为空

                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(stringValue))
                      return "Please enter a valid email address";

                    if (stringValue === currentEmail)
                      return "New email cannot be the same as the current email";

                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="New email"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="Enter new email (optional)"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                  />
                )}
              </form.Field>

              {/* 确认新邮箱字段 */}
              <form.Field
                name="confirmNewEmail"
                validators={{
                  onChangeListenTo: ["newEmail"], // 监听新邮箱字段
                  onChange: ({ value, fieldApi }) => {
                    const stringValue = String(value || "");
                    const newEmail = String(
                      fieldApi.form.getFieldValue("newEmail") || ""
                    );

                    // 如果新邮箱为空，确认邮箱也应该为空
                    if (!newEmail && !stringValue) return undefined;
                    if (!newEmail && stringValue)
                      return "Please enter a new email first";
                    if (newEmail && !stringValue)
                      return "Please confirm the new email";

                    if (stringValue !== newEmail)
                      return "The two entered emails do not match";

                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Confirm new email"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="Enter new email again"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                    description={
                      field.state.meta.errors.length === 0 &&
                      String(field.state.value) && (
                        <div className="text-success-foreground">
                          ✓ Email matched
                        </div>
                      )
                    }
                  />
                )}
              </form.Field>
            </div>
          </div>

          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Submitting..." : "Register account"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Reset form
            </form.Button>
          </div>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 表单状态和字段状态 */}
        <div className="space-y-4">
          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Form status:</div>
            <div className="grid grid-cols-2 gap-2">
              <div>Can submit: {form.state.canSubmit ? "Yes" : "No"}</div>
              <div>Is dirty: {form.state.isDirty ? "Yes" : "No"}</div>
              <div>Is submitting: {form.state.isSubmitting ? "Yes" : "No"}</div>
              <div>Is valid: {form.state.isValid ? "Yes" : "No"}</div>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Field linking status:</div>
            <div className="space-y-1">
              <div>• Confirm password listen: password field</div>
              <div>• New email listen: email field</div>
              <div>• Confirm new email listen: newEmail field</div>
            </div>
          </div>

          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Current form data:</div>
            <pre className="overflow-auto">
              {JSON.stringify(form.state.values, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Form with reactivity patterns
 */
export const WithReactivity: Story = {
  render: function WithReactivityRender() {
    const [submitResult, setSubmitResult] = useState<string | null>(null);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    const form = useForm({
      defaultValues: {
        userType: "personal" as "personal" | "business",
        name: "",
        email: "",
        company: "",
        website: "",
        plan: "basic" as "basic" | "pro" | "enterprise",
        newsletter: false,
        notifications: {
          email: true,
          sms: false,
          push: true,
        },
        budget: 1000,
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Form submitted:", value);
          setSubmitResult("Form submitted successfully!");
        } catch (error) {
          setSubmitResult(
            `Submit failed: ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      },
    });

    // 使用 useStore 订阅特定的表单值
    const userType = useStore(form.store, (state) => state.values.userType);
    const formValues = useStore(form.store, (state) => state.values);
    const canSubmit = useStore(form.store, (state) => state.canSubmit);
    const isDirty = useStore(form.store, (state) => state.isDirty);
    const isValid = useStore(form.store, (state) => state.isValid);

    // 根据用户类型计算价格
    const calculatePrice = () => {
      const basePrices = { basic: 10, pro: 50, enterprise: 200 };
      const multiplier = userType === "business" ? 2 : 1;
      const plan = String(
        formValues.plan || "basic"
      ) as keyof typeof basePrices;
      return basePrices[plan] * multiplier;
    };

    return (
      <div className="w-80 space-y-4">
        <div>
          <h3 className="font-strong">Reactive subscription example</h3>
          <p className="text-secondary-foreground">
            Demonstrates how to use useStore and form.Subscribe to access
            reactive form values
          </p>
        </div>

        {/* 使用 useStore 的响应式状态显示 */}
        <div className="rounded-xl border p-4">
          <h4 className="text-success-foreground font-strong mb-2">
            useStore subscription example
          </h4>
          <div className="space-y-1">
            <div>
              • Current user type:{" "}
              <span className="font-strong">
                {userType === "personal" ? "Personal user" : "Business user"}
              </span>
            </div>
            <div>
              • Calculate price:{" "}
              <span className="font-strong">${calculatePrice()}/month</span>
            </div>
            <div>
              • Form status:
              <Badge variant={canSubmit ? "success" : "error"} className="ml-1">
                {canSubmit ? "Can submit" : "Cannot submit"}
              </Badge>
            </div>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* 用户类型选择 */}
          <form.Field name="userType">
            {(field) => (
              <form.Segmented
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                options={[
                  { content: "Personal user", value: "personal" },
                  { content: "Business user", value: "business" },
                ]}
              />
            )}
          </form.Field>

          {/* 基本信息 */}
          <form.Field
            name="name"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                return !stringValue ? "Name cannot be empty" : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                label={userType === "personal" ? "Name" : "Contact name"}
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                placeholder={
                  userType === "personal"
                    ? "Enter your name"
                    : "Enter contact name"
                }
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) => {
                const stringValue = String(value || "");
                if (!stringValue) return "Email cannot be empty";
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return !emailRegex.test(stringValue)
                  ? "Please enter a valid email address"
                  : undefined;
              },
            }}
          >
            {(field) => (
              <form.Input
                label="Email"
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                type="email"
                placeholder="Enter email address"
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          {/* 条件渲染 - 企业用户额外字段 */}
          {userType === "business" && (
            <div className="space-y-4 rounded-xl border p-4">
              <h4 className="text-accent-foreground font-strong">
                Business information
              </h4>

              <form.Field
                name="company"
                validators={{
                  onChange: ({ value }) => {
                    // 只有在企业用户时才验证公司名称
                    if (userType === "business") {
                      const stringValue = String(value || "");
                      return !stringValue
                        ? "Company name cannot be empty"
                        : undefined;
                    }
                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Company name"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter company name"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                  />
                )}
              </form.Field>

              <form.Field name="website">
                {(field) => (
                  <form.Input
                    label="Company website"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="url"
                    placeholder="https://example.com"
                    error={formatErrors(field.state.meta.errors).join(", ")}
                  />
                )}
              </form.Field>
            </div>
          )}

          {/* 套餐选择 */}
          <form.Field name="plan">
            {(field) => (
              <form.Segmented
                name={field.name}
                value={String(field.state.value || "")}
                onChange={field.handleChange}
                options={[
                  { content: "Basic - $10", value: "basic" },
                  { content: "Pro - $50", value: "pro" },
                  { content: "Enterprise - $200", value: "enterprise" },
                ]}
              />
            )}
          </form.Field>

          {/* 使用 form.Subscribe 的响应式组件 */}
          <form.Subscribe
            selector={(state) => [state.values.plan, state.values.userType]}
          >
            {([plan, userType]) => (
              <div className="rounded-xl border p-4">
                <h4 className="text-accent-foreground font-strong mb-2">
                  form.Subscribe subscription example
                </h4>
                <div className="text-secondary-foreground">
                  <div>
                    • Selected plan:{" "}
                    <span className="font-strong">{String(plan)}</span>
                  </div>
                  <div>
                    • User type:{" "}
                    <span className="font-strong">{String(userType)}</span>
                  </div>
                  <div>
                    • Actual price:{" "}
                    <span className="text-body-large-strong">
                      $
                      {({ basic: 10, pro: 50, enterprise: 200 }[
                        plan as keyof typeof plan
                      ] || 0) * (userType === "business" ? 2 : 1)}
                      /month
                    </span>
                  </div>
                  {userType === "business" && (
                    <div className="mt-2">
                      Business users get 2x features, with corresponding price
                      adjustments
                    </div>
                  )}
                </div>
              </div>
            )}
          </form.Subscribe>

          {/* 预算滑块 */}
          <form.Field name="budget">
            {(field) => (
              <form.Range
                label="Budget"
                value={Number(field.state.value) || 1000}
                onChange={(value) => field.handleChange(value)}
                min={100}
                max={10000}
                error={formatErrors(field.state.meta.errors).join(", ")}
              />
            )}
          </form.Field>

          {/* 通知设置 */}
          <div className="space-y-4">
            <h4 className="font-strong">Notification settings</h4>

            <form.Field name="newsletter">
              {(field) => (
                <form.Checkbox
                  label="Subscribe to newsletter"
                  name={field.name}
                  value={Boolean(field.state.value)}
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>

            <form.Field name="notifications.email">
              {(field) => (
                <form.Checkbox
                  label="Email notifications"
                  name={field.name}
                  value={Boolean(field.state.value)}
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>

            <form.Field name="notifications.sms">
              {(field) => (
                <form.Checkbox
                  label="SMS notifications"
                  name={field.name}
                  value={Boolean(field.state.value)}
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>

            <form.Field name="notifications.push">
              {(field) => (
                <form.Checkbox
                  label="Push notifications"
                  name={field.name}
                  value={Boolean(field.state.value)}
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
          </div>

          {/* 响应式提交按钮 */}
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isDirty,
            ]}
          >
            {([canSubmit, isSubmitting, isDirty]) => (
              <div className="flex gap-2">
                <form.Button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit form"}
                </form.Button>

                <form.Button
                  type="button"
                  variant="secondary"
                  onClick={() => form.reset()}
                  disabled={!isDirty}
                >
                  Reset form
                </form.Button>
              </div>
            )}
          </form.Subscribe>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 响应式状态监控 */}
        <div className="space-y-4">
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isDirty,
              state.isValid,
              state.isSubmitting,
              state.errorMap,
            ]}
          >
            {([canSubmit, isDirty, isValid, isSubmitting, errorMap]) => (
              <div className="rounded-xl border p-4">
                <div className="font-strong mb-2">
                  Real-time form status (form.Subscribe):
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div
                    className={canSubmit ? "text-green-600" : "text-red-600"}
                  >
                    Can submit: {canSubmit ? "Yes" : "No"}
                  </div>
                  <div className={isDirty ? "text-blue-600" : "text-gray-600"}>
                    Is dirty: {isDirty ? "Yes" : "No"}
                  </div>
                  <div className={isValid ? "text-green-600" : "text-red-600"}>
                    Is valid: {isValid ? "Yes" : "No"}
                  </div>
                  <div
                    className={
                      isSubmitting ? "text-orange-600" : "text-gray-600"
                    }
                  >
                    Is submitting: {isSubmitting ? "Yes" : "No"}
                  </div>
                </div>
                {Object.keys(errorMap).length > 0 && (
                  <div className="mt-2 text-red-600">
                    Error fields: {Object.keys(errorMap).join(", ")}
                  </div>
                )}
              </div>
            )}
          </form.Subscribe>

          <form.Subscribe selector={(state) => state.values}>
            {(values) => (
              <div className="rounded-xl border p-4">
                <div className="font-strong mb-2">
                  Real-time form data (form.Subscribe):
                </div>
                <pre className="max-h-40 overflow-auto">
                  {JSON.stringify(values, null, 2)}
                </pre>
              </div>
            )}
          </form.Subscribe>

          {/* 性能对比说明 */}
          <div className="rounded-xl border p-4">
            <div className="font-strong mb-2">Performance optimization:</div>
            <div>
              • <strong>form.Subscribe</strong>: Suitable for responsive
              rendering, only re-rendering when the subscribed value changes
            </div>
            <div>
              • <strong>Selector</strong>: Use precise selectors to avoid
              unnecessary re-rendering
            </div>
            <div>
              • <strong>Multiple value subscription</strong>: Can subscribe to
              multiple values, reducing subscription count
            </div>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Form with listeners API
 */
export const WithListeners: Story = {
  render: function WithListeners() {
    const [submitResult, setSubmitResult] = useState<string | null>(null);
    const [activityLog, setActivityLog] = useState<string[]>([]);

    // Helper function: format error messages
    const formatErrors = (errors: unknown[]): string[] => {
      const formatted = errors.map((error) => {
        if (typeof error === "string") return error;
        if (error && typeof error === "object" && "message" in error) {
          return String(error.message);
        }
        return String(error);
      });
      // Remove duplicates
      return [...new Set(formatted)];
    };

    // 添加活动日志
    const addLog = (message: string) => {
      const timestamp = new Date().toLocaleTimeString();
      setActivityLog((prev) => [
        `[${timestamp}] ${message}`,
        ...prev.slice(0, 9),
      ]); // 保留最近10条
    };

    // 模拟国家-省份数据
    const countryProvinceData = {
      china: [
        { label: "Beijing", value: "beijing" },
        { label: "Shanghai", value: "shanghai" },
        { label: "Guangdong", value: "guangdong" },
        { label: "Zhejiang", value: "zhejiang" },
      ],
      usa: [
        { label: "California", value: "california" },
        { label: "New York", value: "newyork" },
        { label: "Texas", value: "texas" },
        { label: "Florida", value: "florida" },
      ],
      japan: [
        { label: "Tokyo", value: "tokyo" },
        { label: "Osaka", value: "osaka" },
        { label: "Kanagawa", value: "kanagawa" },
        { label: "Aichi", value: "aichi" },
      ],
    };

    const form = useForm({
      defaultValues: {
        // 级联选择
        country: "",
        province: "",
        city: "",

        // 用户类型相关
        userType: "individual" as "individual" | "company" | "organization",
        personalInfo: {
          firstName: "",
          lastName: "",
          idNumber: "",
        },
        companyInfo: {
          companyName: "",
          taxId: "",
          industry: "",
        },
        organizationInfo: {
          orgName: "",
          orgType: "",
          registrationNumber: "",
        },

        // 其他字段
        email: "",
        phone: "",
        newsletter: false,
        notifications: {
          email: true,
          sms: false,
        },
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        addLog("Form submission started");
        try {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Form submitted:", value);
          setSubmitResult("Form submitted successfully!");
          addLog("Form submitted successfully");
        } catch (error) {
          const errorMsg = `Submission failed: ${error instanceof Error ? error.message : "Unknown error"}`;
          setSubmitResult(errorMsg);
          addLog(errorMsg);
        }
      },
    });

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h3 className="font-strong">Listeners API example</h3>
          <p className="text-secondary-foreground">
            Demonstrates how to use Listeners API to handle side effects and
            cascading logic between fields
          </p>
        </div>

        {/* 活动日志 */}
        <div className="rounded-xl border p-4">
          <h4 className="font-strong mb-2">Activity log</h4>
          <div className="max-h-32 space-y-1 overflow-y-auto">
            {activityLog.length === 0 ? (
              <div className="text-secondary-foreground">No activity</div>
            ) : (
              activityLog.map((log, index) => (
                <div key={index} className="text-gray-700">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* 级联选择示例 - 国家-省份 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">Cascading select example</h4>
            <p className="text-secondary-foreground">
              Demonstrates classic country-province cascading select, resetting
              province when country changes
            </p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 国家选择 */}
              <form.Field
                name="country"
                listeners={{
                  onChange: ({ value }) => {
                    // 当国家改变时，重置省份和城市
                    form.setFieldValue("province", "");
                    form.setFieldValue("city", "");
                    addLog(
                      `Country changed to: ${value || "empty"}, reset province and city`
                    );
                  },
                  onMount: () => {
                    addLog("Country field mounted");
                  },
                }}
                validators={{
                  onChange: ({ value }) => {
                    const stringValue = String(value || "");
                    return !stringValue ? "Please select a country" : undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Select
                    label="Country"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    placeholder="Please select a country"
                    options={[
                      { label: "China", value: "china" },
                      { label: "USA", value: "usa" },
                      { label: "Japan", value: "japan" },
                    ]}
                    error={
                      field.state.meta.errors.length > 0
                        ? formatErrors(field.state.meta.errors).join(", ")
                        : undefined
                    }
                  />
                )}
              </form.Field>

              {/* 省份选择 */}
              <form.Field
                name="province"
                listeners={{
                  onChange: ({ value }) => {
                    // 当省份改变时，重置城市
                    form.setFieldValue("city", "");
                    addLog(
                      `Province changed to: ${value || "empty"}, reset city`
                    );
                  },
                  onBlur: ({ value }) => {
                    if (value) {
                      addLog(`Province field blurred, current value: ${value}`);
                    }
                  },
                }}
                validators={{
                  onChange: ({ value }) => {
                    const country = form.getFieldValue("country");
                    if (country && !value) return "Please select a province";
                    return undefined;
                  },
                }}
              >
                {(field) => {
                  const currentCountry = String(
                    form.getFieldValue("country") || ""
                  );
                  const provinces = currentCountry
                    ? countryProvinceData[
                        currentCountry as keyof typeof countryProvinceData
                      ] || []
                    : [];

                  return (
                    <form.Select
                      label="Province"
                      name={field.name}
                      value={String(field.state.value || "")}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="Please select a province"
                      options={provinces}
                      disabled={!currentCountry}
                      error={
                        field.state.meta.errors.length > 0
                          ? formatErrors(field.state.meta.errors).join(", ")
                          : undefined
                      }
                      description="Please select a province"
                    />
                  );
                }}
              </form.Field>

              {/* 城市输入 */}
              <form.Field
                name="city"
                listeners={{
                  onChange: ({ value }) => {
                    if (value) {
                      addLog(`City input: ${value}`);
                    }
                  },
                }}
              >
                {(field) => {
                  const currentProvince = String(
                    form.getFieldValue("province") || ""
                  );

                  return (
                    <form.Input
                      className="col-span-2"
                      label="City"
                      name={field.name}
                      value={String(field.state.value || "")}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                      placeholder="Please enter city name"
                      disabled={!currentProvince}
                      description="Please select a province"
                    />
                  );
                }}
              </form.Field>
            </div>
          </div>

          {/* 用户类型切换示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">User type switch example</h4>
            <p className="text-secondary-foreground">
              Demonstrates when user type changes, reset related information
              fields
            </p>

            {/* 用户类型选择 */}
            <form.Field
              name="userType"
              listeners={{
                onChange: ({ value }) => {
                  // 重置所有类型相关的字段
                  form.setFieldValue("personalInfo", {
                    firstName: "",
                    lastName: "",
                    idNumber: "",
                  });
                  form.setFieldValue("companyInfo", {
                    companyName: "",
                    taxId: "",
                    industry: "",
                  });
                  form.setFieldValue("organizationInfo", {
                    orgName: "",
                    orgType: "",
                    registrationNumber: "",
                  });
                  addLog(
                    `User type changed to: ${value}, reset all related information`
                  );
                },
              }}
            >
              {(field) => (
                <form.RadioGroup
                  label="User type"
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  options={[
                    { label: "Individual", value: "individual" },
                    { label: "Company", value: "company" },
                    { label: "Organization", value: "organization" },
                  ]}
                />
              )}
            </form.Field>

            {/* 条件渲染不同类型的信息字段 */}
            {form.getFieldValue("userType") === "individual" && (
              <div className="space-y-4">
                <h5 className="font-strong">Personal information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="personalInfo.firstName"
                    listeners={{
                      onMount: () =>
                        addLog(
                          "Personal information - first name field mounted"
                        ),
                      onBlur: ({ value }) => {
                        if (value)
                          addLog(
                            `Personal information - first name input completed: ${value}`
                          );
                      },
                    }}
                  >
                    {(field) => (
                      <form.Input
                        label="First name"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter first name"
                      />
                    )}
                  </form.Field>

                  <form.Field name="personalInfo.lastName">
                    {(field) => (
                      <form.Input
                        label="Last name"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter last name"
                      />
                    )}
                  </form.Field>

                  <form.Field
                    name="personalInfo.idNumber"
                    listeners={{
                      onChange: ({ value }) => {
                        // 身份证号变化时的格式化或验证
                        if (value && String(value).length === 18) {
                          addLog(
                            "ID number input completed, format validation in progress..."
                          );
                        }
                      },
                    }}
                  >
                    {(field) => (
                      <form.Input
                        label="ID number"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter ID number"
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            )}

            {form.getFieldValue("userType") === "company" && (
              <div className="space-y-4">
                <h5 className="font-strong">Company information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <form.Field
                    name="companyInfo.companyName"
                    listeners={{
                      onMount: () =>
                        addLog(
                          "Company information - company name field mounted"
                        ),
                      onChange: ({ value }) => {
                        if (value && String(value).length >= 3) {
                          addLog(`Company name updated: ${value}`);
                        }
                      },
                    }}
                  >
                    {(field) => (
                      <form.Input
                        label="Company name"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter company name"
                      />
                    )}
                  </form.Field>

                  <form.Field name="companyInfo.taxId">
                    {(field) => (
                      <form.Input
                        label="Tax ID"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter tax ID"
                      />
                    )}
                  </form.Field>

                  <form.Field name="companyInfo.industry">
                    {(field) => (
                      <form.Select
                        label="Industry"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        placeholder="Please select industry"
                        options={[
                          { label: "Technology", value: "technology" },
                          { label: "Finance", value: "finance" },
                          { label: "Manufacturing", value: "manufacturing" },
                          { label: "Service", value: "service" },
                        ]}
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            )}

            {form.getFieldValue("userType") === "organization" && (
              <div className="space-y-4">
                <h5 className="font-strong">Organization information</h5>
                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="organizationInfo.orgName">
                    {(field) => (
                      <form.Input
                        label="Organization name"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter organization name"
                      />
                    )}
                  </form.Field>

                  <form.Field name="organizationInfo.orgType">
                    {(field) => (
                      <form.Select
                        label="Organization type"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        placeholder="Please select organization type"
                        options={[
                          {
                            label: "Nonprofit organization",
                            value: "nonprofit",
                          },
                          { label: "Government agency", value: "government" },
                          {
                            label: "Education institution",
                            value: "education",
                          },
                          { label: "Charity organization", value: "charity" },
                        ]}
                      />
                    )}
                  </form.Field>

                  <form.Field name="organizationInfo.registrationNumber">
                    {(field) => (
                      <form.Input
                        label="Registration number"
                        name={field.name}
                        value={String(field.state.value || "")}
                        onChange={field.handleChange}
                        onBlur={field.handleBlur}
                        placeholder="Please enter registration number"
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            )}
          </div>

          {/* 通知设置示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">Notification settings example</h4>
            <p className="text-secondary-foreground">
              Demonstrates the logic of linking checkboxes
            </p>

            <div className="space-y-4">
              <form.Field
                name="newsletter"
                listeners={{
                  onChange: ({ value }) => {
                    if (!value) {
                      // 如果取消订阅新闻通讯，也取消邮件通知
                      form.setFieldValue("notifications.email", false);
                      addLog(
                        "Unsubscribe from newsletter, also cancel email notification"
                      );
                    } else {
                      addLog("Subscribe to newsletter");
                    }
                  },
                }}
              >
                {(field) => (
                  <form.Checkbox
                    label="Subscribe to newsletter"
                    name={field.name}
                    value={Boolean(field.state.value)}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>

              <form.Field
                name="notifications.email"
                listeners={{
                  onChange: ({ value }) => {
                    if (value) {
                      // 如果开启邮件通知，自动订阅新闻通讯
                      form.setFieldValue("newsletter", true);
                      addLog(
                        "Enable email notification, automatically subscribe to newsletter"
                      );
                    } else {
                      addLog("Disable email notification");
                    }
                  },
                }}
              >
                {(field) => (
                  <form.Checkbox
                    label="Email notification"
                    name={field.name}
                    value={Boolean(field.state.value)}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>

              <form.Field
                name="notifications.sms"
                listeners={{
                  onChange: ({ value }) => {
                    addLog(
                      `SMS notification ${value ? "enabled" : "disabled"}`
                    );
                  },
                }}
              >
                {(field) => (
                  <form.Checkbox
                    label="SMS notification"
                    name={field.name}
                    value={Boolean(field.state.value)}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* 基本联系信息 */}
          <div className="space-y-4">
            <h4 className="font-strong">Contact information</h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <form.Field
                name="email"
                listeners={{
                  onBlur: ({ value }) => {
                    if (value && String(value).includes("@")) {
                      addLog(`Email input completed: ${value}`);
                    }
                  },
                }}
                validators={{
                  onChange: ({ value }) => {
                    const stringValue = String(value || "");
                    if (!stringValue) return "Email cannot be empty";
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return !emailRegex.test(stringValue)
                      ? "Please enter a valid email address"
                      : undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Email *"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="Please enter email address"
                    error={
                      field.state.meta.errors.length > 0
                        ? formatErrors(field.state.meta.errors).join(", ")
                        : undefined
                    }
                  />
                )}
              </form.Field>

              <form.Field
                name="phone"
                listeners={{
                  onChange: ({ value }) => {
                    const phone = String(value || "");
                    if (phone.length === 11) {
                      addLog(`Phone number input completed: ${phone}`);
                    }
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Phone number"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="tel"
                    placeholder="Please enter phone number"
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Submitting..." : "Submit form"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                addLog("Form has been reset");
                setActivityLog([]);
              }}
            >
              Reset form
            </form.Button>
          </div>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 表单状态监控 */}
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Current form data preview:</div>
          <pre className="max-h-60 overflow-auto rounded bg-white p-2">
            {JSON.stringify(form.state.values, null, 2)}
          </pre>
        </div>

        {/* 监听器说明 */}
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Listener events description:</div>
          <div className="text-secondary-foreground space-y-1">
            <div>
              • <strong>onChange</strong>: Triggered when the field value
              changes (most commonly used)
            </div>
            <div>
              • <strong>onBlur</strong>: Triggered when the field loses focus
            </div>
            <div>
              • <strong>onMount</strong>: Triggered when the field is first
              mounted
            </div>
            <div>
              • <strong>onSubmit</strong>: Triggered when the form is submitted
            </div>
          </div>
        </div>
      </div>
    );
  },
};

// 自定义错误类型定义
interface ValidationError {
  code?: string;
  details?: Record<string, unknown>;
  field?: string;
  message: string;
  severity?: "error" | "warning" | "info";
  type: "required" | "format" | "length" | "custom" | "server";
}

interface PasswordStrengthError {
  message: string;
  requirements: {
    length: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
    uppercase: boolean;
  };
  score: number;
  suggestions: string[];
  type: "password_strength";
}

interface FileValidationError {
  file: string;
  issues: Array<{
    current?: string | number;
    limit?: string | number;
    message: string;
    type: "size" | "format" | "name" | "content";
  }>;
  message: string;
  type: "file_validation";
}

// 联合错误类型
type CustomError =
  | ValidationError
  | PasswordStrengthError
  | FileValidationError;

/**
 * Form with custom errors
 */
export const WithCustomErrors: Story = {
  render: function WithCustomErrorsRender() {
    const [submitResult, setSubmitResult] = useState<string | null>(null);
    const [serverErrors, setServerErrors] = useState<
      Record<string, ValidationError[]>
    >({});

    // 辅助函数：格式化不同类型的错误
    const formatCustomErrors = (errors: unknown[]): ReactNode[] => {
      return errors.map((error, index) => {
        // 字符串错误
        if (typeof error === "string") {
          return (
            <div key={index} className="text-danger-foreground">
              {error}
            </div>
          );
        }

        // 验证错误对象
        if (error && typeof error === "object" && "type" in error) {
          const validationError = error as CustomError;

          if (validationError.type === "password_strength") {
            const pwdError = error as PasswordStrengthError;
            return (
              <div key={index} className="space-y-2">
                <div className="text-danger-foreground font-strong">
                  {pwdError.message}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <span className="text-secondary-foreground">
                      Strength score:
                    </span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div
                          key={level}
                          className={`h-2 w-4 rounded-sm ${
                            level <= pwdError.score
                              ? pwdError.score >= 4
                                ? "bg-success-foreground"
                                : pwdError.score >= 3
                                  ? "bg-warning-foreground"
                                  : "bg-danger-foreground"
                              : "bg-secondary-foreground"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-secondary-foreground">
                      ({pwdError.score}/5)
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="text-secondary-foreground">
                      Requirements:
                    </div>
                    {Object.entries(pwdError.requirements).map(([key, met]) => (
                      <div key={key} className="flex items-center gap-1">
                        <span
                          className={
                            met
                              ? "text-success-foreground"
                              : "text-danger-foreground"
                          }
                        >
                          {met ? "✓" : "✗"}
                        </span>
                        <span
                          className={
                            met
                              ? "text-success-foreground"
                              : "text-danger-foreground"
                          }
                        >
                          {key === "length" && "At least 8 characters"}
                          {key === "uppercase" && "Contains uppercase letters"}
                          {key === "lowercase" && "Contains lowercase letters"}
                          {key === "numbers" && "Contains numbers"}
                          {key === "symbols" && "Contains special characters"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {pwdError.suggestions.length > 0 && (
                    <div className="space-y-1">
                      <div className="text-secondary-foreground">
                        Suggestions:
                      </div>
                      {pwdError.suggestions.map((suggestion, i) => (
                        <div key={i} className="text-accent-foreground">
                          • {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          }

          if (validationError.type === "file_validation") {
            const fileError = error as FileValidationError;
            return (
              <div key={index} className="space-y-2">
                <div className="text-danger-foreground font-strong">
                  {fileError.message}
                </div>
                <div className="space-y-1">
                  <div className="text-secondary-foreground">
                    File: {fileError.file}
                  </div>
                  <div className="space-y-1">
                    {fileError.issues.map((issue, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-danger-foreground">•</span>
                        <div className="text-danger-foreground">
                          <div>{issue.message}</div>
                          {issue.limit && issue.current && (
                            <div className="text-secondary-foreground mt-1">
                              Current: {issue.current}, Limit: {issue.limit}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          // 普通验证错误
          return (
            <div key={index} className="space-y-1">
              <div
                className={` ${
                  validationError.severity === "warning"
                    ? "text-warning-foreground"
                    : validationError.severity === "info"
                      ? "text-accent-foreground"
                      : "text-danger-foreground"
                }`}
              >
                {validationError.message}
              </div>
              {validationError.code && (
                <div className="text-secondary-foreground">
                  Error code: {validationError.code}
                </div>
              )}
              {validationError.details && (
                <div className="text-secondary-foreground">
                  Details: {JSON.stringify(validationError.details)}
                </div>
              )}
            </div>
          );
        }

        // 数组错误
        if (Array.isArray(error)) {
          return (
            <div key={index} className="space-y-1">
              {error.map((err, i) => (
                <div key={i} className="text-danger-foreground">
                  • {typeof err === "string" ? err : JSON.stringify(err)}
                </div>
              ))}
            </div>
          );
        }

        // 其他类型错误
        return (
          <div key={index} className="text-danger-foreground">
            {JSON.stringify(error)}
          </div>
        );
      });
    };

    // 密码强度验证器
    const validatePasswordStrength = (
      password: string
    ): PasswordStrengthError | undefined => {
      if (!password) return undefined;

      const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        numbers: /\d/.test(password),
        symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      };

      const score = Object.values(requirements).filter(Boolean).length;
      const suggestions: string[] = [];

      if (!requirements.length)
        suggestions.push("Increase password length to at least 8 characters");
      if (!requirements.uppercase) suggestions.push("Add uppercase letters");
      if (!requirements.lowercase) suggestions.push("Add lowercase letters");
      if (!requirements.numbers) suggestions.push("Add numbers");
      if (!requirements.symbols) suggestions.push("Add special characters");

      // 如果所有要求都满足，返回 undefined (无错误)
      if (score === 5) return undefined;

      return {
        type: "password_strength",
        message: "Password strength is not enough",
        requirements,
        score,
        suggestions,
      };
    };

    // 文件验证器
    const validateFile = (
      filename: string
    ): FileValidationError | undefined => {
      if (!filename) return undefined;

      const issues: FileValidationError["issues"] = [];

      // 检查文件扩展名
      const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".pdf",
        ".doc",
        ".docx",
      ];
      const extension = filename
        .toLowerCase()
        .substring(filename.lastIndexOf("."));
      if (!allowedExtensions.includes(extension)) {
        issues.push({
          type: "format",
          message: `Unsupported file format: ${extension}`,
          current: extension,
          limit: allowedExtensions.join(", "),
        });
      }

      // 检查文件名长度
      if (filename.length > 100) {
        issues.push({
          type: "name",
          message: "File name is too long",
          current: filename.length,
          limit: 100,
        });
      }

      // 模拟文件大小检查
      const mockFileSize = filename.length * 1024; // 模拟文件大小
      if (mockFileSize > 5 * 1024 * 1024) {
        // 5MB
        issues.push({
          type: "size",
          message: "File size exceeds the limit",
          current: `${(mockFileSize / 1024 / 1024).toFixed(1)}MB`,
          limit: "5MB",
        });
      }

      if (issues.length === 0) return undefined;

      return {
        type: "file_validation",
        message: "File validation failed",
        file: filename,
        issues,
      };
    };

    // 模拟服务器验证
    const simulateServerValidation = async (
      field: string,
      value: string
    ): Promise<ValidationError | undefined> => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      if (field === "username" && value === "admin") {
        return {
          type: "server",
          message: "Username is already taken",
          code: "USERNAME_TAKEN",
          field: "username",
          severity: "error",
          details: { suggestions: ["admin123", "admin2024", "user_admin"] },
        };
      }

      if (field === "email" && value === "test@example.com") {
        return {
          type: "server",
          message: "This email is already registered",
          code: "EMAIL_EXISTS",
          field: "email",
          severity: "error",
          details: { registeredAt: "2024-01-01" },
        };
      }

      return undefined;
    };

    // 复合验证器 - 返回多种错误类型
    const validateComplex = (
      value: string,
      field: string
    ): ValidationError[] | string | undefined => {
      if (!value) {
        return [
          {
            type: "required",
            message: `${field} is required`,
            code: "REQUIRED_FIELD",
            severity: "error",
          } as ValidationError,
        ];
      }

      const errors: ValidationError[] = [];

      // 长度检查
      if (value.length < 3) {
        errors.push({
          type: "length",
          message: `${field} must be at least 3 characters`,
          code: "MIN_LENGTH",
          severity: "error",
          details: { minLength: 3, currentLength: value.length },
        });
      }

      // 格式检查
      if (field === "Username" && !/^[a-zA-Z0-9_]+$/.test(value)) {
        errors.push({
          type: "format",
          message: "Username can only contain letters, numbers and underscores",
          code: "INVALID_FORMAT",
          severity: "error",
        });
      }

      // 警告级别的检查
      if (field === "Username" && value.length > 20) {
        errors.push({
          type: "length",
          message:
            "Username is too long, it is recommended to keep it within 20 characters",
          code: "LONG_USERNAME",
          severity: "warning",
          details: { maxRecommended: 20, currentLength: value.length },
        });
      }

      return errors.length > 0 ? errors : undefined;
    };

    const form = useForm({
      defaultValues: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fileName: "",
        description: "",
        tags: "",
        score: 0,
        agreement: false,
      },
      onSubmit: async ({ value }) => {
        setSubmitResult(null);
        setServerErrors({});

        try {
          // 模拟服务器端验证
          const serverValidationErrors: Record<string, ValidationError[]> = {};

          // 检查用户名
          const usernameError = await simulateServerValidation(
            "username",
            (value as unknown as { username: string }).username
          );
          if (usernameError) {
            serverValidationErrors.username = [usernameError];
          }

          // 检查邮箱
          const emailError = await simulateServerValidation(
            "email",
            (value as unknown as { email: string }).email
          );
          if (emailError) {
            serverValidationErrors.email = [emailError];
          }

          if (Object.keys(serverValidationErrors).length > 0) {
            setServerErrors(serverValidationErrors);
            setSubmitResult(
              "Server validation failed, please check the error information"
            );
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("Form submitted:", value);
          setSubmitResult("Form submitted successfully!");
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Unknown error";
          setSubmitResult(`Submission failed: ${errorMsg}`);
        }
      },
    });

    return (
      <div className="w-80 space-y-4">
        <div className="space-y-2">
          <h3 className="font-strong">Custom error handling example</h3>
          <p className="text-secondary-foreground">
            Demonstrates how to use TanStack Form&apos;s flexible error handling
            mechanism, supporting multiple error types and custom error display
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* 复合验证示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">Composite validation example</h4>
            <p className="text-secondary-foreground">
              Demonstrates returning multiple error types: objects, arrays, and
              different severity levels
            </p>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="username"
                validators={{
                  onChange: ({ value }) =>
                    validateComplex(String(value), "Username"),
                  onBlurAsync: async ({ value }) => {
                    if (!value) return undefined;
                    const serverError = await simulateServerValidation(
                      "username",
                      String(value)
                    );
                    return serverError;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Username"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    placeholder="Enter username"
                    error={
                      <>
                        {field.state.meta.errors.length > 0 && (
                          <div className="space-y-1">
                            {formatCustomErrors(field.state.meta.errors)}
                          </div>
                        )}
                        {serverErrors.username && (
                          <div className="space-y-1">
                            {formatCustomErrors(serverErrors.username)}
                          </div>
                        )}
                      </>
                    }
                    description={
                      <>
                        {field.state.meta.isValidating && (
                          <div className="text-accent-foreground">
                            Validating...
                          </div>
                        )}
                      </>
                    }
                  />
                )}
              </form.Field>

              <form.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    const email = String(value || "");
                    if (!email)
                      return {
                        type: "required",
                        message: "Email is required",
                        severity: "error",
                      };
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(email)) {
                      return {
                        type: "format",
                        message: "Please enter a valid email address",
                        code: "INVALID_EMAIL_FORMAT",
                        severity: "error",
                        details: { pattern: emailRegex.source },
                      };
                    }
                    return undefined;
                  },
                  onBlurAsync: async ({ value }) => {
                    if (!value) return undefined;
                    return await simulateServerValidation(
                      "email",
                      String(value)
                    );
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Email"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="email"
                    placeholder="Enter email address"
                    error={
                      <>
                        {field.state.meta.errors.length > 0 && (
                          <div className="space-y-1">
                            {formatCustomErrors(field.state.meta.errors)}
                          </div>
                        )}
                        {serverErrors.email && (
                          <div className="space-y-1">
                            {formatCustomErrors(serverErrors.email)}
                          </div>
                        )}
                      </>
                    }
                    description={
                      <>
                        {field.state.meta.isValidating && (
                          <div className="text-accent-foreground">
                            Validating...
                          </div>
                        )}
                      </>
                    }
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* 密码强度验证示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">
              Password strength validation example
            </h4>
            <p className="text-secondary-foreground">
              Demonstrates complex password strength validation, returning
              detailed error objects
            </p>

            <div className="grid grid-cols-2 gap-4">
              <form.Field
                name="password"
                validators={{
                  onChange: ({ value }) =>
                    validatePasswordStrength(String(value || "")),
                }}
              >
                {(field) => (
                  <form.Input
                    label="Password"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="Enter password"
                    error={
                      <>
                        {field.state.meta.errors.length > 0 && (
                          <div className="space-y-1">
                            {formatCustomErrors(field.state.meta.errors)}
                          </div>
                        )}
                      </>
                    }
                  />
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                  onChange: ({ value }) => {
                    const password = form.getFieldValue("password");
                    const confirmPassword = String(value || "");

                    if (!confirmPassword) {
                      return {
                        type: "required",
                        message: "Please confirm the password",
                        severity: "error",
                      };
                    }

                    if (password !== confirmPassword) {
                      return {
                        type: "custom",
                        message: "The passwords entered twice do not match",
                        code: "PASSWORD_MISMATCH",
                        severity: "error",
                        details: {
                          originalLength: String(password).length,
                          confirmLength: confirmPassword.length,
                        },
                      };
                    }

                    return undefined;
                  },
                }}
              >
                {(field) => (
                  <form.Input
                    label="Confirm Password"
                    name={field.name}
                    value={String(field.state.value || "")}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    type="password"
                    placeholder="Enter password again"
                    error={
                      <>
                        {field.state.meta.errors.length > 0 && (
                          <div className="space-y-1">
                            {formatCustomErrors(field.state.meta.errors)}
                          </div>
                        )}
                      </>
                    }
                  />
                )}
              </form.Field>
            </div>
          </div>

          {/* 文件验证示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">File validation example</h4>
            <p className="text-secondary-foreground">
              Demonstrates complex file validation logic, including multiple
              validation rules
            </p>

            <form.Field
              name="fileName"
              validators={{
                onChange: ({ value }) => validateFile(String(value || "")),
              }}
            >
              {(field) => (
                <form.Input
                  label="File name"
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter file name (e.g. document.pdf)"
                  error={
                    <>
                      {field.state.meta.errors.length > 0 && (
                        <div className="space-y-1">
                          {formatCustomErrors(field.state.meta.errors)}
                        </div>
                      )}
                    </>
                  }
                  description="Supported formats: .jpg, .jpeg, .png, .pdf, .doc, .docx"
                />
              )}
            </form.Field>
          </div>

          {/* 数组错误示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">Array error example</h4>
            <p className="text-secondary-foreground">
              Demonstrates returning error arrays, including validation logic
            </p>

            <form.Field
              name="tags"
              validators={{
                onChange: ({ value }) => {
                  const tags = String(value || "");
                  if (!tags) return undefined;

                  const errors: string[] = [];
                  const tagList = tags.split(",").map((tag) => tag.trim());

                  // 检查标签数量
                  if (tagList.length > 5) {
                    errors.push("The number of tags cannot exceed 5");
                  }

                  // 检查标签长度
                  const longTags = tagList.filter((tag) => tag.length > 10);
                  if (longTags.length > 0) {
                    errors.push(`Tags are too long: ${longTags.join(", ")}`);
                  }

                  // 检查重复标签
                  const uniqueTags = new Set(tagList);
                  if (uniqueTags.size !== tagList.length) {
                    errors.push("There are duplicate tags");
                  }

                  // 检查特殊字符
                  const invalidTags = tagList.filter((tag) =>
                    /[!@#$%^&*(),.?":{}|<>]/.test(tag)
                  );
                  if (invalidTags.length > 0) {
                    errors.push(
                      `Tags contain special characters: ${invalidTags.join(", ")}`
                    );
                  }

                  return errors.length > 0 ? errors : undefined;
                },
              }}
            >
              {(field) => (
                <form.Input
                  label="Tags"
                  name={field.name}
                  value={String(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter tags, separated by commas"
                  error={
                    <>
                      {field.state.meta.errors.length > 0 && (
                        <div className="space-y-1">
                          {formatCustomErrors(field.state.meta.errors)}
                        </div>
                      )}
                    </>
                  }
                  description="Separate multiple tags with commas, up to 5, each tag is no more than 10 characters"
                />
              )}
            </form.Field>
          </div>

          {/* 数值验证示例 */}
          <div className="space-y-4 rounded-xl border p-4">
            <h4 className="font-strong">Number validation example</h4>
            <p className="text-secondary-foreground">
              Demonstrates returning numeric or boolean values as errors
            </p>

            <form.Field
              name="score"
              validators={{
                onChange: ({ value }) => {
                  const score = Number(value);

                  // 返回布尔值 - true 表示错误
                  if (isNaN(score)) return true;

                  // 返回数字 - 非零表示错误
                  if (score < 0) return -1;
                  if (score > 100) return 1;

                  // 返回 undefined 表示无错误
                  return undefined;
                },
              }}
            >
              {(field) => (
                <form.NumericInput
                  label="Score"
                  name={field.name}
                  value={Number(field.state.value || "")}
                  onChange={field.handleChange}
                  onBlur={field.handleBlur}
                  placeholder="Enter score (0-100)"
                  error={
                    field.state.meta.errors.length > 0 && (
                      <div className="space-y-1">
                        {field.state.meta.errors.map((error, index) => (
                          <div key={index}>
                            {error === true && "Please enter a valid number"}
                            {error === -1 && "Score cannot be negative"}
                            {error === 1 && "Score cannot exceed 100"}
                            {typeof error === "string" && error}
                          </div>
                        ))}
                      </div>
                    )
                  }
                />
              )}
            </form.Field>
          </div>

          {/* 描述字段 */}
          <form.Field
            name="description"
            validators={{
              onChange: ({ value }) => {
                const desc = String(value || "");
                if (desc.length > 200) {
                  return {
                    type: "length",
                    message: "Description cannot exceed 200 characters",
                    severity: "warning",
                    details: { maxLength: 200, currentLength: desc.length },
                  };
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <form.Textarea
                label="Description"
                name={field.name}
                value={String(field.state.value || "")}
                onChange={(e) => field.handleChange(e)}
                onBlur={field.handleBlur}
                rows={4}
                placeholder="Enter description"
                error={
                  field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">
                      {formatCustomErrors(field.state.meta.errors)}
                    </div>
                  )
                }
                description={`Current characters: ${String(field.state.value || "").length}/200`}
              />
            )}
          </form.Field>

          {/* 协议同意 */}
          <form.Field
            name="agreement"
            validators={{
              onChange: ({ value }) => {
                if (!value) {
                  return {
                    type: "required",
                    message: "Please agree to the user agreement",
                    severity: "error",
                  };
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <form.Checkbox
                label="I have read and agree to the user agreement"
                name={field.name}
                value={Boolean(field.state.value)}
                onChange={(e) => field.handleChange(e)}
                onBlur={field.handleBlur}
                error={
                  field.state.meta.errors.length > 0 && (
                    <div className="space-y-1">
                      {formatCustomErrors(field.state.meta.errors)}
                    </div>
                  )
                }
              />
            )}
          </form.Field>

          {/* 提交按钮 */}
          <div className="flex gap-2">
            <form.Button
              type="submit"
              disabled={!form.state.canSubmit || form.state.isSubmitting}
            >
              {form.state.isSubmitting ? "Submitting..." : "Submit form"}
            </form.Button>

            <form.Button
              type="button"
              variant="secondary"
              onClick={() => {
                form.reset();
                setServerErrors({});
              }}
            >
              Reset form
            </form.Button>
          </div>
        </form>

        {submitResult && (
          <div
            className={tcx(
              "rounded-xl p-4",
              submitResult.includes("success")
                ? "text-success-foreground bg-green-100"
                : "text-danger-foreground bg-red-100"
            )}
          >
            {submitResult}
          </div>
        )}

        {/* 错误类型说明 */}
        <div className="rounded-xl border p-4">
          <div className="font-strong mb-2">Supported error types:</div>
          <div className="text-secondary-foreground space-y-1">
            <div>
              • <strong>String</strong>: The most common error type
            </div>
            <div>
              • <strong>Object</strong>: Contains type, message, severity, and
              other detailed information
            </div>
            <div>
              • <strong>Array</strong>: A collection of multiple errors
            </div>
            <div>
              • <strong>Boolean</strong>: true means error, false means correct
            </div>
            <div>
              • <strong>Number</strong>: Non-zero values mean error
            </div>
            <div>
              • <strong>undefined/null</strong>: Means no error
            </div>
          </div>
        </div>
      </div>
    );
  },
};
