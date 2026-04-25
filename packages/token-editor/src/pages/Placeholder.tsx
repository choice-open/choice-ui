type Props = { title: string }

export function PlaceholderPage({ title }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-text-secondary">Panel coming in a follow-up commit.</p>
    </div>
  )
}
