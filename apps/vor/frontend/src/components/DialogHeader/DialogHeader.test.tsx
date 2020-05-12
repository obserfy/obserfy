import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DialogHeader.stories"

describe("DialogHeader", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
