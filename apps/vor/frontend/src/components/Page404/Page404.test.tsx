import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Page404.stories"

describe("Page404", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
