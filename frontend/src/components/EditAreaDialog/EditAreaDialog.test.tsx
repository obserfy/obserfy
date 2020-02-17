import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./EditAreaDialog.stories"

describe("EditAreaDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
