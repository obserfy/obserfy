import React from "react"
import { render } from "../../test-utils"
import Markdown from "./Markdown"

describe("Markdown", () => {
  it("should render correctly", () => {
    const { container } = render(<Markdown />)
    expect(container).toMatchSnapshot()
  })
})
