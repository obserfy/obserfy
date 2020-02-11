import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./NewSubjectDialog.stories"

describe("NewSubjectDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
