import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./FloatingActionButton.stories"

describe("FloatingActionButton", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
