import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Link.stories"

describe("Link", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
