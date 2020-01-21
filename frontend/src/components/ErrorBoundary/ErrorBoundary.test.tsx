import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ErrorBoundary.stories"

describe("ErrorBoundary", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
