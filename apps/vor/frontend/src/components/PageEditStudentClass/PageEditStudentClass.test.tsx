import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageEditStudentClass.stories"

describe("PageEditStudentClass", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
