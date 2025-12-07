import type { Meta, StoryObj } from "@storybook/react-vite"
import React, { useState } from "react"
import {
  Conditions,
  FieldType,
  LogicalOperator,
  ComparisonOperator,
  createEmptyConditions,
  type Field,
  type ConditionsRoot,
} from "../src"

const meta: Meta<typeof Conditions> = {
  title: "Components/Conditions",
  component: Conditions,
  tags: ["autodocs", "beta"],
}

export default meta
type Story = StoryObj<typeof Conditions>

// Sample field definitions for all stories
const sampleFields: Field[] = [
  {
    key: "title",
    label: "Title",
    type: FieldType.Text,
    placeholder: "Enter title...",
  },
  {
    key: "priority",
    label: "Priority",
    type: FieldType.Select,
    options: [
      { label: "High", value: "high", color: "#ef4444" },
      { label: "Medium", value: "medium", color: "#f59e0b" },
      { label: "Low", value: "low", color: "#10b981" },
    ],
  },
  {
    key: "assignee",
    label: "Assignee",
    type: FieldType.User,
    multiple: true,
  },
  {
    key: "dueDate",
    label: "Due Date",
    type: FieldType.Date,
  },
  {
    key: "createdAt",
    label: "Created At",
    type: FieldType.DateTime,
  },
  {
    key: "isCompleted",
    label: "Is Completed",
    type: FieldType.Boolean,
    trueLabel: "Completed",
    falseLabel: "Pending",
  },
  {
    key: "estimatedHours",
    label: "Estimated Hours",
    type: FieldType.Number,
    min: 0,
    max: 100,
    step: 0.5,
  },
  {
    key: "tags",
    label: "Tags",
    type: FieldType.Tag,
    multiple: true,
    colorized: true,
  },
]

/**
 * Basic usage of the Conditions component with simple field configuration.
 * This demonstrates the fundamental functionality of creating and managing filter conditions.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const [conditions, setConditions] = useState<ConditionsRoot>(createEmptyConditions())

    return (
      <div className="space-y-4">
        <Conditions
          fields={sampleFields}
          value={conditions}
          onChange={setConditions}
        />

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h3 className="text-body-small-strong mb-2 text-gray-700">Current Conditions:</h3>
          <pre className="max-h-96 overflow-auto text-xs text-gray-600">
            {JSON.stringify(conditions, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates the Conditions component with pre-configured complex nested conditions.
 * Shows how multiple condition groups can be combined with AND/OR logic.
 */
