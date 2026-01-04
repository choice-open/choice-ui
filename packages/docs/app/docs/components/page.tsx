"use client"

import {
  ButtonsCollection,
  CollectionsCollection,
  DataDisplayCollection,
  DateAndTimeCollection,
  FormsCollection,
  LayoutsCollection,
  NavigationCollection,
  OverlaysCollection,
  PickersCollection,
} from "@/components/components-collection"

export default function ComponentsPage() {
  return (
    <div className="col-span-2 min-w-0 space-y-16">
      <div className="md space-y-2">
        <h1 className="md-h1">All Components</h1>
        <p className="md-h4 text-secondary-foreground">
          Browse all available components organized by category.
        </p>
      </div>

      <div className="flex flex-col gap-y-8">
        <ButtonsCollection />

        <CollectionsCollection />

        <FormsCollection />

        <DateAndTimeCollection />

        <NavigationCollection />

        <OverlaysCollection />

        <LayoutsCollection />

        <DataDisplayCollection />

        <PickersCollection />
      </div>
    </div>
  )
}
