import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentImageDetails.stories"

describe("PageStudentImageDetails", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
