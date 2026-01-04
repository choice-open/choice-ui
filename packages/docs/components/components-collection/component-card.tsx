import Link from "next/link"
import { memo } from "react"

interface ComponentCardProps {
  children: React.ReactNode
  title: string
  collection?: string
}

export const ComponentCard = memo(function ComponentCard({
  children,
  title,
  collection,
}: ComponentCardProps) {
  const href = `/docs/components/${collection}/${title.toLowerCase().replaceAll(" ", "-")}`

  return (
    <div className="flex flex-col gap-2">
      <Link
        href={href}
        className="cursor-pointer"
      >
        <div className="hover:border-disabled-background bg-default-background flex aspect-square flex-col rounded-xl border p-4 dark:border-transparent">
          <div className="pointer-events-none relative flex aspect-square flex-1 flex-col items-center justify-center [&_*]:pointer-events-none">
            {children}
          </div>
        </div>
      </Link>
      <p className="text-body-medium px-1">{title}</p>
    </div>
  )
})
