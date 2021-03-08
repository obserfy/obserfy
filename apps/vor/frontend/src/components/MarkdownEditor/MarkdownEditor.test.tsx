import React from "react"
import { render } from "../../test-utils"
import MarkdownEditor from "./MarkdownEditor"

describe("MarkdownEditor", () => {
  it("should render correctly", () => {
    const { container } = render(<MarkdownEditor />)
    expect(container).toMatchSnapshot()
  })
})
