# PicturePreview Component

A comprehensive image preview component with advanced zoom, pan, and navigation capabilities. Perfect for image galleries, file previews, and detailed image inspection interfaces.

## Overview

The PicturePreview component provides a full-featured image viewing experience with zoom controls, drag-to-pan functionality, keyboard shortcuts, and loading/error state handling. It's optimized for performance and provides smooth interactions.

## Usage

### Basic Usage

```tsx
import { PicturePreview } from "~/components/picture-preview"

export function BasicExample() {
  return (
    <div className="h-96 w-2xl">
      <PicturePreview
        src="https://example.com/image.jpg"
        fileName="sample-image.jpg"
      />
    </div>
  )
}
```

### With Error Handling

```tsx
export function ErrorHandlingExample() {
  return (
    <PicturePreview
      src="https://example.com/non-existent-image.jpg"
      fileName="broken-image.jpg"
      defaultText={{
        error: "Failed to load image. Please check the URL and try again.",
      }}
    />
  )
}
```

### Image Gallery

```tsx
import { useState } from "react"

export function GalleryExample() {
  const images = [
    { src: "https://example.com/image1.jpg", fileName: "image1.jpg" },
    { src: "https://example.com/image2.jpg", fileName: "image2.jpg" },
    { src: "https://example.com/image3.jpg", fileName: "image3.jpg" },
  ]

  return (
    <div className="grid h-96 grid-cols-2 gap-4">
      {images.map((image, index) => (
        <PicturePreview
          key={index}
          src={image.src}
          fileName={image.fileName}
        />
      ))}
    </div>
  )
}
```

## Props

| Prop          | Type       | Default | Description                                      |
| ------------- | ---------- | ------- | ------------------------------------------------ |
| `src`         | `string`   | -       | **Required.** The image URL to display           |
| `fileName`    | `string`   | -       | Optional filename for accessibility and display  |
| `onClose`     | `function` | -       | Callback function when close action is triggered |
| `className`   | `string`   | -       | Additional CSS classes                           |
| `defaultText` | `object`   | -       | Customizable text labels (see below)             |
| `control`     | `object`   | -       | Control bar configuration (see below)            |

### Control Configuration

```tsx
control?: {
  enable?: boolean                                          // Enable/disable control bar (default: true)
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"  // Control bar position (default: "bottom-right")
  show?: "always" | "hover"                                 // Show mode (default: "hover")
}
```

Default values:

```tsx
{
  enable: true,
  position: "bottom-right",
  show: "hover"
}
```

### Default Text Configuration

```tsx
defaultText?: {
  error: string              // Error message text
  fitToScreen: string        // Fit to screen button text
  zoomIn: string            // Zoom in button text
  zoomOut: string           // Zoom out button text
  zoomTo100: string         // Zoom to 100% text
  zoomTo200: string         // Zoom to 200% text
  zoomTo50: string          // Zoom to 50% text
}
```

Default values:

```tsx
{
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  fitToScreen: "Fit to screen",
  zoomTo50: "Zoom to 50%",
  zoomTo100: "Zoom to 100%",
  zoomTo200: "Zoom to 200%",
  error: "Image loading failed, please try again."
}
```

## Features

### Zoom Controls

- **Mouse wheel**: Zoom in/out centered at cursor position
- **Trackpad pinch**: Two-finger pinch-to-zoom on trackpad
- **Zoom buttons**: Increment/decrement zoom level
- **Zoom dropdown**: Quick access to common zoom levels (50%, 100%, 200%)
- **Zoom range**: 2% to 1000% based on actual image size
- **Actual percentage display**: Shows zoom relative to original image dimensions
- **Keyboard shortcuts**: `Cmd/Ctrl + Plus/Minus` for zooming

### Pan and Navigation

- **Drag to pan**: Click and drag to move the image
- **Smooth panning**: Performance-optimized pan interactions
- **Reset view**: Return to original position and zoom
- **Fit to screen**: Automatically fit image to container
- **Double-click to fit**: Double-click anywhere to fit image to screen

### Loading States

- **Loading indicator**: Animated spinner while image loads
- **Smooth transition**: Blur and scale animation when image loads
- **Error handling**: Clear error message with retry capability
- **Graceful fallbacks**: Alt text and filename fallbacks

### Control Bar

- **Configurable position**: Place controls in any corner
- **Show on hover**: Auto-hide controls, show on hover
- **Always visible**: Option to keep controls always visible
- **Disable controls**: Option to hide control bar entirely

### Keyboard Shortcuts

| Shortcut           | Action                  |
| ------------------ | ----------------------- |
| `Cmd/Ctrl + Plus`  | Zoom in                 |
| `Cmd/Ctrl + Minus` | Zoom out                |
| `Cmd/Ctrl + 0`     | Reset zoom and position |
| `Cmd/Ctrl + 1`     | Fit to screen           |

## Advanced Examples

### Control Bar Configuration

```tsx
// Always visible controls in top-right corner
<PicturePreview
  src="https://example.com/image.jpg"
  control={{
    enable: true,
    position: "top-right",
    show: "always",
  }}
/>

// Hidden controls (for custom UI)
<PicturePreview
  src="https://example.com/image.jpg"
  control={{ enable: false }}
/>

// Show on hover in bottom-left
<PicturePreview
  src="https://example.com/image.jpg"
  control={{
    position: "bottom-left",
    show: "hover",
  }}
/>
```

