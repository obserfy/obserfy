import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Spacer.stories"

describe("Spacer", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
