import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DateInput.stories"

describe("DateInput", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
