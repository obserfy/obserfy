import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewClass.stories"

describe("PageNewClass", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
