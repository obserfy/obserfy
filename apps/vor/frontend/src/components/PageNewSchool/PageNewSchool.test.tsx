import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewSchool.stories"

describe("PageNewSchool", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
