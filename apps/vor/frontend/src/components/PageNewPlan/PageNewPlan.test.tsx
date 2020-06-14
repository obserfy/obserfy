import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewPlan.stories"

describe("PageNewPlan", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
