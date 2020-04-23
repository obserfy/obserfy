import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Tab.stories"

describe("Tab", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
