import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageEditStudent.stories"

describe("PageEditStudent", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
