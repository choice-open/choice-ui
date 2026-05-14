import { Button, FileUpload, IconButton } from "@choice-ui/react"
import { DataUpload } from "@choiceform/icons-react"
import { useState } from "react"

export function AssetUploadBlock() {
  const [files, setFiles] = useState<File[]>([])

  return (
    <section className="flex flex-col rounded-lg bg-background-default shadow-sm">
      <header className="border-b border-border-default px-5 py-4">
        <span className="text-body-small uppercase tracking-wide text-text-tertiary">
          Assets
        </span>
        <h3 className="text-heading-small">Upload theme bundle</h3>
      </header>
      <div className="px-5 py-4">
        <FileUpload
          maxFiles={3}
          maxSize={5 * 1024 * 1024}
          value={files}
          onValueChange={setFiles}
          multiple
        >
          <FileUpload.Dropzone>
            <div className="flex flex-col items-center gap-1.5 py-2">
              <DataUpload className="text-text-tertiary" width={28} height={28} />
              <p className="text-body-medium text-text-default">Drop a `.zip` or pick files</p>
              <p className="text-body-small text-text-tertiary">
                Up to 3 files · 5 MB each
              </p>
            </div>
            <FileUpload.Trigger asChild>
              <Button variant="secondary" className="mt-2 w-fit">
                Browse files
              </Button>
            </FileUpload.Trigger>
          </FileUpload.Dropzone>
          <FileUpload.List>
            {files.map((file, index) => (
              <FileUpload.Item key={index} value={file}>
                <FileUpload.ItemPreview />
                <FileUpload.ItemMetadata />
                <FileUpload.ItemDelete asChild>
                  <IconButton variant="ghost" aria-label="Remove">
                    ×
                  </IconButton>
                </FileUpload.ItemDelete>
              </FileUpload.Item>
            ))}
          </FileUpload.List>
        </FileUpload>
      </div>
    </section>
  )
}
