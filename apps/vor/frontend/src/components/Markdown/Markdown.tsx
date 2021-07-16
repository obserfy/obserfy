import DOMPurify from "dompurify"
import { FC } from "react"
import snarkdown from "snarkdown"
import { Box, BoxProps } from "theme-ui"

const snarkdownEnhanced = (md: string) => {
  const htmls = md.split(/(?:\r?\n){2,}/).map((l) => {
    return [" ", "\t", "#", "-", "*"].some((ch) => l.startsWith(ch))
      ? snarkdown(l)
      : `<p>${snarkdown(l)}</p>`
  })

  return htmls.join("\n\n")
}

export interface MarkdownProps extends Omit<BoxProps, "css"> {
  markdown: string
}

const Markdown: FC<MarkdownProps> = ({ markdown, className, ...props }) => {
  const html = snarkdownEnhanced(markdown)
  let innerHtml: { __html: string } | undefined

  if (typeof window !== "undefined") {
    const sanitizedHtml = DOMPurify.sanitize(html)
    innerHtml = { __html: sanitizedHtml }
  }

  return (
    <Box
      className={`prose prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={innerHtml}
      {...props}
    />
  )
}

export default Markdown
