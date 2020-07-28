import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageSubscription.stories"

describe("PageSubscription", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
