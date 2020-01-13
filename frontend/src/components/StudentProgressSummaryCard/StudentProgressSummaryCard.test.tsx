import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./StudentProgressSummaryCard.stories"

describe("StudentProgressSummaryCard", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
