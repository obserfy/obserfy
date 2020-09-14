import React from "react"
import { render } from "../../test-utils"
import { Default } from "./PageEditObservation.stories"

describe("PageEditObservation", () => {
  it("should render correctly", () => {
    const { container } = render(<Default />)
    expect(container).toMatchSnapshot()
  })
})
