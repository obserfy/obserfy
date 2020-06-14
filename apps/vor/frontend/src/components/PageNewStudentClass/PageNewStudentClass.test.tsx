import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageNewStudentClass.stories"

describe("PageNewStudentClass", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
