import {
  File,
  FileArchive,
  FileCode,
  FileDocument,
  FilePicture,
  FileSettings,
  FileSound,
  FileVideo,
} from "@choiceform/icons-react"

export function getFileIcon(file: File) {
  const type = file.type
  const extension = file.name.split(".").pop()?.toLowerCase() ?? ""

  if (type.startsWith("video/")) {
    return <FileVideo />
  }

  if (type.startsWith("audio/")) {
    return <FileSound />
  }

  if (type.startsWith("text/") || ["txt", "md", "rtf", "pdf"].includes(extension)) {
    return <FileDocument />
  }

  if (
    type.startsWith("image/") ||
    ["jpg", "jpeg", "png", "gif", "bmp", "tiff", "ico"].includes(extension)
  ) {
    return <FilePicture />
  }

  if (
    [
      "html",
      "css",
      "js",
      "jsx",
      "ts",
      "tsx",
      "json",
      "xml",
      "php",
      "py",
      "rb",
      "java",
      "c",
      "cpp",
      "cs",
    ].includes(extension)
  ) {
    return <FileCode />
  }

  if (["zip", "rar", "7z", "tar", "gz", "bz2"].includes(extension)) {
    return <FileArchive />
  }

  if (
    ["exe", "msi", "app", "apk", "deb", "rpm"].includes(extension) ||
    type.startsWith("application/")
  ) {
    return <FileSettings />
  }

  return <File />
}
