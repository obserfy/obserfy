import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PagePlans.stories"

describe("PagePlans", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
