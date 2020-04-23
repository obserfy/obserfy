import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ProfilePicker.stories"

describe("ProfilePicker", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
