import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageChooseSchool.stories"

describe("PageChooseSchool", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
