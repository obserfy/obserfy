import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./GuardianRelationshipPill.stories"

describe("GuardianRelationshipPill", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
