import React from "react"
import { render } from "../../test-utils"
import GuardianRelationshipSelector from "./GuardianRelationshipSelector"

describe("GuardianRelationshipSelector", () => {
  it("should render correctly", () => {
    const { container } = render(<GuardianRelationshipSelector />)
    expect(container).toMatchSnapshot()
  })
})
