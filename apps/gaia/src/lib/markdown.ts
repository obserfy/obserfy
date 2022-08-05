import DOMPurify from "isomorphic-dompurify"
import snarkdown from "snarkdown"

export interface SanitizedHTML {
  __html: string
}

const snarkdownEnhanced = (md: string) => {
  const htmls = md.split(/(?:\r?\n){2,}/).map((l) => {
    return [" ", "\t", "#", "-", "*"].some((ch) => l.startsWith(ch))
      ? snarkdown(l)
      : `<p>${snarkdown(l)}</p>`
  })

  return htmls.join("\n\n")
}

export const convertMarkdownToHTML = (
  markdown: string | undefined | null
): SanitizedHTML => {
  if (!markdown) {
    return { __html: "" }
  }
  const html = snarkdownEnhanced(markdown)
  return { __html: DOMPurify.sanitize(html) }
}
