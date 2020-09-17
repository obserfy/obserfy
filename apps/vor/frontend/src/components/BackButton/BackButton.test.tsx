import React from "react"
import { render } from "../../test-utils"
import { Default } from "./BackButton.stories"

describe("BackButton", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
