import React from "react"
import { render } from "../../test-utils"
import { Default } from "./ImagePreview.stories"

describe("ImagePreview", () => {
  it("should render correctly", () => {
    const { container } = render(<Default {...Default.args} />)
    expect(container).toMatchSnapshot()
  })
})
