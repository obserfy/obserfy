import React from "react"
import { render } from "../../test-utils"
import { All } from "./Typography.styles.stories"

describe("Typography", () => {
  it("should render correctly all correctly", () => {
    const { container } = render(<All />)
    expect(container).toMatchSnapshot()
  })
})
