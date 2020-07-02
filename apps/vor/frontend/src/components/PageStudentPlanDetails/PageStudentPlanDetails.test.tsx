import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentPlanDetails.stories"

describe("PageStudentPlanDetails", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
