import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DeleteStudentDialog.stories"

describe("DeleteStudentDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
