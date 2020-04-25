import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Switch.stories"

describe("Switch", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
