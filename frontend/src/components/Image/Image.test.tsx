import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Image.stories"

describe("Image", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
