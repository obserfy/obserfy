import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Select.stories"

describe("Select", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
