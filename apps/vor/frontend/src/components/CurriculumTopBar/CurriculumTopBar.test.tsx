import React from "react"
import { render } from "../../test-utils"
import CurriculumTopBar from "./CurriculumTopBar"

describe("CurriculumTopBar", () => {
  it("should render correctly", () => {
    const { container } = render(<CurriculumTopBar />)
    expect(container).toMatchSnapshot()
  })
})
