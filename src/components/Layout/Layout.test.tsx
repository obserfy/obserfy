import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Layout.stories"

describe("Layout", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
