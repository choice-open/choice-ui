import { Input } from "@choice-ui/input"
import { Search } from "@choiceform/icons-react"
import { translation } from "../contents"

type Props = {
  onSearchValueChange: (value: string) => void
  searchValue: string
}

export const IfLibrariesSearchInput = (props: Props) => {
  const { searchValue, onSearchValueChange } = props

  return (
    <div className="flex items-center border-b px-3 py-2">
      <Search />
      <Input
        autoFocus
        value={searchValue}
        onChange={onSearchValueChange}
        placeholder={translation.common.SEARCH}
        variant="reset"
        className="flex-1"
      />
    </div>
  )
}
