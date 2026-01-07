import { translation } from "../contents"
import { LibrariesEmptyContent } from "./libraries-empty-content"

export const LibrariesSearchEmptyContent = () => {
  return <LibrariesEmptyContent label={translation.common.NO_MATCH} />
}
