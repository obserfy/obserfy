import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageEditGuardians.stories"

describe("PageEditGuardians", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
