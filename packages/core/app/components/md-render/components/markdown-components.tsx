import { Children, memo } from "react"
import { Components } from "react-markdown"
import { CodeBlock } from "~/components/code-block"
import { mdRenderTv } from "../tv"
import type { MentionRenderProps } from "../types"
import { extractLanguage, processMentionsInChildren } from "../utils"

interface MentionItemProps {
  [key: string]: unknown
  id: string
  label: string
}

const CheckboxIcon = memo(function CheckboxIcon({ checked = false }: { checked?: boolean }) {
  const tv = mdRenderTv()

  return (
    <div className={tv.checkbox()}>
      {checked ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <g fill="currentColor">
            <path d="M7,11c-.256,0-.512-.098-.707-.293l-2-2c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l1.293,1.293,3.293-3.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414l-4,4c-.195,.195-.451,.293-.707,.293Z" />
            <rect
              width="16"
              height="16"
              fillOpacity="0.2"
              rx="4"
            />
          </g>
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
        >
          <rect
            width="16"
            height="16"
            fillOpacity="0.1"
            fill="currentColor"
            rx="4"
          />
        </svg>
      )}
    </div>
  )
})

export const createMarkdownComponents = (
  tv: ReturnType<typeof mdRenderTv>,
  MentionComponent?: React.ComponentType<MentionRenderProps>,
  mentionItems?: MentionItemProps[],
): Partial<Components> => {
  const hasMentionSupport = !!MentionComponent

  const processChildren = hasMentionSupport
    ? (children: React.ReactNode) =>
        processMentionsInChildren(children, MentionComponent, mentionItems)
    : (children: React.ReactNode) => children

  return {
    p: ({ children }) => <p className={tv.paragraph()}>{processChildren(children)}</p>,
    h1: ({ children }) => <h1 className={tv.h1()}>{processChildren(children)}</h1>,
    h2: ({ children }) => <h2 className={tv.h2()}>{processChildren(children)}</h2>,
    h3: ({ children }) => <h3 className={tv.h3()}>{processChildren(children)}</h3>,
    h4: ({ children }) => <h4 className={tv.h4()}>{processChildren(children)}</h4>,
    h5: ({ children }) => <h5 className={tv.h5()}>{processChildren(children)}</h5>,
    h6: ({ children }) => <h6 className={tv.h6()}>{processChildren(children)}</h6>,

    ul: ({ children }) => <ul className={tv.ul()}>{children}</ul>,
    ol: ({ children }) => <ol className={tv.ol()}>{children}</ol>,
    li: function LiComponent({ children, node, ...props }) {
      const childrenArray = Children.toArray(children)
      const hasCheckbox = childrenArray.some(
        (child) =>
          typeof child === "object" &&
          child !== null &&
          "props" in child &&
          child.props?.type === "checkbox",
      )

      return (
        <li
          className={tv.li({ hasCheckbox })}
          {...props}
        >
          {processChildren(children)}
        </li>
      )
    },

    blockquote: ({ children }) => (
      <blockquote className={tv.blockquote()}>{processChildren(children)}</blockquote>
    ),

    hr: () => <hr className={tv.hr()} />,

    a: ({ href, children }) => (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={tv.a()}
      >
        {processChildren(children)}
      </a>
    ),

    code: function CodeComponent({ className, children, node, ...props }) {
      const isInline =
        !node?.position?.start?.line || node?.position?.start?.line === node?.position?.end?.line

      if (isInline) {
        return (
          <code
            className={tv.code()}
            {...props}
          >
            {children}
          </code>
        )
      }

      const language = extractLanguage(className)

      return (
        <CodeBlock
          language={language}
          className={tv.code()}
        >
          <CodeBlock.Content code={children as string} />
        </CodeBlock>
      )
    },

    pre: function PreComponent({ children }) {
      return <pre className={tv.pre()}>{children}</pre>
    },

    table: ({ children }) => (
      <div className={tv.tableWrapper()}>
        <table className={tv.table()}>{children}</table>
      </div>
    ),
    thead: ({ children }) => <thead className={tv.thead()}>{children}</thead>,
    tbody: ({ children }) => <tbody className={tv.tbody()}>{children}</tbody>,
    tr: ({ children }) => <tr className={tv.tr()}>{children}</tr>,
    th: ({ children }) => <th className={tv.th()}>{processChildren(children)}</th>,
    td: ({ children }) => <td className={tv.td()}>{processChildren(children)}</td>,

    strong: ({ children }) => <strong className={tv.strong()}>{processChildren(children)}</strong>,
    em: ({ children }) => <em className={tv.em()}>{processChildren(children)}</em>,
    del: ({ children }) => <del className={tv.del()}>{processChildren(children)}</del>,

    img: ({ src, alt }) => (
      <img
        src={src}
        alt={alt}
        className={tv.img()}
      />
    ),

    input: ({ type, checked, node, ...props }) => {
      if (type === "checkbox") {
        return <CheckboxIcon checked={checked} />
      }
      return (
        <input
          type={type}
          {...props}
        />
      )
    },
  }
}
