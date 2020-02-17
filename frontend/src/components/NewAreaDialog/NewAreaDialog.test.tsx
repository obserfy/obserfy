import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./NewAreaDialog.stories"

describe("NewAreaDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
