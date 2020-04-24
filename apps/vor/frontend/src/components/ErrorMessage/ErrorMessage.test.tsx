import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ErrorMessage.stories"

describe("ErrorMessage", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
