import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PagePickGuardian.stories"

describe("PagePickGuardian", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
