import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageClassSettings.stories"

describe("PageClassSettings", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
