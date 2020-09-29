import React from "react"
import { advanceTo } from "jest-date-mock"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentPlanDetails.stories"

describe("PageStudentPlanDetails", () => {
  it("should render correctly", () => {
    advanceTo(new Date(2018, 5, 27, 0, 0, 0)) // r

    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
