import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Avatar.stories"

describe("Avatar", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
