import { useMemo } from "react"
import { translation } from "../../contents"
import type { Style, Variable } from "../../types"

export type CategoryOption = { label: string; value: string }

interface UseLibraryCategoriesProps {
  styles?: Style[]
  variables?: Variable[]
}

export function useLibraryCategories({ variables = [], styles = [] }: UseLibraryCategoriesProps) {
  return useMemo(() => {
    const categories = new Set<string>()

    // 收集变量的分类
    variables.forEach((v: Variable) => {
      if (v.masterId) {
        categories.add(v.masterId.split("/")[0])
      }
    })

    // 收集样式的分类
    styles.forEach((s: Style) => {
      if (s.fileId) {
        categories.add(s.fileId.split("/")[0])
      }
    })

    return [
      { label: translation.libraries.ALL, value: "all" },

      ...Array.from(categories).map((category) => ({
        label: category,
        value: category,
      })),
    ] as CategoryOption[]
  }, [variables, styles])
}
