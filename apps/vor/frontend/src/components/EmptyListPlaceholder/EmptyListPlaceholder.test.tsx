import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./EmptyListPlaceholder.stories"

describe("EmptyListPlaceholder", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
