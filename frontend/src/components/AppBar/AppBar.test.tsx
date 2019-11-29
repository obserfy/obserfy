import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./AppBar.stories"

describe("AppBar", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
