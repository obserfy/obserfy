import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageAnalyze.stories"

describe("PageAnalyze", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
