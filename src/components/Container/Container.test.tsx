import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Container.stories"

describe("Container", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
