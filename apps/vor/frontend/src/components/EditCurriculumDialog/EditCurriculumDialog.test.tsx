import React from "react"
import { render } from "../../test-utils"
import EditCurriculumDialog from "./EditCurriculumDialog"

describe("EditCurriculumDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<EditCurriculumDialog />)
    expect(container).toMatchSnapshot()
  })
})
