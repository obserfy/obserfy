import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Box.stories"

describe("Box", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
