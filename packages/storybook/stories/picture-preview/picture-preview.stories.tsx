import { PicturePreview } from "@choiceform/design-system";
import type { Meta } from "@storybook/react-vite";

// Sample image URLs
const sampleImages = [
  {
    src: "https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fileName: "koi-fish-lotus.jpg",
  },
  {
    src: "https://images.unsplash.com/photo-1745659601865-1af86dec8bcd?q=80&w=3183&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    fileName: "IMG_0658.jpg",
  },
];

const meta: Meta<typeof PicturePreview> = {
  title: "Data Display/PicturePreview",
  component: PicturePreview,
  tags: ["beta"],
  decorators: [
    (Story) => (
      <div className="h-96 w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;

/**
 * `PicturePreview` is a component for displaying image previews with additional metadata.
 *
 * Features:
 * - Clean, responsive image display
 * - File name display
 * - Image loading indicator
 * - Error state handling
 * - Optimized image rendering
 * - Support for various image formats
 *
 * Usage Guidelines:
 * - Use for displaying image previews in galleries, file lists, or attachments
 * - Provide both image source and file name for complete context
 * - Consider appropriate sizing in your layout (component will adapt)
 * - Use in conjunction with image loading or lazy loading for performance
 *
 * Accessibility:
 * - Includes appropriate alt text based on file name
 * - Maintains proper contrast for filename text
 * - Supports keyboard navigation
 * - Loading states are properly communicated to screen readers
 */
export const Default = {
  render: function DefaultStory() {
    return (
      <PicturePreview
        src={sampleImages[0].src}
        fileName={sampleImages[0].fileName}
      />
    );
  },
};

/**
 * WithError: Demonstrates how the component handles image loading errors.
 *
 * This example shows how the PicturePreview component displays an error state
 * when the image fails to load. It provides visual feedback to the user
 * that there was a problem loading the image, while still displaying the
 * filename information.
 */
export const WithError = {
  render: function WithErrorStory() {
    return (
      <PicturePreview
        src="https://example.com/non-existent-image.jpg"
        fileName="broken-image.jpg"
      />
    );
  },
};

/**
 * Gallery: Demonstrates using multiple PicturePreview components together.
 *
 * This example shows how multiple PicturePreview components can be used
 * in a grid layout to create a simple image gallery. Each preview retains
 * its own filename display and error handling capabilities.
 */
export const Gallery = {
  render: function GalleryStory() {
    return (
      <div className="grid grid-cols-2 gap-4">
        {sampleImages.map((image, index) => (
          <PicturePreview
            key={index}
            src={image.src}
            fileName={image.fileName}
          />
        ))}
      </div>
    );
  },
};
