import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentProfile.stories"

describe("PageStudentProfile", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
