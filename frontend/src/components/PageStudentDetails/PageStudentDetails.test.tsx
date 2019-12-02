import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentDetails.stories"

describe("PageStudentDetails", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
