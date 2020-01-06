import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./InformationalCard.stories"

describe("InformationalCard", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
