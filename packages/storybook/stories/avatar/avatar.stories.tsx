import { Avatar } from "@choiceform/design-system";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo } from "react";

const meta: Meta<typeof Avatar> = {
  title: "Feedback/Avatar",
  component: Avatar,
  tags: ["new", "autodocs"],
};

export default meta;

type Story = StoryObj<typeof Avatar>;

/**
 * Basic: Demonstrates the Avatar component with different names and random background colors.
 * - Shows how the Avatar can display initials or a fallback when no photo is provided.
 * - Useful for user lists, team members, or any entity with a name.
 * - The color prop customizes the background color for each avatar.
 * - Names are generated randomly for demonstration.
 */
export const Basic: Story = {
  render: function BasicStory() {
    const colors = useMemo(() => {
      return Array.from({ length: 4 }, () => {
        const color = faker.color.rgb();
        const name = faker.person.firstName();
        return {
          name,
          color,
        };
      });
    }, []);

    return (
      <div className="grid grid-cols-4 gap-4">
        {colors.map((color) => (
          <div key={color.name} className="flex flex-col items-center gap-2">
            <Avatar name={color.name} color={color.color} />
            <p>{color.name}</p>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Photo: Demonstrates the Avatar component with user photos.
 * - Shows how to provide a photo prop to display a user's image.
 * - If the photo fails to load, the Avatar will fallback to initials or a default state.
 * - Useful for user profiles, comments, or chat applications.
 * - Names and photos are generated randomly for demonstration.
 */
export const Photo: Story = {
  render: function PhotoStory() {
    const photos = useMemo(() => {
      return Array.from({ length: 4 }, (_, index) => {
        const photo = `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`;
        const name = faker.person.firstName();
        return {
          name,
          photo,
        };
      });
    }, []);

    return (
      <div className="grid grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.name} className="flex flex-col items-center gap-2">
            <Avatar name={photo.name} photo={photo.photo} />
            <p>{photo.name}</p>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Sizes: Demonstrates the different size options for the Avatar component.
 * - Shows how to use the size prop: "small", "medium", "large", and custom numeric values.
 * - Useful for adapting Avatar to different UI contexts (e.g., lists, profile pages, dashboards).
 * - Each avatar is given a unique color and labeled with its size.
 * - Numeric sizes allow for precise control over avatar dimensions.
 */
export const Sizes: Story = {
  render: function SizesStory() {
    const presetSizes = [
      { size: "small" as const, label: "small" },
      { size: "medium" as const, label: "medium" },
      { size: "large" as const, label: "large" },
    ];

    const numericSizes = [20, 32, 48, 64];

    return (
      <div className="space-y-8">
        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            Preset Sizes
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {presetSizes.map((item) => (
              <div
                className="flex flex-col items-center gap-2"
                key={item.label}
              >
                <Avatar
                  name={item.label}
                  size={item.size}
                  color={faker.color.rgb()}
                />
                <p className="text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-medium text-gray-700">
            Numeric Sizes
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {numericSizes.map((size) => (
              <div className="flex flex-col items-center gap-2" key={size}>
                <Avatar
                  name={`${size}px`}
                  size={size}
                  color={faker.color.rgb()}
                />
                <p className="text-sm">{size}px</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * States: Demonstrates the different visual states for the Avatar component.
 * - Shows how to use the states prop: "default", "dash", "design", and "spotlight".
 * - Each state may represent a different user status, role, or highlight in your application.
 * - Useful for indicating user activity, special roles, or featured users.
 */
export const States: Story = {
  render: function StatesStory() {
    enum States {
      Dash = "dash",
      Default = "default",
      Design = "design",
      Spotlight = "spotlight",
    }

    return (
      <div className="grid grid-cols-4 gap-4">
        {Object.values(States).map((state) => (
          <div className="flex flex-col items-center gap-2" key={state}>
            <Avatar name={state} states={state} />
            <p>{state}</p>
          </div>
        ))}
      </div>
    );
  },
};

/**
 * Rounded: Demonstrates different border radius options for the Avatar component.
 * - Shows how to customize the rounded corners using className prop with rounded utilities.
 * - Available options: rounded-sm, rounded-md, rounded-lg, rounded-xl, rounded-full.
 * - Useful for adapting Avatar to different design styles or matching other UI elements.
 * - The default Avatar uses rounded-full, but can be overridden with custom className.
 */
export const Rounded: Story = {
  render: function RoundedStory() {
    const roundedClasses = [
      { class: "rounded-sm", label: "rounded-sm" },
      { class: "rounded-md", label: "rounded-md" },
      { class: "rounded-lg", label: "rounded-lg" },
      { class: "rounded-xl", label: "rounded-xl" },
      { class: "rounded-full", label: "rounded-full" },
    ];

    return (
      <div className="grid grid-cols-5 gap-6">
        {roundedClasses.map((rounded) => (
          <div className="flex flex-col items-center gap-2" key={rounded.class}>
            <Avatar
              name="A"
              className={rounded.class}
              photo="https://api.dicebear.com/7.x/avataaars/svg?seed=1"
              size="large"
            />
            <p className="text-sm">{rounded.label}</p>
          </div>
        ))}
      </div>
    );
  },
};
