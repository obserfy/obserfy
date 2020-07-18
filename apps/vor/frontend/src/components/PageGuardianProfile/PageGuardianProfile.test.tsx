import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageGuardianProfile.stories"

describe("PageGuardianProfile", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
