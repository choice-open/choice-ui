import { memo } from "react"
import { ScrollArea, Separator } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const LayoutsCollection = memo(function LayoutsCollection() {
  return (
    <CollectionSection
      title="Layouts"
      description="Structural components for organizing and arranging content, including scroll areas, splitters, and grids."
    >
      <ComponentCard
        title="Scroll Area"
        collection="layouts"
      >
        <ScrollArea
          className="bg-secondary-background absolute h-full w-full overflow-hidden rounded-lg"
          type="always"
        >
          <ScrollArea.Viewport>
            <ScrollArea.Content>
              <div className="flex flex-col gap-4 p-4">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam. Morbi accumsan cursus enim, sed ultricies sapien.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam. Morbi accumsan cursus enim, sed ultricies sapien.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                  risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                  quam. Morbi accumsan cursus enim, sed ultricies sapien.
                </p>
              </div>
            </ScrollArea.Content>
          </ScrollArea.Viewport>
        </ScrollArea>
      </ComponentCard>

      <ComponentCard
        title="Separator"
        collection="layouts"
      >
        <Separator className="w-full">OR</Separator>
      </ComponentCard>

      <ComponentCard
        title="Splitter"
        collection="layouts"
      >
        <div className="bg-secondary-background grid size-full grid-cols-2 grid-rows-2 rounded-lg">
          <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-1 flex items-center justify-center border-b-2 p-4">
            1
          </div>
          <div className="bg-primary-background text-body-large-strong text-secondary-foreground border-default-background col-span-1 row-span-2 flex items-center justify-center border-l-2 p-4">
            2
          </div>
          <div className="bg-primary-background text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-4">
            3
          </div>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Virtualized Grid"
        collection="layouts"
      >
        <div className="bg-secondary-background grid size-full grid-cols-4 grid-rows-4 rounded-lg p-1">
          {Array.from({ length: 16 }).map((_, index) => (
            <div
              key={index}
              className="text-body-large-strong text-secondary-foreground col-span-1 row-span-1 flex items-center justify-center p-1"
            >
              <div className="bg-default-background flex h-full w-full items-center justify-center rounded-md">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </ComponentCard>
    </CollectionSection>
  )
})