### Custom Error Handling

```tsx
import { useState } from "react"

export function CustomErrorExample() {
  const [imageSrc, setImageSrc] = useState("https://example.com/broken-image.jpg")
  const [hasError, setHasError] = useState(false)

  const handleRetry = () => {
    setHasError(false)
    // Reload or fetch alternative image
    setImageSrc(`${imageSrc}?retry=${Date.now()}`)
  }

  return (
    <PicturePreview
      src={imageSrc}
      fileName="retryable-image.jpg"
      defaultText={{
        error: hasError ? "Image failed to load. Click to retry." : "Loading image...",
      }}
    />
  )
}
```

### Full-Screen Modal Integration

```tsx
import { useState } from "react"

export function FullScreenExample() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>("")

  const openPreview = (imageSrc: string) => {
    setSelectedImage(imageSrc)
    setIsOpen(true)
  }

  return (
    <>
      {/* Thumbnail grid */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            className="cursor-pointer rounded hover:opacity-80"
            onClick={() => openPreview(image.src)}
          />
        ))}
      </div>

      {/* Full-screen modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="max-h-4xl m-4 h-full w-full max-w-6xl">
            <PicturePreview
              src={selectedImage}
              fileName="full-screen-preview.jpg"
              onClose={() => setIsOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  )
}
```

### Controlled Zoom State

```tsx
import { useState, useRef } from "react"

export function ControlledZoomExample() {
  const [currentZoom, setCurrentZoom] = useState(1)
  const previewRef = useRef<HTMLDivElement>(null)

  const handleZoomChange = (newZoom: number) => {
    setCurrentZoom(newZoom)
    // Additional logic when zoom changes
    console.log(`Zoom changed to: ${Math.round(newZoom * 100)}%`)
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <span>Current Zoom: {Math.round(currentZoom * 100)}%</span>
        <button
          onClick={() => handleZoomChange(0.5)}
          className="rounded bg-blue-500 px-2 py-1 text-white"
        >
          50%
        </button>
        <button
          onClick={() => handleZoomChange(1)}
          className="rounded bg-blue-500 px-2 py-1 text-white"
        >
          100%
        </button>
        <button
          onClick={() => handleZoomChange(2)}
          className="rounded bg-blue-500 px-2 py-1 text-white"
        >
          200%
        </button>
      </div>

      <PicturePreview
        ref={previewRef}
        src="https://example.com/detailed-image.jpg"
        fileName="controlled-zoom.jpg"
      />
    </div>
  )
}
```

### Performance-Optimized Gallery

```tsx
import { useState, useCallback, useMemo } from "react"

export function OptimizedGalleryExample() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const images = useMemo(
    () => [
      { src: "https://example.com/image1.jpg", fileName: "image1.jpg" },
      { src: "https://example.com/image2.jpg", fileName: "image2.jpg" },
      { src: "https://example.com/image3.jpg", fileName: "image3.jpg" },
    ],
    [],
  )

  const handlePrevious = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }, [images.length])

  const currentImage = images[selectedIndex]

  return (
    <div className="flex h-96 flex-col">
      <div className="mb-2 flex items-center justify-between">
        <button
          onClick={handlePrevious}
          className="rounded bg-gray-200 px-3 py-1"
        >
          Previous
        </button>
        <span>
          {selectedIndex + 1} of {images.length}
        </span>
        <button
          onClick={handleNext}
          className="rounded bg-gray-200 px-3 py-1"
        >
          Next
        </button>
      </div>

      <div className="flex-1">
        <PicturePreview
          key={selectedIndex} // Force re-render for new images
          src={currentImage.src}
          fileName={currentImage.fileName}
        />
      </div>
    </div>
  )
}
```

## Accessibility

### Keyboard Navigation

- All zoom and pan actions are available via keyboard shortcuts
- Focus management for interactive controls
- Proper tab order through zoom controls

### Screen Reader Support

- Descriptive alt text based on filename
- Loading state announcements
- Error state communication
- Zoom level announcements

### Visual Accessibility

- High contrast loading and error indicators
- Clear visual feedback for all interactive states
- Sufficient color contrast for all text elements

## Performance Considerations

### Optimization Features

- **Hardware acceleration**: Uses `transform3d` and `will-change` for smooth animations
- **RAF scheduling**: Optimized animation frame usage for zoom updates
- **Event throttling**: Efficient handling of wheel and drag events
- **Memory management**: Proper cleanup of event listeners and animation frames

### Best Practices

1. **Container sizing**: Always provide explicit container dimensions
2. **Image optimization**: Use appropriately sized images for your use case
3. **Lazy loading**: Consider implementing lazy loading for image galleries
4. **Error boundaries**: Wrap in error boundaries for robust error handling

## Styling and Theming

The component uses Tailwind Variants for styling and supports:

- Dark/light theme compatibility
- Custom styling through className props
- CSS variables for consistent theming
- Responsive design considerations

## Browser Compatibility

- Modern browsers with ES2015+ support
- Proper fallbacks for older browsers
- Touch device support for mobile interactions
- High DPI display optimization
