import { RatingHeartSolid, RemoveSmall } from "@choiceform/icons-react"
import { memo } from "react"
import { Button, Chip, IconButton, LinkButton, Segmented, ToggleButton } from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const ButtonsCollection = memo(function ButtonsCollection() {
  return (
    <CollectionSection
      title="Buttons"
      description="Interactive elements for triggering actions, toggling states, and making selections."
    >
      <ComponentCard
        title="Button"
        collection="buttons"
      >
        <Button>Button</Button>
      </ComponentCard>
      <ComponentCard
        title="Icon Button"
        collection="buttons"
      >
        <IconButton aria-label="Icon button">
          <RemoveSmall />
        </IconButton>
      </ComponentCard>
      <ComponentCard
        title="Link Button"
        collection="buttons"
      >
        <LinkButton>Link Button</LinkButton>
      </ComponentCard>

      <ComponentCard
        title="Toggle Button"
        collection="buttons"
      >
        <ToggleButton
          value={true}
          onChange={() => {}}
          aria-label="Toggle button"
          variant="highlight"
        >
          <RatingHeartSolid />
        </ToggleButton>
      </ComponentCard>

      <ComponentCard
        title="Segmented"
        collection="buttons"
      >
        <Segmented
          value={"photo"}
          onChange={() => {}}
        >
          <Segmented.Item
            value="photo"
            className="px-2"
          >
            Photo
          </Segmented.Item>
          <Segmented.Item
            value="video"
            className="px-2"
          >
            Video
          </Segmented.Item>
          <Segmented.Item
            value="audio"
            className="px-2"
          >
            Audio
          </Segmented.Item>
        </Segmented>
      </ComponentCard>

      <ComponentCard
        title="Chip"
        collection="buttons"
      >
        <Chip>Chip</Chip>
      </ComponentCard>
    </CollectionSection>
  )
})
