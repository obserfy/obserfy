import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./DraggableMaterialListItem.stories"

describe("DraggableMaterialListItem", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
