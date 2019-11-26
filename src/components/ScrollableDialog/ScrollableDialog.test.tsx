import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./ScrollableDialog.stories"

describe("ScrollableDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
