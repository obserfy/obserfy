import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ToggleButton.stories"

describe("ToggleButton", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
