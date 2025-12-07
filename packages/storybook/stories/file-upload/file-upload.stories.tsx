import {
  Button,
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  IconButton,
} from "@choiceform/design-system";
import { DataUpload, RemoveSmall } from "@choiceform/icons-react";
import type { Meta, StoryObj } from "@storybook/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const meta: Meta = {
  title: "Forms/FileUpload",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs", "beta"],
};

export default meta;
type Story = StoryObj;

/**
 * Basic FileUpload with compound component pattern
 */
export const Basic: Story = {
  render: function FileUploadDemo() {
    const [files, setFiles] = useState<File[]>([]);

    const onFileReject = useCallback((file: File, message: string) => {
      toast(message, {
        description: `"${
          file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        }" has been rejected`,
      });
    }, []);

    return (
      <FileUpload
        maxFiles={2}
        maxSize={5 * 1024 * 1024}
        value={files}
        onValueChange={setFiles}
        onFileReject={onFileReject}
        multiple
      >
        <FileUpload.Dropzone>
          <div className="flex flex-col items-center gap-1">
            <DataUpload
              className="text-tertiary-foreground"
              width={32}
              height={32}
              strokeWidth={(2 * 16) / 32}
            />

            <p className="font-strong">Drag & drop files here</p>
            <p className="text-secondary-foreground">
              Or click to browse (max 2 files, up to 5MB each)
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
                <IconButton>
                  <RemoveSmall />
                </IconButton>
              </FileUpload.ItemDelete>
            </FileUpload.Item>
          ))}
        </FileUpload.List>
      </FileUpload>
    );
  },
};

/**
 * Backward compatible usage (still supported)
 */
export const BackwardCompatible: Story = {
  render: function BackwardCompatibleDemo() {
    const [files, setFiles] = useState<File[]>([]);

    const onFileReject = useCallback((file: File, message: string) => {
      toast(message, {
        description: `"${
          file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
        }" has been rejected`,
      });
    }, []);

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

            <p className="font-strong">Drag & drop files here</p>
            <p className="text-secondary-foreground">
              Legacy usage style (still works)
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button variant="secondary" className="mt-2 w-fit">
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>
        <FileUploadList>
          {files.map((file, index) => (
            <FileUploadItem key={index} value={file}>
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
    );
  },
};

/**
 * FileUpload with progress indicators
 */
export const WithProgress: Story = {
  render: function FileUploadWithProgressDemo() {
    const [files, setFiles] = useState<File[]>([]);

    const simulateUpload = async (
      files: File[],
      {
        onProgress,
        onSuccess,
        onError,
      }: {
        onError: (file: File, error: Error) => void;
        onProgress: (file: File, progress: number) => void;
        onSuccess: (file: File) => void;
      }
    ): Promise<void> => {
      for (const file of files) {
        try {
          // Simulate upload progress
          for (let progress = 0; progress <= 100; progress += 10) {
            await new Promise((resolve) => setTimeout(resolve, 100));
            onProgress(file, progress);
          }
          onSuccess(file);
        } catch (error) {
          onError(file, error);
        }
      }
    };

    return (
      <FileUpload
        maxFiles={3}
        value={files}
        onValueChange={setFiles}
        onUpload={simulateUpload}
        multiple
      >
        <FileUpload.Dropzone>
          <div className="flex flex-col items-center gap-1">
            <DataUpload
              className="text-tertiary-foreground"
              width={32}
              height={32}
              strokeWidth={(2 * 16) / 32}
            />
            <p className="font-strong">Drop files to upload</p>
            <p className="text-secondary-foreground">
              Upload will start automatically
            </p>
          </div>
          <FileUpload.Trigger asChild>
            <Button variant="secondary" className="mt-2 w-fit">
              Select files
            </Button>
          </FileUpload.Trigger>
        </FileUpload.Dropzone>
        <FileUpload.List>
          {files.map((file, index) => (
            <FileUpload.Item key={index} value={file}>
              <FileUpload.ItemPreview />
              <div className="flex-1">
                <FileUpload.ItemMetadata />
                <FileUpload.ItemProgress />
              </div>
              <FileUpload.ItemDelete asChild>
                <IconButton>
                  <RemoveSmall />
                </IconButton>
              </FileUpload.ItemDelete>
            </FileUpload.Item>
          ))}
        </FileUpload.List>
      </FileUpload>
    );
  },
};
