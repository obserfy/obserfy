import React from "react"
import { render } from "../../test-utils"
import { All } from "./Button.stories"

describe("Button", () => {
  it("should render correctly", () => {
    const { container } = render(<All />)
    expect(container).toMatchSnapshot()
  })
})
