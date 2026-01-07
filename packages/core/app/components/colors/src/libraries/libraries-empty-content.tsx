type Props = {
  label: string
}

export const LibrariesEmptyContent = ({ label }: Props) => {
  return (
    <div className="text-secondary flex h-16 w-[240px] items-center justify-center select-none">
      <span>{label}</span>
    </div>
  )
}
