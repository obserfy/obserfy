import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Card.stories"

describe("Card", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
