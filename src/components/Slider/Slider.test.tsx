import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Slider.stories"

describe("Slider", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
