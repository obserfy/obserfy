import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./NavigationItem.stories"

describe("NavigationItem", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
