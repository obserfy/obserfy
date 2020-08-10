import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageStudentImages.stories"

describe("PageStudentImages", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
