import { CircleCheckLargeSolid } from "@choiceform/icons-react"
import { memo } from "react"
import {
  Avatar,
  Badge,
  Button,
  Hint,
  Input,
  Pagination,
  ProgressBar,
  ProgressCircle,
  Skeleton,
  Stackflow,
  Tabs,
} from "../ui"
import { CollectionSection } from "./collection-section"
import { ComponentCard } from "./component-card"

export const NavigationCollection = memo(function NavigationCollection() {
  return (
    <CollectionSection
      title="Navigation"
      description="Components for moving between views, pages, and content sections within an application."
    >
      <ComponentCard
        title="Tabs"
        collection="navigation"
      >
        <Tabs
          value="home"
          onChange={() => {}}
        >
          <Tabs.Item value="home">Home</Tabs.Item>
          <Tabs.Item value="settings">Settings</Tabs.Item>
          <Tabs.Item value="analytics">Analytics</Tabs.Item>
        </Tabs>
      </ComponentCard>

      <ComponentCard
        title="Pagination"
        collection="navigation"
      >
        <Pagination
          currentPage={1}
          totalItems={100}
          itemsPerPage={10}
          onPageChange={() => {}}
          onItemsPerPageChange={() => {}}
        >
          <Pagination.Navigation />
        </Pagination>
      </ComponentCard>

      <ComponentCard
        title="Stackflow"
        collection="navigation"
      >
        <Stackflow
          className="w-full rounded-xl border"
          defaultId="page1"
        >
          {/* Fixed header - does not scroll with page content */}
          <Stackflow.Prefix>
            <div className="flex items-center justify-between border-b p-3">
              <Button variant="secondary">←</Button>
              <span className="font-strong">Page 1</span>
              <Button variant="primary">→</Button>
            </div>
          </Stackflow.Prefix>

          {/* Page 1 */}
          <Stackflow.Item id="page1">
            <div className="p-4">
              <h3 className="font-strong mb-2">Page 1</h3>
              <p className="text-secondary-foreground">
                Click &quot;Next&quot; to navigate to Page 2.
              </p>
            </div>
          </Stackflow.Item>

          {/* Page 2 */}
          <Stackflow.Item id="page2">
            <div className="p-4">
              <h3 className="font-strong mb-2">Page 2</h3>
              <p className="text-secondary-foreground">
                Click &quot;Back&quot; to return, or &quot;Next&quot; to continue.
              </p>
            </div>
          </Stackflow.Item>

          {/* Page 3 */}
          <Stackflow.Item id="page3">
            <div className="p-4">
              <h3 className="font-strong mb-2">Page 3</h3>
              <p className="text-secondary-foreground">
                This is the last page. Click &quot;Back&quot; to return.
              </p>
            </div>
          </Stackflow.Item>
        </Stackflow>
      </ComponentCard>

      <h2 className="md-h3 col-span-full mb-0">Feedback</h2>
      <ComponentCard
        title="Avatar"
        collection="feedback"
      >
        <div className="flex gap-2">
          <Avatar
            photo="https://github.com/shadcn.png"
            name="John Doe"
          />
          <Avatar name="John Doe" />
        </div>
      </ComponentCard>

      <ComponentCard
        title="Badge"
        collection="feedback"
      >
        <div className="flex gap-2">
          <Badge>Badge</Badge>
          <Badge variant="brand">Badge</Badge>
          <Badge variant="success">Badge</Badge>
          <Badge variant="warning">Badge</Badge>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Hint"
        collection="feedback"
      >
        <Hint>
          <Hint.Content>Hint</Hint.Content>
        </Hint>
      </ComponentCard>

      <ComponentCard
        title="Progress Bar"
        collection="feedback"
      >
        <ProgressBar
          value={50}
          showValue
        >
          <ProgressBar.Label>Progress</ProgressBar.Label>
          <ProgressBar.Track>
            <ProgressBar.Connects />
          </ProgressBar.Track>
        </ProgressBar>
      </ComponentCard>

      <ComponentCard
        title="Progress Circle"
        collection="feedback"
      >
        <ProgressCircle value={50}>
          <ProgressCircle.Value />
        </ProgressCircle>
      </ComponentCard>

      <ComponentCard
        title="Skeleton"
        collection="feedback"
      >
        <div className="flex w-full flex-col items-start gap-2">
          <Skeleton loading>
            <p>Quisquam, quos.</p>
          </Skeleton>

          <Skeleton loading>
            <Input
              placeholder="Enter text..."
              className="w-full"
            />
          </Skeleton>
          <Skeleton loading>
            <Button variant="primary">Click me</Button>
          </Skeleton>
        </div>
      </ComponentCard>

      <ComponentCard
        title="Toast"
        collection="feedback"
      >
        <div className="bg-menu-background grid grid-cols-[1fr_auto] rounded-lg text-white">
          <div className="grid min-h-14 grid-cols-[1.5rem_1fr] gap-x-2 px-2 py-3">
            <div className="row-span-2 flex h-6 w-6 shrink-0 items-center justify-center self-center">
              <CircleCheckLargeSolid className="text-success-foreground" />
            </div>
            <p className="text-body-medium-strong">Success</p>
            <p className="text-body-medium opacity-70">The operation was successful.</p>
          </div>
          <div className="border-menu-boundary flex items-center justify-center self-stretch border-l px-2">
            Close
          </div>
        </div>
      </ComponentCard>
    </CollectionSection>
  )
})
