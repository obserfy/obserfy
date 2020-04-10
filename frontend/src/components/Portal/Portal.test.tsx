import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Portal.stories"

describe("Portal", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
