import plugin from "tailwindcss/plugin"

/**
 * Grid Areas Plugin for Tailwind CSS v4
 *
 * Provides utilities for CSS Grid named areas:
 * - grid-areas-{name}: Define grid template areas (CSS: grid-template-areas)
 * - grid-area-{name}: Place elements in named grid areas (CSS: grid-area)
 * - row-start-{name}, row-end-{name}: Row positioning with named lines
 * - col-start-{name}, col-end-{name}: Column positioning with named lines
 * - row-span-{name}, col-span-{name}: Span from named line to named line
 */

export interface GridTemplateArea {
  /** Array of strings representing each row of the grid template */
  rows: string[]
  /** Optional grid-template-rows definition */
  gridTemplateRows?: string
  /** Optional grid-template-columns definition */
  gridTemplateColumns?: string
}

export interface GridAreasPluginOptions {
  /**
   * Named grid template areas
   * @example
   * {
   *   layout: {
   *     rows: [
   *       "header header header",
   *       "sidebar main main",
   *       "footer footer footer"
   *     ],
   *     gridTemplateRows: "auto 1fr auto",
   *     gridTemplateColumns: "200px 1fr 1fr"
   *   }
   * }
   */
  gridTemplateAreas?: Record<string, GridTemplateArea | string[]>
}

// CSS global/keyword values
const CSS_KEYWORDS = ["none", "inherit", "initial", "revert", "revert-layer", "unset"] as const
const GRID_AREA_KEYWORDS = ["auto", ...CSS_KEYWORDS] as const

/**
 * Extract unique area names from grid template area definitions
 */
function extractAreaNames(rows: string[]): string[] {
  const areaNames = new Set<string>()

  for (const row of rows) {
    const areas = row.trim().split(/\s+/)
    for (const area of areas) {
      // Skip dots (empty cells) and add unique area names
      if (area !== "." && area !== "..") {
        areaNames.add(area)
      }
    }
  }

  return Array.from(areaNames)
}

/**
 * Convert grid template area definition to CSS grid-template-areas value
 */
function formatGridTemplateAreas(rows: string[]): string {
  return rows.map((row) => `"${row}"`).join(" ")
}

/**
 * Normalize the grid template area config to a consistent format
 */
function normalizeAreaConfig(
  config: GridTemplateArea | string[]
): GridTemplateArea {
  if (Array.isArray(config)) {
    return { rows: config }
  }
  return config
}

/**
 * Parse arbitrary value syntax for grid areas
 * Supports: grid-areas-[header_main,sidebar_footer] where _ = space, , = row separator
 * Also supports CSS variables: grid-areas-[var(--my-areas)]
 */
function parseArbitraryGridAreas(value: string): string {
  // If the value is a CSS variable, return it as-is
  if (value.match(/^var\(.*\)$/)) {
    return value
  }

  const rows = value.split(",").map((row) => {
    const trimmed = row.replace(/_/g, " ").trim()
    // If row contains a CSS variable, don't wrap in quotes
    if (trimmed.match(/var\(.*\)/)) {
      return trimmed
    }
    return `"${trimmed}"`
  })
  return rows.join(" ")
}

interface CssInJs {
  [key: string]: string | string[] | CssInJs | CssInJs[]
}

/**
 * Tailwind CSS v4 Grid Areas Plugin
 *
 * @example
 * // In tailwind.css
 * @plugin "@choice-ui/react/grid-areas";
 *
 * // In HTML
 * <div class="grid-areas-[header_header,sidebar_main,footer_footer]">
 *   <header class="grid-area-[header]">Header</header>
 *   <aside class="grid-area-[sidebar]">Sidebar</aside>
 *   <main class="grid-area-[main]">Main</main>
 *   <footer class="grid-area-[footer]">Footer</footer>
 * </div>
 */
