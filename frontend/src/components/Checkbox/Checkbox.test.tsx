import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Checkbox.stories"

describe("Checkbox", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
