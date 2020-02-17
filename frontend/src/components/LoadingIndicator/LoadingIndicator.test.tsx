import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./LoadingIndicator.stories"

describe("LoadingIndicator", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
