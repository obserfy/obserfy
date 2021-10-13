import snarkdown from "snarkdown"
import xss from "xss"

export const markdownToHtml = (markdown: string) => {
  const htmls = markdown.split(/(?:\r?\n){2,}/).map((line) => {
    return [" ", "\t", "#", "-", "*"].some((char) => line.startsWith(char))
      ? snarkdown(line)
      : `<p>${snarkdown(line)}</p>`
  })

  return xss(htmls.join("\n\n"))
}
