import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./WarningDialog.stories"

describe("WarningDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
