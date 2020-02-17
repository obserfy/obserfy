import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DeleteAreaDialog.stories"

describe("DeleteAreaDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
