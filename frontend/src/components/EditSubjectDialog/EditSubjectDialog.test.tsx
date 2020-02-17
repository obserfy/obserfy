import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./EditSubjectDialog.stories"

describe("EditSubjectDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
