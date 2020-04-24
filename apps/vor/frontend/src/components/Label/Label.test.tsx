import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Label.stories"

describe("Label", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
