import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Pill.stories"

describe("Pill", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
