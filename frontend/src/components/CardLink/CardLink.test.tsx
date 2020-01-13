import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./CardLink.stories"

describe("CardLink", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