export const PreConfigured: Story = {
  render: function PreConfiguredStory() {
    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "root_1",
      groups: [
        {
          id: "group_1",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "condition_1",
              fieldKey: "priority",
              operator: ComparisonOperator.Equals,
              value: "high",
            },
            {
              id: "condition_2",
              fieldKey: "isCompleted",
              operator: ComparisonOperator.IsFalse,
              value: null,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-body-small text-blue-800">
            <strong>Pre-configured example:</strong> High priority AND not completed
          </p>
        </div>

        <Conditions
          fields={sampleFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Shows different field types and their corresponding operators.
 * Demonstrates how operators change based on the selected field type.
 */
export const FieldTypes: Story = {
  render: function FieldTypesStory() {
    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "root_field_types",
      groups: [
        {
          id: "group_field_types",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "text_condition",
              fieldKey: "title",
              operator: ComparisonOperator.Contains,
              value: "bug",
            },
            {
              id: "number_condition",
              fieldKey: "estimatedHours",
              operator: ComparisonOperator.GreaterThan,
              value: 8,
            },
            {
              id: "date_condition",
              fieldKey: "createdAt",
              operator: ComparisonOperator.IsAfter,
              value: "2023-01-01",
            },
            {
              id: "boolean_condition",
              fieldKey: "isCompleted",
              operator: ComparisonOperator.IsTrue,
              value: null,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-3">
          <p className="text-body-small text-green-800">
            <strong>Field Types Demo:</strong> Each field type shows different available operators
          </p>
        </div>

        <Conditions
          fields={sampleFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Shows the disabled state of the Conditions component.
 * All interactions are disabled but the current conditions remain visible.
 */
export const Disabled: Story = {
  render: function DisabledStory() {
    const conditions: ConditionsRoot = {
      id: "root_disabled",
      groups: [
        {
          id: "group_disabled",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "condition_disabled_1",
              fieldKey: "title",
              operator: ComparisonOperator.Contains,
              value: "high",
            },
            {
              id: "condition_disabled_2",
              fieldKey: "createdAt",
              operator: ComparisonOperator.IsAfter,
              value: "2023-01-01",
            },
          ],
        },
      ],
    }

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <p className="text-body-small text-gray-600">
            <strong>Disabled State:</strong> All controls are disabled but conditions remain visible
          </p>
        </div>

        <Conditions
          fields={sampleFields}
          value={conditions}
          disabled={true}
        />
      </div>
    )
  },
}

/**
 * Demonstrates real-world usage with a task management scenario.
 * Shows practical filtering conditions for a project management interface.
 */
export const TaskManagement: Story = {
  render: function TaskManagementStory() {
    const taskFields: Field[] = [
      {
        key: "taskName",
        label: "Task Name",
        type: FieldType.Text,
        placeholder: "Search task names...",
      },
      {
        key: "priority",
        label: "Priority",
        type: FieldType.Select,
        options: [
          { label: "Urgent", value: "urgent" },
          { label: "High", value: "high" },
          { label: "Medium", value: "medium" },
          { label: "Low", value: "low" },
        ],
      },
      {
        key: "dueDate",
        label: "Due Date",
        type: FieldType.Date,
      },
      {
        key: "estimatedHours",
        label: "Estimated Hours",
        type: FieldType.Number,
        min: 0,
        max: 40,
        step: 0.25,
      },
      {
        key: "isBlocked",
        label: "Is Blocked",
        type: FieldType.Boolean,
      },
    ]

    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "task_root",
      groups: [
        {
          id: "task_group",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "title_filter",
              fieldKey: "taskName",
              operator: ComparisonOperator.Contains,
              value: "urgent",
            },
            {
              id: "due_soon",
              fieldKey: "dueDate",
              operator: ComparisonOperator.IsAfter,
              value: "2024-01-01",
            },
            {
              id: "not_blocked",
              fieldKey: "isBlocked",
              operator: ComparisonOperator.IsFalse,
              value: null,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-indigo-200 bg-indigo-50 p-3">
          <p className="text-body-small text-indigo-800">
            <strong>Task Management:</strong> Filter tasks by priority, due date, and blocking
            status
          </p>
        </div>

        <Conditions
          fields={taskFields}
          value={conditions}
          onChange={setConditions}
        />

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h4 className="text-body-small-strong mb-2 text-gray-700">Filter Summary:</h4>
          <div className="text-xs text-gray-600">
            {conditions.groups.length === 0 ? (
              <p>No filters applied</p>
            ) : (
              <p>{conditions.groups[0].conditions.length} condition(s) active</p>
            )}
          </div>
        </div>
      </div>
    )
  },
}

/**
 * Demonstrates advanced operators including exists/does not exist checks.
 * Shows how to filter based on field presence rather than specific values.
 */
export const AdvancedOperators: Story = {
  render: function AdvancedOperatorsStory() {
    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "advanced_root",
      groups: [
        {
          id: "advanced_group",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "title_exists",
              fieldKey: "title",
              operator: ComparisonOperator.Exists,
              value: null,
            },
            {
              id: "assignee_missing",
              fieldKey: "assignee",
              operator: ComparisonOperator.DoesNotExist,
              value: null,
            },
            {
              id: "tags_not_empty",
              fieldKey: "tags",
              operator: ComparisonOperator.IsNotEmpty,
              value: null,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-purple-200 bg-purple-50 p-3">
          <p className="text-body-small text-purple-800">
            <strong>Advanced Operators:</strong> Filter by field existence, emptiness, and presence
          </p>
        </div>

        <Conditions
          fields={sampleFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Shows regular expression pattern matching capabilities.
 * Demonstrates how to use regex patterns for advanced text filtering.
 */
export const RegexPatterns: Story = {
  render: function RegexPatternsStory() {
    const regexFields: Field[] = [
      {
        key: "email",
        label: "Email",
        type: FieldType.Text,
        placeholder: "Enter email address...",
      },
      {
        key: "phoneNumber",
        label: "Phone Number",
        type: FieldType.Text,
        placeholder: "Enter phone number...",
      },
      {
        key: "userCode",
        label: "User Code",
        type: FieldType.Text,
        placeholder: "Enter user code...",
      },
    ]

    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "regex_root",
      groups: [
        {
          id: "regex_group",
          logicalOperator: LogicalOperator.Or,
          conditions: [
            {
              id: "email_pattern",
              fieldKey: "email",
              operator: ComparisonOperator.MatchesRegex,
              value: {
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                flags: "i",
              },
            },
            {
              id: "phone_pattern",
              fieldKey: "phoneNumber",
              operator: ComparisonOperator.MatchesRegex,
              value: {
                pattern: "\\+?\\d{1,4}[\\s.-]?\\(?\\d{1,3}\\)?[\\s.-]?\\d{1,4}[\\s.-]?\\d{1,4}",
                flags: "",
              },
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-3">
          <p className="text-body-small text-orange-800">
            <strong>Regex Patterns:</strong> Use regular expressions for advanced text matching
          </p>
          <div className="mt-2 text-xs text-orange-700">
            <p>• Email pattern validates standard email formats</p>
            <p>• Phone pattern matches various international phone formats</p>
          </div>
        </div>

        <Conditions
          fields={regexFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Demonstrates array and text length filtering capabilities.
 * Shows how to filter based on the length of fields rather than their content.
 */
export const ArrayLengthFilters: Story = {
  render: function ArrayLengthFiltersStory() {
    const lengthFields: Field[] = [
      {
        key: "description",
        label: "Description",
        type: FieldType.Text,
        placeholder: "Enter description...",
      },
      {
        key: "categories",
        label: "Categories",
        type: FieldType.MultiSelect,
        options: [
          { label: "Bug", value: "bug" },
          { label: "Feature", value: "feature" },
          { label: "Enhancement", value: "enhancement" },
          { label: "Documentation", value: "docs" },
        ],
      },
      {
        key: "reviewers",
        label: "Reviewers",
        type: FieldType.User,
        multiple: true,
      },
    ]

    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "length_root",
      groups: [
        {
          id: "length_group",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "description_length",
              fieldKey: "description",
              operator: ComparisonOperator.LengthGreaterThan,
              value: 50,
            },
            {
              id: "categories_count",
              fieldKey: "categories",
              operator: ComparisonOperator.LengthLessThanOrEqual,
              value: 3,
            },
            {
              id: "reviewers_minimum",
              fieldKey: "reviewers",
              operator: ComparisonOperator.LengthGreaterThanOrEqual,
              value: 2,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-teal-200 bg-teal-50 p-3">
          <p className="text-body-small text-teal-800">
            <strong>Length Filters:</strong> Filter by text length or array item count
          </p>
          <div className="mt-2 text-xs text-teal-700">
            <p>• Description must be longer than 50 characters</p>
            <p>• Categories limited to 3 or fewer</p>
            <p>• Minimum 2 reviewers required</p>
          </div>
        </div>

        <Conditions
          fields={lengthFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Shows simplified boolean logic with dedicated true/false operators.
 * Demonstrates cleaner boolean field handling without explicit value selection.
 */
export const BooleanLogic: Story = {
  render: function BooleanLogicStory() {
    const booleanFields: Field[] = [
      {
        key: "isPublished",
        label: "Is Published",
        type: FieldType.Boolean,
        trueLabel: "Published",
        falseLabel: "Draft",
      },
      {
        key: "isArchived",
        label: "Is Archived",
        type: FieldType.Boolean,
      },
      {
        key: "hasComments",
        label: "Has Comments",
        type: FieldType.Boolean,
      },
      {
        key: "isLocked",
        label: "Is Locked",
        type: FieldType.Boolean,
      },
    ]

    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "boolean_root",
      groups: [
        {
          id: "boolean_group_1",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "published_true",
              fieldKey: "isPublished",
              operator: ComparisonOperator.IsTrue,
              value: null,
            },
            {
              id: "archived_false",
              fieldKey: "isArchived",
              operator: ComparisonOperator.IsFalse,
              value: null,
            },
          ],
        },
        {
          id: "boolean_group_2",
          logicalOperator: LogicalOperator.Or,
          conditions: [
            {
              id: "has_comments",
              fieldKey: "hasComments",
              operator: ComparisonOperator.IsTrue,
              value: null,
            },
            {
              id: "not_locked",
              fieldKey: "isLocked",
              operator: ComparisonOperator.IsFalse,
              value: null,
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3">
          <p className="text-body-small text-blue-800">
            <strong>Boolean Logic:</strong> Simplified true/false operators for cleaner boolean
            filtering
          </p>
          <div className="mt-2 text-xs text-blue-700">
            <p>• Uses dedicated IsTrue/IsFalse operators</p>
            <p>• No need to select true/false values manually</p>
            <p>• Supports complex nested boolean logic</p>
          </div>
        </div>

        <Conditions
          fields={booleanFields}
          value={conditions}
          onChange={setConditions}
        />
      </div>
    )
  },
}

/**
 * Test drag and drop functionality with debugging information.
 * This story includes nested groups to test cross-group dragging scenarios.
 */
export const DragAndDropTest: Story = {
  render: function DragAndDropTestStory() {
    const [conditions, setConditions] = useState<ConditionsRoot>({
      id: "drag_test_root",
      groups: [
        {
          id: "main_group",
          logicalOperator: LogicalOperator.And,
          conditions: [
            {
              id: "condition_1",
              fieldKey: "title",
              operator: ComparisonOperator.Contains,
              value: "main condition 1",
            },
            {
              id: "condition_2",
              fieldKey: "priority",
              operator: ComparisonOperator.Equals,
              value: "high",
            },
            // Nested group for cross-group drag testing
            {
              id: "nested_group",
              logicalOperator: LogicalOperator.Or,
              conditions: [
                {
                  id: "condition_3",
                  fieldKey: "title",
                  operator: ComparisonOperator.StartsWith,
                  value: "nested condition",
                },
                {
                  id: "condition_4",
                  fieldKey: "isCompleted",
                  operator: ComparisonOperator.IsTrue,
                  value: null,
                },
              ],
            },
          ],
        },
      ],
    })

    return (
      <div className="space-y-4">
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3">
          <p className="text-body-small text-red-800">
            <strong>Drag & Drop Test:</strong> Test dragging conditions between groups, within
            groups, and in/out of nested groups. Open browser console to see debug logs.
          </p>
          <div className="mt-2 text-xs text-red-700">
            <p>• Try dragging conditions from main group to nested group</p>
            <p>• Try dragging conditions from nested group to main group</p>
            <p>• Try reordering conditions within the same group</p>
          </div>
        </div>

        <Conditions
          fields={sampleFields}
          value={conditions}
          onChange={setConditions}
        />

        <div className="mt-6 rounded-xl bg-gray-50 p-4">
          <h4 className="text-body-small-strong mb-2 text-gray-700">
            Current Structure (for debugging):
          </h4>
          <pre className="max-h-96 overflow-auto text-xs text-gray-600">
            {JSON.stringify(conditions, null, 2)}
          </pre>
        </div>
      </div>
    )
  },
}
