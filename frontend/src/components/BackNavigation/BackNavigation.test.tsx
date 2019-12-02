import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./BackNavigation.stories"

describe("BackNavigation", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
