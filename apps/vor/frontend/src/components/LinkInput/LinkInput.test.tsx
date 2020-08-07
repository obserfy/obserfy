import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./LinkInput.stories"

describe("LinkInput", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
