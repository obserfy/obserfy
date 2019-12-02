import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./NewStudentDialog.stories"

describe("NewStudentDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
