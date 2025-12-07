import { Chip } from "@choiceform/chip"
import { Dropdown } from "@choiceform/dropdown"
import { IconButton } from "@choiceform/icon-button"
import { Add, CopySmall, EllipsisSmall, Trash } from "@choiceform/icons-react"
import { LogicalOperator } from "../types"

interface LogicalOperatorChipProps {
  disabled?: boolean
  onChange: (newOperator: LogicalOperator) => void
  operator: LogicalOperator
}

export function LogicalOperatorChip({ operator, disabled, onChange }: LogicalOperatorChipProps) {
  return (
    <div className="flex w-12 items-center justify-center px-1">
      <Chip
        className="bg-default-background ring-default-background relative z-2 ring-2"
        onClick={() => {
          const newOperator =
            operator === LogicalOperator.And ? LogicalOperator.Or : LogicalOperator.And
          onChange(newOperator)
        }}
        disabled={disabled}
      >
        {operator === LogicalOperator.And ? "AND" : "OR"}
      </Chip>
    </div>
  )
}

interface AddConditionDropdownProps {
  canAddGroup?: boolean
  disabled?: boolean
  onAddCondition: () => void
  onAddGroup: () => void
}

export function AddConditionDropdown({
  disabled,
  onAddCondition,
  onAddGroup,
  canAddGroup = true,
}: AddConditionDropdownProps) {
  return (
    <Dropdown>
      <Dropdown.Trigger
        prefixElement={<Add />}
        disabled={disabled}
        className="pointer-events-auto"
      >
        Add Condition
      </Dropdown.Trigger>
      <Dropdown.Content>
        <Dropdown.Item onMouseUp={onAddCondition}>Add a filter</Dropdown.Item>
        {canAddGroup && <Dropdown.Item onMouseUp={onAddGroup}>Add group</Dropdown.Item>}
      </Dropdown.Content>
    </Dropdown>
  )
}

interface GroupActionsDropdownProps {
  disabled?: boolean
  onDelete: () => void
  onDuplicate?: () => void
  onOpenChange?: (open: boolean) => void
  open?: boolean
}

export function GroupActionsDropdown({
  open,
  onOpenChange,
  disabled,
  onDuplicate,
  onDelete,
}: GroupActionsDropdownProps) {
  return (
    <Dropdown
      open={open}
      onOpenChange={onOpenChange}
    >
      <Dropdown.Trigger asChild>
        <IconButton
          disabled={disabled}
          aria-label="Group actions"
        >
          <EllipsisSmall />
        </IconButton>
      </Dropdown.Trigger>
      <Dropdown.Content>
        {onDuplicate && (
          <Dropdown.Item onMouseUp={onDuplicate}>
            <CopySmall />
            Duplicate group
          </Dropdown.Item>
        )}
        <Dropdown.Item
          onMouseUp={onDelete}
          variant="danger"
        >
          <Trash />
          Delete group
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  )
}

interface DragGuideProps {
  dragGuideIndex: number | null
  index: number
}

export function DragGuide({ index, dragGuideIndex }: DragGuideProps) {
  if (dragGuideIndex !== index) return null

  return (
    <div
      key={`guide-${index}`}
      className="bg-accent-foreground z-2 col-start-1 mx-2 -my-px h-0.5 rounded-full"
    />
  )
}
