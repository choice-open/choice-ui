import type { User } from "@choiceform/design-system";
import {
  CommentItem,
  CustomElement,
  Dialog,
  ImageElement,
  Modal,
  PicturePreview,
} from "@choiceform/design-system";
import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useMemo, useState } from "react";
import { Descendant } from "slate";

const meta = {
  title: "Components/Comments/CommentItem",
  component: CommentItem,
  decorators: [
    (Story) => (
      <Modal>
        <Modal.Content className="w-80 p-0 py-4">
          <Story />
        </Modal.Content>
      </Modal>
    ),
  ],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

// 创建一个 mock user
const mockUser: User = {
  id: "1",
  name: "Jane Doe",
  email: "jane@example.com",
  photo_url: "https://i.pravatar.cc/150?img=1",
  color: null,
};

// 基本评论示例
export const Basic: Story = {
  args: {
    author: mockUser,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message_meta: [
      {
        type: "paragraph",
        children: [{ text: "This is a basic comment without any formatting." }],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 带格式的评论示例（1天前）- 中文
export const WithFormattingChinese: Story = {
  args: {
    author: {
      id: "2",
      name: "John Smith",
      email: "john@example.com",
      photo_url: "https://i.pravatar.cc/150?img=2",
      color: null,
    },
    created_at: new Date(Date.now() - 86400000), // 1 day ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          { text: "这条评论包含 " },
          { text: "粗体", bold: true },
          { text: "、" },
          { text: "斜体", italic: true },
          { text: "和" },
          { text: "下划线", underline: true },
          { text: "文本，以及" },
          { text: "删除线", strikethrough: true },
          { text: "。" },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 带格式的评论示例（1天前）- 英文
export const WithFormattingEnglish: Story = {
  args: {
    author: {
      id: "2",
      name: "John Smith",
      email: "john@example.com",
      photo_url: "https://i.pravatar.cc/150?img=2",
      color: null,
    },
    created_at: new Date(Date.now() - 86400000), // 1 day ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          { text: "This comment has " },
          { text: "bold", bold: true },
          { text: ", " },
          { text: "italic", italic: true },
          { text: ", and " },
          { text: "underlined", underline: true },
          { text: " text, as well as " },
          { text: "strikethrough", strikethrough: true },
          { text: "." },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "en-us",
  },
};

// 今日内评论示例（2小时前）- 中文
export const RecentCommentChinese: Story = {
  args: {
    author: {
      id: "9",
      name: "Rebecca Moore",
      email: "rebecca@example.com",
      photo_url: "https://i.pravatar.cc/150?img=9",
      color: null,
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message_meta: [
      {
        type: "paragraph",
        children: [{ text: "这条评论是最近发布的，显示相对时间格式。" }],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 今日内评论示例（2小时前）- 英文
export const RecentCommentEnglish: Story = {
  args: {
    author: {
      id: "9",
      name: "Rebecca Moore",
      email: "rebecca@example.com",
      photo_url: "https://i.pravatar.cc/150?img=9",
      color: null,
    },
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          {
            text: "This comment was posted recently, showing the relative time format.",
          },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "en-us",
  },
};

// 本年内评论示例（3个月前）- 中文
export const ThisYearCommentChinese: Story = {
  args: {
    author: {
      id: "10",
      name: "Thomas Wilson",
      email: "thomas@example.com",
      photo_url: "https://i.pravatar.cc/150?img=10",
      color: null,
    },
    created_at: new Date(new Date().setMonth(new Date().getMonth() - 3)), // 3 months ago
    message_meta: [
      {
        type: "paragraph",
        children: [{ text: "这条评论发布于今年，显示月份和日期格式。" }],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 本年内评论示例（3个月前）- 英文
export const ThisYearCommentEnglish: Story = {
  args: {
    author: {
      id: "10",
      name: "Thomas Wilson",
      email: "thomas@example.com",
      photo_url: "https://i.pravatar.cc/150?img=10",
      color: null,
    },
    created_at: new Date(new Date().setMonth(new Date().getMonth() - 3)), // 3 months ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          {
            text: "This comment was posted within this year, showing month and day.",
          },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "en-us",
  },
};

// 去年评论示例 - 中文
export const LastYearCommentChinese: Story = {
  args: {
    author: {
      id: "11",
      name: "Patricia Clark",
      email: "patricia@example.com",
      photo_url: "https://i.pravatar.cc/150?img=11",
      color: null,
    },
    created_at: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 year ago
    message_meta: [
      {
        type: "paragraph",
        children: [{ text: "这条评论发布于去年，显示完整日期格式。" }],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 去年评论示例 - 英文
export const LastYearCommentEnglish: Story = {
  args: {
    author: {
      id: "11",
      name: "Patricia Clark",
      email: "patricia@example.com",
      photo_url: "https://i.pravatar.cc/150?img=11",
      color: null,
    },
    created_at: new Date(new Date().setFullYear(new Date().getFullYear() - 1)), // 1 year ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          {
            text: "This comment was posted last year, showing the full date format.",
          },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "en-us",
  },
};

// 带提及和图片的评论示例
export const WithMentionAndImage: Story = {
  args: {
    author: {
      id: "3",
      name: "Alex Johnson",
      email: "alex@example.com",
      photo_url: "https://i.pravatar.cc/150?img=3",
      color: null,
    },
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    message_meta: [
      {
        type: "paragraph",
        children: [
          { text: "Take a look at this image " },
          {
            type: "mention",
            user: {
              id: "user-1",
              name: "Sarah Parker",
              photo_url: "https://i.pravatar.cc/150?img=5",
              email: "sarah.parker@example.com",
              color: null,
            },
            children: [{ text: "" }],
          } as CustomElement,
          { text: " shared:" },
        ],
      } as CustomElement,
      {
        type: "image",
        attachments: [
          {
            url: "https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Nature Image",
          },
        ],
        children: [{ text: "" }],
      } as CustomElement,
      {
        type: "paragraph",
        children: [
          { text: "What do you think? " },
          {
            type: "mention",
            user: {
              id: "user-2",
              name: "Robert Davis",
              photo_url: "https://i.pravatar.cc/150?img=8",
              email: "robert.davis@example.com",
              color: null,
            },
            children: [{ text: "" }],
          } as CustomElement,
          { text: " might have some thoughts on this." },
        ],
      } as CustomElement,
    ],
    reactions: null,
    locale: "zh-cn",
  },
};

// 带列表的评论示例
export const WithLists: Story = {
  args: {
    author: {
      id: "4",
      name: "Emily Wilson",
      email: "emily@example.com",
      photo_url: "https://i.pravatar.cc/150?img=4",
      color: null,
    },
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    message_meta: [
      {
        type: "paragraph",
        children: [{ text: "Here are some key points:" }],
      } as CustomElement,
      {
        type: "bulleted-list",
        children: [
          {
            type: "list-item",
            children: [{ text: "First bullet point" }],
          } as CustomElement,
          {
            type: "list-item",
            children: [
              { text: "Second bullet point with " },
              { text: "formatting", bold: true },
            ],
          } as CustomElement,
          {
            type: "list-item",
            children: [{ text: "Third bullet point" }],
          } as CustomElement,
        ],
      } as CustomElement,
      {
        type: "paragraph",
        children: [{ text: "And a numbered list:" }],
      } as CustomElement,
      {
        type: "numbered-list",
        children: [
          {
            type: "list-item",
            children: [{ text: "First numbered item" }],
          } as CustomElement,
          {
            type: "list-item",
            children: [{ text: "Second numbered item" }],
          } as CustomElement,
          {
            type: "list-item",
            children: [{ text: "Third numbered item" }],
          } as CustomElement,
        ],
      } as CustomElement,
    ],
    reactions: null,
  },
};

// 多图片评论示例
export const MultipleImages = {
  render: function RenderStory() {
    const [isOpen, setIsOpen] = useState(false);
    const [imageIndex, setImageIndex] = useState<number | undefined>(undefined);

    const message_meta: Descendant[] = useMemo(
      () => [
        {
          type: "paragraph",
          children: [{ text: "Check out these images from our trip:" }],
        } as CustomElement,
        {
          type: "image",
          attachments: [
            {
              url: "https://images.unsplash.com/photo-1745750747234-5df61f67a7bc?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              name: "Beach",
            },
            {
              url: "https://images.unsplash.com/photo-1739989934289-4cb75f451a56?q=80&w=5070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              name: "Mountains",
            },
            {
              url: "https://images.unsplash.com/photo-1746071062150-b12db59e9c53?q=80&w=2048&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              name: "Forest",
            },
            {
              url: "https://images.unsplash.com/photo-1745659601865-1af86dec8bcd?q=80&w=3183&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              name: "City",
            },
          ],
          children: [{ text: "" }],
        } as CustomElement,
        {
          type: "paragraph",
          children: [{ text: "It was an amazing experience!" }],
        } as CustomElement,
      ],
      []
    );

    const currentImage = useMemo(() => {
      const image = message_meta.find((item) => {
        // 检查是否为 CustomElement 并且是 image 类型
        return (item as CustomElement).type === "image";
      }) as ImageElement | undefined;

      if (!image || !image.attachments) return null;
      return image.attachments[imageIndex ?? 0];
    }, [message_meta, imageIndex]);

    const author = useMemo(() => {
      return {
        id: faker.string.uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        photo_url: faker.image.avatar(),
        color: null,
      };
    }, []);

    return (
      <>
        <CommentItem
          author={author}
          created_at={faker.date.recent()}
          message_meta={message_meta}
          reactions={null}
          handleOnImageClick={(index) => {
            setImageIndex(index);
            setIsOpen(true);
          }}
        />
        {imageIndex !== undefined && (
          <Dialog
            open={isOpen}
            onOpenChange={setIsOpen}
            outsidePress
            className="overflow-hidden"
          >
            <Dialog.Header title={currentImage?.name} />
            <Dialog.Content className="overflow-hidden p-0">
              <PicturePreview
                src={currentImage?.url ?? ""}
                fileName={currentImage?.name}
              />
            </Dialog.Content>
          </Dialog>
        )}
      </>
    );
  },
};
