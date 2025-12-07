import type { PaginationRootProps } from "@choiceform/design-system";
import { Pagination } from "@choiceform/design-system";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

const meta: Meta<typeof Pagination> = {
  title: "Navigation/Pagination",
  component: Pagination,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "An advanced pagination component with multiple display options, page size selection, and jump-to-page functionality.",
      },
    },
  },
  tags: ["autodocs", "new"],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component for controlled stories - using default layout
const PaginationWrapper = (
  props: Partial<PaginationRootProps> & { totalItems: number }
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(props.itemsPerPage || 10);

  return (
    <Pagination
      {...props}
      currentPage={currentPage}
      totalItems={props.totalItems}
      itemsPerPage={itemsPerPage}
      onPageChange={setCurrentPage}
      onItemsPerPageChange={setItemsPerPage}
    >
      <Pagination.Spinner />
      <Pagination.Navigation />
      <Pagination.ItemsPerPage />
    </Pagination>
  );
};

export const Default: Story = {
  render: () => <PaginationWrapper totalItems={100} />,
};

export const BasicPagination: Story = {
  args: {
    currentPage: 1,
    totalItems: 100,
    itemsPerPage: 10,
  },
  render: (args) => <PaginationWrapper {...args} />,
};

export const RealWorldExample: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(25);
    const totalItems = 1337;

    // Simulate data for current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentItems = Array.from(
      { length: endIndex - startIndex },
      (_, i) => `Item ${startIndex + i + 1}`
    );

    return (
      <div className="w-full space-y-4">
        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-lg font-semibold">Data Table Example</h3>
          <div className="mb-4 space-y-2">
            {currentItems.map((item) => (
              <div
                key={item}
                className="rounded bg-gray-50 px-3 py-2 dark:bg-gray-800"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
          pageSizeOptions={[10, 25, 50, 100]}
        >
          <Pagination.Spinner />
          <Pagination.Navigation />
          <Pagination.ItemsPerPage />
        </Pagination>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const ResponsiveExample: Story = {
  render: function Render() {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    return (
      <div className="w-full space-y-8">
        <div>
          <h3 className="mb-2 text-sm font-medium">
            Desktop View (All Features)
          </h3>
          <Pagination
            currentPage={currentPage}
            totalItems={500}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            showPageSizeSelector={true}
          >
            <Pagination.Spinner />
            <Pagination.Navigation />
            <Pagination.ItemsPerPage />
          </Pagination>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">Mobile View (Compact)</h3>
          <Pagination
            currentPage={currentPage}
            totalItems={500}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={setItemsPerPage}
            maxPageButtons={5}
          >
            <Pagination.Navigation />
          </Pagination>
        </div>
      </div>
    );
  },
  parameters: {
    layout: "padded",
  },
};

export const LoadingState: Story = {
  render: function Render() {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const handlePageChange = (page: number) => {
      setIsLoading(true);
      setCurrentPage(page);

      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    const handleItemsPerPageChange = (newItemsPerPage: number) => {
      setIsLoading(true);
      setItemsPerPage(newItemsPerPage);
      setCurrentPage(1); // Reset to first page

      // Simulate API delay
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    return (
      <div className="w-full space-y-4">
        <div className="rounded-lg border p-4">
          <div className="mb-4 flex items-center gap-4">
            <h3 className="text-lg font-semibold">Loading State Example</h3>
            <button
              type="button"
              onClick={() => setIsLoading(!isLoading)}
              className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
            >
              Toggle Loading
            </button>
          </div>

          <div className="mb-4 space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="h-8 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            ) : (
              Array.from({ length: itemsPerPage }, (_, i) => (
                <div
                  key={`${currentPage}-${i}`}
                  className="rounded bg-gray-50 px-3 py-2 dark:bg-gray-800"
                >
                  Page {currentPage} - Item {i + 1}
                </div>
              ))
            )}
          </div>
        </div>

        <Pagination
          currentPage={currentPage}
          totalItems={250}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          loading={isLoading}
          pageSizeOptions={[10, 20, 50, 100]}
        >
          <Pagination.Spinner />
          <Pagination.Navigation />
          <Pagination.ItemsPerPage />
        </Pagination>
      </div>
    );
  },
  parameters: {
    layout: "padded",
    docs: {
      description: {
        story:
          "Demonstrates pagination in loading state. Click pagination controls to see loading behavior, or use the 'Toggle Loading' button to manually control the loading state.",
      },
    },
  },
};
