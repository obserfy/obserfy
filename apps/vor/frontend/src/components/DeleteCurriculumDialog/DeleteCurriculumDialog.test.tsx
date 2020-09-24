import React from "react"
import { render } from "../../test-utils"
import DeleteCurriculumDialog from "./DeleteCurriculumDialog"

describe("DeleteCurriculumDialog", () => {
  it("should render correctly", () => {
    const { container } = render(<DeleteCurriculumDialog />)
    expect(container).toMatchSnapshot()
  })
})
