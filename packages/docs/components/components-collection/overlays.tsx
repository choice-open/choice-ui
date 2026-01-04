import { memo } from "react"
import { Button, Modal } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const OverlaysCollection = memo(function OverlaysCollection() {
  return (
    <CollectionSection
      title="Overlays"
      description="Floating UI elements like modals, dialogs, popovers, and tooltips that appear above the main content."
    >
      <ComponentCard
        title="Alert Dialog"
        collection="overlays"
      >
        <Modal className="absolute w-[180%] max-w-none scale-55">
          <Modal.Header
            title="Delete User"
            onClose={() => {}}
            className="border-none"
          />
          <Modal.Content className="flex flex-col gap-4 p-4">
            This action cannot be undone. Are you sure you want to delete this item?
          </Modal.Content>
          <Modal.Footer className="justify-end border-none">
            <Button variant="secondary">Cancel</Button>
            <Button variant="destructive">Delete</Button>
          </Modal.Footer>
        </Modal>
      </ComponentCard>

      <ComponentCard
        title="Dialog"
        collection="overlays"
      >
        <Modal className="absolute w-[180%] max-w-none scale-55">
          <Modal.Header
            title="Create a new user"
            onClose={() => {}}
          />
          <Modal.Content className="flex flex-col gap-4 p-4">
            <Modal.Input
              label="Username"
              placeholder="Enter username"
            />
            <Modal.Textarea
              label="Description"
              placeholder="Enter description"
            />
          </Modal.Content>
          <Modal.Footer className="justify-end">
            <Button variant="secondary">Cancel</Button>
            <Button>Save</Button>
          </Modal.Footer>
        </Modal>
      </ComponentCard>

      <ComponentCard
        title="Popover"
        collection="overlays"
      >
        <div className="relative mt-12 mb-auto scale-75">
          <Button>Click me</Button>
          <Modal className="absolute top-8 left-1/2 -translate-x-1/2">
            <Modal.Header
              title="Popover Title"
              onClose={() => {}}
            />
            <Modal.Content className="flex w-64 flex-col gap-4 p-4">
              This is a popover content. It will be displayed when the button is clicked.
            </Modal.Content>
          </Modal>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Tooltip"
        collection="overlays"
      >
        <div className="relative">
          <Button>Hover me</Button>
          <div className="bg-menu-background absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded-md px-2 py-1 text-white shadow-md">
            <div className="bg-menu-background absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45" />
            Tooltip
          </div>
        </div>
      </ComponentCard>
    </CollectionSection>
  )
})
