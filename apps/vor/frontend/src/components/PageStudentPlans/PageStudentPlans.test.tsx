import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentPlans.stories"

describe("PageStudentPlans", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
