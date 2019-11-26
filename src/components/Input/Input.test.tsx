import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Input.stories"

describe("Input", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
