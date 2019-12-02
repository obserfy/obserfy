import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./LoadingPlaceholder.stories"

describe("LoadingPlaceholder", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
