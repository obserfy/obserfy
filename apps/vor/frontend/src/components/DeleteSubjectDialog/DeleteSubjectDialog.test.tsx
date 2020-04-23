import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DeleteSubjectDialog.stories"

describe("DeleteSubjectDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
