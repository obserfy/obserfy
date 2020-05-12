import React from "react"
import { advanceTo } from "jest-date-mock"
import { render } from "../../test-utils"
import { Basic } from "./PagePlans.stories"

describe("PagePlans", () => {
  it("should render correctly", () => {
    advanceTo(new Date("2019-12-11T11:53:02.050339Z"))
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
