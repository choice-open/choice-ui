import { IndexGenerator } from "fractional-indexing-jittered"
import { SortableItem } from "../context"

export function setupIndexGenerator<T extends SortableItem>(
  data: T[],
  externalGenerator?: IndexGenerator,
): IndexGenerator {
  if (externalGenerator) {
    externalGenerator.updateList(data.map((item) => item.indexKey))
    return externalGenerator
  }

  return new IndexGenerator(data.map((item) => item.indexKey))
}
