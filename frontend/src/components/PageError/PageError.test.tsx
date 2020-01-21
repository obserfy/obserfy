import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageError.stories"

describe("PageError", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
