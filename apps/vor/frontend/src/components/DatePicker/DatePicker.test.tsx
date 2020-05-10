import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DatePicker.stories"

describe("DatePicker", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
