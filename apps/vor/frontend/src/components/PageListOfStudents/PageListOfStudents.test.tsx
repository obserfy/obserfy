import React from "react"
import { render } from "../../test-utils"
import { Basic } from "./PageListOfStudents.stories"

describe("PageListOfStudents", () => {
  it("should render correctly", () => {
    const { container } = render(<Basic />)
    expect(container).toMatchSnapshot()
  })
})
