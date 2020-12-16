import DOMPurify from "dompurify"
import React, { FC } from "react"
import snarkdown from "snarkdown"
import { Box, BoxProps } from "theme-ui"

export interface MarkdownProps extends Omit<BoxProps, "css"> {
  markdown: string
}
const Markdown: FC<MarkdownProps> = ({ markdown, ...props }) => {
  const html = snarkdown(markdown)
  const sanitizedHtml = DOMPurify.sanitize(html)

  return <Box dangerouslySetInnerHTML={{ __html: sanitizedHtml }} {...props} />
}

export default Markdown
