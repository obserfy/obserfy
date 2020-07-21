import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageSupport.stories"

describe("PageSupport", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
