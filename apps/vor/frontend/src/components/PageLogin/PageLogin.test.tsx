import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageLogin.stories"

describe("PageLogin", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
