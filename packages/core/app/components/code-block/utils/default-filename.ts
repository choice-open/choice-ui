export function getDefaultFilenameForLanguage(language: string): string {
  const lang = language.trim().toLowerCase()

  switch (lang) {
    case "tsx":
      return "component.tsx"
    case "jsx":
      return "component.jsx"
    case "ts":
      return "script.ts"
    case "js":
      return "script.js"
    case "html":
      return "file.html"
    case "css":
      return "styles.css"
    case "json":
      return "data.json"
    case "bash":
    case "sh":
    case "shell":
      return "script.sh"
    case "yaml":
    case "yml":
      return "config.yaml"
    case "md":
    case "markdown":
      return "README.md"
    case "py":
    case "python":
      return "script.py"
    case "go":
      return "main.go"
    case "rs":
    case "rust":
      return "main.rs"
    case "java":
      return "Main.java"
    case "kt":
    case "kotlin":
      return "Main.kt"
    case "c":
      return "main.c"
    case "cpp":
    case "cc":
    case "cxx":
      return "main.cpp"
    case "cs":
      return "Program.cs"
    case "sql":
      return "query.sql"
    case "graphql":
    case "gql":
      return "schema.graphql"
    case "xml":
      return "file.xml"
    case "svg":
      return "image.svg"
    case "plaintext":
    case "text":
      return "file.txt"
    default:
      return "file.txt"
  }
}