export const gridAreasPlugin = plugin.withOptions<GridAreasPluginOptions>(
  (options: GridAreasPluginOptions = {}) => {
    return ({ addUtilities, matchUtilities }) => {
      const { gridTemplateAreas = {} } = options

      // Collect all area names from all templates
      const allAreaNames = new Set<string>()

      // Generate grid-areas-{name} utilities (grid-template-areas)
      const gridAreasUtilities: Record<string, CssInJs> = {}

      for (const [name, config] of Object.entries(gridTemplateAreas)) {
        const normalizedConfig = normalizeAreaConfig(config)
        const { rows, gridTemplateRows, gridTemplateColumns } = normalizedConfig

        // Extract area names for this template
        const areaNames = extractAreaNames(rows)
        areaNames.forEach((areaName) => allAreaNames.add(areaName))

        // Build the utility styles
        const styles: CssInJs = {
          display: "grid",
          "grid-template-areas": formatGridTemplateAreas(rows),
        }

        if (gridTemplateRows) {
          styles["grid-template-rows"] = gridTemplateRows
        }

        if (gridTemplateColumns) {
          styles["grid-template-columns"] = gridTemplateColumns
        }

        gridAreasUtilities[`.grid-areas-${name}`] = styles
      }

      // Add CSS keyword utilities for grid-areas
      for (const keyword of CSS_KEYWORDS) {
        gridAreasUtilities[`.grid-areas-${keyword}`] = {
          display: "grid",
          "grid-template-areas": keyword,
        }
      }

      addUtilities(gridAreasUtilities)

      // Generate grid-area-{name} utilities for placing items in areas
      const gridAreaUtilities: Record<string, CssInJs> = {}

      for (const areaName of allAreaNames) {
        gridAreaUtilities[`.grid-area-${areaName}`] = {
          "grid-area": areaName,
        }
      }

      // Add CSS keyword utilities for grid-area
      for (const keyword of GRID_AREA_KEYWORDS) {
        gridAreaUtilities[`.grid-area-${keyword}`] = {
          "grid-area": keyword,
        }
      }

      addUtilities(gridAreaUtilities)

      // Generate row/column start/end utilities with named lines
      const lineUtilities: Record<string, CssInJs> = {}

      for (const areaName of allAreaNames) {
        // Row utilities
        lineUtilities[`.row-start-${areaName}`] = {
          "grid-row-start": `${areaName}-start`,
        }
        lineUtilities[`.row-end-${areaName}`] = {
          "grid-row-end": `${areaName}-end`,
        }
        lineUtilities[`.row-span-${areaName}`] = {
          "grid-row": `${areaName}-start / ${areaName}-end`,
        }

        // Column utilities
        lineUtilities[`.col-start-${areaName}`] = {
          "grid-column-start": `${areaName}-start`,
        }
        lineUtilities[`.col-end-${areaName}`] = {
          "grid-column-end": `${areaName}-end`,
        }
        lineUtilities[`.col-span-${areaName}`] = {
          "grid-column": `${areaName}-start / ${areaName}-end`,
        }
      }

      addUtilities(lineUtilities)

      // Match utilities for arbitrary values

      // grid-areas-[value] - arbitrary grid template areas
      matchUtilities(
        {
          "grid-areas": (value: string) => ({
            display: "grid",
            "grid-template-areas": parseArbitraryGridAreas(value),
          }),
        },
        { values: {} }
      )

      // grid-area-[value] - arbitrary grid area placement
      matchUtilities(
        {
          "grid-area": (value: string) => ({
            "grid-area": value.replace(/_/g, " "),
          }),
        },
        { values: {} }
      )

      // row-start-[value], row-end-[value] for arbitrary line names
      matchUtilities(
        {
          "row-start": (value: string) => ({
            "grid-row-start": value,
          }),
          "row-end": (value: string) => ({
            "grid-row-end": value,
          }),
        },
        { values: {} }
      )

      // col-start-[value], col-end-[value] for arbitrary line names
      matchUtilities(
        {
          "col-start": (value: string) => ({
            "grid-column-start": value,
          }),
          "col-end": (value: string) => ({
            "grid-column-end": value,
          }),
        },
        { values: {} }
      )
    }
  }
)

export default gridAreasPlugin
