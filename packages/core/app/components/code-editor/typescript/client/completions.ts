import {
  type CompletionContext,
  insertCompletionText,
  pickedCompletion,
  type Completion,
  type CompletionSource,
} from "@codemirror/autocomplete"
import { typescriptWorkerFacet } from "./facet"
import { blockCommentSnippet, snippets } from "./snippets"
import { longestCommonPrefix, prefixMatch } from "../../utils"

const START_CHARACTERS = ['"', "'", "(", ".", "@"]
const START_CHARACTERS_REGEX = /[.('"@]/

export const matchText = (context: CompletionContext) => {
  let word = context.matchBefore(START_CHARACTERS_REGEX)
  if (!word?.text) {
    word = context.matchBefore(/[$\w]+/)
  }
  if (!word?.text) {
    word = context.matchBefore(/["'].*/)
  }
  return word
}

export const typescriptCompletionSource: CompletionSource = async (context) => {
  const { worker } = context.state.facet(typescriptWorkerFacet)

  const line = context.state.doc.lineAt(context.pos)
  const lineText = line.text
  const importMatch = lineText.match(/^\s*import\s.*from\s*["']([^"']*)$/)

  if (importMatch) {
    const from = context.pos - importMatch[1].length
    const modulePrefix = importMatch[1]

    const moduleNames = (await worker.getModuleNames?.()) ?? []

    const options: Completion[] = moduleNames
      .filter((name) => name.startsWith(modulePrefix))
      .map((name) => ({
        label: name,
        type: "import",
        apply: name,
      }))

    return {
      from,
      options,
      filter: false,
    }
  }

  const word = matchText(context)

  const blockComment = context.matchBefore(/\/\*?\*?/)
  if (blockComment) {
    // Autocomplete a block comment snippet
    return { from: blockComment?.from, options: [blockCommentSnippet] }
  }

  if (!word) return null

  const completionResult = await worker.getCompletionsAtPos(context.pos)

  if (!completionResult || context.aborted) return null

  const { result, isGlobal } = completionResult

  let options = [...result.options]

  if (isGlobal) {
    options = options.concat(snippets)
  }

  return {
    from: word ? (START_CHARACTERS.includes(word.text) ? word.to : word.from) : context.pos,
    filter: false,
    getMatch(completion: Completion) {
      const lcp = longestCommonPrefix(completion.label, word.text)
      return [0, lcp.length]
    },
    options: options
      .filter(
        (option) =>
          word.text === "" ||
          START_CHARACTERS.includes(word.text) ||
          prefixMatch(
            option.label.replace(START_CHARACTERS_REGEX, ""),
            word.text.replace(START_CHARACTERS_REGEX, ""),
          ),
      )
      .map((completion) => {
        if (completion.label.endsWith("()")) {
          completion.apply = (view, _, from, to) => {
            const cursorPosition = from + completion.label.length - 1
            view.dispatch({
              ...insertCompletionText(view.state, completion.label, from, to),
              annotations: pickedCompletion.of(completion),
              selection: { anchor: cursorPosition, head: cursorPosition },
            })
          }
        }
        return completion
      }),
  }
}
