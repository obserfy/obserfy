import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewStudent.stories"

describe("PageNewStudent", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
