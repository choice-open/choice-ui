import { Dialog } from "@choice-ui/react"
import { getSection, type SectionId } from "../sections"

type Props = {
  sectionId: SectionId | null
  onClose: () => void
}

export function CustomizePanelDialog({ sectionId, onClose }: Props) {
  const open = sectionId !== null
  const section = sectionId ? getSection(sectionId) : null
  const Page = section?.Page

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => (next ? null : onClose())}
      draggable
      initialPosition="left-top"
    >
      <Dialog.Header title={section ? `Customize ${section.label}` : ""} />
      <Dialog.Content className="max-h-[80vh] w-[640px] overflow-auto p-0">
        {Page ? <Page /> : null}
      </Dialog.Content>
    </Dialog>
  )
}
