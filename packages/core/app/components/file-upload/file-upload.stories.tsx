import { DataUpload, RemoveSmall } from "@choiceform/icons-react"
import type { Meta, StoryObj } from "@storybook/react"
import React, { useCallback, useState } from "react"
import { toast } from "sonner"
import { Button } from "../button"
import { IconButton } from "../icon-button"
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "./file-upload"

const meta: Meta = {
  title: "Forms/FileUpload",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
}

export default meta
type Story = StoryObj

/**
 * Basic FileUpload
 */
export const Basic: Story = {
  render: function FileUploadDemo() {
    const [files, setFiles] = useState<File[]>([])

    const onFileReject = useCallback((file: File, message: string) => {
      toast(message, {
        description: `"${
          file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        }" has been rejected`,
      })
    }, [])

    return (
      <FileUpload
        maxFiles={2}
        maxSize={5 * 1024 * 1024}
        value={files}
        onValueChange={setFiles}
        onFileReject={onFileReject}
        multiple
      >
        <FileUploadDropzone>
          <div className="flex flex-col items-center gap-1">
            <DataUpload
              className="text-tertiary-foreground"
              width={32}
              height={32}
              strokeWidth={(2 * 16) / 32}
            />

            <p className="font-medium">Drag & drop files here</p>
            <p className="text-secondary-foreground">
              Or click to browse (max 2 files, up to 5MB each)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button
              variant="secondary"
              className="mt-2 w-fit"
            >
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file, index) => (
            <FileUploadItem
              key={index}
              value={file}
            >
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <IconButton>
                  <RemoveSmall />
                </IconButton>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
      </FileUpload>
    )
  },
}
