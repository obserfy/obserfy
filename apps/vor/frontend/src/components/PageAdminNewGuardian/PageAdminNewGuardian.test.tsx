import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageAdminNewGuardian.stories"

describe("PageAdminNewGuardian", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
