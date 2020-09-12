import React from "react"
import { render } from "../../test-utils"
import { Default } from "./TranslucentBar.stories"

describe("TranslucentBar", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
