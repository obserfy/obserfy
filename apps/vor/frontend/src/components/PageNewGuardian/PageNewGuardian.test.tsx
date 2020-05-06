import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewGuardian.stories"

describe("PageNewGuardian", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
