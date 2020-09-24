import React from "react"
import { render } from "../../test-utils"
import NewCustomCurriculumDialog from "./NewCustomCurriculumDialog"

describe("NewCustomCurriculumDialog", () => {
  it("should render correctly", () => {
    const { container } = render(
      <NewCustomCurriculumDialog onDismiss={() => {}} />
    )
    expect(container).toMatchSnapshot()
  })
})
