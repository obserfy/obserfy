import React from "react"
import { render } from "../../test-utils"
import { Default } from "./Breadcrumb.stories"

describe("Breadcrumb", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
