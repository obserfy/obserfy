import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DraggableListItem.stories"

describe("DraggableListItem", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
