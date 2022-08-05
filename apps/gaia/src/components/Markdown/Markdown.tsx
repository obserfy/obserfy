import { SanitizedHTML } from "$lib/markdown"
import { FC } from "react"

export interface MarkdownProps {
  markdown: SanitizedHTML
  className?: string
}

const Markdown: FC<MarkdownProps> = ({ markdown, className, ...props }) => (
  <div
    className={`prose max-w-none text-gray-700 ${className}`}
    dangerouslySetInnerHTML={markdown}
    {...props}
  />
)

export default Markdown
