import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Navbar.stories"

describe("Navbar", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
