import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./Icon.stories"

describe("Icon", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
