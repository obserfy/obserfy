import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageInviteUser.stories"

describe("PageInviteUser", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
