import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageHome.stories"

describe("PageHome", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
