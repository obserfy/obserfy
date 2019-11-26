import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./SearchBar.stories"

describe("SearchBar", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
