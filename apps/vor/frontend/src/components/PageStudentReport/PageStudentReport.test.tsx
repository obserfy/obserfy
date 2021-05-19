import React from "react"
import { render } from "../../test-utils"
import PageStudentReport from "./PageStudentReport"

describe("PageStudentReport", () => {
  it("should render correctly", () => {
    const { container } = render(<PageStudentReport studentId="" />)
    expect(container).toMatchSnapshot()
  })
})
