import DOMPurify from "dompurify"
import { FC } from "react"
import snarkdown from "snarkdown"

const snarkdownEnhanced = (md: string) => {
  const htmls = md.split(/(?:\r?\n){2,}/).map((l) => {
    return [" ", "\t", "#", "-", "*"].some((ch) => l.startsWith(ch))
      ? snarkdown(l)
      : `<p>${snarkdown(l)}</p>`
  })

  return htmls.join("\n\n")
}

export interface MarkdownProps {
  markdown: string
  className?: string
}

const Markdown: FC<MarkdownProps> = ({ markdown, className, ...props }) => {
  const html = snarkdownEnhanced(markdown)
  let sanitizedHtml = ""
  if (typeof window !== "undefined") {
    sanitizedHtml = DOMPurify.sanitize(html)
  }

  return (
    <div
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      {...props}
    />
  )
}

export default Markdown
