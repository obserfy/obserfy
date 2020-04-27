import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DeleteClassDialog.stories"

describe("DeleteClassDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
