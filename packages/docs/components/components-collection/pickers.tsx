import { memo } from "react"
import { EmojiPicker } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const PickersCollection = memo(function PickersCollection() {
  return (
    <CollectionSection
      title="Pickers"
      description="Specialized selection components like emoji pickers and color pickers for choosing from visual options."
    >
      <ComponentCard
        title="Emoji Picker"
        collection="pickers"
      >
        <EmojiPicker
          showSearch={false}
          showCategories={false}
          className="absolute scale-50 rounded-lg"
          height={360}
        />
      </ComponentCard>
    </CollectionSection>
  )
})
