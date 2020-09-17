import React from "react"
import { render } from "../../test-utils"
import { Default } from "./MultilineDataBox.stories"

describe("MultilineDataBox", () => {
  it("should render correctly", () => {
    const { container } = render(<Default {...Default.args} />)
    expect(container).toMatchSnapshot()
  })
})
