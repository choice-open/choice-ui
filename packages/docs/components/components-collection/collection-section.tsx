import { memo } from "react"

interface CollectionSectionProps {
  children: React.ReactNode
  title: string
  description?: string
}

export const CollectionSection = memo(function CollectionSection({
  children,
  title,
  description,
}: CollectionSectionProps) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-x-4 gap-y-4">
      <div className="md col-span-full">
        <h2 className="md-h3">{title}</h2>
        {description && <p className="text-secondary-foreground md-p">{description}</p>}
      </div>
      {children}
    </div>
  )
})
