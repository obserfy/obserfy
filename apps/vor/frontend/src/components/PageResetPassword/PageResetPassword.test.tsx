import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageResetPassword.stories"

describe("PageResetPassword", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
